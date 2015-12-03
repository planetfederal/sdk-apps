# Example applications for the Boundless Web SDK

Use node version 4.2.2.

# How to use
    cd %examplename%
    npm i
    npm run build
    npm start

```npm run build``` will create the minified js file for production use

```npm start``` will start up the debug server at http://localhost:3000/app.html

http://localhost:3000/app-production.html will show the production version of the app.

# Linking to a github directory of the sdk
Go to the directory of your sdk git checkout and type:
    npm link

Go to the node_modules/react directory of that git checkout and type:
    npm link

In your sdk app type:
    npm link boundless-sdk
    npm link react

This will be the result on file system:

    lrwxr-xr-x   1 bartvandeneijnden  staff    71 Dec  3 15:05 boundless-sdk -> ../../../../../.nvm/versions/node/v4.2.2/lib/node_modules/boundless-sdk
    lrwxr-xr-x   1 bartvandeneijnden  staff    63 Dec  3 15:05 react -> ../../../../../.nvm/versions/node/v4.2.2/lib/node_modules/react
