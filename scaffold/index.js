'use strict';

let generators = require('yeoman-generator');
let _ = require('inflection');

module.exports = generators.Base.extend({
  constructor: function() {
    generators.Base.apply(this, arguments);
    this.argument('resourceName', { type: String, required: true });
  },

  writing: function() {
    let name = _.titleize(_.pluralize(this.resourceName.toLowerCase()));

    this.composeWith('cs-meteor:collection', {
      options: {
        addToCollection: true
      },
      args: [name]
    });
    ['insert', 'update', 'read', 'delete'].forEach(kind => {
        this.composeWith('cs-meteor:method', {
          options: {
            kind,
            resource: name
          }
        })
      }
    );
    ['new', 'list', 'show', 'edit'].forEach(kind => {
        this.composeWith('cs-meteor:view', {
          options: {
            kind,
            resource: name,
            route: true
          }
        })
      }
    );
  }
});
