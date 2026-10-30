#!/usr/bin/env bash
# Installed as root-owned /usr/local/sbin/kceli-redeploy on the production host.
set -Eeuo pipefail
export PATH=/usr/sbin:/usr/bin:/sbin:/bin

if [[ "$EUID" -ne 0 ]]; then
  echo "Run this script as root (Systems Manager does this automatically)." >&2
  exit 1
fi
for tool in docker curl flock; do
  command -v "$tool" >/dev/null || { echo "Missing required tool: $tool" >&2; exit 1; }
done

exec 9>/run/lock/kceli-deploy.lock
flock -n 9 || { echo "Another Kceli deployment is already running." >&2; exit 1; }

# This file is created once by the server administrator, never supplied by the workflow.
source /etc/kceli-deploy.conf
: "${KCELI_ENV_FILE:?Set KCELI_ENV_FILE in /etc/kceli-deploy.conf}"
[[ "$KCELI_ENV_FILE" = /* && -f "$KCELI_ENV_FILE" && -r "$KCELI_ENV_FILE" ]] || {
  echo "KCELI_ENV_FILE must be an absolute path to the existing readable dotenv file." >&2
  exit 1
}

: "${KCELI_HOST_PORT:?Set KCELI_HOST_PORT in /etc/kceli-deploy.conf}"
[[ "$KCELI_HOST_PORT" =~ ^[0-9]{1,5}$ ]] && ((10#$KCELI_HOST_PORT >= 1 && 10#$KCELI_HOST_PORT <= 65535)) || {
  echo "KCELI_HOST_PORT must be a port number between 1 and 65535." >&2
  exit 1
}
image="esheleyni/kceli:latest"
backup="kceli-previous"
docker container inspect kceli >/dev/null
if docker container inspect "$backup" >/dev/null 2>&1; then
  echo "kceli-previous already exists. Inspect the interrupted deployment before trying again." >&2
  exit 1
fi

# Download first. A failed pull leaves the current website running.
docker pull "$image"
# Run the image just pulled, even if another process changes the latest tag locally.
image_id="$(docker image inspect --format '{{.Id}}' "$image")"
echo "Deploying $image ($image_id)"

old_stopped=0
old_renamed=0
rollback() {
  trap - ERR INT TERM
  set +e
  echo "Deployment failed. Attempting to restore the previous container." >&2
  if [[ "$old_renamed" -eq 1 ]]; then
    docker rm -f kceli >/dev/null 2>&1
    if docker rename "$backup" kceli && docker start kceli; then
      echo "Previous container restored. Check the Kceli website." >&2
    else
      echo "Automatic rollback failed. Inspect kceli and kceli-previous on the server." >&2
    fi
  elif [[ "$old_stopped" -eq 1 ]]; then
    docker start kceli || echo "Could not restart the previous container." >&2
  fi
  exit 1
}
trap rollback ERR INT TERM

docker stop --time 30 kceli
old_stopped=1
docker rename kceli "$backup"
old_renamed=1

# Use the existing nginx upstream port configured by the administrator.
docker run --name kceli -d --restart unless-stopped \
  --env-file "$KCELI_ENV_FILE" \
  -p "127.0.0.1:${KCELI_HOST_PORT}:3030" \
  "$image_id"

ready=0
for ((attempt=1; attempt<=30; attempt++)); do
  if [[ "$(docker container inspect --format '{{.State.Running}}' kceli)" != "true" ]]; then
    break
  fi
  if curl --fail --silent --show-error --max-time 3 \
      "http://127.0.0.1:${KCELI_HOST_PORT}/" --output /dev/null 2>/dev/null; then
    ready=1
    break
  fi
  sleep 2
done

if [[ "$ready" -ne 1 ]]; then
  echo "The replacement container did not pass its HTTP startup check." >&2
  rollback
fi

trap - ERR INT TERM
# Remove the stopped backup only after the replacement responds successfully.
docker rm "$backup"
echo "Kceli deployment succeeded: $image_id"
