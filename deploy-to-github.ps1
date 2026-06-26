# Скрипт для загрузки сайта на GitHub
# Запусти этот файл из PowerShell в папке проекта.

Set-Location "$PSScriptRoot"

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Error "Git не найден. Установи Git и запусти скрипт снова."
  exit 1
}

if (-not (Test-Path ".git")) {
  git init
}

git add .

git commit -m "Initial site" 2>$null

if (git remote get-url origin 2>$null) {
  git remote remove origin
}

git remote add origin https://github.com/cube564-1108/srtoyportal.git

git branch -M main

git push -u origin main
