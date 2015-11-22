'use strict';

let mkdirp = require('mkdirp');
let path = require('path');
let _ = require('lodash');

module.exports = class {
  static writing(self) {
      self.fs.copyTpl(
        self.templatePath('flowrouter/home.js.ejs'),
        self.destinationPath('lib/routes/home.js'),
        {
          front: _.capitalize(self.front)
        }
      );
    }
  }
