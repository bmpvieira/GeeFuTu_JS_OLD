# GeeFuTu
[![Build Status](https://travis-ci.org/wookoouk/GeeFuTu.svg?branch=master)](https://travis-ci.org/wookoouk/GeeFuTu)
[![Coverage Status](https://coveralls.io/repos/wookoouk/GeeFuTu/badge.png?branch=master)](https://coveralls.io/r/wookoouk/GeeFuTu?branch=master)
[![Dependency Status](https://gemnasium.com/wookoouk/GeeFuTu.svg)](https://gemnasium.com/wookoouk/GeeFuTu)
[![Code Climate](https://codeclimate.com/github/wookoouk/GeeFuTu/badges/gpa.svg)](https://codeclimate.com/github/wookoouk/GeeFuTu)
[![MIT Licence](http://img.shields.io/:license-mit-blue.svg)](https://github.com/wookoouk/GeeFuTu/blob/master/LICENCE)
<img align="right" height="200" src="https://raw.githubusercontent.com/wookoouk/GeeFuTu/master/public/GeeFuTu.png">

GeeFuTu is a platform for sharing and updating genomics data, projects can be private with per experiment permissions or public for anybody to view and edit.
GeeFuTu is available for anyone to install from source but will also be a service available to all later in the year.

## Install
```sh
$ npm install
$ bower install
$ gulp
$ gulp setup
$ cd public/components/dalliance && npm install && gulp #This needs to be better
```

## Start
For development I suggest using nodemon, this will auto reload on changes.
```sh
nodemon app
```

You can start the app using node
```sh
node app
```

## Contributors
Martin Page <wookoouk@gmail.com>
Shyam Rallapalli <Ghanasyam.Rallapalli@tsl.ac.uk>
Dan Maclean <Dan.MacLean@tsl.ac.uk>

## Docs
Generated docs can be found in /docs, to updates these run    
```sh
dox-foundation --target docs --ignore node_modules,public/components --source ./
```
