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

  prompting: function() {
    let done = this.async();

    this.prompt([
      {
        message: 'Frontend framework?',
        name: 'front',
        type: 'list',
        choices: ['angular', 'react', 'blaze'],
        default: 'blaze'
      },
      {
        message: 'Schema system?',
        name: 'schemaSystem',
        type: 'list',
        choices: ['none', 'aldeed:simple-schema'],
        default: 'aldeed:simple-schema'
      },
      {
        message: 'Collection system?',
        name: 'collectionSystem',
        type: 'list',
        choices: ['none', 'aldeed:collection2'],
        default: 'aldeed:collection2'
      },
      {
        message: 'Router?',
        name: 'router',
        type: 'list',
        choices: ['none', 'iron:router', 'kadira:flow-router'],
        default: 'kadira:flow-router'
      },
      {
        message: 'User system?',
        name: 'userSystem',
        type: 'list',
        choices: ['none', 'accounts-base'],
        default: 'accounts-base'
      }
    ], function(answers) {
      this.front = answers.front;
      this.schemaSystem = answers.schemaSystem;
      this.collectionSystem = answers.collectionSystem;
      this.router = answers.router;
      this.userSystem = answers.userSystem;
      done();
    }.bind(this));
  },

  configuring: function() {
    this.config.set('front', this.front);
    this.config.set('schemaSystem', this.schemaSystem);
    this.config.set('collectionSystem', this.collectionSystem);
    this.config.set('router', this.router);
    this.config.set('userSystem', this.userSystem);
  },

  writing: function() {
    this.spawnCommandSync('meteor', ['create', '.'], {});
    this.fs.delete('*');
    this.fs.commit([], function() { });

    mkdirp.sync('client');
    mkdirp.sync('server/publications');
    ['collections', 'methods', 'routes', 'helpers'].forEach(
      dir => mkdirp.sync(`lib/${dir}`)
    );
    ['insert', 'read', 'remove', 'update'].forEach(
      crud => mkdirp.sync(`lib/methods/${crud}`)
    );

    ['client', 'server', 'lib'].forEach(
      dir => {
        this.fs.copyTpl(
          this.templatePath('startup.ejs'),
          this.destinationPath(`${dir}/startup.js`)
        );
      }
    );

    [`toJSON.${this.front}.ejs`,
      `schemas.${this.front}.ejs`,
      `collections.${this.front}.ejs`].forEach(
        file => {
          this.fs.copyTpl(
            this.templatePath(file),
            this.destinationPath(`lib/helpers/${file.substr(0, file.indexOf('.')) + '.js'}`)
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
