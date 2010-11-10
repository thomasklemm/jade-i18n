/**
 * Module dependencies.
 */

var i18n = module.parent.exports
  , jade = require('jade');

/**
 * i18n compiler
 */

var Compiler = module.exports = function(node, options){
  jade.Compiler.call(this, node, options);
};

/**
 * Inherit from `jade.Compiler`.
 */

Compiler.prototype.__proto__ = jade.Compiler.prototype;

/**
 * Override visitTag.
 *
 * @param {Node} node
 */

Compiler.prototype.visitTag = function(node){
  var parent = jade.Compiler.prototype.visitTag;
  
  if (!this.options.language)
    return parent.call(this, node);
  
  if (node.attrs){
    for (var i = 0, l = node.attrs.length; i < l; i++)
      if (attr.name == 'i18n'){
        if (i18n.lookup(this.options.language, node))
          node = i18n.lookup(this.options, node);
        else
          // CHECKME: is it .val?
          i18n.emit('missing', this.options.language, node, attr.val);
      }
  }
  
  parent.call(this, node);
};