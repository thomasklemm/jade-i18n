
var fs = require('fs')
  , jade = require('jade')
  , i18n = require('jade-i18n')
  , serialize = require('jade-serial').serialize
  , deserialize = require('jade-serial').deserialize
  , _ = i18n.helpers._
  , assert = require('assert')
  , Compiler = i18n.Compiler;

function render(tpl, obj, fn){
  fs.readFile(__dirname + '/fixtures/' + tpl, 'utf8', function(err, str){
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
      _: function(){
        return _.apply(this, [obj.language].concat(Array.prototype.slice.call(arguments)));
      }
    };
    fn(jade.compile(str, obj)(obj.locals));
  });
};

module.exports = {
  
  'test simple translation for _': function(){
    i18n.phrase('ja_JP', 'Test', 'Tetzu');
    render('command.jade', 'ja_JP', function(html){
      assert.equal(html, '<em>Tetzu</em>');
    });
  },
  
  'test replacement translation for _': function(){
    i18n.phrase('es_SP', 'Hello {place}', 'Hola {place}');
    render('command-replace.jade', 'es_SP', function(html){
      assert.equal(html, '<em>Hola world</em>');
    });
    render('command-replace.jade', function(html){
      assert.equal(html, '<em>Hello world</em>');
    });
  },
  
  'test the firing of the missing event for _': function(){
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
      assert.equal(lang, 'es_SP');
      assert.equal(str, 'Test');
      assert.equal(desc, 'A command example');
      assert.equal(html, '<em>Test</em>');
    });
  },
  
  'test the translation of a simple tag': function(){
    var from = { __type: 'tag'
      , name: 'a'
      , attrs: [ { name: 'href', val: ' \'#\'' } ]
      , block: { __type: 'block' }
      , text: { __type: 'text', __items: [ ' Hello World' ] }
    };

    var to = deserialize({ __type: 'tag'
      , name: 'a'
      , attrs: [ { name: 'href', val: ' \'#\'' } ]
      , block: { __type: 'block' }
      , text: { __type: 'text', __items: [ ' Hola Mundo' ] }
    });

    i18n.phrase('en_CA', from, to);

    render('tag.jade', 'en_CA', function(html){
      assert.equal(html, '<a href="#">Hola Mundo</a>');
    });
  },
  // 
  // 'test the firing of the missing event for tag': function(){
  //   var lang
  //     , node
  //     , desc;
  //     
  //   i18n.on('missing', function(_lang, _node, id, _desc){
  //     if (_lang != 'ru_RU') return;
  //     lang = _lang;
  //     node = _node;
  //     desc = _desc;
  //   });
  //   
  //   render('tag.jade', 'ru_RU', function(html){
  //     assert.equal(lang, 'ru_RU');
  //     assert.equal(node.__type, 'tag');
  //     assert.equal(node.name, 'a');
  //     assert.equal(node.attrs.length, 1);
  //     assert.equal(desc, undefined);
  //     assert.equal(html, '<a href="#">Hello World</a>');
  //   });
  // }
  
};
