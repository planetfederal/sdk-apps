#!/bin/bash
cd basic
npm i --loglevel silent > /dev/null
npm run test
cd ..
