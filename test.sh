#!/bin/bash
set -e # Exit with nonzero exit code if anything fails
cd basic
npm i --loglevel silent > /dev/null
npm run test
cd ..
