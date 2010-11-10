var jade = require('jade')
  , i18n = require('jade-i18n')
  , helpers = i18n.helpers;

function render(tpl, obj){
  if (typeof obj == 'string')
    obj = { language: obj };
  obj.locals = helpers;
  return jade.render(__dirname + '/fixtures/' + tpl, obj || {});
};

module.exports = {
  
  'test the firing of the missing event for __': function(assert, beforeExit){
    var lang
      , string
      , desc
      , html;
  
    i18n.once('missing', function(_lang, _str, _desc){
      lang = _lang;
      str = _str;
      desc = _desc;
    });
  
    html = render('command.jade', 'es_SP');
  
    beforeExit(function(){
      assert.ok(lang == 'es_SP');
      assert.ok(str == 'Test');
      assert.ok(desc == 'A command example');
      assert.ok(html == '<em>Test</em>');
    });
  }
  
};