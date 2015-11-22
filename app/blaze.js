'use strict';

module.exports = class {
  static writing(self) {
    [`toJSON.blaze.ejs`,
      `schemas.blaze.ejs`,
      `collections.blaze.ejs`].forEach(
        file => {
          self.fs.copyTpl(
            self.templatePath(file),
            self.destinationPath(`lib/helpers/${file.substr(0, file.indexOf('.')) + '.js'}`)
          );
        }
      );
    }
  }
