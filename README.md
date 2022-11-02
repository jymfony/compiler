Compiler
========

Jymfony JS parser/compiler

Compiles ECMAScript modules down to CommonJS to be interpreted and executed by Node.JS.  

__NOTE:__ This package shouldn't be used standalone, but only in conjunction with `@jymfony/autoloader`.
Its API could change without prior notice.

#### Import/Export

Imports from commonjs modules are supported.  
Example:

```js
module.exports = MySimpleFunction;
```

can be imported as

```js
import MySimpleFunction from './myfile';
```

Also Node.JS could be imported as ES modules:

```js
import { dirname } from 'fs';
```

CommonJS exports are supported as well as ES modules.

```js
module.exports = MyClass;

// Is nearly the same as

export default MyClass;
```

#### Decorators

ECMAScript decorators are supported.

##### ! TODO support to decorator onto private instance fields/methods is missing.

Resources
---------

  * [Documentation](http://www.jymfony.com/link_to_docs)
  * [Contributing](http://www.jymfony.com/link_to_contributing)
  * [Report issues](https://github.com/jymfony/jymfony/issues) and
    [send Pull Requests](https://github.com/jymfony/jymfony/pulls)
    in the [main Jymfony repository](https://github.com/jymfony/jymfony)
