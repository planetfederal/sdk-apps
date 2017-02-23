#!/bin/bash
mkdir -p out/basic
cd basic
npm i --loglevel silent > /dev/null
npm run build
npm run createzip -- --output-file=../out/basic/package.zip
cd ../out/basic
unzip package.zip
rm package.zip
cd ..
