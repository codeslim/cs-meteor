'use strict';

module.exports = class {
  static writing(options) {
    this.fs.copyTpl(
      this.templatePath(`blaze/${this.kind}.html.ejs`),
      this.destinationPath(`client/templates/${this.resource}/${this.kind}.html`),
      options
    );
    this.fs.copyTpl(
      this.templatePath(`blaze/${this.kind}.js.ejs`),
      this.destinationPath(`client/templates/${this.resource}/${this.kind}.js`),
      options
    );
  }
}
