#!/bin/bash
for i in $( ls **/app.jsx ); do
  dir="$(dirname $i)"
  mkdir -p out/$dir
  cd $dir
  npm i --loglevel silent > /dev/null
  npm run build
  npm run createzip -- --output-file=../out/$dir/package.zip
  cd ../out/$dir
  unzip package.zip
  rm package.zip
  cd ..
done
