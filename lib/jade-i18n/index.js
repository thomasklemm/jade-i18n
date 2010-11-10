/**
 * Module dependencies.
 */

var jade = require('jade')
  , serialize = require('../../support/jade-serial').serialize
  , crypto = require('crypto')
  , EventEmitter = require('events').EventEmitter
  , Node = jade.nodes.Node
  , oldRender = jade.render
  , phrases = {};

/**
 * Hashes a node for lookup
 */
function hash(obj){
  if (typeof obj == 'string') return obj;
  if (obj instanceof Node) obj = serialize(obj);
  if (typeof obj == 'object')
    return crypto.createHash('md5').update(JSON.parse(obj)).digest('hex');
};

/**
 * Override `jade.render`. Adds `language` option support.
 *
 * @param {String} template
 * @param {Object} options hash
 */
jade.render = function(str, options){
  if (options.language)
    // We ensure that the caching will work on a language-to-language basis by altering the filename
    options.filename = options.filename + '.' + options.language;
  
  return oldRender.call(jade, str, options);
};

/**
 * Inherit EventEmitter
 */
 
var exports = module.exports = new EventEmitter;

/**
 * Registers an event that's fired once
 * 
 * @param {String} event name
 * @param {Function} callback
 * @api public
 */

if (!('once' in exports))
  exports.once = function(ev, fn){
    var self = this;
    return this.on(ev, function(){
      fn.apply(self, arguments);
      self.removeListener(ev, fn);
    });
  };
  
/**
 * Registers a phrase by language, hash of serialized nodes / translation string
 * 
 * @param {String} language
 * @param {String} existing string
 * @param {Node}/{String} translation
 * @api public
 */

exports.phrase = function(language, existing, translation){
  if (!(language in phrases))
    phrases[language] = {};
  phrases[language][hash(existing)] = translation;
};

/**
 * Looks up a phrase by hash of serialized nodes / translation string
 *
 * @param {String} language
 * @param {Node}/{String} existing phrase
 * @api public
 */

exports.lookup = function(language, existing){
  if (!(language in phrases)) return;
  return phrases[language][hash(existing)];
};
  
/**
 * Compiler instance to inherit from to support i18n
 * 
 * @api public
 */
 
exports.Compiler = require('./compiler');

/**
 * Helpers
 *
 * @api public
 */
 
exports.helpers = require('./helpers');