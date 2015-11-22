'use strict';

let mkdirp = require('mkdirp');
let path = require('path');
let _ = require('lodash');

module.exports = class {
  static writing(self) {
      self.fs.copyTpl(
        self.templatePath('kadira:flow-router/routefile.ejs'),
        self.destinationPath(`lib/routes/${self.group}.js`),
        {
          groupVar: `${_.capitalize(self.group.toLowerCase())}Routes`,
          group: self.group,
          name: self.name,
          path: self.path,
          template: self.template,
          layout: 'default',
          front: _.capitalize(self.config.get('front')),
          args: self.args
        }
      );
    }
  }
