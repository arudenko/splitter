#!/bin/sh

set -e

grunt build

cd dist

tape -c ../.taperc
