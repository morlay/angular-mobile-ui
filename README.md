# Angular Mobile UI

UI Kits for PhoneGap or Mobile Web App

* install `node.js` and `npm` form <http://nodejs.org/>

* install [grunt](http://gruntjs.com/) `$ npm install -g grunt-cli`
* install [bower](http://bower.io) `$ npm install -g bower` (must have the git envi)
* install [cordova](http://cordova.apache.org/) `$ npm install -g cordora`


## Base Libs & Styles

* [angular.js](https://github.com/angular/angular.js)
* [hammer.js](https://github.com/senchalabs/hammerjs)
* [bootstrap](https://github.com/twbs/bootstrap)
* [font-awesome](https://github.com/FortAwesome/Font-Awesome)

All above use bower for install by `$ bower install`

* [angular-ui/bootstrap](https://github.com/angular-ui/bootstrap)

## Demos

https://googledrive.com/host/0Bwdui5aYcEA9WFB1TThKUWVCS28/index.html

## How To

after all envi installed, you can use CLI for task

1. `$ npm install` and `$ bower install` for base libs (must first).
2. `$ grunt package` for package all statics to the dist for web.
3. `$ grunt package-to-app` for package all statics to the dist for phonegap app.
3. `$ grunt prepare` for that copy base files to the dist.
3. `$ grunt` for local host at 127.0.0.1:80
3. `$ grunt watch` for that when you modify the file in src, task will run itself to refresh the statics for showing new.



## PhoneGap Plugins

* [Web Socket for Android](https://github.com/mkuklis/phonegap-websocket)
