'use strict';
let generators = require('yeoman-generator');
let fs = require('fs');
let path = require('path');
let mkdirp = require('mkdirp');
let _ = require('lodash');
let lodash_inflection = require('lodash-inflection');

module.exports = generators.Base.extend({
  constructor: function() {
    generators.Base.apply(this, arguments);
    if (this._getResources().length < 1) this.env.error('You should have at least one resource!');
  },

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

    this.prompt([
      {
        message: 'What kind of view?',
        type: 'list',
        default: 'list',
        choices: ['list', 'show', 'new', 'edit'],
        name: 'kind'
      },
      {
        message: 'For which resource?',
        type: 'list',
        choices: this._getResources(),
        name: 'resource'
      },
      {
        message: 'Should I create the route for you?',
        type: 'confirm',
        name: 'route'
      }],
    answers => {
      this.kind = answers.kind;
      this.resource = answers.resource;
      this.route = answers.route;
      done();
    });
  },

  configuring: function() {
    this.front = this.config.get('front');
  },

  writing: function() {
    mkdirp(`client/templates/${this.resource}`);
    let path, template, group = _.capitalize(this.resource.toLowerCase()), tableTitle;
    switch (this.kind) {
      case 'list':
        path = `/${group.toLowerCase()}/`;
        template = `list${group}`;
        tableTitle = _.capitalize(lodash_inflection.pluralize(this.resource.toLowerCase()));
        break;
      case 'show':
        path = `/${group.toLowerCase()}/:_id`;
        template = `show${group}`;
        tableTitle = _.capitalize(this.resource.toLowerCase());
        break;
      case 'new':
        path = `/${group.toLowerCase()}/new`;
        template = `new${group}`;
        break;
      case 'edit':
        path = `/${group.toLowerCase()}/:_id/edit`;
        template = `edit${group}`;
        tableTitle = _.capitalize(this.resource.toLowerCase());
        break;
    }

    let options = {
      template,
      tableTitle,
      resource: lodash_inflection.pluralize(this.resource.toLowerCase()),
      collection: group
    };

    require(`./${this.front}.js`).writing.bind(this)(options);

    if (this.route) {
      this.composeWith('joker:route', { options: {
        group,
        name: template,
        path,
        template
      }});
    }
  }
});
