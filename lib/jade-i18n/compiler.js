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
      if (node.attrs[i].name == 'i18n'){
        var desc = typeof node.attrs[i].val != 'string' ? undefined : node.attrs[i].val;
        node.attrs.splice(i, 1); // remove attr before hashing
        if (this.options.language != i18n.default){
          var lookup = i18n.lookup(this.options.language, node);
          if (lookup)
            node = lookup;
          else
            i18n.onMissing(this.options.language, node, desc);
        }
      }
  }
  
  parent.call(this, node);
};
