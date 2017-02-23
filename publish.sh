#!/bin/bash
start_dir=${1:-`pwd`}
for i in $( ls **/app.jsx ); do
  dir="$(dirname $i)"
  mkdir -p $start_dir/out/$dir
  cd $start_dir/$dir
  npm i --loglevel silent > /dev/null
  npm run build
  npm run createzip -- --output-file=../out/$dir/package.zip
  cd $start_dir/out/$dir
  unzip package.zip
  sed -i -- 's/\/geoserver\//http:\/\/demo.boundlessgeo.com\/geoserver\//g' app.js
  rm package.zip
done
