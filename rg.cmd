@echo off
setlocal
set "RG_EXE=%~dp0node_modules\@vscode\ripgrep\bin\rg.exe"
if not exist "%RG_EXE%" (
  echo rg executable not found: "%RG_EXE%"
  echo Run: npm install -D @vscode/ripgrep
  exit /b 1
)
"%RG_EXE%" %*

