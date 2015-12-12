'use strict';

let generators = require('yeoman-generator');
let _ = require('lodash');
let fs = require('fs');
let path = require('path');

module.exports = generators.Base.extend({
  constructor: function() {
    generators.Base.apply(this, arguments);
  },

  _optionOrPrompt: require('yeoman-option-or-prompt'),

  _getResources() {
    if (typeof this.resources === 'undefined') {
      this.resources = fs.readdirSync(
        this.destinationPath('lib/collections')
      ).map(elem => path.basename(elem, '.js'));
    }
    return this.resources;
  },

  prompting: function() {
    let done = this.async();
    let router = this.config.get('router');

    this._optionOrPrompt([
      {
        message: 'What kind of method?',
        type: 'list',
        default: 'insert',
        choices: ['insert', 'update', 'read', 'delete'],
        name: 'kind'
      },
      {
        message: 'For which resource?',
        type: 'list',
        choices: this._getResources(),
        name: 'resource'
      }],
    answers => {
      this.kind = answers.kind;
      this.resource = answers.resource;
      done();
    });
  },

  writing: function() {
    let collection = _.capitalize(this.resource);
    let userSystem = this.config.get('userSystem');

    this.fs.copyTpl(
      this.templatePath(`${this.kind}.ejs`),
      this.destinationPath(`lib/methods/${this.kind}/${this.resource}.js`),
      {
        collection,
        userSystem
      }
    )
  }
});
