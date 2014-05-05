# Bill Splitter
When you need a split between participants. 

Compiled version is available at [Splitter](http://d3srl5srr7lrhy.cloudfront.net/splitter/index.html)

## Setup

### Dependencies

- [Node.js](http://nodejs.org/)
- [Karma](http://karma-runner.github.io/) as a runner:
    `npm install -g karma`
- [Jasmine](http://pivotal.github.io/jasmine/) as test framework
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

