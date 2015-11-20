'use strict';

let generators = require('yeoman-generator');
let mkdirp = require('mkdirp');

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
      },
      {
        message: 'Which schema system will you use?',
        name: 'schemaSystem',
        type: 'list',
        choices: ['none', 'aldeed:simple-schema'],
        default: 'aldeed:simple-schema'
      },
      {
        message: 'Which collection system will you use?',
        name: 'collectionSystem',
        type: 'list',
        choices: ['none', 'aldeed:collection2'],
        default: 'aldeed:collection2'
      },
      {
        message: 'Which router will you use?',
        name: 'router',
        type: 'list',
        choices: ['none', 'iron:router', 'kadira:flow-router'],
        default: 'kadira:flow-router'
      }
    ], function(answers) {
      this.front = answers.front;
      this.schemaSystem = answers.schemaSystem;
      this.collectionSystem = answers.collectionSystem;
      this.router = answers.router;
      done();
    }.bind(this));
  },

  configuring: function() {
    this.config.set('front', this.front);
    this.config.set('schemaSystem', this.schemaSystem);
    this.config.set('collectionSystem', this.collectionSystem);
    this.config.set('router', this.router);
  },

  writing: function() {
    this.spawnCommandSync('meteor', ['create', '.'], {});
    this.fs.delete('*');
    this.fs.commit([], function() { });

    mkdirp.sync('client');
    mkdirp.sync('server/publications');
    ['collections', 'methods', 'routes'].forEach(
      dir => mkdirp.sync(`lib/${dir}`)
    );

    ['client', 'server', 'lib'].forEach(
      dir => {
        this.fs.copyTpl(
          this.templatePath('startup.js'),
          this.destinationPath(`${dir}/startup.js`)
        );
      }
    );
  },

  install: function() {
    let addList = ['add'];
    let removeList = ['remove'];

    switch(this.front) {
      case 'angular':
      case 'react':
        addList.push(this.front);
        removeList.push('blaze-html-templates');
    }

    [this.schemaSystem, this.collectionSystem, this.router].forEach(
      component => {
        if (component !== 'none') addList.push(component);
      }
    );

    if (removeList.length > 1) this.spawnCommandSync('meteor', removeList, {});
    if (addList.length > 1) this.spawnCommandSync('meteor', addList, {});
  }
});
