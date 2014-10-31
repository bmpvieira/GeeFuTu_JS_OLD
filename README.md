# GeeFuTu
[![Build Status](https://travis-ci.org/wookoouk/GeeFuTu.svg?branch=master)](https://travis-ci.org/wookoouk/GeeFuTu)
[![Coverage Status](https://coveralls.io/repos/wookoouk/GeeFuTu/badge.png?branch=master)](https://coveralls.io/r/wookoouk/GeeFuTu?branch=master)
[![Dependency Status](https://gemnasium.com/wookoouk/GeeFuTu.svg)](https://gemnasium.com/wookoouk/GeeFuTu)
[![Code Climate](https://codeclimate.com/github/wookoouk/GeeFuTu/badges/gpa.svg)](https://codeclimate.com/github/wookoouk/GeeFuTu)
<img align="right" height="200" src="https://raw.githubusercontent.com/wookoouk/GeeFuTu/master/public/GeeFuTu.png">

GeeFuTu is a platform for sharing and updating genomics data, projects can be private with per experiment permissions or public for anybody to view and edit.
GeeFuTu is available for anyone to install from source but will also be a service available to all later in the year.

GeeFuTu is still heavily under development, please check the Road Map for list of completed and upcoming features.

##BETA

### Private BETA 1/11/14 - 20/11/14
> All data will be removed at the end of this beta

### Public BETA 20/11/14 - 20/11/14
> All data will be removed at the end of this beta

## Road Map

### Dec 2014

* Hosted service available.
* Editing inside BioDalliance.
* Private projects.
* Public projects.
* GFF, BAM, VCF, BigWig BED and BigBED support.
* BioJS visualisation.
* Forking/Cloning.
* Tutorial.
* Synteny view.
* Text (Markdown) notes for experiments, features, genomes, etc.
* Basic Documentation.
* Cross OS/Browser support (Safari, Chrome, Firefox, Opera, IE9 and mobile browsers (Android, Chrome Mobile, iOS Safari).

### March 2015

* Full test coverage.
* Multiple Alignment Format (HAL?).
* Remote logging.
* Public API.
* Full Documentation.

## Install

```sh
$ npm install
$ bower install
$ gulp
$ gulp config-file
$ cd public/components/dalliance && npm install && gulp
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
