'use strict';

let generators = require('yeoman-generator');
let mkdirp = require('mkdirp');
let path = require('path');

module.exports = generators.Base.extend({
  constructor: function() {
    generators.Base.apply(this, arguments);

    this.argument('appname', { type: String, required: false });
    this.destinationRoot(`${this.destinationRoot()}/${this.appname ? this.appname : ''}`);
    this.config.set('appname', this.appname !== undefined ? this.appname : path.basename(this.destinationRoot()));
  },

  prompting: function() {
    let done = this.async();

    this.prompt([
      {
        message: 'Frontend framework?',
        name: 'front',
        type: 'list',
        choices: ['blaze'/*, 'angular', 'react'*/],
        default: 'blaze'
      },
      {
        message: 'Schema system?',
        name: 'schemaSystem',
        type: 'list',
        choices: [/*'none', */'aldeed:simple-schema'],
        default: 'aldeed:simple-schema'
      },
      {
        message: 'Collection system?',
        name: 'collectionSystem',
        type: 'list',
        choices: [/*'none', */'aldeed:collection2'],
        default: 'aldeed:collection2'
      },
      {
        message: 'Router?',
        name: 'router',
        type: 'list',
        choices: [/*'none', */'kadira:flow-router'/*, 'iron:router'*/],
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
      this.schemaSystem = answers.schemaSystem !== 'none' ? answers.schemaSystem : undefined;
      this.collectionSystem = answers.collectionSystem !== 'none' ? answers.collectionSystem : undefined;
      this.router = answers.router !== 'none' ? answers.router : undefined;
      this.userSystem = answers.userSystem !== 'none' ? answers.userSystem : undefined;
      done();
    }.bind(this));
  },

  configuring: function() {
    this.config.set('front', this.front);
    this.config.set('schemaSystem', this.schemaSystem);
    this.config.set('collectionSystem', this.collectionSystem);
    this.config.set('router', this.router);
    this.config.set('userSystem', this.userSystem);

    this.frontClass = require(`./${this.front}.js`);
    this.routerClass = require(`./${this.router}.js`);
  },

  writing: function() {
    this.spawnCommandSync('meteor', ['create', '.'], {});
    this.fs.delete('*');
    this.fs.commit([], function() { });

    mkdirp.sync('client');
    mkdirp.sync('client/templates');

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

    this.frontClass.writing.bind(this)();
    this.routerClass.writing.bind(this)();
  },

  install: function() {
    let addList = ['add', 'check'];
    let removeList = ['remove'];

    addList = addList.concat(this.frontClass.getPackagesToAdd.bind(this)());
    removeList = removeList.concat(this.frontClass.getPackagesToRemove.bind(this)());

    addList = addList.concat(this.routerClass.getPackagesToAdd.bind(this)());
    removeList = removeList.concat(this.routerClass.getPackagesToRemove.bind(this)());

    [this.schemaSystem, this.collectionSystem, this.userSystem].forEach(
      component => {
        if (component) addList.push(component);
      }
    );

    if (removeList.length > 1) this.spawnCommandSync('meteor', removeList, {});
    if (addList.length > 1) this.spawnCommandSync('meteor', addList, {});
  }
});
