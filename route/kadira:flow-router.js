'use strict';

let mkdirp = require('mkdirp');
let path = require('path');
let _ = require('lodash');
let esprima = require('esprima');
let estraverse = require('estraverse');
let escodegen = require('escodegen');
let ejs = require('ejs');

module.exports = class {
  static writing(self) {
    let outputFile = `lib/routes/${self.group}.js`;
    let params = {
      groupVar: `${_.capitalize(self.group.toLowerCase())}Routes`,
      group: self.group,
      name: self.name,
      path: self.path,
      template: self.template,
      layout: 'default',
      front: _.capitalize(self.config.get('front')),
      args: self.args
    };

    if (self.fs.exists(outputFile)) {
      let ast = esprima.parse(self.fs.read(outputFile));
      let routeBlock, objectBlock;
      let newRouteBlock = esprima.parse(ejs.render(self.fs.read(self.templatePath('kadira:flow-router/routeblock.ejs')), params));

      estraverse.replace(ast, {
        enter: function(node, parent) {
          if (node.type === 'CallExpression' &&
              node.callee.type === 'MemberExpression' &&
              node.callee.object.name === params.groupVar &&
              node.callee.property.name === 'route') {
                routeBlock = node;
              }
          if (routeBlock && node.type === 'Property' &&
              node.key.name === 'name' && node.value.name === self.name) {
                objectBlock = node;
              }
        },

        leave: function(node) {
          if (routeBlock === node && objectBlock) {
            this.break();
            return newRouteBlock;
          } else if (routeBlock === node) {
            routeBlock = null;
          }
        }
      });

      if (!routeBlock) ast.body = ast.body.concat(newRouteBlock);
      self.fs.write(outputFile, escodegen.generate(ast));
    } else {
      self.fs.copyTpl(
        self.templatePath('kadira:flow-router/routefile.ejs'),
        self.destinationPath(outputFile),
        params
      );
    }
  }
}
