# Example applications for the Boundless Web SDK
[![Travis CI Status](https://secure.travis-ci.org/boundlessgeo/sdk-apps.svg)](http://travis-ci.org/#!/boundlessgeo/sdk-apps)

# Online demos
Check out our <a href="http://boundlessgeo.github.io/sdk-apps/index.html">online demos</a>.

Use node version LTS (Long Term Support) through nvm (https://github.com/creationix/nvm).

    nvm install --lts

# How to use
    cd %examplename%
    nvm use --lts
    npm i
    npm run build
    npm start

```npm run build``` will create the minified js file for production use

```npm start``` will start up the debug server at http://localhost:3000/

```npm run package``` will generate a production version of the application.

Applications that need access to a local GeoServer will need to run (in addition to ```npm start```):

```npm run start:proxy``` this will start up the application at http://localhost:4000/ and will have a proxy to a local geoserver on port 8080 (proxy-config.json).

# Linking to a github directory of the sdk
Go to the directory of your sdk git checkout and type:

    npm run release
    cd release
    npm link

Go to the node_modules/react directory of the release subdirectory and type:

    npm link

Go to the node_modules/openlayers directory of the release subdirectory and type:

    npm link

In your sdk app type:

    npm link boundless-sdk
    npm link react
    npm link openlayers

Go to the root of your sdk checkout and run the watchdog.

    npm start

This will be the result on file system (check with something like: ```ls -l ~/.nvm/versions/node/v6.9.2/lib/node_modules/```):

    lrwxrwxrwx  1 bartvde bartvde   37 jan  4 17:59 boundless-sdk -> /home/bartvde/opengeo/git/sdk/release
    lrwxrwxrwx  1 bartvde bartvde   53 jan  4 17:59 openlayers -> /home/bartvde/opengeo/git/sdk/node_modules/openlayers
    lrwxrwxrwx  1 bartvde bartvde   48 jan  4 17:59 react -> /home/bartvde/opengeo/git/sdk/node_modules/react
