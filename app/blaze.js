'use strict';

let mkdirp = require('mkdirp');
let path = require('path');

module.exports = class {
  static writing() {
    mkdirp.sync('client/templates/layouts');

    ['default.html.ejs', 'default.css.ejs'].forEach(
      file => {
        this.fs.copyTpl(
          this.templatePath(`blaze/${file}`),
          this.destinationPath(`client/templates/layouts/${path.basename(file, '.ejs')}`),
          {
            appname: this.config.get('appname')
          }
        );
      }
    );

    [`toJSON.js.ejs`,
      `schemas.js.ejs`,
      `collections.js.ejs`,
      `keysIn.js.ejs`].forEach(
        file => {
          this.fs.copyTpl(
            this.templatePath(`blaze/${file}`),
            this.destinationPath(`lib/helpers/${path.basename(file, '.ejs')}`)
          );
        }
      );
    }

    static getPackagesToAdd() {
      return ['aldeed:autoform'];
    }

    static getPackagesToRemove() {
      return [];
    }
  }
