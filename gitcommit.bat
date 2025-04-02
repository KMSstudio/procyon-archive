@echo off
set /p commit_message="Commit message: "
git add .
git commit -m "%commit_message%"
for /f "tokens=*" %%b in ('git branch --show-current') do set branch=%%b
@REM git push -u origin %branch%