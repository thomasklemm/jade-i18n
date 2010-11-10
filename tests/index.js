var fs = require('fs')
  , jade = require('jade')
  , i18n = require('jade-i18n')
  , helpers = i18n.helpers;

function render(tpl, obj, fn){
  fs.readFile(__dirname + '/fixtures/' + tpl, function(err, str){
    if (typeof obj == 'string')
      obj = { language: obj };
    obj.locals = helpers;
    fn(jade.render(str, obj || {}));
  });
};

module.exports = {
  
  'test the firing of the missing event for __': function(assert){
    var lang
      , string
      , desc;
  
    i18n.once('missing', function(_lang, _str, _desc){
      lang = _lang;
      str = _str;
      desc = _desc;
    });
  
    render('command.jade', 'es_SP', function(html){
      assert.ok(lang == 'es_SP');
      assert.ok(str == 'Test');
      assert.ok(desc == 'A command example');
      assert.ok(html == '<em>Test</em>');
    });
  }
  
};