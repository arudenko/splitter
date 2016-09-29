[![Build Status](https://travis-ci.org/arudenko/splitter.svg?branch=master)](https://travis-ci.org/arudenko/splitter)

# Bill Splitter

When you need a split between participants. 

Compiled version is available at [splitbillwith.me](http://splitbillwith.me/)

## Setup

### Dependencies

- [Node.js](http://nodejs.org/)
- [Karma](http://karma-runner.github.io/) as a runner:
    `npm install -g karma`
- [Jasmine](https://jasmine.github.io/) as test framework
- [Grunt](http://gruntjs.com/) as build tool

### Install packages
`npm install`

## Build

`grunt build`

## Unit tests 
`grunt test`

## ReactJS Component Structure

- app
    - bill
        - BillItems
    - UsersList
        - User
            - UserBillItem

