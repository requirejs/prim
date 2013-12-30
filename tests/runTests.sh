#!/bin/bash

node node_modules/.bin/promises-aplus-tests adapter

# Own tests not part of aplus set.
# Debug command: node --debug-brk node_modules/.bin/_mocha own
node_modules/.bin/mocha own
