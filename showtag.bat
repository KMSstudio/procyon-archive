@echo off
setlocal enabledelayedexpansion
for /f "tokens=*" %%A in ('git for-each-ref --sort=-creatordate --count=5 --format="%%(refname:short)" refs/tags') do (
    echo %%A
)