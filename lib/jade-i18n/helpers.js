
/**
 * Module dependencies.
 */

var i18n = module.parent.exports;

/**
 * Substitution util. Finds str and replaces tokens delimited by `{` `}` with the values found in the `obj`
 *
 * @param {String} str
 * @param {Object} obj
 */

var regexp = /\\?\{([^{}]+)\}/g;
 
function substitute(str, obj){
  return str.replace(regexp, function(match, name){
    if (match.charAt(0) == '\\') return match.slice(1);
    return (obj[name] != undefined) ? obj[name] : '';
  });
};

/**
 * _ helper
 *
 * @param {String} language identifier, or falsy for default language
 * @param {String} str translation phrase
 * @param {Object} replacements object -optional-
 * @param {String} description
 */
 
var notifications = {};
 
module.exports._ = function(language, str, obj, desc){
  if (typeof obj == 'string'){
    desc = obj;
    obj = null;
  }
  
  var lookup = i18n.lookup(language, str);
  
  if (lookup == undefined && language && (!(language in notifications) || !(str in notifications[language]))){
    notifications[language] = notifications[language] || {};
    notifications[language][str] = 1;
    i18n.onMissing(language, str, str, desc);
  } else if (lookup != undefined) {
    str = lookup;
  }
  
  return obj ? substitute(str, obj) : str;
};
