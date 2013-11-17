# Angular Mobile UI

UI Kits for PhoneGap or Mobile Web App

* install `node.js` and `npm` form <http://nodejs.org/>

* install [grunt](http://gruntjs.com/) `$ npm install -g grunt-cli`
* install [bower](http://bower.io) `$ npm install -g bower` (must have the git envi)

* install [cordova](http://cordova.apache.org/) `$ npm install -g cordora`


## Base Libs & Styles

* [angular.js](https://github.com/angular/angular.js)
* [bootstrap](https://github.com/twbs/bootstrap)
* [font-awesome](https://github.com/FortAwesome/Font-Awesome)

All above use bower for install by `$ bower install`

## Demos

<https://googledrive.com/host/0Bwdui5aYcEA9WFB1TThKUWVCS28/index.html>

## How To

after all envi installed, you can use CLI for task

1. `$ npm install` and `$ bower install` for base modules and libs (must first).
2. `$ grunt package` for package all statics to the dist for web.
3. `$ grunt cordova.init` for create phonegap 3.0+ path.
4. `$ grunt cordova.add.plugins` for add plugins by misc/cordova/plugins.json.
5. `$ grunt package.cordova` for package all statics to the dist for phonegap app. (step.3 must be first)
6. `$ grunt prepare` for that copy base files to the dist.
7. `$ grunt` for local host at 127.0.0.1:80
8. `$ grunt watch` for that when you modify the file in src, task will run itself to refresh the statics for showing new.


## Dev Docs

Soon ……

