var fs = require('fs')
  , jade = require('jade')
  , i18n = require('jade-i18n')
  , serialize = require('../support/jade-serial').serialize
  , deserialize = require('../support/jade-serial').deserialize
  , _ = i18n.helpers.__
  , Compiler = i18n.Compiler;

function render(tpl, obj, fn){
  fs.readFile(__dirname + '/fixtures/' + tpl, function(err, str){
    if (typeof obj == 'function'){
      fn = obj;
      obj = {};
    }
    if (!obj) obj = {};
    if (typeof obj == 'string')
      obj = { language: obj };
    obj.compiler = Compiler;
    obj.filename = tpl;
    obj.locals = {
      __: function(){
        return _.apply(this, [obj.language].concat(Array.prototype.slice.call(arguments)));
      }
    };
    fn(jade.render(str, obj || {}));
  });
};

module.exports = {
  
  'test simple translation for __': function(assert){
    i18n.phrase('ja_JP', 'Test', 'Tetzu');
    render('command.jade', 'ja_JP', function(html){
      assert.ok(html == '<em>Tetzu</em>');
    });
  },
  
  'test replacement translation for __': function(assert){
    i18n.phrase('es_SP', 'Hello {place}', 'Hola {place}');
    render('command-replace.jade', 'es_SP', function(html){
      assert.ok(html == '<em>Hola world</em>');
    });
    render('command-replace.jade', function(html){
      assert.ok(html == '<em>Hello world</em>');
    });
  },
  
  'test the firing of the missing event for __': function(assert){
    var lang
      , string
      , desc;
  
    i18n.on('missing', function(_lang, _str, id, _desc){
      if (_lang != 'es_SP') return;
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
  },
  
  'test the translation of a simple tag': function(assert){
    i18n.phrase('en_CA', { __type: 'tag'
    , name: 'a'
    , attrs: [ { name: 'href', val: ' \'#\'' } ]
    , block: { __type: 'block' }
    , text: { __type: 'text', __items: [ ' Hello World' ] }
    }, deserialize({ __type: 'tag'
    , name: 'a'
    , attrs: [ { name: 'href', val: ' \'#\'' } ]
    , block: { __type: 'block' }
    , text: { __type: 'text', __items: [ ' Hola Mundo' ] }
    }));
    
    render('tag.jade', 'en_CA', function(html){
      assert.ok(html == '<a href="#">Hola Mundo</a>');
    });
  },
  
  'test the firing of the missing event for tag': function(assert){
    var lang
      , node
      , desc;
      
    i18n.on('missing', function(_lang, _node, id, _desc){
      if (_lang != 'ru_RU') return;
      lang = _lang;
      node = _node;
      desc = _desc;
    });
    
    render('tag.jade', 'ru_RU', function(html){
      assert.ok(lang == 'ru_RU');
      assert.ok(node.__type == 'tag');
      assert.ok(node.name == 'a');
      assert.ok(node.attrs.length == 1);
      assert.ok(desc == undefined);
      assert.ok(html == '<a href="#">Hello World</a>');
    });
  }
  
};
