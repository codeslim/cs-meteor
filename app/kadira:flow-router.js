'use strict';

let mkdirp = require('mkdirp');
let path = require('path');
let _ = require('lodash');

module.exports = class {
  static writing() {
    this.fs.copyTpl(
      this.templatePath('flowrouter/home.js.ejs'),
      this.destinationPath('lib/routes/home.js'),
      {
        front: _.capitalize(this.front)
      }
    );
  }

  static getPackagesToAdd() {
    return ['kadira:flow-router', 'kadira:blaze-layout'];
  }

  static getPackagesToRemove() {
    return [];
  }
}
