/**
 * Module dependencies.
 */

var jade = require('jade')
  , serialize = require('jade-serial').serialize
  , deserialize = require('jade-serial').deserialize
  , crypto = require('crypto')
  , EventEmitter = require('events').EventEmitter
  , Node = jade.nodes.Node
  , compile = jade.compile
  , phrases = {};

/**
 * Override `jade.compile`. Adds `language` option support.
 *
 * @param {String} template
 * @param {Object} options hash
 */
jade.compile = function(str, options){
  if (options.language)
    // We ensure that the caching will work on a language-to-language basis by altering the filename
    options.filename = options.filename + '.' + options.language;
  
  return compile.call(jade, str, options);
};

/**
 * Inherit EventEmitter
 */
 
var exports = module.exports = new EventEmitter;

/**
 * Hashes a node for lookup
 *
 * @param {String/Node/Object} obj
 * @api public
 */
var hash = exports.hash = function(obj){
  if (typeof obj == 'string') return obj;
  if (obj instanceof Node) obj = serialize(obj);
  if (typeof obj == 'object')
    return crypto.createHash('md5').update(JSON.stringify(obj)).digest('hex');
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
 * Called on missing phrase
 *
 * @api private
 */

exports.onMissing = function(language, data, desc){
  data = typeof data == 'string' ? data : serialize(data);
  exports.emit('missing', language, data, hash(data), desc);
};

/**
 * Called for every phrase
 *
 * @api private
 */

exports.onPhrase = function (language, data, desc) {
  data = typeof data == 'string' ? data : serialize(data);
  exports.emit('phrase', language, data, hash(data), desc);
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

/**
 * Default language. Defaults to en_US. Can be any string, with any format.
 *
 * @api public
 */

exports.default = 'en_US';

/**
 * Exports the serializer
 *
 * @api public
 */

exports.serialize = serialize;

/**
 * Exports the deserializer
 *
 * @api public
 */

exports.deserialize = deserialize;
