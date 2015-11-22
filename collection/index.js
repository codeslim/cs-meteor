'use strict';

let generators = require('yeoman-generator');
let _ = require('lodash-inflection');

module.exports = generators.NamedBase.extend({
  constructor: function() {
    generators.NamedBase.apply(this, arguments);
    if (!this.name.match(/^\w+$/)) this.env.error('Your collection name shoud match /^\\w+$/');
  },

  _askForProperty: function() {
    this.prompt([
      {
        message: 'Property name',
        name: 'name',
        type: 'input'
      },
      {
        message: 'Property type',
        name: 'type',
        type: 'input'
      }
    ],
    answers => {
      this.properties.push(answers);
      this._askForMoreProperties();
    });
  },

  _askForMoreProperties: function() {
    let done = this.async();

    this.prompt({
      message: 'Do you want to add a property?',
      name: 'moreProperties',
      type: 'confirm'
    },
    answers => {
      if (answers.moreProperties === false) {
        this.prompt({
          message: 'Add it to its own collection?',
          name: 'addToCollection',
          type: 'confirm'
        },
        answers => {
          this.addToCollection = answers.addToCollection;
          done();
        });
      } else {
        this._askForProperty();
      }
    });
  },

  prompting: function() {
    this.properties = [];
    this._askForMoreProperties();
  },

  writing: function() {
    let collectionSystem = this.config.get('collectionSystem');
    let collectionName = _.pluralize(this.name.toLowerCase());
    let collectionVarName = _.titleize(collectionName);
    let fileName = `${collectionName}.js`;

    let schemaSystem = this.config.get('schemaSystem');
    let schemaName = `${collectionVarName}Schema`;

    this.fs.copyTpl(
      this.templatePath('collection.ejs'),
      this.destinationPath(`lib/collections/${fileName}`),
      {
        properties: this.properties,
        collectionSystem,
        collectionVarName,
        collectionName,
        schemaSystem,
        schemaName,
        addToCollection: this.addToCollection
      }
    );
  }
});
