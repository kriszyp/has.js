# has.js

Pure feature detection library, a la carte style.

This document is **not** complete. 

## About

Browser sniffing and feature inference are flawed techniques for detecting browser support in client side JavaScript. The goal of 
**has.js** is to provide a collection of self-contained tests and unified framework around using pure feature detection for whatever 
library consumes it. 

You likely _won't_ see **has.js** as a public API in any library. The idea is that _%yourfavoritelibrary%_ will import some or all
the available tests, based on their own needs for providing you a normalized future proof API against common tasks.

**not stable**, so keep that in mind. This is a young project, and the decided naming conventions may be a moving target. 
The tests are nothing that haven't been done over and over in various places,
so the intention is to come to some agreement on a basic naming convention and API based on real world use cases.

Currently, the testing convention is _has('somefeature')_ returns _Boolean_. eg:

    if(has("function-bind")){
        // your enviroment has a native Function.prototype.bind
    }else{
        // you should get a new browser. 
    }
    
In the real world, this may translate into something like:

    mylibrary.trim = has("string-trim") ? function(str){
        return (str || "").trim();
    } : function(str){
        /* do the regexp based string trimming you feel like using */
    }

By doing this, we can easily defer to browser-native versions of common functions, augment prototypes (which **has.js** will _not_ do) to 
supplement the natives, or whatever we choose.

Running _has()_ is a one-time cost, deferred until needed. After first run, subsequent _has()_ checks are cached and return immediately.

## Testing Registration

Each test is self-contained. Register a test with _has.add()_:

    has.add("some-test-name", function(global, document, anElement){
        // global is a reference to global scope, document is the same
        // anElement only exists in browser enviroments, and can be used
        // as a common element from which to do DOM working.
        // ALWAYS CLEAN UP AFTER YOURSELF in a test. No leaks, thanks. 
        // return a Boolean from here.
        return true; 
    });
    
You can register and run a test immediately by passing a truthy value after the test function:

    has.add("some-other-test", function(){
        return false; // Boolean
    }, true)

This is preferred over what would seem a much more effective version:

    // this is not wrapped in a function, and should be:
    has.add("some-other-test", ("foo" in bar)); // or whatever
    
By forcing a function wrapper around the test logic we are able to defer execution until needed, as well as provide a normalized way for 
each test to have it's own execution context. This way, we can remove some or all the tests we do not need in whatever upstream library
should adopt _has_.

## As a Module
has.js can be loaded as a module with RequireJS, Dojo, or any other AMD module 
loader, and no global variable will be created. Requiring or depending on has.js give 
you access to has(). You can also depend on any of the detect modules and has will
be included. For example, we could create a module that depends on has/array:

    define(["has/array"], function(has){
      if(has("array-every")){
        someArray.every(...);
      }
      ...
    }); 

Make sure that you have has.js setup as a package in order for this work properly though.
You can setup has.js as a package in RequireJS with something like:

	packages: [
		{
			name:"has",
			location:"has.js",
			lib:"./detect",
			main:"../has"
		}
	]

## As a Dependency Plugin

has.js can also be used as a dependency loader plugin for AMD module loaders. This allows
you to conditionally load modules based on available features. The syntax for feature-dependent
modules is based on the JavaScript ternary operator:

    define(["has!feature?module-if-has-feature:module-if-does-not-have-feature",...

This follows the standard rule for ternary operators. If the feature (the token before the
?) is available, the module before the : is loaded, otherwise the module after the colon
is loaded. Ternary operators can also be nested. We can have a set of different modules
based on different features:

    define(["has!feature1?module1:feature2?module2:feature3?module3:default-module",...

If feature1 is available, module1 will be returned, if feature2 is available, module2 will be returned, etc.  

Also, if no module (empty string) is provided in one of the ternary slots, undefined will be returned. For example:

    define(["has!feature?module-if-has-feature",...

This will return the module "module-if-has-feature" if the feature is available, otherwise
it will return undefined.

The "has" module itself does not register any tests. Normally you would reference the 
has detection module that registers the needed tests to ensure that the correct tests
are available. For example, if you want to branch to different modules based on the
existence of the the Array's every() method, you could do:

    define(["has/array!array-every?module-for-every:module-when-no-every",...
     
Or more likely, you can also create your test registration module, then use this module as the
branching module. For example, we could create a test registration module:

    define("my-tests", ["has"], function(has){
        has.add("some-test", function(){
          // the test code
        });
    }); 

And then we could use it:

    define(["my-tests!some-test?module-a:module-b"], function(...
    

## Platform Builds

Something resembling a "builder" is coming. A basic dependency matcher and test lister is provided in `build/`

## Contribute

**has.js** contributions are covered under a common license by way of [Dojo Foundation CLA](http://dojofoundation.org/cla), and brought to you by the following awesome folks:

  + [John David Dalton](http://allyoucanleet.com/) - FuseJS Project Lead
  + [Brad Dougherty](http://github.com/bdougherty)
  + [Bryan Forbes](http://http://www.reigndropsfall.net) - Dojo Committer
  + [Ryan Grove](http://twitter.com/yaypie) - YUI engineer
  + [Andrée Hansson](http://github.com/peol)
  + [Peter Higgins](http://higginsforpresident.net) - Dojo Project Lead
  + [Paul Irish](http://paulirish.com) - jQuery Team, Modernizr developer
  + [Weston Ruter](http://weston.ruter.net/) - X-Team/XHTMLized developer
  + [Rick Waldron](http://github.com/rwldrn/)
  + [Juriy Zaytsev](http://perfectionkills.com) - @kangax, nuff' said.
  
There is an _irc_ room setup for discussion or questions: **#hasjs@irc.freenode.net**

## Conventions

Internally, we follow these conventions:

  + All Strings are quoted using double-quotes **"**
  + Test names are lowercase, hyphen separated strings. Enclosed in double-quotes
    + Tests are passed `g`, `d`, and `n`. Use these aliases always.
  + Globals are as follows, available as used but will be reduced to a single ref:
    + STR == "string"
    + FN == "function"
  + Tests return Booleans. Sometimes, you must coerce a boolean:
    + DO return !!(someExpression) as necessary
    + DO N0T return !!("x" in y) or anything else that would otherwise return a boolean, eg
      + x !== y, x > y, x typeof y
    + DO wrap expressions in parens: eg return ("x" in y)

## License 

Tentatively, **has.js** is available under the Academic Free License, New BSD License, and the MIT License. Providing this common code under multiple licenses requires us to have all contributors agree to a [CLA](http://dojofoundation.org/cla).

## TODO

**has.js** is open source, and open to contribution. Please fork and send pull requests as you see fit. This is a rough list of things that are needed or coming:

  + moar tests. Fork/pull request anytime. 
  + Static Frontend - some home to put a static instance of has.js online to collect UA -> has(test) mappings
  + Documentation regarding each of the tests, by name. eg: has("native-xhr") // tests if the environment has a native XmlHttpRequest implementation. 
  + moar tests. Again with the forking. 
  + "compiler" code / frontend 
     + ideally something that will use the list of tests, provide a clean interface to selecting tests needed and to download a single has.js file with tests embedded.
     + keeping in mind to remove additional closures and provide (only needed) var CONTS = "" style helpers in a single wrapping function. 