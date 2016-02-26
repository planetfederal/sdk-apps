# Install
Install nvm (node version manager, https://github.com/creationix/nvm)

    nvm use 4.2.2
    npm i

# Running the debug server

    npm start

# Using a proxy to a local geoserver instance

Edit proxy-config.json if GeoServer does not run on http://localhost:8080

    npm run start:proxy

# Accessing the application in debug mode

Go to http://localhost:4000/

# Using a different port

Edit package.json and change ```-p 4000```.

# Creating a war file

    npm run package

Specify an output file name when prompted, e.g. /tmp/app-styles.war
