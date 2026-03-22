$rgExe = Join-Path $PSScriptRoot "node_modules\@vscode\ripgrep\bin\rg.exe"
if (-not (Test-Path $rgExe)) {
  Write-Error "rg executable not found: $rgExe`nRun: npm install -D @vscode/ripgrep"
  exit 1
}
& $rgExe @args

