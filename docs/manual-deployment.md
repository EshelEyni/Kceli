# Kceli: one-command deployment to AWS

After the one-time setup, run this from the Kceli repository root (`dev` in this workspace):

```powershell
npm run deploy:all
```

It builds the local checkout, pushes `esheleyni/kceli:latest`, triggers **Deploy Kceli** on GitHub, waits for that exact run, and shows a Windows success/failure dialog. It stops on errors. Git pushes do not trigger deployment.

The image contains your local files, including uncommitted changes not excluded by `.dockerignore`; it is not automatically built from GitHub main. Avoid simultaneous image publications because this flow uses the mutable `latest` tag.

## 1. Confirm the existing server settings

In the AWS terminal, inspect Kceli's container without displaying environment secrets:

```bash
sudo docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Ports}}'
sudo docker inspect kceli --format '{{json .HostConfig.PortBindings}}'
sudo docker inspect kceli --format '{{json .Mounts}}'
realpath ~/kceli/dotenv
```

The supplied scripts assume container `kceli`, Docker Hub image `esheleyni/kceli:latest`, and internal port `3030` (confirmed in the app source). Record the current **host port** and dotenv path. If the container/image names differ, update the supplied scripts before installation. If the existing container uses volumes, a custom Docker network, or other runtime flags, preserve those in `kceli-redeploy.sh` before installing it.

The replacement binds the host port to `127.0.0.1`, matching nginx on the same host. Confirm nginx already proxies to that local port.

## 2. Put the supplied files on main

Review and commit these files through your normal Git workflow:

- `.github/workflows/deploy-kceli.yml`
- `scripts/deploy/` (publisher, npm wrapper, server script, and AWS JSON templates)
- `package.json`
- This guide

The manual workflow must exist on the repository's default branch before it can be dispatched. The supplied workflow permits only `main`. Committing these files does not deploy.

## 3. Reuse the existing AWS foundation

If this is the same instance as Roza, reuse its working SSM Agent and EC2 instance role. Confirm the instance is **Online** in Systems Manager in the correct region. If it is another instance, it also needs SSM Agent, the `AmazonSSMManagedInstanceCore` instance-role policy, and outbound access to SSM and Docker Hub.

Reuse the account's GitHub OIDC identity provider (`token.actions.githubusercontent.com`, audience `sts.amazonaws.com`). Create a separate Kceli deployment role below.

Record the AWS account ID, region, and Kceli instance ID. Replace `YOUR_ACCOUNT_ID`, `YOUR_REGION`, and `YOUR_INSTANCE_ID` in the AWS console copies of the JSON templates. These identifiers are not secrets.

## 4. Install the server script

After the files are available on main, run in the AWS terminal:

```bash
curl --fail --show-error --location \
  https://raw.githubusercontent.com/EshelEyni/Kceli/main/scripts/deploy/kceli-redeploy.sh \
  --output /tmp/kceli-redeploy.sh
less /tmp/kceli-redeploy.sh
sudo install -o root -g root -m 0755 /tmp/kceli-redeploy.sh /usr/local/sbin/kceli-redeploy
sudo bash -n /usr/local/sbin/kceli-redeploy
sudo nano /etc/kceli-deploy.conf
```

For a private GitHub repository, transfer the reviewed script over your existing authenticated SSH connection instead of using the public raw URL.

Add these two lines, using the actual path and host port from step 1 (replace `YOUR_EXISTING_HOST_PORT` with a number):

```bash
KCELI_ENV_FILE=/home/ubuntu/kceli/dotenv
KCELI_HOST_PORT=YOUR_EXISTING_HOST_PORT
```

Save, then run:

```bash
sudo chown root:root /etc/kceli-deploy.conf
sudo chmod 600 /etc/kceli-deploy.conf
command -v docker curl flock
sudo docker container inspect kceli --format '{{.State.Running}}'
```

All three tools must exist and the container should be running. Keep the existing dotenv file on the server. For a private Docker Hub image, authenticate root with `sudo docker login --username esheleyni`, using a read token at the prompt.

Installing the script does not deploy. Running `/usr/local/sbin/kceli-redeploy` does.

