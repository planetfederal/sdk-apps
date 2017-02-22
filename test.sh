#!/bin/bash
npm config set loglevel warn
for i in $( ls **/app.jsx ); do
  dir="$(dirname $i)"
  cd $dir
  npm i
  npm run test
  cd ..
done
for i in $( ls **/**/app.jsx ); do
  dir="$(dirname $i)"
  cd $dir
  npm i
  npm run test
  cd ../../
done
