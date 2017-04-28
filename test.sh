#!/bin/bash
set -e # Exit with nonzero exit code if anything fails
for i in $( ls **/app.jsx ); do
( dir="$(dirname $i)"
  cd $dir
  npm i --loglevel silent > /dev/null
  npm run build
  npm run test
  cd .. ) &
done
wait
