'use strict';

var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  constructor: function() {
    generators.Base.apply(this, arguments);

    this.argument('appname', { type: String, required: false });
    this.destinationRoot(`${this.destinationRoot()}/${this.appname ? this.appname : ''}`);
    this.config.set('appname', this.appname ? this.appname : this.name);
  },

  prompting: function () {
    let done = this.async();

    this.prompt([
      {
        message: 'Which front-end framework will you use?',
        name: 'front',
        type: 'list',
        choices: ['angular', 'react', 'blaze'],
        default: 'blaze'
      }
    ], function(answers) {
      this.front = answers.front;
      done();
    }.bind(this));
  },

  configuring: function() {
    this.config.set('front', this.front);
  },

  writing: function() {
    this.spawnCommandSync('meteor', ['create', '.'], {});
    this.fs.delete('*');
    this.fs.commit([], function() { });
  },

  install: function() {
    switch(this.front) {
      case 'angular':
      case 'react':
        this.spawnCommandSync('meteor', ['remove', 'blaze-html-templates'], {});
        this.spawnCommandSync('meteor', ['add', this.front], {});
    }
  }
});
