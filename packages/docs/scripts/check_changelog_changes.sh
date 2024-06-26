#!/bin/bash

# Get the current branch name
current_branch=$(git rev-parse --abbrev-ref HEAD)

# Check if the current branch is 'master'
if [ "$current_branch" != "master" ]; then
  echo "✅ - Not on 'main' branch. Skipping CHANGELOG check. Deploying the documentation..."
  exit 1;
fi

# Get the list of changed files between the last commit and the current commit
changed_files=$(git diff --name-only HEAD HEAD~1)

# Check if any of the changed files is a CHANGELOG.md
if echo "$changed_files" | grep -q "packages/docs/CHANGELOG.md"; then
  # Proceed with the build if any CHANGELOG.md file has changed
  echo "✅ - Docs CHANGELOG.md file has changed. Deploying the documentation..."
  exit 1;
else
  echo "🛑 - No changes in docs CHANGELOG.md file. Cancelling the deployment of the documentation..."
  exit 0;
fi
