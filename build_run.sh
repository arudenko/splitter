#!/bin/sh

set -e

grunt build

cd dist

python -m SimpleHTTPServer
