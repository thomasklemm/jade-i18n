jade-i18n
=========

Adds simple yet very effective i18n support to jade.

## Features

* Support for i18n at Compiler level w/ caching. A piece of the parse tree can be translated (relies on `jade-serial` to produce JSON-able representations of the parsed nodes)
* Support for a traditional __() function for complex cases whose markup can't be handled easily by translators.
* Translation-source agnostic. The translation table can be populated from any source (eg: database, .po/.mo, XLIFF)
* Evented. Emits a `missing` event when a certain phrase / node is not translated, therefore it doesn't rely on gettext-style parsing.

## Credits

Guillermo Rauch &lt;guillermo@learnboost.com&gt;