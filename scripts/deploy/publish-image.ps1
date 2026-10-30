# Build and publish Kceli from the repository root. Does not deploy to AWS.
[CmdletBinding()]
param(
    [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
$repositoryRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../..'))

function Invoke-DockerStep {
    param([Parameter(Mandatory = $true)][string[]]$Arguments)

    Write-Host ('> docker ' + ($Arguments -join ' '))
    if ($DryRun) { return }

    & docker @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw ('Docker command failed with exit code ' + $LASTEXITCODE + '. Stopping before the next step.')
    }
}

if (-not $DryRun -and -not (Get-Command docker -ErrorAction SilentlyContinue)) {
    throw 'Docker CLI was not found. Install/start Docker Desktop and sign in with docker login.'
}

Push-Location -LiteralPath $repositoryRoot
try {
    Write-Host ('Repository: ' + $repositoryRoot)
    Invoke-DockerStep -Arguments @('build', '-t', 'kceli', '.')
    Invoke-DockerStep -Arguments @('tag', 'kceli', 'esheleyni/kceli:latest')
    Invoke-DockerStep -Arguments @('push', 'esheleyni/kceli:latest')

    if ($DryRun) {
        Write-Host 'Dry run complete. No Docker commands were executed.'
    } else {
        Write-Host 'Published esheleyni/kceli:latest. AWS has not been redeployed.'
        Write-Host 'To deploy it, run: npm run deploy:kceli'
    }
} finally {
    Pop-Location
}
