'use strict';

module.exports = class {
  static writing(self) {
  }

  static getPackagesToAdd() {
    return [];
  }

  static getPackagesToRemove() {
    return ['blaze-html-templates'];
  }
}
