#!/bin/sh
if [ "$TRAVIS_BRANCH" = "production" ];
then
  npm run ci:build
else
  npm run ci:build-sandbox
fi
tar -cvzf visualization-managment-frontend.tgz -C dist ff-ui
