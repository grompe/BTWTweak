@echo off
setlocal enabledelayedexpansion
echo :: Making client patches
for /F "tokens=*" %%i in ('git diff --name-only btw..HEAD -- src/minecraft/net/minecraft/src/*.java') do (
  set fff=%%~ni
  echo !fff!
  call git diff --unified=0 btw..HEAD -- %%i >_patches\!fff!.diff
)
echo :: Making server patches
for /F "tokens=*" %%i in ('git diff --name-only btw..HEAD -- src/minecraft_server/net/minecraft/src/*.java') do (
  set fff=%%~ni
  echo !fff!
  call git diff --unified=0 btw..HEAD -- %%i >_patches_server\!fff!.diff
)
