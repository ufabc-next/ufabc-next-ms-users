#!/usr/bin/env sh

. "$(dirname "$0")/_/husky.sh"

echo "running tests"
pnpm test  

echo "running lint"
pnpm lint 

echo "validate branch name"

isAValidBranchName = pnpm enforce-branch-name '(hotfix|bugfix|feature)\/.+' --ignore 'staging'

if $?; 
then
  echo "[pre-commit-hook] Your branch name is illegal. Please rename your branch with using following feature/bugfix/hotfix/"
  exit 1
fi