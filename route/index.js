'use strict';

let generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  constructor: function() {
    generators.Base.apply(this, arguments);
  },

  _optionOrPrompt: require('yeoman-option-or-prompt'),

  prompting: function() {
    let done = this.async();
    let router = this.config.get('router');

    this._optionOrPrompt([
      {
        message: 'Group name?',
        name: 'group',
        type: 'input'
      },
      {
        message: 'Name?',
        name: 'name',
        type: 'input'
      },
      {
        message: 'Path?',
        name: 'path',
        type: 'input'
      },
      {
        message: 'Template name?',
        name: 'template',
        type: 'input'
      }
    ],
    answers => {
      this.group = answers.group;
      this.name = answers.name;
      this.path = answers.path;
      this.template = answers.template;
      done();
    });
  },

  _parseArgs: function(path) {
    let ret = [];
    let regex = /:([^/]+)/g;
    let exec;

    while ((exec = regex.exec(path)) !== null) {
      ret.push(exec[1]);
    }
    return ret;
  },

  writing: function() {
    this.args = this._parseArgs(this.path);
    require(`./${this.config.get('router')}`).writing(this);
  }
});