## 5. Create the Kceli Systems Manager document

AWS Console → Systems Manager → Documents → Create document:

1. Name: **Kceli-Redeploy**.
2. Type: **Command**; content: **JSON**.
3. Paste `scripts/deploy/ssm-document.json`.
4. Create it in the instance's region.

It executes only `/usr/local/sbin/kceli-redeploy`. The workflow selects document version `1`.

## 6. Create the Kceli GitHub IAM role

AWS Console → IAM → Roles → Create role → Custom trust policy:

1. Name the role **KceliGitHubDeploy**.
2. Paste `scripts/deploy/github-role-trust.json`, substituting your AWS account ID.
3. Add an inline permissions policy from `scripts/deploy/github-role-policy.json`, substituting account, region, and instance ID.
4. Copy the role ARN.

The trust subject is `repo:EshelEyni/Kceli:ref:refs/heads/main`. Confirm this matches your repository's OIDC subject format; repositories using immutable subject claims include owner/repository IDs. Do not broaden the subject to a wildcard. The workflow has no GitHub environment declaration, which would require a different subject.

The permissions allow `ssm:SendCommand` only for **Kceli-Redeploy** and the chosen instance, plus `ssm:GetCommandInvocation` to read deployment results. Do not replace Roza's role or policies.

## 7. Set GitHub repository variables

In **EshelEyni/Kceli → Settings → Secrets and variables → Actions → Variables**, add:

| Variable | Value |
| --- | --- |
| `AWS_REGION` | Kceli instance's region |
| `AWS_ROLE_ARN` | ARN of `KceliGitHubDeploy` |
| `KCELI_INSTANCE_ID` | Kceli instance ID |

The region and instance may match Roza. The role is Kceli's new role. No permanent AWS key or SSH key is needed in GitHub.

## 8. Prepare your Windows terminal

Docker Desktop must be running. Create the Docker Hub repository `esheleyni/kceli` if it does not already exist. Authenticate once:

```powershell
docker login --username esheleyni
gh auth login
gh auth status
```

If GitHub CLI is missing, install it with `winget install --id GitHub.cli --exact`, then reopen the terminal.

From the Kceli repository root, preview the flow:

```powershell
npm run deploy:all -- -DryRun
```

This prints the steps without publishing, deploying, or displaying a dialog. It does not validate AWS configuration or build the image.

## 9. Release

```powershell
npm run deploy:all
```

The server pulls the image while the existing container runs, replaces only `kceli`, then checks for an HTTP response. There is a short interruption. If startup fails, it attempts to restore the old container and the workflow reports failure. The HTTP check is not a database or full application test; check the website after the first release.

Separate commands are also available:

```powershell
npm run docker:publish   # Build and push only
npm run deploy:kceli     # Deploy the already-published latest image
npm run deploy:watch     # Choose a GitHub run to watch
```

If the local build fails, deployment is not dispatched. The existing Dockerfile's Node base tag is inherited from the app; a real Docker build must pass before the first release.

## Troubleshooting

- No workflow found: confirm the workflow was pushed to main and Actions is enabled.
- AWS authentication denied: check role ARN, account ID, audience, and exact OIDC subject.
- Invalid instance/offline: check region, instance ID, and Systems Manager Online status.
- SendCommand denied: check both document and instance ARNs in the Kceli role policy.
- Pull denied: check image name and root's Docker Hub authentication.
- Startup check fails: check configured host port, dotenv path, and container logs.
- `kceli-previous` exists: inspect both containers before retrying; the script preserves an interrupted deployment backup.

```bash
sudo docker ps -a --filter name=kceli
sudo docker logs --tail 80 kceli
```

Cancelling a GitHub run does not necessarily cancel its already-dispatched SSM command. Check Systems Manager → Run Command before retrying. A failed local watch also does not prove the remote deployment failed; inspect the run URL printed by the wrapper.

References: [manual GitHub workflows](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow), [AWS OIDC](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws), [Systems Manager Run Command](https://docs.aws.amazon.com/systems-manager/latest/userguide/run-command.html).
