// { "framework": "Vue" }

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 17);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(21)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file.
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate

    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_script_index_0_title_vue__ = __webpack_require__(11);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_7_1_vue_loader_lib_template_compiler_index_id_data_v_1fd30c98_hasScoped_true_buble_transforms_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_template_index_0_title_vue__ = __webpack_require__(41);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(39)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-1fd30c98"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_script_index_0_title_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_7_1_vue_loader_lib_template_compiler_index_id_data_v_1fd30c98_hasScoped_true_buble_transforms_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_template_index_0_title_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\components\\title.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1fd30c98", Component.options)
  } else {
    hotAPI.reload("data-v-1fd30c98", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
  data() {
    return {};
  },
  created() {}
});

/***/ }),
/* 5 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_loginTitle_vue__ = __webpack_require__(7);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



const modal = weex.requireModule("modal");
const stream = weex.requireModule("stream");
const context = weex.requireModule("context");
const picker = weex.requireModule("picker");
const animation = weex.requireModule("animation");
const fingerprint = weex.requireModule("fingerprint");

/* harmony default export */ __webpack_exports__["a"] = ({
  components: {
    Title: __WEBPACK_IMPORTED_MODULE_0__components_loginTitle_vue__["a" /* default */]
  },
  data() {
    return {
      Title: "",
      Show: true,
      UserName: "",
      UserPwd: "",
      bg: "red",
      maskFlag: false,
      logoUrl: this.$store.state.imgBaseUrl + "logo.png",
      nameUrl: this.$store.state.imgBaseUrl + "login_user_icon@2x.png",
      pwdUrl: this.$store.state.imgBaseUrl + "login_password_icon@2x.png",
      backgroudimage: "",
      backbuttonimage: this.$store.state.imgBaseUrl + "backbuttonimage.png",
      btnimageurl: this.$store.state.imgBaseUrl + "login_btbg.png"
    };
  },
  methods: {
    //获取用户名
    getName(event) {
      this.UserName = event.value;
    },
    //获取密码
    getPwd(event) {
      this.UserPwd = event.value;
    },
    //忘记密码
    toForget() {
      this.jump("/forgetPwd");
    },
    register() {
      this.jump('./register');
    },
    //更多登录
    moreLogin() {
      let items = ["手势登录", "指纹登录"];
      picker.pick({
        index: 0,
        items
      }, event => {
        if (event.result === "success") {
          modal.toast({ message: event.data });
          if (event.data == 0) {
            // context.launchStage("main.gesture");
            this.jump('/gestureslogin');
          } else if (event.data == 1) {
            this.jump('/fingerprintlogin');
            // fingerprint.identify(data => {
            //     if (data == "1") {
            //     modal.alert({
            //         message: "指纹登录成功",
            //         duration: 0.3
            //     });
            //     } else {
            //     modal.alert({
            //         message: data,
            //         duration: 0.3
            //     });
            //     }
            // });
          }
        }
      });
      // this.showType()
    },
    //展示登录方式
    showType() {
      var testEl = this.$refs.moreList;
      animation.transition(testEl, {
        styles: {
          transform: "translate(0px, -240px)",
          transformOrigin: "center center"
        },
        duration: 400, //ms
        timingFunction: "ease",
        delay: 0 //ms
      }, function () {});
      this.maskFlag = true;
    },
    //隐藏登录方式
    hideType() {
      var testEl = this.$refs.moreList;
      animation.transition(testEl, {
        styles: {
          transform: "translate(0px, 0px)",
          transformOrigin: "center center"
        },
        duration: 400, //ms
        timingFunction: "ease",
        delay: 0 //ms
      }, function () {});
      this.maskFlag = false;
    },
    toLoginTpe(index) {
      if (index == 1) {} else if (index == 2) {} else {}
      this.hideType();
    },
    //立即登录
    toLogin() {
      //拿到token执行setToken
      //   if (
      //     context.setToken(
      //       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MjIzMjAwMDAwMDAwMDExNDM3IiwiYXVkIjoiNjIyMzIwMDAwMDAwMDAxMTQzNyIsIm5hbWUiOiI2MjIzMjAwMDAwMDAwMDExNDM3MTUyMDM5MjIxOTA5NiIsImlzcyI6IjYyMjMyMDAwMDAwMDAwMTE0MzcifQ.eSmWTMfXUpmFsVIEtFCpN0RBkM39L5f1M3qvDg8eB2g"
      //     ) == 0
      //   ) {
      //     // context.next();
      //     context.finish();
      //   } else {
      //     modal.alert({
      //       message: "登录失败"
      //     });
      //   }

      //  if (1==1) {
      //     modal.alert({
      //         message: "222"
      //     })
      //     context.next();
      // } else {
      //     modal.alert({
      //         message: "登录失败"
      //     })
      // }

      // const params = {
      //     //  "LoginId":this.UserName,
      //     //  "Password":this.UserPwd,
      //     "LoginType": "C",
      //     "LoginId": "6223200000000011403",
      //     "Password": this.UserPwd,
      //     "BankId": "9999"
      // };
      // stream.fetch({
      //     method: 'POST',
      //     url: `/uauth/pweb-common.Login.do`,
      //     type: 'json',
      //     body: this.toParams(params)
      // }, response => {
      //     if (response.status == 200) {
      //         modal.alert({
      //             message: "返回码" + response.data.JSON._RejCode
      //         })
      //         if (response.data.JSON._RejCode == "000000") {
      //             //拿到token执行setToken
      //             if (context.setToken(response.data.JSON.Token) == 0) {
      //                 context.next();
      //             } else {
      //                 modal.alert({
      //                     message: "错误"
      //                 })
      //             }
      //         } else {
      //             modal.alert({
      //                 message: response.data.jsonError[0]._exceptionMessage
      //             })
      //         }

      //     } else {}
      // }, () => {});
    },
    //注册
    toRegister() {
      context.launchStage("main.register");
      // this.jump("/register")
    }
  }
});

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_script_index_0_loginTitle_vue__ = __webpack_require__(8);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_7_1_vue_loader_lib_template_compiler_index_id_data_v_43f57642_hasScoped_true_buble_transforms_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_template_index_0_loginTitle_vue__ = __webpack_require__(30);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(28)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-43f57642"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_script_index_0_loginTitle_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_7_1_vue_loader_lib_template_compiler_index_id_data_v_43f57642_hasScoped_true_buble_transforms_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_template_index_0_loginTitle_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\components\\loginTitle.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-43f57642", Component.options)
  } else {
    hotAPI.reload("data-v-43f57642", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


const modal = weex.requireModule('modal');
const context = weex.requireModule("context");
/* harmony default export */ __webpack_exports__["a"] = ({
    props: ["title", "show", "bg"],
    data() {
        return {
            backurl: this.$store.state.imgBaseUrl + "nav_back.png",
            marginTop: 0
        };
    },
    mounted() {
        this.marginTop = context.getDeviceInfo().status_bar_height;
    },
    methods: {}
});

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_loginTitle_vue__ = __webpack_require__(7);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



const modal = weex.requireModule("modal");
const stream = weex.requireModule("stream");
const context = weex.requireModule("context");

/* harmony default export */ __webpack_exports__["a"] = ({
  components: {
    Title: __WEBPACK_IMPORTED_MODULE_0__components_loginTitle_vue__["a" /* default */]
  },
  data() {
    return {
      Title: "忘记密码",
      Show: true,
      bg: "red",
      telPhone: "",
      msgCode: "",
      newPwd: "",
      newPwdCfm: "",
      time: 20,
      isTimerStop: true,
      msgCodeBtnText: "获取验证码"

    };
  },
  methods: {
    //获取用户名
    getName(event) {
      this.UserName = event.value;
    },
    //获取密码
    getPwd(event) {
      this.UserPwd = event.value;
    },

    sendCode() {
      if (this.time !== 20) return;
      this.isTimerStop = false;
      //获取短信验证码
      var timer = setInterval(() => {
        if (this.time < 0) {
          this.time = 20;
          this.msgCodeBtnText = "重新获取";
          this.isTimerStop = true;
          clearInterval(timer);
        } else {
          this.msgCodeBtnText = "重新获取(" + this.time-- + ")";
        }
      }, 1000);
      //获取短信验证码
      // const params1 = {
      //     "MobilePhone": this.PhoneNum,
      //     "TransactionId":"LoginRegister"
      // };
      // stream.fetch({
      //     method: 'POST',
      //     url: `/uauth/SendSmsOtpPasswordZhuCe.do`,
      //     type: 'json',
      //     body: this.toParams(params1)
      // }, response => {
      //     if (response.status == 200) {
      //         this.results=response.data.jsonError;
      //         if(this.results==null){
      //             modal.alert({
      //                 message: "返回码"+response.status+"数据"+response.data.Password,
      //             })
      //             this.TimeStamp=response.data.DynaCodeCreateTime;
      //         }else {
      //             this.results=response.data.jsonError;
      //             modal.alert({
      //                 message:"错误"+this.results[0]._exceptionMessage,
      //             })
      //         }
      //     } else {
      //         modal.alert({
      //             message: "返回码"+response.status+"\n数据"+this.toParams(response.data),
      //         })
      //     }
      // }, () => {
      // });
    }

  }
});

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_title_vue__ = __webpack_require__(3);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


const modal = weex.requireModule('modal');
const stream = weex.requireModule('stream');
/* harmony default export */ __webpack_exports__["a"] = ({
    components: { Title: __WEBPACK_IMPORTED_MODULE_0__components_title_vue__["a" /* default */] },
    data() {
        return {
            Title: "注册",
            Show: true,
            ReceivieCode: "", //验证码
            resultCode: 123456,
            phoneNum: "", //手机号
            msgCodeBtnText: "获取验证码",
            time: 60,
            isTimerStop: true,
            TitleBarBg: "#e3392f",
            flag: 1,
            choosed: this.$store.state.imgBaseUrl + "choose_selected@2x.png",
            unchoosed: this.$store.state.imgBaseUrl + "choose_pressed@2x.png"
        };
    },
    created() {},
    methods: {
        change(index) {
            this.flag = index;
        },
        getPhone(event) {
            this.phoneNum = event.value;
        },
        getCode(event) {
            this.ReceivieCode = event.value;
        },
        //获取验证码
        sendCode() {
            if (!/^1[34578]\d{9}$/.test(this.phoneNum)) {
                modal.toast({
                    message: '请输入正确的手机号',
                    duration: 500
                });
                return false;
            }
            this.count();
            //    stream.fetch({
            //             method: "POST",
            //             url: '#',
            //             type: "json",
            //             headers: {'Content-Type': 'application/json; charset=utf-8'},
            //             body:this.phoneNum
            //        },function(result){
            //            if(result.ok){
            //                 console.log(`result`,result);
            //                 this.resultCode = result;
            //                 this.count();
            //            }   
            //       });
        },
        //倒计时
        count() {
            if (this.time !== 60) return;
            this.isTimerStop = false;
            //获取短信验证码
            var timer = setInterval(() => {
                if (this.time < 0) {
                    this.time = 60;
                    this.msgCodeBtnText = "重新获取";
                    this.isTimerStop = true;
                    clearInterval(timer);
                } else {
                    this.msgCodeBtnText = "重新获取(" + this.time-- + ")";
                }
            }, 1000);
        },
        toNext() {
            // this.jump('./loginpwd');
            if (!this.phoneNum) {
                modal.toast({
                    message: '手机号不能为空',
                    duration: 500
                });
                return false;
            }
            if (this.ReceivieCode != this.resultCode) {
                modal.toast({
                    message: '您输入的验证码不正确',
                    duration: 500
                });
                return false;
            } else {
                this.jump('./loginpwd');
            }
        }
    }
});

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


const modal = weex.requireModule('modal');
const context = weex.requireModule("context");
/* harmony default export */ __webpack_exports__["a"] = ({
    props: ["title", "show", "bg"],
    data() {
        return {
            backurl: this.$store.state.imgBaseUrl + "nav_back.png",
            marginTop: 0
        };
    },
    created() {
        this.marginTop = context.getDeviceInfo().status_bar_height;
    },
    methods: {}
});

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_title_vue__ = __webpack_require__(3);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


const modal = weex.requireModule('modal');
const stream = weex.requireModule('stream');
const storage = weex.requireModule('storage');

/* harmony default export */ __webpack_exports__["a"] = ({
    components: { Title: __WEBPACK_IMPORTED_MODULE_0__components_title_vue__["a" /* default */] },
    data() {
        return {
            Title: "设置密码",
            Show: true,
            Pwd: "",
            PwdRepeat: "",
            TitleBarBg: "#e3392f"
        };
    },
    created() {},
    methods: {
        login() {
            if (!this.Pwd) {
                modal.toast({
                    message: '请设置登录密码',
                    duration: 300
                });
                return false;
            }
            if (this.Pwd != this.PwdRepeat) {
                modal.toast({
                    message: '两次输入的密码不一致',
                    duration: 300
                });
                return false;
            } else {
                modal.toast({
                    message: '注册成功',
                    duration: 300
                });
                this.jump('./login');
            }
        },
        identify() {
            this.jump('./peregister');
        },
        getPwd(event) {
            this.Pwd = event.value;
        },
        getPwdRepeat(event) {
            this.PwdRepeat = event.value;
        },
        toNext() {}
    }
});

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_title_vue__ = __webpack_require__(3);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


const modal = weex.requireModule('modal');
const stream = weex.requireModule('stream');
/* harmony default export */ __webpack_exports__["a"] = ({
    components: {
        Title: __WEBPACK_IMPORTED_MODULE_0__components_title_vue__["a" /* default */]
    },
    data() {
        return {
            Title: "实名认证",
            Show: true,
            UserName: "",
            IdNumber: '',
            TitleBarBg: "#e3392f",
            IDReverseURL: this.$store.state.imgBaseUrl + "bg_shenfenzhengbeimian@2x.png",
            IDFrontURL: this.$store.state.imgBaseUrl + "bg_shenfenzhengzhengmian@2x.png",
            IDshouchiURL: this.$store.state.imgBaseUrl + "bg_shenfenzhengshouchi@2x.png"
        };
    },
    created() {},
    methods: {
        getName(event) {
            this.UserName = event.value;
        },
        getIdNumber(event) {
            this.IdNumber = event.value;
        },
        toNext() {}
    }
});

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_title_vue__ = __webpack_require__(3);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


const modal = weex.requireModule('modal');
const stream = weex.requireModule('stream');
/* harmony default export */ __webpack_exports__["a"] = ({
    components: { Title: __WEBPACK_IMPORTED_MODULE_0__components_title_vue__["a" /* default */] },
    data() {
        return {
            Title: "实名认证",
            Show: true,
            companyName: "",
            companyCode: "",
            TitleBarBg: "#e3392f",
            IDEnterURL: this.$store.state.imgBaseUrl + "bg_zhizhao@2x.png"
        };
    },
    created() {},
    methods: {
        getCompanyName(event) {
            this.companyName = event.value;
        },
        getCompanyCode(event) {
            this.companyCode = event.value;
        },
        toNext() {}
    }
});

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_title_vue__ = __webpack_require__(3);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




const modal = weex.requireModule('modal');
const stream = weex.requireModule('stream');
const context = weex.requireModule('context');
const picker = weex.requireModule("picker");
const fingerprint = weex.requireModule("fingerprint");

/* harmony default export */ __webpack_exports__["a"] = ({
  components: {
    Title: __WEBPACK_IMPORTED_MODULE_0__components_title_vue__["a" /* default */]
  },
  data() {
    return {
      Title: "指纹登录",
      Show: false,
      bg: "red",
      UserName: "",
      UserPwd: "",
      portraitUrl: this.$store.state.imgBaseUrl + "login_user_icon@3x.png",
      logoUrl: this.$store.state.imgBaseUrl + "logo.png",
      nameUrl: this.$store.state.imgBaseUrl + "userimage.png",
      pwdUrl: this.$store.state.imgBaseUrl + "passwordimage.png",
      backgroudimage: "",
      backbuttonimage: this.$store.state.imgBaseUrl + "backbuttonimage.png",
      btnimageurl: this.$store.state.imgBaseUrl + "login_btbg.png",
      fingerprintImageurl: this.$store.state.imgBaseUrl + "fingerprintImage.png"
    };
  },
  methods: {
    //获取用户名
    getName(event) {
      this.UserName = event.value;
    },
    //获取密码
    getPwd(event) {
      this.UserPwd = event.value;
    },
    //忘记密码
    toForget() {
      this.jump("/forgetpwdone");
    },
    //立即登录
    toLogin() {
      const params = {
        "LoginId": this.UserName,
        "Password": this.UserPwd,
        "LoginType": "C"
      };
      stream.fetch({
        method: 'POST',
        url: `/uauth/pweb-common.Login.do`,
        type: 'json',
        body: this.toParams(params)
      }, response => {
        if (response.status == 200) {
          modal.alert({
            message: "返回码" + response.data.JSON._RejCode,
            duration: 3
          }, function (value) {
            console.log('confirm callback', value);
          });
          if (response.data.JSON._RejCode == "000000") {
            //拿到token执行setToken
            if (context.setToken(response.data.JSON.Token) == 0) {
              context.next();
            } else {
              modal.alert({
                message: "错误",
                duration: 3
              }, function (value) {
                console.log('confirm callback', value);
              });
            }
          } else {
            modal.alert({
              message: response.data.jsonError[0]._exceptionMessage,
              duration: 3
            }, function (value) {
              console.log('confirm callback', value);
            });
          }
        } else {}
      }, () => {});
    },
    //注册
    toRegister() {
      this.jump("/register");
    },
    fingerprintAction() {
      fingerprint.identify(data => {
        if (data == "1") {
          modal.alert({
            message: "指纹登录成功",
            duration: 0.3
          });
        } else {
          modal.alert({
            message: data,
            duration: 0.3
          });
        }
      });
    },
    selectButonAction() {
      let items = ["手势登录", "普通登录"];
      picker.pick({
        index: 0,
        items
      }, event => {
        if (event.result === "success") {
          modal.toast({ message: event.data });
          if (event.data == 0) {
            // context.launchStage("main.gesture");
            this.jump('/gestureslogin');
          } else if (event.data == 1) {
            this.jump('/login');
            // fingerprint.identify(data => {
            //     if (data == "1") {
            //     modal.alert({
            //         message: "指纹登录成功",
            //         duration: 0.3
            //     });
            //     } else {
            //     modal.alert({
            //         message: data,
            //         duration: 0.3
            //     });
            //     }
            // });
          }
        }
      });
    }
  }
});

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_title_vue__ = __webpack_require__(3);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




const modal = weex.requireModule('modal');
const stream = weex.requireModule('stream');
const context = weex.requireModule('context');
const fingerprint = weex.requireModule("fingerprint");

/* harmony default export */ __webpack_exports__["a"] = ({
  components: {
    Title: __WEBPACK_IMPORTED_MODULE_0__components_title_vue__["a" /* default */]
  },
  data() {
    return {
      Title: "手势密码",
      Show: false,
      bg: "red",
      UserName: "",
      UserPwd: "",
      portraitUrl: this.$store.state.imgBaseUrl + "login_user_icon@3x.png",
      logoUrl: this.$store.state.imgBaseUrl + "logo.png",
      nameUrl: this.$store.state.imgBaseUrl + "userimage.png",
      pwdUrl: this.$store.state.imgBaseUrl + "passwordimage.png",
      backgroudimage: "",
      backbuttonimage: this.$store.state.imgBaseUrl + "backbuttonimage.png",
      btnimageurl: this.$store.state.imgBaseUrl + "login_btbg.png",
      fingerprintImageurl: this.$store.state.imgBaseUrl + "fingerprintImage.png"
    };
  },
  methods: {
    onComplete(event) {
      if (event.text == "12589") {
        modal.alert({
          message: "设置成功",
          duration: 0.3
        });
        this.$refs.lockview.clear();
      } else {
        this.$refs.lockview.error();
        modal.alert({
          message: "手势不一致",
          duration: 0.3
        });
        setTimeout(() => {
          this.$refs.lockview.clear();
        }, 1500);
      }
    },
    //获取用户名
    getName(event) {
      this.UserName = event.value;
    },
    //获取密码
    getPwd(event) {
      this.UserPwd = event.value;
    },
    //忘记密码
    toForget() {
      this.jump("/forgetpwdone");
    },
    //立即登录
    toLogin() {
      const params = {
        "LoginId": this.UserName,
        "Password": this.UserPwd,
        "LoginType": "C"
      };
      stream.fetch({
        method: 'POST',
        url: `/uauth/pweb-common.Login.do`,
        type: 'json',
        body: this.toParams(params)
      }, response => {
        if (response.status == 200) {
          modal.alert({
            message: "返回码" + response.data.JSON._RejCode,
            duration: 3
          }, function (value) {
            console.log('confirm callback', value);
          });
          if (response.data.JSON._RejCode == "000000") {
            //拿到token执行setToken
            if (context.setToken(response.data.JSON.Token) == 0) {
              context.next();
            } else {
              modal.alert({
                message: "错误",
                duration: 3
              }, function (value) {
                console.log('confirm callback', value);
              });
            }
          } else {
            modal.alert({
              message: response.data.jsonError[0]._exceptionMessage,
              duration: 3
            }, function (value) {
              console.log('confirm callback', value);
            });
          }
        } else {}
      }, () => {});
    },
    //注册
    toRegister() {
      this.jump("/register");
    },
    fingerprintAction() {
      fingerprint.identify(data => {
        if (data == "1") {
          modal.alert({
            message: "指纹登录成功",
            duration: 0.3
          });
        } else {
          modal.alert({
            message: data,
            duration: 0.3
          });
        }
      });
    },
    selectButonAction() {
      modal.alert({ message: context.getParam("name") });
    }
  }
});

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__App_vue__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__router__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__store__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_vuex_router_sync__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_vuex_router_sync___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_vuex_router_sync__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__mixins__ = __webpack_require__(68);
// import Vue from 'vue'






// sync the router with the vuex store.
// this registers `store.state.route`
Object(__WEBPACK_IMPORTED_MODULE_3_vuex_router_sync__["sync"])(__WEBPACK_IMPORTED_MODULE_2__store__["a" /* default */], __WEBPACK_IMPORTED_MODULE_1__router__["a" /* default */]);

// register global mixins.
Vue.mixin(__WEBPACK_IMPORTED_MODULE_4__mixins__["a" /* default */]);

// create the app instance.
// here we inject the router and store to all child components,
// making them available everywhere as `this.$router` and `this.$store`.

new Vue(Vue.util.extend({ el: '#root', router: __WEBPACK_IMPORTED_MODULE_1__router__["a" /* default */], store: __WEBPACK_IMPORTED_MODULE_2__store__["a" /* default */] }, __WEBPACK_IMPORTED_MODULE_0__App_vue__["a" /* default */]));
__WEBPACK_IMPORTED_MODULE_1__router__["a" /* default */].push('/');

/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_script_index_0_App_vue__ = __webpack_require__(4);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_7_1_vue_loader_lib_template_compiler_index_id_data_v_04c2046b_hasScoped_false_buble_transforms_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_template_index_0_App_vue__ = __webpack_require__(22);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(19)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_script_index_0_App_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_7_1_vue_loader_lib_template_compiler_index_id_data_v_04c2046b_hasScoped_false_buble_transforms_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_template_index_0_App_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\App.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-04c2046b", Component.options)
  } else {
    hotAPI.reload("data-v-04c2046b", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(20);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("5c6d1331", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../node_modules/_css-loader@0.28.11@css-loader/index.js!../node_modules/_vue-loader@13.7.1@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-04c2046b\",\"scoped\":false,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.7.1@vue-loader/lib/selector.js?type=styles&index=0!./App.vue", function() {
     var newContent = require("!!../node_modules/_css-loader@0.28.11@css-loader/index.js!../node_modules/_vue-loader@13.7.1@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-04c2046b\",\"scoped\":false,\"hasInlineConfig\":false}!../node_modules/_vue-loader@13.7.1@vue-loader/lib/selector.js?type=styles&index=0!./App.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\nbody{\n  margin: 0;\n  padding: 0;\n}\n", ""]);

// exports


/***/ }),
/* 21 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticStyle: _vm.$processStyle(undefined),
      style: _vm.$processStyle(undefined),
      on: { clickbackitem: _vm.goBack }
    },
    [
      _c("router-view", {
        staticStyle: _vm.$processStyle({ flex: "1" }),
        style: _vm.$processStyle(undefined)
      })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-loader/node_modules/vue-hot-reload-api")      .rerender("data-v-04c2046b", esExports)
  }
}

/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_router__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__views_Login_vue__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__views_ForgetPwd_vue__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__views_Register_vue__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__views_LoginPwd_vue__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__views_PeRegister_vue__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__views_EnterRegister_vue__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__views_FingerprintLogin_vue__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__views_GesturesLogin_vue__ = __webpack_require__(59);
// import Vue from 'vue'

Vue.use(__WEBPACK_IMPORTED_MODULE_0_vue_router__["a" /* default */]);

 //登录
 //忘记密码

 //注册
 //设置登录密码
 //个人认证
 //企业认证

 //指纹登录
 //手势登录

/* harmony default export */ __webpack_exports__["a"] = (new __WEBPACK_IMPORTED_MODULE_0_vue_router__["a" /* default */]({
	// mode: 'abstract',
	routes: [{
		path: '/login',
		component: __WEBPACK_IMPORTED_MODULE_1__views_Login_vue__["a" /* default */]
	}, {
		path: '/forgetPwd',
		component: __WEBPACK_IMPORTED_MODULE_2__views_ForgetPwd_vue__["a" /* default */]
	}, {
		path: '/fingerprintlogin',
		component: __WEBPACK_IMPORTED_MODULE_7__views_FingerprintLogin_vue__["a" /* default */]
	}, {
		path: '/gestureslogin',
		component: __WEBPACK_IMPORTED_MODULE_8__views_GesturesLogin_vue__["a" /* default */]
	}, {
		path: '/register',
		component: __WEBPACK_IMPORTED_MODULE_3__views_Register_vue__["a" /* default */]
	}, {
		path: '/loginpwd',
		component: __WEBPACK_IMPORTED_MODULE_4__views_LoginPwd_vue__["a" /* default */]
	}, {
		path: '/peregister',
		component: __WEBPACK_IMPORTED_MODULE_5__views_PeRegister_vue__["a" /* default */]
	}, {
		path: '/enterregister',
		component: __WEBPACK_IMPORTED_MODULE_6__views_EnterRegister_vue__["a" /* default */]
	}, {
		path: '/',
		redirect: '/login'
	}]
}));

/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
  * vue-router v3.0.1
  * (c) 2017 Evan You
  * @license MIT
  */
/*  */

function assert (condition, message) {
  if (!condition) {
    throw new Error(("[vue-router] " + message))
  }
}

function warn (condition, message) {
  if (process.env.NODE_ENV !== 'production' && !condition) {
    typeof console !== 'undefined' && console.warn(("[vue-router] " + message));
  }
}

function isError (err) {
  return Object.prototype.toString.call(err).indexOf('Error') > -1
}

var View = {
  name: 'router-view',
  functional: true,
  props: {
    name: {
      type: String,
      default: 'default'
    }
  },
  render: function render (_, ref) {
    var props = ref.props;
    var children = ref.children;
    var parent = ref.parent;
    var data = ref.data;

    data.routerView = true;

    // directly use parent context's createElement() function
    // so that components rendered by router-view can resolve named slots
    var h = parent.$createElement;
    var name = props.name;
    var route = parent.$route;
    var cache = parent._routerViewCache || (parent._routerViewCache = {});

    // determine current view depth, also check to see if the tree
    // has been toggled inactive but kept-alive.
    var depth = 0;
    var inactive = false;
    while (parent && parent._routerRoot !== parent) {
      if (parent.$vnode && parent.$vnode.data.routerView) {
        depth++;
      }
      if (parent._inactive) {
        inactive = true;
      }
      parent = parent.$parent;
    }
    data.routerViewDepth = depth;

    // render previous view if the tree is inactive and kept-alive
    if (inactive) {
      return h(cache[name], data, children)
    }

    var matched = route.matched[depth];
    // render empty node if no matched route
    if (!matched) {
      cache[name] = null;
      return h()
    }

    var component = cache[name] = matched.components[name];

    // attach instance registration hook
    // this will be called in the instance's injected lifecycle hooks
    data.registerRouteInstance = function (vm, val) {
      // val could be undefined for unregistration
      var current = matched.instances[name];
      if (
        (val && current !== vm) ||
        (!val && current === vm)
      ) {
        matched.instances[name] = val;
      }
    }

    // also register instance in prepatch hook
    // in case the same component instance is reused across different routes
    ;(data.hook || (data.hook = {})).prepatch = function (_, vnode) {
      matched.instances[name] = vnode.componentInstance;
    };

    // resolve props
    var propsToPass = data.props = resolveProps(route, matched.props && matched.props[name]);
    if (propsToPass) {
      // clone to prevent mutation
      propsToPass = data.props = extend({}, propsToPass);
      // pass non-declared props as attrs
      var attrs = data.attrs = data.attrs || {};
      for (var key in propsToPass) {
        if (!component.props || !(key in component.props)) {
          attrs[key] = propsToPass[key];
          delete propsToPass[key];
        }
      }
    }

    return h(component, data, children)
  }
};

function resolveProps (route, config) {
  switch (typeof config) {
    case 'undefined':
      return
    case 'object':
      return config
    case 'function':
      return config(route)
    case 'boolean':
      return config ? route.params : undefined
    default:
      if (process.env.NODE_ENV !== 'production') {
        warn(
          false,
          "props in \"" + (route.path) + "\" is a " + (typeof config) + ", " +
          "expecting an object, function or boolean."
        );
      }
  }
}

function extend (to, from) {
  for (var key in from) {
    to[key] = from[key];
  }
  return to
}

/*  */

var encodeReserveRE = /[!'()*]/g;
var encodeReserveReplacer = function (c) { return '%' + c.charCodeAt(0).toString(16); };
var commaRE = /%2C/g;

// fixed encodeURIComponent which is more conformant to RFC3986:
// - escapes [!'()*]
// - preserve commas
var encode = function (str) { return encodeURIComponent(str)
  .replace(encodeReserveRE, encodeReserveReplacer)
  .replace(commaRE, ','); };

var decode = decodeURIComponent;

function resolveQuery (
  query,
  extraQuery,
  _parseQuery
) {
  if ( extraQuery === void 0 ) extraQuery = {};

  var parse = _parseQuery || parseQuery;
  var parsedQuery;
  try {
    parsedQuery = parse(query || '');
  } catch (e) {
    process.env.NODE_ENV !== 'production' && warn(false, e.message);
    parsedQuery = {};
  }
  for (var key in extraQuery) {
    parsedQuery[key] = extraQuery[key];
  }
  return parsedQuery
}

function parseQuery (query) {
  var res = {};

  query = query.trim().replace(/^(\?|#|&)/, '');

  if (!query) {
    return res
  }

  query.split('&').forEach(function (param) {
    var parts = param.replace(/\+/g, ' ').split('=');
    var key = decode(parts.shift());
    var val = parts.length > 0
      ? decode(parts.join('='))
      : null;

    if (res[key] === undefined) {
      res[key] = val;
    } else if (Array.isArray(res[key])) {
      res[key].push(val);
    } else {
      res[key] = [res[key], val];
    }
  });

  return res
}

function stringifyQuery (obj) {
  var res = obj ? Object.keys(obj).map(function (key) {
    var val = obj[key];

    if (val === undefined) {
      return ''
    }

    if (val === null) {
      return encode(key)
    }

    if (Array.isArray(val)) {
      var result = [];
      val.forEach(function (val2) {
        if (val2 === undefined) {
          return
        }
        if (val2 === null) {
          result.push(encode(key));
        } else {
          result.push(encode(key) + '=' + encode(val2));
        }
      });
      return result.join('&')
    }

    return encode(key) + '=' + encode(val)
  }).filter(function (x) { return x.length > 0; }).join('&') : null;
  return res ? ("?" + res) : ''
}

/*  */


var trailingSlashRE = /\/?$/;

function createRoute (
  record,
  location,
  redirectedFrom,
  router
) {
  var stringifyQuery$$1 = router && router.options.stringifyQuery;

  var query = location.query || {};
  try {
    query = clone(query);
  } catch (e) {}

  var route = {
    name: location.name || (record && record.name),
    meta: (record && record.meta) || {},
    path: location.path || '/',
    hash: location.hash || '',
    query: query,
    params: location.params || {},
    fullPath: getFullPath(location, stringifyQuery$$1),
    matched: record ? formatMatch(record) : []
  };
  if (redirectedFrom) {
    route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery$$1);
  }
  return Object.freeze(route)
}

function clone (value) {
  if (Array.isArray(value)) {
    return value.map(clone)
  } else if (value && typeof value === 'object') {
    var res = {};
    for (var key in value) {
      res[key] = clone(value[key]);
    }
    return res
  } else {
    return value
  }
}

// the starting route that represents the initial state
var START = createRoute(null, {
  path: '/'
});

function formatMatch (record) {
  var res = [];
  while (record) {
    res.unshift(record);
    record = record.parent;
  }
  return res
}

function getFullPath (
  ref,
  _stringifyQuery
) {
  var path = ref.path;
  var query = ref.query; if ( query === void 0 ) query = {};
  var hash = ref.hash; if ( hash === void 0 ) hash = '';

  var stringify = _stringifyQuery || stringifyQuery;
  return (path || '/') + stringify(query) + hash
}

function isSameRoute (a, b) {
  if (b === START) {
    return a === b
  } else if (!b) {
    return false
  } else if (a.path && b.path) {
    return (
      a.path.replace(trailingSlashRE, '') === b.path.replace(trailingSlashRE, '') &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query)
    )
  } else if (a.name && b.name) {
    return (
      a.name === b.name &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query) &&
      isObjectEqual(a.params, b.params)
    )
  } else {
    return false
  }
}

function isObjectEqual (a, b) {
  if ( a === void 0 ) a = {};
  if ( b === void 0 ) b = {};

  // handle null value #1566
  if (!a || !b) { return a === b }
  var aKeys = Object.keys(a);
  var bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) {
    return false
  }
  return aKeys.every(function (key) {
    var aVal = a[key];
    var bVal = b[key];
    // check nested equality
    if (typeof aVal === 'object' && typeof bVal === 'object') {
      return isObjectEqual(aVal, bVal)
    }
    return String(aVal) === String(bVal)
  })
}

function isIncludedRoute (current, target) {
  return (
    current.path.replace(trailingSlashRE, '/').indexOf(
      target.path.replace(trailingSlashRE, '/')
    ) === 0 &&
    (!target.hash || current.hash === target.hash) &&
    queryIncludes(current.query, target.query)
  )
}

function queryIncludes (current, target) {
  for (var key in target) {
    if (!(key in current)) {
      return false
    }
  }
  return true
}

/*  */

// work around weird flow bug
var toTypes = [String, Object];
var eventTypes = [String, Array];

var Link = {
  name: 'router-link',
  props: {
    to: {
      type: toTypes,
      required: true
    },
    tag: {
      type: String,
      default: 'a'
    },
    exact: Boolean,
    append: Boolean,
    replace: Boolean,
    activeClass: String,
    exactActiveClass: String,
    event: {
      type: eventTypes,
      default: 'click'
    }
  },
  render: function render (h) {
    var this$1 = this;

    var router = this.$router;
    var current = this.$route;
    var ref = router.resolve(this.to, current, this.append);
    var location = ref.location;
    var route = ref.route;
    var href = ref.href;

    var classes = {};
    var globalActiveClass = router.options.linkActiveClass;
    var globalExactActiveClass = router.options.linkExactActiveClass;
    // Support global empty active class
    var activeClassFallback = globalActiveClass == null
            ? 'router-link-active'
            : globalActiveClass;
    var exactActiveClassFallback = globalExactActiveClass == null
            ? 'router-link-exact-active'
            : globalExactActiveClass;
    var activeClass = this.activeClass == null
            ? activeClassFallback
            : this.activeClass;
    var exactActiveClass = this.exactActiveClass == null
            ? exactActiveClassFallback
            : this.exactActiveClass;
    var compareTarget = location.path
      ? createRoute(null, location, null, router)
      : route;

    classes[exactActiveClass] = isSameRoute(current, compareTarget);
    classes[activeClass] = this.exact
      ? classes[exactActiveClass]
      : isIncludedRoute(current, compareTarget);

    var handler = function (e) {
      if (guardEvent(e)) {
        if (this$1.replace) {
          router.replace(location);
        } else {
          router.push(location);
        }
      }
    };

    var on = { click: guardEvent };
    if (Array.isArray(this.event)) {
      this.event.forEach(function (e) { on[e] = handler; });
    } else {
      on[this.event] = handler;
    }

    var data = {
      class: classes
    };

    if (this.tag === 'a') {
      data.on = on;
      data.attrs = { href: href };
    } else {
      // find the first <a> child and apply listener and href
      var a = findAnchor(this.$slots.default);
      if (a) {
        // in case the <a> is a static node
        a.isStatic = false;
        var extend = _Vue.util.extend;
        var aData = a.data = extend({}, a.data);
        aData.on = on;
        var aAttrs = a.data.attrs = extend({}, a.data.attrs);
        aAttrs.href = href;
      } else {
        // doesn't have <a> child, apply listener to self
        data.on = on;
      }
    }

    return h(this.tag, data, this.$slots.default)
  }
};

function guardEvent (e) {
  // don't redirect with control keys
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) { return }
  // don't redirect when preventDefault called
  if (e.defaultPrevented) { return }
  // don't redirect on right click
  if (e.button !== undefined && e.button !== 0) { return }
  // don't redirect if `target="_blank"`
  if (e.currentTarget && e.currentTarget.getAttribute) {
    var target = e.currentTarget.getAttribute('target');
    if (/\b_blank\b/i.test(target)) { return }
  }
  // this may be a Weex event which doesn't have this method
  if (e.preventDefault) {
    e.preventDefault();
  }
  return true
}

function findAnchor (children) {
  if (children) {
    var child;
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      if (child.tag === 'a') {
        return child
      }
      if (child.children && (child = findAnchor(child.children))) {
        return child
      }
    }
  }
}

var _Vue;

function install (Vue) {
  if (install.installed && _Vue === Vue) { return }
  install.installed = true;

  _Vue = Vue;

  var isDef = function (v) { return v !== undefined; };

  var registerInstance = function (vm, callVal) {
    var i = vm.$options._parentVnode;
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal);
    }
  };

  Vue.mixin({
    beforeCreate: function beforeCreate () {
      if (isDef(this.$options.router)) {
        this._routerRoot = this;
        this._router = this.$options.router;
        this._router.init(this);
        Vue.util.defineReactive(this, '_route', this._router.history.current);
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this;
      }
      registerInstance(this, this);
    },
    destroyed: function destroyed () {
      registerInstance(this);
    }
  });

  Object.defineProperty(Vue.prototype, '$router', {
    get: function get () { return this._routerRoot._router }
  });

  Object.defineProperty(Vue.prototype, '$route', {
    get: function get () { return this._routerRoot._route }
  });

  Vue.component('router-view', View);
  Vue.component('router-link', Link);

  var strats = Vue.config.optionMergeStrategies;
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created;
}

/*  */

var inBrowser = typeof window !== 'undefined';

/*  */

function resolvePath (
  relative,
  base,
  append
) {
  var firstChar = relative.charAt(0);
  if (firstChar === '/') {
    return relative
  }

  if (firstChar === '?' || firstChar === '#') {
    return base + relative
  }

  var stack = base.split('/');

  // remove trailing segment if:
  // - not appending
  // - appending to trailing slash (last segment is empty)
  if (!append || !stack[stack.length - 1]) {
    stack.pop();
  }

  // resolve relative path
  var segments = relative.replace(/^\//, '').split('/');
  for (var i = 0; i < segments.length; i++) {
    var segment = segments[i];
    if (segment === '..') {
      stack.pop();
    } else if (segment !== '.') {
      stack.push(segment);
    }
  }

  // ensure leading slash
  if (stack[0] !== '') {
    stack.unshift('');
  }

  return stack.join('/')
}

function parsePath (path) {
  var hash = '';
  var query = '';

  var hashIndex = path.indexOf('#');
  if (hashIndex >= 0) {
    hash = path.slice(hashIndex);
    path = path.slice(0, hashIndex);
  }

  var queryIndex = path.indexOf('?');
  if (queryIndex >= 0) {
    query = path.slice(queryIndex + 1);
    path = path.slice(0, queryIndex);
  }

  return {
    path: path,
    query: query,
    hash: hash
  }
}

function cleanPath (path) {
  return path.replace(/\/\//g, '/')
}

var isarray = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

/**
 * Expose `pathToRegexp`.
 */
var pathToRegexp_1 = pathToRegexp;
var parse_1 = parse;
var compile_1 = compile;
var tokensToFunction_1 = tokensToFunction;
var tokensToRegExp_1 = tokensToRegExp;

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g');

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse (str, options) {
  var tokens = [];
  var key = 0;
  var index = 0;
  var path = '';
  var defaultDelimiter = options && options.delimiter || '/';
  var res;

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0];
    var escaped = res[1];
    var offset = res.index;
    path += str.slice(index, offset);
    index = offset + m.length;

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1];
      continue
    }

    var next = str[index];
    var prefix = res[2];
    var name = res[3];
    var capture = res[4];
    var group = res[5];
    var modifier = res[6];
    var asterisk = res[7];

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path);
      path = '';
    }

    var partial = prefix != null && next != null && next !== prefix;
    var repeat = modifier === '+' || modifier === '*';
    var optional = modifier === '?' || modifier === '*';
    var delimiter = res[2] || defaultDelimiter;
    var pattern = capture || group;

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      asterisk: !!asterisk,
      pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
    });
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index);
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path);
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */
function compile (str, options) {
  return tokensToFunction(parse(str, options))
}

/**
 * Prettier encoding of URI path segments.
 *
 * @param  {string}
 * @return {string}
 */
function encodeURIComponentPretty (str) {
  return encodeURI(str).replace(/[\/?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
 *
 * @param  {string}
 * @return {string}
 */
function encodeAsterisk (str) {
  return encodeURI(str).replace(/[?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length);

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$');
    }
  }

  return function (obj, opts) {
    var path = '';
    var data = obj || {};
    var options = opts || {};
    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent;

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (typeof token === 'string') {
        path += token;

        continue
      }

      var value = data[token.name];
      var segment;

      if (value == null) {
        if (token.optional) {
          // Prepend partial segment prefixes.
          if (token.partial) {
            path += token.prefix;
          }

          continue
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined')
        }
      }

      if (isarray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j]);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment;
        }

        continue
      }

      segment = token.asterisk ? encodeAsterisk(value) : encode(value);

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
      }

      path += token.prefix + segment;
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1')
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {!RegExp} re
 * @param  {Array}   keys
 * @return {!RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys;
  return re
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags (options) {
  return options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {!Array}  keys
 * @return {!RegExp}
 */
function regexpToRegexp (path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g);

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        partial: false,
        asterisk: false,
        pattern: null
      });
    }
  }

  return attachKeys(path, keys)
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array}   keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = [];

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source);
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

  return attachKeys(regexp, keys)
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {!Array}  keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function stringToRegexp (path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}          tokens
 * @param  {(Array|Object)=} keys
 * @param  {Object=}         options
 * @return {!RegExp}
 */
function tokensToRegExp (tokens, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  var strict = options.strict;
  var end = options.end !== false;
  var route = '';

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];

    if (typeof token === 'string') {
      route += escapeString(token);
    } else {
      var prefix = escapeString(token.prefix);
      var capture = '(?:' + token.pattern + ')';

      keys.push(token);

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*';
      }

      if (token.optional) {
        if (!token.partial) {
          capture = '(?:' + prefix + '(' + capture + '))?';
        } else {
          capture = prefix + '(' + capture + ')?';
        }
      } else {
        capture = prefix + '(' + capture + ')';
      }

      route += capture;
    }
  }

  var delimiter = escapeString(options.delimiter || '/');
  var endsWithDelimiter = route.slice(-delimiter.length) === delimiter;

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?';
  }

  if (end) {
    route += '$';
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)';
  }

  return attachKeys(new RegExp('^' + route, flags(options)), keys)
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {(Array|Object)=}       keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp (path, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  if (path instanceof RegExp) {
    return regexpToRegexp(path, /** @type {!Array} */ (keys))
  }

  if (isarray(path)) {
    return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
  }

  return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
}

pathToRegexp_1.parse = parse_1;
pathToRegexp_1.compile = compile_1;
pathToRegexp_1.tokensToFunction = tokensToFunction_1;
pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;

/*  */

// $flow-disable-line
var regexpCompileCache = Object.create(null);

function fillParams (
  path,
  params,
  routeMsg
) {
  try {
    var filler =
      regexpCompileCache[path] ||
      (regexpCompileCache[path] = pathToRegexp_1.compile(path));
    return filler(params || {}, { pretty: true })
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      warn(false, ("missing param for " + routeMsg + ": " + (e.message)));
    }
    return ''
  }
}

/*  */

function createRouteMap (
  routes,
  oldPathList,
  oldPathMap,
  oldNameMap
) {
  // the path list is used to control path matching priority
  var pathList = oldPathList || [];
  // $flow-disable-line
  var pathMap = oldPathMap || Object.create(null);
  // $flow-disable-line
  var nameMap = oldNameMap || Object.create(null);

  routes.forEach(function (route) {
    addRouteRecord(pathList, pathMap, nameMap, route);
  });

  // ensure wildcard routes are always at the end
  for (var i = 0, l = pathList.length; i < l; i++) {
    if (pathList[i] === '*') {
      pathList.push(pathList.splice(i, 1)[0]);
      l--;
      i--;
    }
  }

  return {
    pathList: pathList,
    pathMap: pathMap,
    nameMap: nameMap
  }
}

function addRouteRecord (
  pathList,
  pathMap,
  nameMap,
  route,
  parent,
  matchAs
) {
  var path = route.path;
  var name = route.name;
  if (process.env.NODE_ENV !== 'production') {
    assert(path != null, "\"path\" is required in a route configuration.");
    assert(
      typeof route.component !== 'string',
      "route config \"component\" for path: " + (String(path || name)) + " cannot be a " +
      "string id. Use an actual component instead."
    );
  }

  var pathToRegexpOptions = route.pathToRegexpOptions || {};
  var normalizedPath = normalizePath(
    path,
    parent,
    pathToRegexpOptions.strict
  );

  if (typeof route.caseSensitive === 'boolean') {
    pathToRegexpOptions.sensitive = route.caseSensitive;
  }

  var record = {
    path: normalizedPath,
    regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
    components: route.components || { default: route.component },
    instances: {},
    name: name,
    parent: parent,
    matchAs: matchAs,
    redirect: route.redirect,
    beforeEnter: route.beforeEnter,
    meta: route.meta || {},
    props: route.props == null
      ? {}
      : route.components
        ? route.props
        : { default: route.props }
  };

  if (route.children) {
    // Warn if route is named, does not redirect and has a default child route.
    // If users navigate to this route by name, the default child will
    // not be rendered (GH Issue #629)
    if (process.env.NODE_ENV !== 'production') {
      if (route.name && !route.redirect && route.children.some(function (child) { return /^\/?$/.test(child.path); })) {
        warn(
          false,
          "Named Route '" + (route.name) + "' has a default child route. " +
          "When navigating to this named route (:to=\"{name: '" + (route.name) + "'\"), " +
          "the default child route will not be rendered. Remove the name from " +
          "this route and use the name of the default child route for named " +
          "links instead."
        );
      }
    }
    route.children.forEach(function (child) {
      var childMatchAs = matchAs
        ? cleanPath((matchAs + "/" + (child.path)))
        : undefined;
      addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs);
    });
  }

  if (route.alias !== undefined) {
    var aliases = Array.isArray(route.alias)
      ? route.alias
      : [route.alias];

    aliases.forEach(function (alias) {
      var aliasRoute = {
        path: alias,
        children: route.children
      };
      addRouteRecord(
        pathList,
        pathMap,
        nameMap,
        aliasRoute,
        parent,
        record.path || '/' // matchAs
      );
    });
  }

  if (!pathMap[record.path]) {
    pathList.push(record.path);
    pathMap[record.path] = record;
  }

  if (name) {
    if (!nameMap[name]) {
      nameMap[name] = record;
    } else if (process.env.NODE_ENV !== 'production' && !matchAs) {
      warn(
        false,
        "Duplicate named routes definition: " +
        "{ name: \"" + name + "\", path: \"" + (record.path) + "\" }"
      );
    }
  }
}

function compileRouteRegex (path, pathToRegexpOptions) {
  var regex = pathToRegexp_1(path, [], pathToRegexpOptions);
  if (process.env.NODE_ENV !== 'production') {
    var keys = Object.create(null);
    regex.keys.forEach(function (key) {
      warn(!keys[key.name], ("Duplicate param keys in route with path: \"" + path + "\""));
      keys[key.name] = true;
    });
  }
  return regex
}

function normalizePath (path, parent, strict) {
  if (!strict) { path = path.replace(/\/$/, ''); }
  if (path[0] === '/') { return path }
  if (parent == null) { return path }
  return cleanPath(((parent.path) + "/" + path))
}

/*  */


function normalizeLocation (
  raw,
  current,
  append,
  router
) {
  var next = typeof raw === 'string' ? { path: raw } : raw;
  // named target
  if (next.name || next._normalized) {
    return next
  }

  // relative params
  if (!next.path && next.params && current) {
    next = assign({}, next);
    next._normalized = true;
    var params = assign(assign({}, current.params), next.params);
    if (current.name) {
      next.name = current.name;
      next.params = params;
    } else if (current.matched.length) {
      var rawPath = current.matched[current.matched.length - 1].path;
      next.path = fillParams(rawPath, params, ("path " + (current.path)));
    } else if (process.env.NODE_ENV !== 'production') {
      warn(false, "relative params navigation requires a current route.");
    }
    return next
  }

  var parsedPath = parsePath(next.path || '');
  var basePath = (current && current.path) || '/';
  var path = parsedPath.path
    ? resolvePath(parsedPath.path, basePath, append || next.append)
    : basePath;

  var query = resolveQuery(
    parsedPath.query,
    next.query,
    router && router.options.parseQuery
  );

  var hash = next.hash || parsedPath.hash;
  if (hash && hash.charAt(0) !== '#') {
    hash = "#" + hash;
  }

  return {
    _normalized: true,
    path: path,
    query: query,
    hash: hash
  }
}

function assign (a, b) {
  for (var key in b) {
    a[key] = b[key];
  }
  return a
}

/*  */


function createMatcher (
  routes,
  router
) {
  var ref = createRouteMap(routes);
  var pathList = ref.pathList;
  var pathMap = ref.pathMap;
  var nameMap = ref.nameMap;

  function addRoutes (routes) {
    createRouteMap(routes, pathList, pathMap, nameMap);
  }

  function match (
    raw,
    currentRoute,
    redirectedFrom
  ) {
    var location = normalizeLocation(raw, currentRoute, false, router);
    var name = location.name;

    if (name) {
      var record = nameMap[name];
      if (process.env.NODE_ENV !== 'production') {
        warn(record, ("Route with name '" + name + "' does not exist"));
      }
      if (!record) { return _createRoute(null, location) }
      var paramNames = record.regex.keys
        .filter(function (key) { return !key.optional; })
        .map(function (key) { return key.name; });

      if (typeof location.params !== 'object') {
        location.params = {};
      }

      if (currentRoute && typeof currentRoute.params === 'object') {
        for (var key in currentRoute.params) {
          if (!(key in location.params) && paramNames.indexOf(key) > -1) {
            location.params[key] = currentRoute.params[key];
          }
        }
      }

      if (record) {
        location.path = fillParams(record.path, location.params, ("named route \"" + name + "\""));
        return _createRoute(record, location, redirectedFrom)
      }
    } else if (location.path) {
      location.params = {};
      for (var i = 0; i < pathList.length; i++) {
        var path = pathList[i];
        var record$1 = pathMap[path];
        if (matchRoute(record$1.regex, location.path, location.params)) {
          return _createRoute(record$1, location, redirectedFrom)
        }
      }
    }
    // no match
    return _createRoute(null, location)
  }

  function redirect (
    record,
    location
  ) {
    var originalRedirect = record.redirect;
    var redirect = typeof originalRedirect === 'function'
        ? originalRedirect(createRoute(record, location, null, router))
        : originalRedirect;

    if (typeof redirect === 'string') {
      redirect = { path: redirect };
    }

    if (!redirect || typeof redirect !== 'object') {
      if (process.env.NODE_ENV !== 'production') {
        warn(
          false, ("invalid redirect option: " + (JSON.stringify(redirect)))
        );
      }
      return _createRoute(null, location)
    }

    var re = redirect;
    var name = re.name;
    var path = re.path;
    var query = location.query;
    var hash = location.hash;
    var params = location.params;
    query = re.hasOwnProperty('query') ? re.query : query;
    hash = re.hasOwnProperty('hash') ? re.hash : hash;
    params = re.hasOwnProperty('params') ? re.params : params;

    if (name) {
      // resolved named direct
      var targetRecord = nameMap[name];
      if (process.env.NODE_ENV !== 'production') {
        assert(targetRecord, ("redirect failed: named route \"" + name + "\" not found."));
      }
      return match({
        _normalized: true,
        name: name,
        query: query,
        hash: hash,
        params: params
      }, undefined, location)
    } else if (path) {
      // 1. resolve relative redirect
      var rawPath = resolveRecordPath(path, record);
      // 2. resolve params
      var resolvedPath = fillParams(rawPath, params, ("redirect route with path \"" + rawPath + "\""));
      // 3. rematch with existing query and hash
      return match({
        _normalized: true,
        path: resolvedPath,
        query: query,
        hash: hash
      }, undefined, location)
    } else {
      if (process.env.NODE_ENV !== 'production') {
        warn(false, ("invalid redirect option: " + (JSON.stringify(redirect))));
      }
      return _createRoute(null, location)
    }
  }

  function alias (
    record,
    location,
    matchAs
  ) {
    var aliasedPath = fillParams(matchAs, location.params, ("aliased route with path \"" + matchAs + "\""));
    var aliasedMatch = match({
      _normalized: true,
      path: aliasedPath
    });
    if (aliasedMatch) {
      var matched = aliasedMatch.matched;
      var aliasedRecord = matched[matched.length - 1];
      location.params = aliasedMatch.params;
      return _createRoute(aliasedRecord, location)
    }
    return _createRoute(null, location)
  }

  function _createRoute (
    record,
    location,
    redirectedFrom
  ) {
    if (record && record.redirect) {
      return redirect(record, redirectedFrom || location)
    }
    if (record && record.matchAs) {
      return alias(record, location, record.matchAs)
    }
    return createRoute(record, location, redirectedFrom, router)
  }

  return {
    match: match,
    addRoutes: addRoutes
  }
}

function matchRoute (
  regex,
  path,
  params
) {
  var m = path.match(regex);

  if (!m) {
    return false
  } else if (!params) {
    return true
  }

  for (var i = 1, len = m.length; i < len; ++i) {
    var key = regex.keys[i - 1];
    var val = typeof m[i] === 'string' ? decodeURIComponent(m[i]) : m[i];
    if (key) {
      params[key.name] = val;
    }
  }

  return true
}

function resolveRecordPath (path, record) {
  return resolvePath(path, record.parent ? record.parent.path : '/', true)
}

/*  */


var positionStore = Object.create(null);

function setupScroll () {
  // Fix for #1585 for Firefox
  window.history.replaceState({ key: getStateKey() }, '');
  window.addEventListener('popstate', function (e) {
    saveScrollPosition();
    if (e.state && e.state.key) {
      setStateKey(e.state.key);
    }
  });
}

function handleScroll (
  router,
  to,
  from,
  isPop
) {
  if (!router.app) {
    return
  }

  var behavior = router.options.scrollBehavior;
  if (!behavior) {
    return
  }

  if (process.env.NODE_ENV !== 'production') {
    assert(typeof behavior === 'function', "scrollBehavior must be a function");
  }

  // wait until re-render finishes before scrolling
  router.app.$nextTick(function () {
    var position = getScrollPosition();
    var shouldScroll = behavior(to, from, isPop ? position : null);

    if (!shouldScroll) {
      return
    }

    if (typeof shouldScroll.then === 'function') {
      shouldScroll.then(function (shouldScroll) {
        scrollToPosition((shouldScroll), position);
      }).catch(function (err) {
        if (process.env.NODE_ENV !== 'production') {
          assert(false, err.toString());
        }
      });
    } else {
      scrollToPosition(shouldScroll, position);
    }
  });
}

function saveScrollPosition () {
  var key = getStateKey();
  if (key) {
    positionStore[key] = {
      x: window.pageXOffset,
      y: window.pageYOffset
    };
  }
}

function getScrollPosition () {
  var key = getStateKey();
  if (key) {
    return positionStore[key]
  }
}

function getElementPosition (el, offset) {
  var docEl = document.documentElement;
  var docRect = docEl.getBoundingClientRect();
  var elRect = el.getBoundingClientRect();
  return {
    x: elRect.left - docRect.left - offset.x,
    y: elRect.top - docRect.top - offset.y
  }
}

function isValidPosition (obj) {
  return isNumber(obj.x) || isNumber(obj.y)
}

function normalizePosition (obj) {
  return {
    x: isNumber(obj.x) ? obj.x : window.pageXOffset,
    y: isNumber(obj.y) ? obj.y : window.pageYOffset
  }
}

function normalizeOffset (obj) {
  return {
    x: isNumber(obj.x) ? obj.x : 0,
    y: isNumber(obj.y) ? obj.y : 0
  }
}

function isNumber (v) {
  return typeof v === 'number'
}

function scrollToPosition (shouldScroll, position) {
  var isObject = typeof shouldScroll === 'object';
  if (isObject && typeof shouldScroll.selector === 'string') {
    var el = document.querySelector(shouldScroll.selector);
    if (el) {
      var offset = shouldScroll.offset && typeof shouldScroll.offset === 'object' ? shouldScroll.offset : {};
      offset = normalizeOffset(offset);
      position = getElementPosition(el, offset);
    } else if (isValidPosition(shouldScroll)) {
      position = normalizePosition(shouldScroll);
    }
  } else if (isObject && isValidPosition(shouldScroll)) {
    position = normalizePosition(shouldScroll);
  }

  if (position) {
    window.scrollTo(position.x, position.y);
  }
}

/*  */

var supportsPushState = inBrowser && (function () {
  var ua = window.navigator.userAgent;

  if (
    (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
    ua.indexOf('Mobile Safari') !== -1 &&
    ua.indexOf('Chrome') === -1 &&
    ua.indexOf('Windows Phone') === -1
  ) {
    return false
  }

  return window.history && 'pushState' in window.history
})();

// use User Timing api (if present) for more accurate key precision
var Time = inBrowser && window.performance && window.performance.now
  ? window.performance
  : Date;

var _key = genKey();

function genKey () {
  return Time.now().toFixed(3)
}

function getStateKey () {
  return _key
}

function setStateKey (key) {
  _key = key;
}

function pushState (url, replace) {
  saveScrollPosition();
  // try...catch the pushState call to get around Safari
  // DOM Exception 18 where it limits to 100 pushState calls
  var history = window.history;
  try {
    if (replace) {
      history.replaceState({ key: _key }, '', url);
    } else {
      _key = genKey();
      history.pushState({ key: _key }, '', url);
    }
  } catch (e) {
    window.location[replace ? 'replace' : 'assign'](url);
  }
}

function replaceState (url) {
  pushState(url, true);
}

/*  */

function runQueue (queue, fn, cb) {
  var step = function (index) {
    if (index >= queue.length) {
      cb();
    } else {
      if (queue[index]) {
        fn(queue[index], function () {
          step(index + 1);
        });
      } else {
        step(index + 1);
      }
    }
  };
  step(0);
}

/*  */

function resolveAsyncComponents (matched) {
  return function (to, from, next) {
    var hasAsync = false;
    var pending = 0;
    var error = null;

    flatMapComponents(matched, function (def, _, match, key) {
      // if it's a function and doesn't have cid attached,
      // assume it's an async component resolve function.
      // we are not using Vue's default async resolving mechanism because
      // we want to halt the navigation until the incoming component has been
      // resolved.
      if (typeof def === 'function' && def.cid === undefined) {
        hasAsync = true;
        pending++;

        var resolve = once(function (resolvedDef) {
          if (isESModule(resolvedDef)) {
            resolvedDef = resolvedDef.default;
          }
          // save resolved on async factory in case it's used elsewhere
          def.resolved = typeof resolvedDef === 'function'
            ? resolvedDef
            : _Vue.extend(resolvedDef);
          match.components[key] = resolvedDef;
          pending--;
          if (pending <= 0) {
            next();
          }
        });

        var reject = once(function (reason) {
          var msg = "Failed to resolve async component " + key + ": " + reason;
          process.env.NODE_ENV !== 'production' && warn(false, msg);
          if (!error) {
            error = isError(reason)
              ? reason
              : new Error(msg);
            next(error);
          }
        });

        var res;
        try {
          res = def(resolve, reject);
        } catch (e) {
          reject(e);
        }
        if (res) {
          if (typeof res.then === 'function') {
            res.then(resolve, reject);
          } else {
            // new syntax in Vue 2.3
            var comp = res.component;
            if (comp && typeof comp.then === 'function') {
              comp.then(resolve, reject);
            }
          }
        }
      }
    });

    if (!hasAsync) { next(); }
  }
}

function flatMapComponents (
  matched,
  fn
) {
  return flatten(matched.map(function (m) {
    return Object.keys(m.components).map(function (key) { return fn(
      m.components[key],
      m.instances[key],
      m, key
    ); })
  }))
}

function flatten (arr) {
  return Array.prototype.concat.apply([], arr)
}

var hasSymbol =
  typeof Symbol === 'function' &&
  typeof Symbol.toStringTag === 'symbol';

function isESModule (obj) {
  return obj.__esModule || (hasSymbol && obj[Symbol.toStringTag] === 'Module')
}

// in Webpack 2, require.ensure now also returns a Promise
// so the resolve/reject functions may get called an extra time
// if the user uses an arrow function shorthand that happens to
// return that Promise.
function once (fn) {
  var called = false;
  return function () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    if (called) { return }
    called = true;
    return fn.apply(this, args)
  }
}

/*  */

var History = function History (router, base) {
  this.router = router;
  this.base = normalizeBase(base);
  // start with a route object that stands for "nowhere"
  this.current = START;
  this.pending = null;
  this.ready = false;
  this.readyCbs = [];
  this.readyErrorCbs = [];
  this.errorCbs = [];
};

History.prototype.listen = function listen (cb) {
  this.cb = cb;
};

History.prototype.onReady = function onReady (cb, errorCb) {
  if (this.ready) {
    cb();
  } else {
    this.readyCbs.push(cb);
    if (errorCb) {
      this.readyErrorCbs.push(errorCb);
    }
  }
};

History.prototype.onError = function onError (errorCb) {
  this.errorCbs.push(errorCb);
};

History.prototype.transitionTo = function transitionTo (location, onComplete, onAbort) {
    var this$1 = this;

  var route = this.router.match(location, this.current);
  this.confirmTransition(route, function () {
    this$1.updateRoute(route);
    onComplete && onComplete(route);
    this$1.ensureURL();

    // fire ready cbs once
    if (!this$1.ready) {
      this$1.ready = true;
      this$1.readyCbs.forEach(function (cb) { cb(route); });
    }
  }, function (err) {
    if (onAbort) {
      onAbort(err);
    }
    if (err && !this$1.ready) {
      this$1.ready = true;
      this$1.readyErrorCbs.forEach(function (cb) { cb(err); });
    }
  });
};

History.prototype.confirmTransition = function confirmTransition (route, onComplete, onAbort) {
    var this$1 = this;

  var current = this.current;
  var abort = function (err) {
    if (isError(err)) {
      if (this$1.errorCbs.length) {
        this$1.errorCbs.forEach(function (cb) { cb(err); });
      } else {
        warn(false, 'uncaught error during route navigation:');
        console.error(err);
      }
    }
    onAbort && onAbort(err);
  };
  if (
    isSameRoute(route, current) &&
    // in the case the route map has been dynamically appended to
    route.matched.length === current.matched.length
  ) {
    this.ensureURL();
    return abort()
  }

  var ref = resolveQueue(this.current.matched, route.matched);
    var updated = ref.updated;
    var deactivated = ref.deactivated;
    var activated = ref.activated;

  var queue = [].concat(
    // in-component leave guards
    extractLeaveGuards(deactivated),
    // global before hooks
    this.router.beforeHooks,
    // in-component update hooks
    extractUpdateHooks(updated),
    // in-config enter guards
    activated.map(function (m) { return m.beforeEnter; }),
    // async components
    resolveAsyncComponents(activated)
  );

  this.pending = route;
  var iterator = function (hook, next) {
    if (this$1.pending !== route) {
      return abort()
    }
    try {
      hook(route, current, function (to) {
        if (to === false || isError(to)) {
          // next(false) -> abort navigation, ensure current URL
          this$1.ensureURL(true);
          abort(to);
        } else if (
          typeof to === 'string' ||
          (typeof to === 'object' && (
            typeof to.path === 'string' ||
            typeof to.name === 'string'
          ))
        ) {
          // next('/') or next({ path: '/' }) -> redirect
          abort();
          if (typeof to === 'object' && to.replace) {
            this$1.replace(to);
          } else {
            this$1.push(to);
          }
        } else {
          // confirm transition and pass on the value
          next(to);
        }
      });
    } catch (e) {
      abort(e);
    }
  };

  runQueue(queue, iterator, function () {
    var postEnterCbs = [];
    var isValid = function () { return this$1.current === route; };
    // wait until async components are resolved before
    // extracting in-component enter guards
    var enterGuards = extractEnterGuards(activated, postEnterCbs, isValid);
    var queue = enterGuards.concat(this$1.router.resolveHooks);
    runQueue(queue, iterator, function () {
      if (this$1.pending !== route) {
        return abort()
      }
      this$1.pending = null;
      onComplete(route);
      if (this$1.router.app) {
        this$1.router.app.$nextTick(function () {
          postEnterCbs.forEach(function (cb) { cb(); });
        });
      }
    });
  });
};

History.prototype.updateRoute = function updateRoute (route) {
  var prev = this.current;
  this.current = route;
  this.cb && this.cb(route);
  this.router.afterHooks.forEach(function (hook) {
    hook && hook(route, prev);
  });
};

function normalizeBase (base) {
  if (!base) {
    if (inBrowser) {
      // respect <base> tag
      var baseEl = document.querySelector('base');
      base = (baseEl && baseEl.getAttribute('href')) || '/';
      // strip full URL origin
      base = base.replace(/^https?:\/\/[^\/]+/, '');
    } else {
      base = '/';
    }
  }
  // make sure there's the starting slash
  if (base.charAt(0) !== '/') {
    base = '/' + base;
  }
  // remove trailing slash
  return base.replace(/\/$/, '')
}

function resolveQueue (
  current,
  next
) {
  var i;
  var max = Math.max(current.length, next.length);
  for (i = 0; i < max; i++) {
    if (current[i] !== next[i]) {
      break
    }
  }
  return {
    updated: next.slice(0, i),
    activated: next.slice(i),
    deactivated: current.slice(i)
  }
}

function extractGuards (
  records,
  name,
  bind,
  reverse
) {
  var guards = flatMapComponents(records, function (def, instance, match, key) {
    var guard = extractGuard(def, name);
    if (guard) {
      return Array.isArray(guard)
        ? guard.map(function (guard) { return bind(guard, instance, match, key); })
        : bind(guard, instance, match, key)
    }
  });
  return flatten(reverse ? guards.reverse() : guards)
}

function extractGuard (
  def,
  key
) {
  if (typeof def !== 'function') {
    // extend now so that global mixins are applied.
    def = _Vue.extend(def);
  }
  return def.options[key]
}

function extractLeaveGuards (deactivated) {
  return extractGuards(deactivated, 'beforeRouteLeave', bindGuard, true)
}

function extractUpdateHooks (updated) {
  return extractGuards(updated, 'beforeRouteUpdate', bindGuard)
}

function bindGuard (guard, instance) {
  if (instance) {
    return function boundRouteGuard () {
      return guard.apply(instance, arguments)
    }
  }
}

function extractEnterGuards (
  activated,
  cbs,
  isValid
) {
  return extractGuards(activated, 'beforeRouteEnter', function (guard, _, match, key) {
    return bindEnterGuard(guard, match, key, cbs, isValid)
  })
}

function bindEnterGuard (
  guard,
  match,
  key,
  cbs,
  isValid
) {
  return function routeEnterGuard (to, from, next) {
    return guard(to, from, function (cb) {
      next(cb);
      if (typeof cb === 'function') {
        cbs.push(function () {
          // #750
          // if a router-view is wrapped with an out-in transition,
          // the instance may not have been registered at this time.
          // we will need to poll for registration until current route
          // is no longer valid.
          poll(cb, match.instances, key, isValid);
        });
      }
    })
  }
}

function poll (
  cb, // somehow flow cannot infer this is a function
  instances,
  key,
  isValid
) {
  if (instances[key]) {
    cb(instances[key]);
  } else if (isValid()) {
    setTimeout(function () {
      poll(cb, instances, key, isValid);
    }, 16);
  }
}

/*  */


var HTML5History = (function (History$$1) {
  function HTML5History (router, base) {
    var this$1 = this;

    History$$1.call(this, router, base);

    var expectScroll = router.options.scrollBehavior;

    if (expectScroll) {
      setupScroll();
    }

    var initLocation = getLocation(this.base);
    window.addEventListener('popstate', function (e) {
      var current = this$1.current;

      // Avoiding first `popstate` event dispatched in some browsers but first
      // history route not updated since async guard at the same time.
      var location = getLocation(this$1.base);
      if (this$1.current === START && location === initLocation) {
        return
      }

      this$1.transitionTo(location, function (route) {
        if (expectScroll) {
          handleScroll(router, route, current, true);
        }
      });
    });
  }

  if ( History$$1 ) HTML5History.__proto__ = History$$1;
  HTML5History.prototype = Object.create( History$$1 && History$$1.prototype );
  HTML5History.prototype.constructor = HTML5History;

  HTML5History.prototype.go = function go (n) {
    window.history.go(n);
  };

  HTML5History.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      pushState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      replaceState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.ensureURL = function ensureURL (push) {
    if (getLocation(this.base) !== this.current.fullPath) {
      var current = cleanPath(this.base + this.current.fullPath);
      push ? pushState(current) : replaceState(current);
    }
  };

  HTML5History.prototype.getCurrentLocation = function getCurrentLocation () {
    return getLocation(this.base)
  };

  return HTML5History;
}(History));

function getLocation (base) {
  var path = window.location.pathname;
  if (base && path.indexOf(base) === 0) {
    path = path.slice(base.length);
  }
  return (path || '/') + window.location.search + window.location.hash
}

/*  */


var HashHistory = (function (History$$1) {
  function HashHistory (router, base, fallback) {
    History$$1.call(this, router, base);
    // check history fallback deeplinking
    if (fallback && checkFallback(this.base)) {
      return
    }
    ensureSlash();
  }

  if ( History$$1 ) HashHistory.__proto__ = History$$1;
  HashHistory.prototype = Object.create( History$$1 && History$$1.prototype );
  HashHistory.prototype.constructor = HashHistory;

  // this is delayed until the app mounts
  // to avoid the hashchange listener being fired too early
  HashHistory.prototype.setupListeners = function setupListeners () {
    var this$1 = this;

    var router = this.router;
    var expectScroll = router.options.scrollBehavior;
    var supportsScroll = supportsPushState && expectScroll;

    if (supportsScroll) {
      setupScroll();
    }

    window.addEventListener(supportsPushState ? 'popstate' : 'hashchange', function () {
      var current = this$1.current;
      if (!ensureSlash()) {
        return
      }
      this$1.transitionTo(getHash(), function (route) {
        if (supportsScroll) {
          handleScroll(this$1.router, route, current, true);
        }
        if (!supportsPushState) {
          replaceHash(route.fullPath);
        }
      });
    });
  };

  HashHistory.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      pushHash(route.fullPath);
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HashHistory.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      replaceHash(route.fullPath);
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HashHistory.prototype.go = function go (n) {
    window.history.go(n);
  };

  HashHistory.prototype.ensureURL = function ensureURL (push) {
    var current = this.current.fullPath;
    if (getHash() !== current) {
      push ? pushHash(current) : replaceHash(current);
    }
  };

  HashHistory.prototype.getCurrentLocation = function getCurrentLocation () {
    return getHash()
  };

  return HashHistory;
}(History));

function checkFallback (base) {
  var location = getLocation(base);
  if (!/^\/#/.test(location)) {
    window.location.replace(
      cleanPath(base + '/#' + location)
    );
    return true
  }
}

function ensureSlash () {
  var path = getHash();
  if (path.charAt(0) === '/') {
    return true
  }
  replaceHash('/' + path);
  return false
}

function getHash () {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  var href = window.location.href;
  var index = href.indexOf('#');
  return index === -1 ? '' : href.slice(index + 1)
}

function getUrl (path) {
  var href = window.location.href;
  var i = href.indexOf('#');
  var base = i >= 0 ? href.slice(0, i) : href;
  return (base + "#" + path)
}

function pushHash (path) {
  if (supportsPushState) {
    pushState(getUrl(path));
  } else {
    window.location.hash = path;
  }
}

function replaceHash (path) {
  if (supportsPushState) {
    replaceState(getUrl(path));
  } else {
    window.location.replace(getUrl(path));
  }
}

/*  */


var AbstractHistory = (function (History$$1) {
  function AbstractHistory (router, base) {
    History$$1.call(this, router, base);
    this.stack = [];
    this.index = -1;
  }

  if ( History$$1 ) AbstractHistory.__proto__ = History$$1;
  AbstractHistory.prototype = Object.create( History$$1 && History$$1.prototype );
  AbstractHistory.prototype.constructor = AbstractHistory;

  AbstractHistory.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index + 1).concat(route);
      this$1.index++;
      onComplete && onComplete(route);
    }, onAbort);
  };

  AbstractHistory.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index).concat(route);
      onComplete && onComplete(route);
    }, onAbort);
  };

  AbstractHistory.prototype.go = function go (n) {
    var this$1 = this;

    var targetIndex = this.index + n;
    if (targetIndex < 0 || targetIndex >= this.stack.length) {
      return
    }
    var route = this.stack[targetIndex];
    this.confirmTransition(route, function () {
      this$1.index = targetIndex;
      this$1.updateRoute(route);
    });
  };

  AbstractHistory.prototype.getCurrentLocation = function getCurrentLocation () {
    var current = this.stack[this.stack.length - 1];
    return current ? current.fullPath : '/'
  };

  AbstractHistory.prototype.ensureURL = function ensureURL () {
    // noop
  };

  return AbstractHistory;
}(History));

/*  */

var VueRouter = function VueRouter (options) {
  if ( options === void 0 ) options = {};

  this.app = null;
  this.apps = [];
  this.options = options;
  this.beforeHooks = [];
  this.resolveHooks = [];
  this.afterHooks = [];
  this.matcher = createMatcher(options.routes || [], this);

  var mode = options.mode || 'hash';
  this.fallback = mode === 'history' && !supportsPushState && options.fallback !== false;
  if (this.fallback) {
    mode = 'hash';
  }
  if (!inBrowser) {
    mode = 'abstract';
  }
  this.mode = mode;

  switch (mode) {
    case 'history':
      this.history = new HTML5History(this, options.base);
      break
    case 'hash':
      this.history = new HashHistory(this, options.base, this.fallback);
      break
    case 'abstract':
      this.history = new AbstractHistory(this, options.base);
      break
    default:
      if (process.env.NODE_ENV !== 'production') {
        assert(false, ("invalid mode: " + mode));
      }
  }
};

var prototypeAccessors = { currentRoute: { configurable: true } };

VueRouter.prototype.match = function match (
  raw,
  current,
  redirectedFrom
) {
  return this.matcher.match(raw, current, redirectedFrom)
};

prototypeAccessors.currentRoute.get = function () {
  return this.history && this.history.current
};

VueRouter.prototype.init = function init (app /* Vue component instance */) {
    var this$1 = this;

  process.env.NODE_ENV !== 'production' && assert(
    install.installed,
    "not installed. Make sure to call `Vue.use(VueRouter)` " +
    "before creating root instance."
  );

  this.apps.push(app);

  // main app already initialized.
  if (this.app) {
    return
  }

  this.app = app;

  var history = this.history;

  if (history instanceof HTML5History) {
    history.transitionTo(history.getCurrentLocation());
  } else if (history instanceof HashHistory) {
    var setupHashListener = function () {
      history.setupListeners();
    };
    history.transitionTo(
      history.getCurrentLocation(),
      setupHashListener,
      setupHashListener
    );
  }

  history.listen(function (route) {
    this$1.apps.forEach(function (app) {
      app._route = route;
    });
  });
};

VueRouter.prototype.beforeEach = function beforeEach (fn) {
  return registerHook(this.beforeHooks, fn)
};

VueRouter.prototype.beforeResolve = function beforeResolve (fn) {
  return registerHook(this.resolveHooks, fn)
};

VueRouter.prototype.afterEach = function afterEach (fn) {
  return registerHook(this.afterHooks, fn)
};

VueRouter.prototype.onReady = function onReady (cb, errorCb) {
  this.history.onReady(cb, errorCb);
};

VueRouter.prototype.onError = function onError (errorCb) {
  this.history.onError(errorCb);
};

VueRouter.prototype.push = function push (location, onComplete, onAbort) {
  this.history.push(location, onComplete, onAbort);
};

VueRouter.prototype.replace = function replace (location, onComplete, onAbort) {
  this.history.replace(location, onComplete, onAbort);
};

VueRouter.prototype.go = function go (n) {
  this.history.go(n);
};

VueRouter.prototype.back = function back () {
  this.go(-1);
};

VueRouter.prototype.forward = function forward () {
  this.go(1);
};

VueRouter.prototype.getMatchedComponents = function getMatchedComponents (to) {
  var route = to
    ? to.matched
      ? to
      : this.resolve(to).route
    : this.currentRoute;
  if (!route) {
    return []
  }
  return [].concat.apply([], route.matched.map(function (m) {
    return Object.keys(m.components).map(function (key) {
      return m.components[key]
    })
  }))
};

VueRouter.prototype.resolve = function resolve (
  to,
  current,
  append
) {
  var location = normalizeLocation(
    to,
    current || this.history.current,
    append,
    this
  );
  var route = this.match(location, current);
  var fullPath = route.redirectedFrom || route.fullPath;
  var base = this.history.base;
  var href = createHref(base, fullPath, this.mode);
  return {
    location: location,
    route: route,
    href: href,
    // for backwards compat
    normalizedTo: location,
    resolved: route
  }
};

VueRouter.prototype.addRoutes = function addRoutes (routes) {
  this.matcher.addRoutes(routes);
  if (this.history.current !== START) {
    this.history.transitionTo(this.history.getCurrentLocation());
  }
};

Object.defineProperties( VueRouter.prototype, prototypeAccessors );

function registerHook (list, fn) {
  list.push(fn);
  return function () {
    var i = list.indexOf(fn);
    if (i > -1) { list.splice(i, 1); }
  }
}

function createHref (base, fullPath, mode) {
  var path = mode === 'hash' ? '#' + fullPath : fullPath;
  return base ? cleanPath(base + '/' + path) : path
}

VueRouter.install = install;
VueRouter.version = '3.0.1';

if (inBrowser && window.Vue) {
  window.Vue.use(VueRouter);
}

/* harmony default export */ __webpack_exports__["a"] = (VueRouter);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(5)))

/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_script_index_0_Login_vue__ = __webpack_require__(6);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_7_1_vue_loader_lib_template_compiler_index_id_data_v_f6ee8876_hasScoped_true_buble_transforms_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_template_index_0_Login_vue__ = __webpack_require__(31);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(26)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-f6ee8876"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_script_index_0_Login_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_7_1_vue_loader_lib_template_compiler_index_id_data_v_f6ee8876_hasScoped_true_buble_transforms_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_template_index_0_Login_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\views\\Login.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-f6ee8876", Component.options)
  } else {
    hotAPI.reload("data-v-f6ee8876", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(27);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("589677ce", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/_css-loader@0.28.11@css-loader/index.js!../../node_modules/_vue-loader@13.7.1@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-f6ee8876\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/_vue-loader@13.7.1@vue-loader/lib/selector.js?type=styles&index=0!./Login.vue", function() {
     var newContent = require("!!../../node_modules/_css-loader@0.28.11@css-loader/index.js!../../node_modules/_vue-loader@13.7.1@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-f6ee8876\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/_vue-loader@13.7.1@vue-loader/lib/selector.js?type=styles&index=0!./Login.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n.btn[data-v-f6ee8876] {\r\n  flex-direction: row;\r\n  margin-top: 50px;\r\n  margin-bottom: 50px;\r\n  justify-content: space-around;\r\n  border-radius: 10px;\n}\n.btntext[data-v-f6ee8876] {\r\n  width: 265px;\r\n  color: #fff;\r\n  font-size: 30px;\r\n  text-align: center;\r\n  padding-bottom: 20px;\r\n  padding-top: 20px;\r\n  background-color: #dd0011;\n}\n.login-more[data-v-f6ee8876] {\r\n  padding-bottom: 20px;\r\n  padding-top: 100px;\r\n  align-items: center;\n}\n.more-txt[data-v-f6ee8876] {\r\n  width: 180px;\r\n  font-size: 28px;\r\n  color: #565656;\r\n  text-align: center;\r\n  align-content: center;\r\n  align-items: center;\r\n  background-color: #ffffff;\n}\n.more-line[data-v-f6ee8876] {\r\n  top: 15px;\r\n  width: 250px;\r\n  height: 1px;\r\n  background-color: #979797;\r\n  align-content: center;\r\n  align-items: center;\n}\n.Bg[data-v-f6ee8876] {\r\n  align-content: center;\r\n  align-items: center;\n}\n.gap[data-v-f6ee8876] {\r\n  height: 90px;\r\n  background-color: rgb(244, 245, 249);\n}\n.bg-login[data-v-f6ee8876] {\r\n  width: 750px;\r\n  height: 368px;\r\n  padding-top: 33px;\r\n  padding-left: 90px;\r\n  background-color: red;\n}\n.bg-bigT[data-v-f6ee8876] {\r\n  font-size: 72px;\r\n  color: #ffffff;\r\n  padding-bottom: 10px;\n}\n.bg-smallT[data-v-f6ee8876] {\r\n  font-size: 34px;\r\n  color: #ffffff;\n}\n.loginBox[data-v-f6ee8876] {\r\n  align-content: center;\r\n  align-items: center;\n}\n.loginBg[data-v-f6ee8876] {\r\n  width: 630px;\r\n  margin-top: -96px;\r\n  background-color: #ffffff;\r\n  border-width: 1px;\r\n  border-style: solid;\r\n  border-color: #eee;\r\n  border-radius: 10px;\r\n  box-shadow: 0 10px 15px rgba(200, 96, 96, 0.14);\n}\n.loginT[data-v-f6ee8876] {\r\n  height: 97px;\r\n  align-content: center;\r\n  align-items: center;\r\n  margin-bottom: 45px;\n}\n.loginT-txt[data-v-f6ee8876] {\r\n  width: 256px;\r\n  height: 97px;\r\n  line-height: 97px;\r\n  text-align: center;\r\n  align-content: center;\r\n  align-items: center;\r\n  border-bottom-width: 6px;\r\n  border-style: solid;\r\n  border-color: #e61420;\r\n  font-family: PingFangSC-Semibold;\n}\n.userImg[data-v-f6ee8876] {\r\n  width: 34px;\r\n  height: 34px;\r\n  margin-right: 25px;\n}\n.passwordImg[data-v-f6ee8876] {\r\n  width: 34px;\r\n  height: 34px;\r\n  margin-right: 25px;\n}\n.login-r[data-v-f6ee8876] {\r\n  flex-direction: row;\r\n  align-items: center;\r\n  height: 80px;\r\n  padding-left: 31px;\r\n  padding-right: 31px;\r\n  margin-top: 25px;\r\n  margin-bottom: 0px;\r\n  /* border-bottom:1px;\r\n    border-style: solid;\r\n    border-color: #DFDFDF; */\n}\n.line[data-v-f6ee8876] {\r\n  width: 630px;\r\n  height: 1px;\r\n  background-color: #dfdfdf;\n}\n.login-i[data-v-f6ee8876] {\r\n  width: 450px;\r\n  font-size: 30px;\r\n  color: #000000;\n}\r\n/* .login-i::-webkit-input-placeholder{\r\n    color: #CCCCCC;\r\n} */\n.forgotPwd[data-v-f6ee8876] {\r\n  align-items: flex-end;\r\n  top: 22px;\r\n  margin-right: 15px;\r\n  margin-top: 10px;\r\n  margin-bottom: 10px;\n}\n.forgotPwdTxt[data-v-f6ee8876] {\r\n  font-size: 28px;\r\n  color: #666666;\n}\r\n", ""]);

// exports


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(29);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("a04f7fc2", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/_css-loader@0.28.11@css-loader/index.js!../../node_modules/_vue-loader@13.7.1@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-43f57642\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/_vue-loader@13.7.1@vue-loader/lib/selector.js?type=styles&index=0!./loginTitle.vue", function() {
     var newContent = require("!!../../node_modules/_css-loader@0.28.11@css-loader/index.js!../../node_modules/_vue-loader@13.7.1@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-43f57642\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/_vue-loader@13.7.1@vue-loader/lib/selector.js?type=styles&index=0!./loginTitle.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n.header[data-v-43f57642] {\n    position: fixed;\n    top: 0;\n    left: 0;\n    height: 90px;\n    width: 750px;\n    /*border-bottom-width: 1px;*/\n    /*border-bottom-style: solid;*/\n    /*border-bottom-color: rgb(229, 229, 229);*/\n    /* background-color: #e3392f; */\n    color:#ffffff;\n    justify-content: space-between;\n    align-items: center;\n    flex-direction: row;\n}\n.imgDiv[data-v-43f57642] {\n    height: 72px;\n    width: 44px;\n    left: 30px;\n    justify-content: center;\n    align-items: center;\n}\n.backImg[data-v-43f57642] {\n    height: 30px;\n    width: 30px;\n}\n.title[data-v-43f57642] {\n    font-family: Verdana, Geneva, sans-serif;\n    font-size: 38px;\n    color: #FFFFFF;\n    text-align: center;\n}\n.homepage[data-v-43f57642]{\n    right:41px;\n    font-size: 30px;\n    color: #FFFFFF;\n}\n", ""]);

// exports


/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "header",
      staticStyle: _vm.$processStyle(undefined),
      style: _vm.$processStyle({
        "background-color": _vm.bg,
        "margin-top": _vm.marginTop + "px"
      })
    },
    [
      _c(
        "div",
        {
          staticClass: "imgDiv",
          staticStyle: _vm.$processStyle(undefined),
          style: _vm.$processStyle(undefined),
          on: { click: _vm.goBack }
        },
        [
          _c("image", {
            staticClass: "backImg",
            staticStyle: _vm.$processStyle(undefined),
            style: _vm.$processStyle(undefined),
            attrs: { src: _vm.backurl }
          })
        ]
      ),
      _vm._v(" "),
      _c(
        "text",
        {
          staticClass: "title",
          staticStyle: _vm.$processStyle(undefined),
          style: _vm.$processStyle(undefined)
        },
        [_vm._v(_vm._s(_vm.title))]
      ),
      _vm._v(" "),
      _vm.show
        ? _c(
            "text",
            {
              staticClass: "homepage",
              staticStyle: _vm.$processStyle(undefined),
              style: _vm.$processStyle(undefined),
              on: { click: _vm.goHome }
            },
            [_vm._v("跳过")]
          )
        : _vm._e()
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-loader/node_modules/vue-hot-reload-api")      .rerender("data-v-43f57642", esExports)
  }
}

/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "Bg",
      staticStyle: _vm.$processStyle(undefined),
      style: _vm.$processStyle(undefined)
    },
    [
      _c("title", {
        staticStyle: _vm.$processStyle(undefined),
        style: _vm.$processStyle(undefined),
        attrs: { title: _vm.Title, show: _vm.Show, bg: _vm.bg }
      }),
      _vm._v(" "),
      _c("div", {
        staticClass: "gap",
        staticStyle: _vm.$processStyle(undefined),
        style: _vm.$processStyle(undefined)
      }),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass: "bg-login",
          staticStyle: _vm.$processStyle(undefined),
          style: _vm.$processStyle(undefined)
        },
        [
          _c(
            "text",
            {
              staticClass: "bg-bigT",
              staticStyle: _vm.$processStyle(undefined),
              style: _vm.$processStyle(undefined)
            },
            [_vm._v("您好，")]
          ),
          _vm._v(" "),
          _c(
            "text",
            {
              staticClass: "bg-smallT",
              staticStyle: _vm.$processStyle(undefined),
              style: _vm.$processStyle(undefined)
            },
            [_vm._v("欢迎登录三一汽车金融")]
          )
        ]
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass: "loginBox",
          staticStyle: _vm.$processStyle(undefined),
          style: _vm.$processStyle(undefined)
        },
        [
          _c(
            "div",
            {
              staticClass: "loginBg",
              staticStyle: _vm.$processStyle(undefined),
              style: _vm.$processStyle(undefined)
            },
            [
              _c(
                "div",
                {
                  staticClass: "loginT",
                  staticStyle: _vm.$processStyle(undefined),
                  style: _vm.$processStyle(undefined)
                },
                [
                  _c(
                    "text",
                    {
                      staticClass: "loginT-txt",
                      staticStyle: _vm.$processStyle(undefined),
                      style: _vm.$processStyle(undefined)
                    },
                    [_vm._v("登录")]
                  )
                ]
              ),
              _vm._v(" "),
              _c(
                "div",
                {
                  staticClass: "login-r",
                  staticStyle: _vm.$processStyle(undefined),
                  style: _vm.$processStyle(undefined)
                },
                [
                  _c("image", {
                    staticClass: "userImg",
                    staticStyle: _vm.$processStyle(undefined),
                    style: _vm.$processStyle(undefined),
                    attrs: { src: _vm.nameUrl }
                  }),
                  _vm._v(" "),
                  _c("input", {
                    staticClass: "login-i",
                    staticStyle: _vm.$processStyle(undefined),
                    style: _vm.$processStyle(undefined),
                    attrs: {
                      type: "text",
                      placeholder: "手机号/证件号/银行卡/登录名"
                    },
                    on: { input: _vm.getName }
                  })
                ]
              ),
              _vm._v(" "),
              _c("div", {
                staticClass: "line",
                staticStyle: _vm.$processStyle(undefined),
                style: _vm.$processStyle(undefined)
              }),
              _vm._v(" "),
              _c(
                "div",
                {
                  staticClass: "login-r",
                  staticStyle: _vm.$processStyle(undefined),
                  style: _vm.$processStyle(undefined)
                },
                [
                  _c("image", {
                    staticClass: "passwordImg",
                    staticStyle: _vm.$processStyle(undefined),
                    style: _vm.$processStyle(undefined),
                    attrs: { src: _vm.pwdUrl }
                  }),
                  _vm._v(" "),
                  _c("input", {
                    staticClass: "login-i",
                    staticStyle: _vm.$processStyle(undefined),
                    style: _vm.$processStyle(undefined),
                    attrs: { type: "password", placeholder: "请输入登录密码" },
                    on: { input: _vm.getPwd }
                  })
                ]
              ),
              _vm._v(" "),
              _c("div", {
                staticClass: "line",
                staticStyle: _vm.$processStyle(undefined),
                style: _vm.$processStyle(undefined)
              }),
              _vm._v(" "),
              _c(
                "div",
                {
                  staticClass: "forgotPwd",
                  staticStyle: _vm.$processStyle(undefined),
                  style: _vm.$processStyle(undefined),
                  on: { click: _vm.toForget }
                },
                [
                  _c(
                    "text",
                    {
                      staticClass: "forgotPwdTxt",
                      staticStyle: _vm.$processStyle(undefined),
                      style: _vm.$processStyle(undefined)
                    },
                    [_vm._v("忘记密码？")]
                  )
                ]
              ),
              _vm._v(" "),
              _c(
                "div",
                {
                  staticClass: "btn",
                  staticStyle: _vm.$processStyle(undefined),
                  style: _vm.$processStyle(undefined)
                },
                [
                  _c(
                    "text",
                    {
                      staticClass: "btntext",
                      staticStyle: _vm.$processStyle(undefined),
                      style: _vm.$processStyle(undefined),
                      on: { click: _vm.register }
                    },
                    [_vm._v("注 册")]
                  ),
                  _vm._v(" "),
                  _c(
                    "text",
                    {
                      staticClass: "btntext",
                      staticStyle: _vm.$processStyle(undefined),
                      style: _vm.$processStyle(undefined),
                      on: { click: _vm.toLogin }
                    },
                    [_vm._v("登 录")]
                  )
                ]
              )
            ]
          )
        ]
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass: "login-more",
          staticStyle: _vm.$processStyle(undefined),
          style: _vm.$processStyle(undefined),
          on: { click: _vm.moreLogin }
        },
        [
          _c("div", {
            staticClass: "more-line",
            staticStyle: _vm.$processStyle(undefined),
            style: _vm.$processStyle(undefined)
          }),
          _vm._v(" "),
          _c(
            "text",
            {
              staticClass: "more-txt",
              staticStyle: _vm.$processStyle(undefined),
              style: _vm.$processStyle(undefined)
            },
            [_vm._v("更多登录")]
          )
        ]
      )
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-loader/node_modules/vue-hot-reload-api")      .rerender("data-v-f6ee8876", esExports)
  }
}

/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_script_index_0_ForgetPwd_vue__ = __webpack_require__(9);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_7_1_vue_loader_lib_template_compiler_index_id_data_v_d1ac5628_hasScoped_true_buble_transforms_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_template_index_0_ForgetPwd_vue__ = __webpack_require__(35);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(33)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-d1ac5628"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_script_index_0_ForgetPwd_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_7_1_vue_loader_lib_template_compiler_index_id_data_v_d1ac5628_hasScoped_true_buble_transforms_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_template_index_0_ForgetPwd_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\views\\ForgetPwd.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-d1ac5628", Component.options)
  } else {
    hotAPI.reload("data-v-d1ac5628", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(34);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("45727424", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/_css-loader@0.28.11@css-loader/index.js!../../node_modules/_vue-loader@13.7.1@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-d1ac5628\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/_vue-loader@13.7.1@vue-loader/lib/selector.js?type=styles&index=0!./ForgetPwd.vue", function() {
     var newContent = require("!!../../node_modules/_css-loader@0.28.11@css-loader/index.js!../../node_modules/_vue-loader@13.7.1@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-d1ac5628\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/_vue-loader@13.7.1@vue-loader/lib/selector.js?type=styles&index=0!./ForgetPwd.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n.btn[data-v-d1ac5628] {\r\n  flex-direction: row;\r\n  margin-top: 50px;\r\n  margin-bottom: 50px;\r\n  justify-content: space-around;\r\n  border-radius: 10px;\n}\n.btntext[data-v-d1ac5628] {\r\n  width: 265px;\r\n  color: #fff;\r\n  font-size: 30px;\r\n  text-align: center;\r\n  padding-bottom: 20px;\r\n  padding-top: 20px;\r\n  background-color: #dd0011;\n}\n.login-more[data-v-d1ac5628] {\r\n  padding-bottom: 20px;\r\n  padding-top: 100px;\r\n  align-items: center;\n}\n.more-txt[data-v-d1ac5628] {\r\n  width: 180px;\r\n  font-size: 28px;\r\n  color: #565656;\r\n  text-align: center;\r\n  align-content: center;\r\n  align-items: center;\r\n  ackground-color: #ffffff;\n}\n.more-line[data-v-d1ac5628] {\r\n  top: 15px;\r\n  width: 375px;\r\n  height: 1px;\r\n  background-color: #979797;\r\n  align-content: center;\r\n  align-items: center;\n}\n.Bg[data-v-d1ac5628] {\r\n  align-content: center;\r\n  align-items: center;\n}\n.gap[data-v-d1ac5628] {\r\n  height: 90px;\r\n  background-color: rgb(244, 245, 249);\n}\n.bg-login[data-v-d1ac5628] {\r\n  width: 750px;\r\n  height: 368px;\r\n  padding-top: 33px;\r\n  padding-left: 90px;\r\n  background-color: red;\n}\n.bg-bigT[data-v-d1ac5628] {\r\n  font-size: 72px;\r\n  color: #ffffff;\r\n  padding-bottom: 10px;\n}\n.bg-smallT[data-v-d1ac5628] {\r\n  font-size: 34px;\r\n  color: #ffffff;\n}\n.loginBox[data-v-d1ac5628] {\r\n  align-content: center;\r\n  align-items: center;\n}\n.loginBg[data-v-d1ac5628] {\r\n  width: 630px;\r\n  margin-top: -96px;\r\n  background-color: #ffffff;\r\n  border-width: 1px;\r\n  border-style: solid;\r\n  border-color: #eee;\r\n  border-radius: 10px;\r\n  box-shadow: 0 10px 15px rgba(200, 96, 96, 0.14);\n}\n.loginT[data-v-d1ac5628] {\r\n  height: 97px;\r\n  align-content: center;\r\n  align-items: center;\r\n  margin-bottom: 45px;\n}\n.loginT-txt[data-v-d1ac5628] {\r\n  width: 256px;\r\n  height: 97px;\r\n  line-height: 97px;\r\n  text-align: center;\r\n  align-content: center;\r\n  align-items: center;\r\n  border-bottom-width: 6px;\r\n  border-style: solid;\r\n  border-color: #e61420;\r\n  font-family: PingFangSC-Semibold;\n}\n.userImg[data-v-d1ac5628] {\r\n  width: 34px;\r\n  height: 34px;\r\n  margin-right: 25px;\n}\n.passwordImg[data-v-d1ac5628] {\r\n  width: 34px;\r\n  height: 34px;\r\n  margin-right: 25px;\n}\n.login-r[data-v-d1ac5628] {\r\n  flex-direction: row;\r\n  align-items: center;\r\n  width:750px;\r\n  height: 80px;\r\n  padding-left: 60px;\r\n  padding-right: 31px;\r\n  margin-top: 25px;\r\n  margin-bottom: 0px;\r\n  /* border-bottom:1px;\r\n    border-style: solid;\r\n    border-color: #DFDFDF; */\n}\n.line[data-v-d1ac5628] {\r\n  width: 630px;\r\n  height: 1px;\r\n  background-color: #dfdfdf;\n}\n.login-i[data-v-d1ac5628] {\r\n  width: 450px;\r\n  font-size: 30px;\r\n  color: #000000;\n}\n.login-code[data-v-d1ac5628]{\r\n  width: 500px;\r\n  font-size: 30px;\r\n  color: #000000;\n}\n.msgCodeBtn[data-v-d1ac5628]{\r\n  font-size: 30px;\r\n  color: #666666;\n}\r\n/* .login-i::-webkit-input-placeholder{\r\n    color: #CCCCCC;\r\n} */\n.forgotPwd[data-v-d1ac5628] {\r\n  align-items: flex-end;\r\n  top: 22px;\r\n  margin-right: 15px;\r\n  margin-top: 10px;\r\n  margin-bottom: 10px;\n}\n.forgotPwdTxt[data-v-d1ac5628] {\r\n  font-size: 28px;\r\n  color: #666666;\n}\r\n", ""]);

// exports


/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "Bg",
      staticStyle: _vm.$processStyle(undefined),
      style: _vm.$processStyle(undefined)
    },
    [
      _c("title", {
        staticStyle: _vm.$processStyle(undefined),
        style: _vm.$processStyle(undefined),
        attrs: { title: _vm.Title, show: _vm.Show, bg: _vm.bg }
      }),
      _vm._v(" "),
      _c("div", {
        staticClass: "gap",
        staticStyle: _vm.$processStyle(undefined),
        style: _vm.$processStyle(undefined)
      }),
      _vm._v(" "),
      _c(
        "div",
        {
          staticStyle: _vm.$processStyle(undefined),
          style: _vm.$processStyle(undefined)
        },
        [
          _c(
            "div",
            {
              staticClass: "login-r",
              staticStyle: _vm.$processStyle(undefined),
              style: _vm.$processStyle(undefined)
            },
            [
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.telPhone,
                    expression: "telPhone"
                  }
                ],
                staticClass: "login-i",
                staticStyle: _vm.$processStyle(undefined),
                style: _vm.$processStyle(undefined),
                attrs: { type: "tel", placeholder: "请输入手机号" },
                domProps: { value: _vm.telPhone },
                on: {
                  input: function($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.telPhone = $event.target.value
                  }
                }
              })
            ]
          ),
          _vm._v(" "),
          _c("div", {
            staticClass: "line",
            staticStyle: _vm.$processStyle(undefined),
            style: _vm.$processStyle(undefined)
          }),
          _vm._v(" "),
          _c(
            "div",
            {
              staticClass: "login-r",
              staticStyle: _vm.$processStyle(undefined),
              style: _vm.$processStyle(undefined)
            },
            [
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.msgCode,
                    expression: "msgCode"
                  }
                ],
                staticClass: "login-code",
                staticStyle: _vm.$processStyle(undefined),
                style: _vm.$processStyle(undefined),
                attrs: { type: "password", placeholder: "请输入短信验证码" },
                domProps: { value: _vm.msgCode },
                on: {
                  input: function($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.msgCode = $event.target.value
                  }
                }
              }),
              _vm._v(" "),
              _vm.isTimerStop
                ? _c(
                    "text",
                    {
                      staticClass: "msgCodeBtn",
                      staticStyle: _vm.$processStyle(undefined),
                      style: _vm.$processStyle(undefined),
                      on: { click: _vm.sendCode }
                    },
                    [_vm._v(_vm._s(_vm.msgCodeBtnText))]
                  )
                : _c(
                    "text",
                    {
                      staticClass: "msgCodeBtn",
                      staticStyle: _vm.$processStyle(undefined),
                      style: _vm.$processStyle(undefined),
                      on: { click: _vm.sendCode }
                    },
                    [_vm._v(_vm._s(_vm.msgCodeBtnText))]
                  )
            ]
          ),
          _vm._v(" "),
          _c("div", {
            staticClass: "line",
            staticStyle: _vm.$processStyle(undefined),
            style: _vm.$processStyle(undefined)
          }),
          _vm._v(" "),
          _c(
            "div",
            {
              staticClass: "login-r",
              staticStyle: _vm.$processStyle(undefined),
              style: _vm.$processStyle(undefined)
            },
            [
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.newPwd,
                    expression: "newPwd"
                  }
                ],
                staticClass: "login-i",
                staticStyle: _vm.$processStyle(undefined),
                style: _vm.$processStyle(undefined),
                attrs: { type: "password", placeholder: "请输入新密码" },
                domProps: { value: _vm.newPwd },
                on: {
                  input: function($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.newPwd = $event.target.value
                  }
                }
              })
            ]
          ),
          _vm._v(" "),
          _c("div", {
            staticClass: "line",
            staticStyle: _vm.$processStyle(undefined),
            style: _vm.$processStyle(undefined)
          }),
          _vm._v(" "),
          _c(
            "div",
            {
              staticClass: "login-r",
              staticStyle: _vm.$processStyle(undefined),
              style: _vm.$processStyle(undefined)
            },
            [
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.newPwdCfm,
                    expression: "newPwdCfm"
                  }
                ],
                staticClass: "login-i",
                staticStyle: _vm.$processStyle(undefined),
                style: _vm.$processStyle(undefined),
                attrs: { type: "password", placeholder: "请确认新密码" },
                domProps: { value: _vm.newPwdCfm },
                on: {
                  input: function($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.newPwdCfm = $event.target.value
                  }
                }
              })
            ]
          ),
          _vm._v(" "),
          _c("div", {
            staticClass: "line",
            staticStyle: _vm.$processStyle(undefined),
            style: _vm.$processStyle(undefined)
          }),
          _vm._v(" "),
          _c(
            "div",
            {
              staticClass: "btn",
              staticStyle: _vm.$processStyle(undefined),
              style: _vm.$processStyle(undefined)
            },
            [
              _c(
                "text",
                {
                  staticClass: "btntext",
                  staticStyle: _vm.$processStyle(undefined),
                  style: _vm.$processStyle(undefined)
                },
                [_vm._v("提 交")]
              )
            ]
          )
        ]
      )
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-loader/node_modules/vue-hot-reload-api")      .rerender("data-v-d1ac5628", esExports)
  }
}

/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_script_index_0_Register_vue__ = __webpack_require__(10);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_7_1_vue_loader_lib_template_compiler_index_id_data_v_3bb7ea12_hasScoped_true_buble_transforms_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_template_index_0_Register_vue__ = __webpack_require__(42);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(37)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-3bb7ea12"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_script_index_0_Register_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_7_1_vue_loader_lib_template_compiler_index_id_data_v_3bb7ea12_hasScoped_true_buble_transforms_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_template_index_0_Register_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\views\\Register.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3bb7ea12", Component.options)
  } else {
    hotAPI.reload("data-v-3bb7ea12", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(38);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("7b0a0ad9", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/_css-loader@0.28.11@css-loader/index.js!../../node_modules/_vue-loader@13.7.1@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3bb7ea12\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/_vue-loader@13.7.1@vue-loader/lib/selector.js?type=styles&index=0!./Register.vue", function() {
     var newContent = require("!!../../node_modules/_css-loader@0.28.11@css-loader/index.js!../../node_modules/_vue-loader@13.7.1@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3bb7ea12\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/_vue-loader@13.7.1@vue-loader/lib/selector.js?type=styles&index=0!./Register.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n.Bg[data-v-3bb7ea12] {\n     background-color: #f4f5f9;\n     flex: 1;\n}\n.gap[data-v-3bb7ea12] {\n     height: 20px;\n     background-color: rgb(244, 245, 249);\n     margin-top: 120px;\n}\n.input[data-v-3bb7ea12] {\n     flex-direction: row;\n     justify-content: space-between;\n     align-items: center;\n     height: 90px;\n     width: 750px;\n     background-color: #fff;\n}\n.inputText[data-v-3bb7ea12] {\n     left: 31px;\n     font-size: 28px;\n     color: #333333;\n}\n.inputSty2[data-v-3bb7ea12] {\n     width: 250px;\n     height: 90px;\n     font-size: 28px;\n     color: #333333;\n}\n.container[data-v-3bb7ea12] {\n     flex-direction: row;\n     width: 580px;\n     height: 90px;\n     align-items: center;\n     border-bottom-color: rgb(229, 229, 229);\n     border-bottom-width: 1px;\n}\n.msgCodeBtnBlue[data-v-3bb7ea12] {\n     font-size: 28px;\n     lines: 1;\n     color: #54b3fc;\n}\n.msgCodeBtnGray[data-v-3bb7ea12] {\n     font-size: 28px;\n     lines: 1;\n     color: #c5c5c5;\n}\n.picUrl[data-v-3bb7ea12]{\n     width: 30px;\n     height: 30px;\n     margin-left: 20px;\n     margin-right: 20px;\n}\n.notice[data-v-3bb7ea12]{\n     align-items: center;\n     margin-top: 35px;\n}\n.title[data-v-3bb7ea12]{\n     font-size: 26px;\n     color: #666666;\n}\n.btn[data-v-3bb7ea12] {\n     margin-top: 50px;\n     margin-bottom: 50px;\n     width: 650px;\n     height: 90px;\n     margin-left: 50px;\n     justify-content: center;\n     background-color: #e3392f;\n}\n.btntext[data-v-3bb7ea12] {\n     color: #fff;\n     font-size: 34px;\n     text-align: center;\n}\n", ""]);

// exports


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(40);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("62398464", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/_css-loader@0.28.11@css-loader/index.js!../../node_modules/_vue-loader@13.7.1@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-1fd30c98\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/_vue-loader@13.7.1@vue-loader/lib/selector.js?type=styles&index=0!./title.vue", function() {
     var newContent = require("!!../../node_modules/_css-loader@0.28.11@css-loader/index.js!../../node_modules/_vue-loader@13.7.1@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-1fd30c98\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/_vue-loader@13.7.1@vue-loader/lib/selector.js?type=styles&index=0!./title.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n.header[data-v-1fd30c98] {\n    position: fixed;\n    top: 0;\n    left: 0;\n    height: 90px;\n    line-height: 90px;\n    width: 750px;\n    padding-top: 30px;\n    /*border-bottom-width: 1px;*/\n    /*border-bottom-style: solid;*/\n    /*border-bottom-color: rgb(229, 229, 229);*/\n    /* background-color: #e3392f; */\n    color:#ffffff;\n    justify-content: space-between;\n    align-items: center;\n    flex-direction: row;\n}\n.imgDiv[data-v-1fd30c98] {\n    height: 30px;\n    width: 30px;\n    left: 30;\n    bottom: 10;\n    justify-content: center;\n    align-items: center;\n}\n.backImg[data-v-1fd30c98] {\n    height: 30px;\n    width: 30px;\n}\n.title[data-v-1fd30c98] {\n    font-family: Verdana, Geneva, sans-serif;\n    font-size: 32px;\n    bottom: 10;\n    color: #ffffff;\n}\n.homepage[data-v-1fd30c98]{\n    font-size: 30px;\n    right: 30px;\n    color: #ffffff;\n}\n", ""]);

// exports


/***/ }),
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "header",
      staticStyle: _vm.$processStyle(undefined),
      style: _vm.$processStyle({
        "background-color": _vm.bg,
        "margin-top": _vm.marginTop + "px"
      })
    },
    [
      _c(
        "div",
        {
          staticClass: "imgDiv",
          staticStyle: _vm.$processStyle(undefined),
          style: _vm.$processStyle(undefined),
          on: { click: _vm.goBack }
        },
        [
          _c("image", {
            staticClass: "backImg",
            staticStyle: _vm.$processStyle(undefined),
            style: _vm.$processStyle(undefined),
            attrs: { src: _vm.backurl }
          })
        ]
      ),
      _vm._v(" "),
      _c(
        "text",
        {
          staticClass: "title",
          staticStyle: _vm.$processStyle(undefined),
          style: _vm.$processStyle(undefined)
        },
        [_vm._v(_vm._s(_vm.title))]
      ),
      _vm._v(" "),
      _c("div", [
        _vm.show
          ? _c("text", {
              staticClass: "homepage",
              staticStyle: _vm.$processStyle(undefined),
              style: _vm.$processStyle(undefined),
              on: { click: _vm.goHome }
            })
          : _vm._e()
      ])
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-loader/node_modules/vue-hot-reload-api")      .rerender("data-v-1fd30c98", esExports)
  }
}

/***/ }),
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "Bg",
      staticStyle: _vm.$processStyle(undefined),
      style: _vm.$processStyle(undefined)
    },
    [
      _c("title", {
        staticStyle: _vm.$processStyle(undefined),
        style: _vm.$processStyle(undefined),
        attrs: { title: _vm.Title, show: _vm.Show, bg: _vm.TitleBarBg }
      }),
      _vm._v(" "),
      _c("div", {
        staticClass: "gap",
        staticStyle: _vm.$processStyle(undefined),
        style: _vm.$processStyle(undefined)
      }),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass: "input",
          staticStyle: _vm.$processStyle(undefined),
          style: _vm.$processStyle(undefined)
        },
        [
          _c(
            "text",
            {
              staticClass: "inputText",
              staticStyle: _vm.$processStyle(undefined),
              style: _vm.$processStyle(undefined)
            },
            [_vm._v("用户类型")]
          ),
          _vm._v(" "),
          _c(
            "div",
            {
              staticClass: "container",
              staticStyle: _vm.$processStyle(undefined),
              style: _vm.$processStyle(undefined)
            },
            [
              _vm.flag == 1
                ? _c("image", {
                    staticClass: "picUrl",
                    staticStyle: _vm.$processStyle(undefined),
                    style: _vm.$processStyle(undefined),
                    attrs: { src: _vm.choosed }
                  })
                : _vm._e(),
              _vm._v(" "),
              _vm.flag != 1
                ? _c("image", {
                    staticClass: "picUrl",
                    staticStyle: _vm.$processStyle(undefined),
                    style: _vm.$processStyle(undefined),
                    attrs: { src: _vm.unchoosed }
                  })
                : _vm._e(),
              _vm._v(" "),
              _c(
                "text",
                {
                  staticStyle: _vm.$processStyle(undefined),
                  style: _vm.$processStyle(undefined),
                  on: {
                    click: function($event) {
                      _vm.change(1)
                    }
                  }
                },
                [_vm._v("个人用户")]
              ),
              _vm._v(" "),
              _vm.flag == 2
                ? _c("image", {
                    staticClass: "picUrl",
                    staticStyle: _vm.$processStyle(undefined),
                    style: _vm.$processStyle(undefined),
                    attrs: { src: _vm.choosed }
                  })
                : _vm._e(),
              _vm._v(" "),
              _vm.flag != 2
                ? _c("image", {
                    staticClass: "picUrl",
                    staticStyle: _vm.$processStyle(undefined),
                    style: _vm.$processStyle(undefined),
                    attrs: { src: _vm.unchoosed }
                  })
                : _vm._e(),
              _vm._v(" "),
              _c(
                "text",
                {
                  staticStyle: _vm.$processStyle(undefined),
                  style: _vm.$processStyle(undefined),
                  on: {
                    click: function($event) {
                      _vm.change(2)
                    }
                  }
                },
                [_vm._v("企业用户")]
              )
            ]
          )
        ]
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass: "input",
          staticStyle: _vm.$processStyle(undefined),
          style: _vm.$processStyle(undefined)
        },
        [
          _c(
            "text",
            {
              staticClass: "inputText",
              staticStyle: _vm.$processStyle(undefined),
              style: _vm.$processStyle(undefined)
            },
            [_vm._v("手机号")]
          ),
          _vm._v(" "),
          _c(
            "div",
            {
              staticClass: "container",
              staticStyle: _vm.$processStyle(undefined),
              style: _vm.$processStyle(undefined)
            },
            [
              _c("input", {
                staticClass: "inputSty2",
                staticStyle: _vm.$processStyle(undefined),
                style: _vm.$processStyle(undefined),
                attrs: { type: "number", placeholder: "请输入手机号码" },
                on: { input: _vm.getPhone }
              }),
              _vm._v(" "),
              _vm.isTimerStop
                ? _c(
                    "text",
                    {
                      staticClass: "msgCodeBtnBlue",
                      staticStyle: _vm.$processStyle(undefined),
                      style: _vm.$processStyle(undefined),
                      on: { click: _vm.sendCode }
                    },
                    [_vm._v(_vm._s(_vm.msgCodeBtnText))]
                  )
                : _c(
                    "text",
                    {
                      staticClass: "msgCodeBtnGray",
                      staticStyle: _vm.$processStyle(undefined),
                      style: _vm.$processStyle(undefined),
                      on: { click: _vm.sendCode }
                    },
                    [_vm._v(_vm._s(_vm.msgCodeBtnText))]
                  )
            ]
          )
        ]
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass: "input",
          staticStyle: _vm.$processStyle(undefined),
          style: _vm.$processStyle(undefined)
        },
        [
          _c(
            "text",
            {
              staticClass: "inputText",
              staticStyle: _vm.$processStyle(undefined),
              style: _vm.$processStyle(undefined)
            },
            [_vm._v("验证码")]
          ),
          _vm._v(" "),
          _c(
            "div",
            {
              staticClass: "container",
              staticStyle: _vm.$processStyle(undefined),
              style: _vm.$processStyle(undefined)
            },
            [
              _c("input", {
                staticClass: "inputSty2",
                staticStyle: _vm.$processStyle(undefined),
                style: _vm.$processStyle(undefined),
                attrs: { type: "text", placeholder: "请输入手机验证码" },
                on: { input: _vm.getCode }
              })
            ]
          )
        ]
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass: "notice",
          staticStyle: _vm.$processStyle(undefined),
          style: _vm.$processStyle(undefined)
        },
        [
          _c(
            "text",
            {
              staticClass: "title",
              staticStyle: _vm.$processStyle(undefined),
              style: _vm.$processStyle(undefined)
            },
            [_vm._v("说明：手机号将当做登录账号")]
          )
        ]
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass: "btn",
          staticStyle: _vm.$processStyle(undefined),
          style: _vm.$processStyle(undefined),
          on: { click: _vm.toNext }
        },
        [
          _c(
            "text",
            {
              staticClass: "btntext",
              staticStyle: _vm.$processStyle(undefined),
              style: _vm.$processStyle(undefined)
            },
            [_vm._v("下一步")]
          )
        ]
      )
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-loader/node_modules/vue-hot-reload-api")      .rerender("data-v-3bb7ea12", esExports)
  }
}

/***/ }),
/* 43 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_script_index_0_LoginPwd_vue__ = __webpack_require__(12);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_7_1_vue_loader_lib_template_compiler_index_id_data_v_2b14e2e8_hasScoped_true_buble_transforms_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_template_index_0_LoginPwd_vue__ = __webpack_require__(46);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(44)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-2b14e2e8"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_script_index_0_LoginPwd_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_7_1_vue_loader_lib_template_compiler_index_id_data_v_2b14e2e8_hasScoped_true_buble_transforms_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_template_index_0_LoginPwd_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\views\\LoginPwd.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2b14e2e8", Component.options)
  } else {
    hotAPI.reload("data-v-2b14e2e8", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(45);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("95200dea", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/_css-loader@0.28.11@css-loader/index.js!../../node_modules/_vue-loader@13.7.1@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-2b14e2e8\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/_vue-loader@13.7.1@vue-loader/lib/selector.js?type=styles&index=0!./LoginPwd.vue", function() {
     var newContent = require("!!../../node_modules/_css-loader@0.28.11@css-loader/index.js!../../node_modules/_vue-loader@13.7.1@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-2b14e2e8\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/_vue-loader@13.7.1@vue-loader/lib/selector.js?type=styles&index=0!./LoginPwd.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n.Bg[data-v-2b14e2e8] {\n    background-color: #f4f5f9;\n    flex: 1;\n}\n.gap[data-v-2b14e2e8] {\n    height: 20px;\n    background-color: rgb(244, 245, 249);\n    margin-top: 120px;\n}\n.input[data-v-2b14e2e8] {\n    flex-direction: row;\n    justify-content: space-between;\n    align-items: center;\n    height: 90px;\n    width: 750px;\n    background-color: #fff;\n}\n.inputText[data-v-2b14e2e8] {\n    left: 31px;\n    font-size: 28px;\n    color: #333333;\n}\n.inputSty[data-v-2b14e2e8] {\n    width: 580px;\n    height: 90px;\n    color: #333333;\n    font-size: 28px;\n    border-bottom-color: rgb(229, 229, 229);\n    border-bottom-width: 1px;\n}\n.inputSty1[data-v-2b14e2e8] {\n    width: 580px;\n    height: 90px;\n    color: #333333;\n    font-size: 28px;\n    border-bottom-color: rgb(229, 229, 229);\n    border-bottom-width: 1px;\n}\n.btn[data-v-2b14e2e8] {\n   flex-direction: row;\n   align-content: center;\n   justify-content: center;\n}\n.btntext[data-v-2b14e2e8] {\n   margin-top: 50px;\n   margin-left: 20px;\n   margin-right: 20px;\n   background-color: #DD0011;\n   width: 200px;\n   color: #fff;\n   height: 60px;\n   padding-left: 60px;\n   padding-top: 14px;\n   font-size: 30px;\n}\n", ""]);

// exports


/***/ }),
/* 46 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "Bg",
      staticStyle: _vm.$processStyle(undefined),
      style: _vm.$processStyle(undefined)
    },
    [
      _c("title", {
        staticStyle: _vm.$processStyle(undefined),
        style: _vm.$processStyle(undefined),
        attrs: { title: _vm.Title, show: _vm.Show, bg: _vm.TitleBarBg }
      }),
      _vm._v(" "),
      _c("div", {
        staticClass: "gap",
        staticStyle: _vm.$processStyle(undefined),
        style: _vm.$processStyle(undefined)
      }),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass: "input",
          staticStyle: _vm.$processStyle(undefined),
          style: _vm.$processStyle(undefined)
        },
        [
          _c(
            "text",
            {
              staticClass: "inputText",
              staticStyle: _vm.$processStyle(undefined),
              style: _vm.$processStyle(undefined)
            },
            [_vm._v("设置密码")]
          ),
          _vm._v(" "),
          _c("input", {
            staticClass: "inputSty",
            staticStyle: _vm.$processStyle(undefined),
            style: _vm.$processStyle(undefined),
            attrs: { type: "password", placeholder: "请输入密码" },
            on: { input: _vm.getPwd }
          })
        ]
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass: "input",
          staticStyle: _vm.$processStyle(undefined),
          style: _vm.$processStyle(undefined)
        },
        [
          _c(
            "text",
            {
              staticClass: "inputText",
              staticStyle: _vm.$processStyle(undefined),
              style: _vm.$processStyle(undefined)
            },
            [_vm._v("确认密码")]
          ),
          _vm._v(" "),
          _c("input", {
            staticClass: "inputSty1",
            staticStyle: _vm.$processStyle(undefined),
            style: _vm.$processStyle(undefined),
            attrs: { type: "password", placeholder: "请再次输入密码" },
            on: { input: _vm.getPwdRepeat }
          })
        ]
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass: "btn",
          staticStyle: _vm.$processStyle(undefined),
          style: _vm.$processStyle(undefined)
        },
        [
          _c(
            "text",
            {
              staticClass: "btntext",
              staticStyle: _vm.$processStyle(undefined),
              style: _vm.$processStyle(undefined),
              on: { click: _vm.login }
            },
            [_vm._v("登录")]
          ),
          _vm._v(" "),
          _c(
            "text",
            {
              staticClass: "btntext",
              staticStyle: _vm.$processStyle(undefined),
              style: _vm.$processStyle(undefined),
              on: { click: _vm.identify }
            },
            [_vm._v("认证")]
          )
        ]
      )
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-loader/node_modules/vue-hot-reload-api")      .rerender("data-v-2b14e2e8", esExports)
  }
}

/***/ }),
/* 47 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_script_index_0_PeRegister_vue__ = __webpack_require__(13);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_7_1_vue_loader_lib_template_compiler_index_id_data_v_58ad72e8_hasScoped_true_buble_transforms_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_template_index_0_PeRegister_vue__ = __webpack_require__(50);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(48)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-58ad72e8"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_script_index_0_PeRegister_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_7_1_vue_loader_lib_template_compiler_index_id_data_v_58ad72e8_hasScoped_true_buble_transforms_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_template_index_0_PeRegister_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\views\\PeRegister.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-58ad72e8", Component.options)
  } else {
    hotAPI.reload("data-v-58ad72e8", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(49);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("5f8d06a8", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/_css-loader@0.28.11@css-loader/index.js!../../node_modules/_vue-loader@13.7.1@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-58ad72e8\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/_vue-loader@13.7.1@vue-loader/lib/selector.js?type=styles&index=0!./PeRegister.vue", function() {
     var newContent = require("!!../../node_modules/_css-loader@0.28.11@css-loader/index.js!../../node_modules/_vue-loader@13.7.1@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-58ad72e8\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/_vue-loader@13.7.1@vue-loader/lib/selector.js?type=styles&index=0!./PeRegister.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n.Bg[data-v-58ad72e8] {\n    background-color: #f4f5f9;\n    flex: 1;\n}\n.gap[data-v-58ad72e8] {\n    height: 20px;\n    background-color: rgb(244, 245, 249);\n    margin-top: 120px;\n}\n.input[data-v-58ad72e8] {\n    flex-direction: row;\n    justify-content: space-between;\n    align-items: center;\n    height: 90px;\n    width: 750px;\n    background-color: #fff;\n    margin-bottom: 15px;\n}\n.inputText[data-v-58ad72e8] {\n    left: 31px;\n    font-size: 28px;\n    color: #333333;\n}\n.inputSty[data-v-58ad72e8] {\n    width: 580px;\n    height: 90px;\n    color: #333333;\n    font-size: 28px;\n    border-bottom-color: rgb(229, 229, 229);\n    border-bottom-width: 1px;\n}\n.inputSty1[data-v-58ad72e8] {\n    width: 580px;\n    height: 90px;\n    color: #333333;\n    font-size: 28px;\n    border-bottom-color: rgb(229, 229, 229);\n    border-bottom-width: 1px;\n}\n.IDScanContainer[data-v-58ad72e8] {\n    flex-direction: column;\n    align-items: center;\n}\n.IDImage[data-v-58ad72e8] {\n    width: 600px;\n    height: 360px;\n    border-radius: 10px;\n    background-color: #fff;\n    border-width: 3px;\n    border-color: #e5e5e5;\n}\n.scanbtn[data-v-58ad72e8] {\n    width: 320px;\n    height: 70px;\n    align-items: center;\n    justify-content: center;\n    margin-top: 30px;\n    margin-bottom: 35px;\n}\n.scanbtntext[data-v-58ad72e8]{\n    align-items: center;\n    font-size: 28px;\n    color: #333333;\n}\n.btn[data-v-58ad72e8] {\n    margin-top: 50px;\n    margin-bottom: 50px;\n    width: 650px;\n    height: 90px;\n    margin-left: 50px;\n    justify-content: center;\n    background-color: #e3392f;\n}\n.btntext[data-v-58ad72e8] {\n    color: #fff;\n    font-size: 34px;\n    text-align: center;\n}\n", ""]);

// exports


/***/ }),
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "Bg",
      staticStyle: _vm.$processStyle(undefined),
      style: _vm.$processStyle(undefined)
    },
    [
      _c("title", {
        staticStyle: _vm.$processStyle(undefined),
        style: _vm.$processStyle(undefined),
        attrs: { title: _vm.Title, show: _vm.Show, bg: _vm.TitleBarBg }
      }),
      _vm._v(" "),
      _c("scroller", [
        _c("div", {
          staticClass: "gap",
          staticStyle: _vm.$processStyle(undefined),
          style: _vm.$processStyle(undefined)
        }),
        _vm._v(" "),
        _c(
          "div",
          {
            staticClass: "input",
            staticStyle: _vm.$processStyle(undefined),
            style: _vm.$processStyle(undefined)
          },
          [
            _c(
              "text",
              {
                staticClass: "inputText",
                staticStyle: _vm.$processStyle(undefined),
                style: _vm.$processStyle(undefined)
              },
              [_vm._v("姓名")]
            ),
            _vm._v(" "),
            _c("input", {
              staticClass: "inputSty",
              staticStyle: _vm.$processStyle(undefined),
              style: _vm.$processStyle(undefined),
              attrs: { type: "text", placeholder: "请输入您的姓名" },
              on: { input: _vm.getName }
            })
          ]
        ),
        _vm._v(" "),
        _c(
          "div",
          {
            staticClass: "input",
            staticStyle: _vm.$processStyle(undefined),
            style: _vm.$processStyle(undefined)
          },
          [
            _c(
              "text",
              {
                staticClass: "inputText",
                staticStyle: _vm.$processStyle(undefined),
                style: _vm.$processStyle(undefined)
              },
              [_vm._v("身份证号")]
            ),
            _vm._v(" "),
            _c("input", {
              staticClass: "inputSty1",
              staticStyle: _vm.$processStyle(undefined),
              style: _vm.$processStyle(undefined),
              attrs: { type: "text", placeholder: "请输入您的身份证号码" },
              on: { input: _vm.getIdNumber }
            })
          ]
        ),
        _vm._v(" "),
        _c(
          "div",
          {
            staticClass: "IDScanContainer",
            staticStyle: _vm.$processStyle(undefined),
            style: _vm.$processStyle(undefined)
          },
          [
            _c("image", {
              staticClass: "IDImage",
              staticStyle: _vm.$processStyle(undefined),
              style: _vm.$processStyle(undefined),
              attrs: { src: _vm.IDFrontURL }
            }),
            _vm._v(" "),
            _c(
              "div",
              {
                staticClass: "scanbtn",
                staticStyle: _vm.$processStyle(undefined),
                style: _vm.$processStyle(undefined)
              },
              [
                _c(
                  "text",
                  {
                    staticClass: "scanbtntext",
                    staticStyle: _vm.$processStyle(undefined),
                    style: _vm.$processStyle(undefined)
                  },
                  [_vm._v("上传身份证正面照片")]
                )
              ]
            ),
            _vm._v(" "),
            _c("image", {
              staticClass: "IDImage",
              staticStyle: _vm.$processStyle(undefined),
              style: _vm.$processStyle(undefined),
              attrs: { src: _vm.IDReverseURL }
            }),
            _vm._v(" "),
            _c(
              "div",
              {
                staticClass: "scanbtn",
                staticStyle: _vm.$processStyle(undefined),
                style: _vm.$processStyle(undefined)
              },
              [
                _c(
                  "text",
                  {
                    staticClass: "scanbtntext",
                    staticStyle: _vm.$processStyle(undefined),
                    style: _vm.$processStyle(undefined)
                  },
                  [_vm._v("上传身份证背面照片")]
                )
              ]
            ),
            _vm._v(" "),
            _c("image", {
              staticClass: "IDImage",
              staticStyle: _vm.$processStyle(undefined),
              style: _vm.$processStyle(undefined),
              attrs: { src: _vm.IDshouchiURL }
            }),
            _vm._v(" "),
            _c(
              "div",
              {
                staticClass: "scanbtn",
                staticStyle: _vm.$processStyle(undefined),
                style: _vm.$processStyle(undefined)
              },
              [
                _c(
                  "text",
                  {
                    staticClass: "scanbtntext",
                    staticStyle: _vm.$processStyle(undefined),
                    style: _vm.$processStyle(undefined)
                  },
                  [_vm._v("上传手持身份证照片")]
                )
              ]
            )
          ]
        ),
        _vm._v(" "),
        _c(
          "div",
          {
            staticClass: "btn",
            staticStyle: _vm.$processStyle(undefined),
            style: _vm.$processStyle(undefined),
            on: { click: _vm.toNext }
          },
          [
            _c(
              "text",
              {
                staticClass: "btntext",
                staticStyle: _vm.$processStyle(undefined),
                style: _vm.$processStyle(undefined)
              },
              [_vm._v("提交")]
            )
          ]
        )
      ])
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-loader/node_modules/vue-hot-reload-api")      .rerender("data-v-58ad72e8", esExports)
  }
}

/***/ }),
/* 51 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_script_index_0_EnterRegister_vue__ = __webpack_require__(14);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_7_1_vue_loader_lib_template_compiler_index_id_data_v_8a59be12_hasScoped_true_buble_transforms_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_template_index_0_EnterRegister_vue__ = __webpack_require__(54);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(52)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-8a59be12"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_script_index_0_EnterRegister_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_7_1_vue_loader_lib_template_compiler_index_id_data_v_8a59be12_hasScoped_true_buble_transforms_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_template_index_0_EnterRegister_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\views\\EnterRegister.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-8a59be12", Component.options)
  } else {
    hotAPI.reload("data-v-8a59be12", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(53);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("002b109f", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/_css-loader@0.28.11@css-loader/index.js!../../node_modules/_vue-loader@13.7.1@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-8a59be12\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/_vue-loader@13.7.1@vue-loader/lib/selector.js?type=styles&index=0!./EnterRegister.vue", function() {
     var newContent = require("!!../../node_modules/_css-loader@0.28.11@css-loader/index.js!../../node_modules/_vue-loader@13.7.1@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-8a59be12\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/_vue-loader@13.7.1@vue-loader/lib/selector.js?type=styles&index=0!./EnterRegister.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n.Bg[data-v-8a59be12] {\n    background-color: #f4f5f9;\n    flex: 1;\n}\n.gap[data-v-8a59be12] {\n    height: 20px;\n    background-color: rgb(244, 245, 249);\n    margin-top: 120px;\n}\n.input[data-v-8a59be12] {\n    flex-direction: row;\n    justify-content: space-between;\n    align-items: center;\n    height: 90px;\n    width: 750px;\n    background-color: #fff;\n    margin-bottom: 15px;\n}\n.inputText[data-v-8a59be12] {\n    left: 30px;\n    font-size: 28px;\n    color: #333333;\n}\n.inputSty[data-v-8a59be12] {\n    width: 580px;\n    height: 90px;\n    color: #333333;\n    font-size: 28px;\n    border-bottom-color: rgb(229, 229, 229);\n    border-bottom-width: 1px;\n}\n.inputSty1[data-v-8a59be12] {\n    width: 580px;\n    height: 90px;\n    color: #333333;\n    font-size: 28px;\n    border-bottom-color: rgb(229, 229, 229);\n    border-bottom-width: 1px;\n}\n.IDScanContainer[data-v-8a59be12] {\n    flex-direction: column;\n    align-items: center;\n}\n.IDImage[data-v-8a59be12] {\n    width: 600px;\n    height: 360px;\n    border-radius: 10px;\n    background-color: #fff;\n    border-width: 3px;\n    border-color: #e5e5e5;\n}\n.scanbtn[data-v-8a59be12] {\n    width: 320px;\n    height: 70px;\n    align-items: center;\n    justify-content: center;\n    margin-top: 30px;\n    margin-bottom: 35px;\n}\n.scanbtntext[data-v-8a59be12]{\n    align-items: center;\n    font-size: 28px;\n    color: #333333;\n}\n.btn[data-v-8a59be12] {\n    margin-top: 50px;\n    margin-bottom: 50px;\n    width: 650px;\n    height: 90px;\n    margin-left: 50px;\n    justify-content: center;\n    background-color: #e3392f;\n}\n.btntext[data-v-8a59be12] {\n    color: #fff;\n    font-size: 34px;\n    text-align: center;\n}\n", ""]);

// exports


/***/ }),
/* 54 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "Bg",
      staticStyle: _vm.$processStyle(undefined),
      style: _vm.$processStyle(undefined)
    },
    [
      _c("title", {
        staticStyle: _vm.$processStyle(undefined),
        style: _vm.$processStyle(undefined),
        attrs: { title: _vm.Title, show: _vm.Show, bg: _vm.TitleBarBg }
      }),
      _vm._v(" "),
      _c("scroller", [
        _c("div", {
          staticClass: "gap",
          staticStyle: _vm.$processStyle(undefined),
          style: _vm.$processStyle(undefined)
        }),
        _vm._v(" "),
        _c(
          "div",
          {
            staticClass: "input",
            staticStyle: _vm.$processStyle(undefined),
            style: _vm.$processStyle(undefined)
          },
          [
            _c(
              "text",
              {
                staticClass: "inputText",
                staticStyle: _vm.$processStyle(undefined),
                style: _vm.$processStyle(undefined)
              },
              [_vm._v("企业名称")]
            ),
            _vm._v(" "),
            _c("input", {
              staticClass: "inputSty",
              staticStyle: _vm.$processStyle(undefined),
              style: _vm.$processStyle(undefined),
              attrs: { type: "text", placeholder: "请输入企业名称" },
              on: { input: _vm.getCompanyName }
            })
          ]
        ),
        _vm._v(" "),
        _c(
          "div",
          {
            staticClass: "input",
            staticStyle: _vm.$processStyle(undefined),
            style: _vm.$processStyle(undefined)
          },
          [
            _c(
              "text",
              {
                staticClass: "inputText",
                staticStyle: _vm.$processStyle(undefined),
                style: _vm.$processStyle(undefined)
              },
              [_vm._v("证件号码")]
            ),
            _vm._v(" "),
            _c("input", {
              staticClass: "inputSty1",
              staticStyle: _vm.$processStyle(undefined),
              style: _vm.$processStyle(undefined),
              attrs: { type: "text", placeholder: "请输入证件号码" },
              on: { input: _vm.getCompanyCode }
            })
          ]
        ),
        _vm._v(" "),
        _c(
          "div",
          {
            staticClass: "IDScanContainer",
            staticStyle: _vm.$processStyle(undefined),
            style: _vm.$processStyle(undefined)
          },
          [
            _c("image", {
              staticClass: "IDImage",
              staticStyle: _vm.$processStyle(undefined),
              style: _vm.$processStyle(undefined),
              attrs: { src: _vm.IDEnterURL }
            }),
            _vm._v(" "),
            _c(
              "div",
              {
                staticClass: "scanbtn",
                staticStyle: _vm.$processStyle(undefined),
                style: _vm.$processStyle(undefined)
              },
              [
                _c(
                  "text",
                  {
                    staticClass: "scanbtntext",
                    staticStyle: _vm.$processStyle(undefined),
                    style: _vm.$processStyle(undefined)
                  },
                  [_vm._v("上传手持身份证照片")]
                )
              ]
            )
          ]
        ),
        _vm._v(" "),
        _c(
          "div",
          {
            staticClass: "btn",
            staticStyle: _vm.$processStyle(undefined),
            style: _vm.$processStyle(undefined),
            on: { click: _vm.toNext }
          },
          [
            _c(
              "text",
              {
                staticClass: "btntext",
                staticStyle: _vm.$processStyle(undefined),
                style: _vm.$processStyle(undefined)
              },
              [_vm._v("提交")]
            )
          ]
        )
      ])
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-loader/node_modules/vue-hot-reload-api")      .rerender("data-v-8a59be12", esExports)
  }
}

/***/ }),
/* 55 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_script_index_0_FingerprintLogin_vue__ = __webpack_require__(15);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_7_1_vue_loader_lib_template_compiler_index_id_data_v_8d04178e_hasScoped_true_buble_transforms_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_template_index_0_FingerprintLogin_vue__ = __webpack_require__(58);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(56)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-8d04178e"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_script_index_0_FingerprintLogin_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_7_1_vue_loader_lib_template_compiler_index_id_data_v_8d04178e_hasScoped_true_buble_transforms_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_template_index_0_FingerprintLogin_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\views\\FingerprintLogin.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-8d04178e", Component.options)
  } else {
    hotAPI.reload("data-v-8d04178e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(57);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("b436a20a", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/_css-loader@0.28.11@css-loader/index.js!../../node_modules/_vue-loader@13.7.1@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-8d04178e\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/_vue-loader@13.7.1@vue-loader/lib/selector.js?type=styles&index=0!./FingerprintLogin.vue", function() {
     var newContent = require("!!../../node_modules/_css-loader@0.28.11@css-loader/index.js!../../node_modules/_vue-loader@13.7.1@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-8d04178e\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/_vue-loader@13.7.1@vue-loader/lib/selector.js?type=styles&index=0!./FingerprintLogin.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n.portrait[data-v-8d04178e]{\n    width: 176px;\n    height: 176px;\n    margin: 195px 287px 0 287px;\n}\n.name[data-v-8d04178e]{\n    font-family: 'PingFangSC-Regular';\n    font-size: 30px;\n    color: #333333;\n    line-height: 42px;\n    margin-top: 20px;\n    text-align: center;\n}\n.prompt[data-v-8d04178e]{\n    font-family: 'PingFangSC-Regular';\n    font-size: 30px;\n    color: #666666;\n    margin-top: 64px;\n    text-align: center;\n    line-height: 42px;\n}\n.active-box[data-v-8d04178e] {\n  width: 750px;\n  /* height: 200px; */\n  justify-content: center;\n  align-items: center;\n}\n.container[data-v-8d04178e] {\n      \n      align-items: center;\n      flex-direction: column;\n      background-color: white;\n}\n.phoneNum[data-v-8d04178e] {\n    width: 460px;\n    height: 70px;\n    top: -35px;\n    border-radius: 35px;\n    text-align: center;\n    background-color: white;\n    padding-top: 15px;\n    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.281);\n}\n.fingerprintImage[data-v-8d04178e] {\n    top: 100px;\n    width: 125px;\n    height: 125px;\n}\n.fingerprintText[data-v-8d04178e] {\n    top: 150px;\n}\n.selectButon[data-v-8d04178e] {\n    top: 300px;\n    font-size: 30px;\n    color:#59b4f9;\n    /* width: 300; */\n}\n   \n", ""]);

// exports


/***/ }),
/* 58 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _c("title", {
      staticStyle: _vm.$processStyle(undefined),
      style: _vm.$processStyle(undefined),
      attrs: { title: _vm.Title, show: _vm.Show, bg: _vm.bg }
    }),
    _vm._v(" "),
    _c("image", {
      staticClass: "portrait",
      staticStyle: _vm.$processStyle(undefined),
      style: _vm.$processStyle(undefined),
      attrs: { src: _vm.portraitUrl, alt: "" }
    }),
    _vm._v(" "),
    _c(
      "text",
      {
        staticClass: "name",
        staticStyle: _vm.$processStyle(undefined),
        style: _vm.$processStyle(undefined)
      },
      [_vm._v("钱多多，您好")]
    ),
    _vm._v(" "),
    _c(
      "div",
      {
        staticClass: "container",
        staticStyle: _vm.$processStyle(undefined),
        style: _vm.$processStyle(undefined)
      },
      [
        _c("image", {
          staticClass: "fingerprintImage",
          staticStyle: _vm.$processStyle(undefined),
          style: _vm.$processStyle(undefined),
          attrs: { src: _vm.fingerprintImageurl },
          on: { click: _vm.fingerprintAction }
        }),
        _vm._v(" "),
        _c(
          "text",
          {
            staticClass: "fingerprintText",
            staticStyle: _vm.$processStyle(undefined),
            style: _vm.$processStyle(undefined)
          },
          [_vm._v("点击进行指纹登录")]
        ),
        _vm._v(" "),
        _c(
          "text",
          {
            staticClass: "selectButon",
            staticStyle: _vm.$processStyle(undefined),
            style: _vm.$processStyle(undefined),
            on: { click: _vm.selectButonAction }
          },
          [_vm._v("更多登录▼")]
        )
      ]
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-loader/node_modules/vue-hot-reload-api")      .rerender("data-v-8d04178e", esExports)
  }
}

/***/ }),
/* 59 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_script_index_0_GesturesLogin_vue__ = __webpack_require__(16);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_7_1_vue_loader_lib_template_compiler_index_id_data_v_70fd3e9b_hasScoped_true_buble_transforms_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_template_index_0_GesturesLogin_vue__ = __webpack_require__(62);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(60)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-70fd3e9b"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_script_index_0_GesturesLogin_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_7_1_vue_loader_lib_template_compiler_index_id_data_v_70fd3e9b_hasScoped_true_buble_transforms_node_modules_vue_loader_13_7_1_vue_loader_lib_selector_type_template_index_0_GesturesLogin_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\views\\GesturesLogin.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-70fd3e9b", Component.options)
  } else {
    hotAPI.reload("data-v-70fd3e9b", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(61);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("1de43730", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/_css-loader@0.28.11@css-loader/index.js!../../node_modules/_vue-loader@13.7.1@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-70fd3e9b\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/_vue-loader@13.7.1@vue-loader/lib/selector.js?type=styles&index=0!./GesturesLogin.vue", function() {
     var newContent = require("!!../../node_modules/_css-loader@0.28.11@css-loader/index.js!../../node_modules/_vue-loader@13.7.1@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-70fd3e9b\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/_vue-loader@13.7.1@vue-loader/lib/selector.js?type=styles&index=0!./GesturesLogin.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n.Bg[data-v-70fd3e9b] {\n    flex:1;\n}\n.portrait[data-v-70fd3e9b]{\n    width: 176px;\n    height: 176px;\n    margin: 195px 287px 0 287px;\n}\n.name[data-v-70fd3e9b]{\n    font-family: 'PingFangSC-Regular';\n    font-size: 30px;\n    color: #333333;\n    line-height: 42px;\n    margin-top: 20px;\n    text-align: center;\n}\n.prompt[data-v-70fd3e9b]{\n    font-family: 'PingFangSC-Regular';\n    font-size: 30px;\n    color: #666666;\n    margin-top: 64px;\n    text-align: center;\n    line-height: 42px;\n}\n.default-box[data-v-70fd3e9b] {\n  width: 750px;\n  margin-top: 20px;\n  justify-content: center;\n  align-items: center;\n  background-color: skyblue;\n}\n.default[data-v-70fd3e9b] {\n  width: 250px;\n  height: 250px;\n}\n.active-box[data-v-70fd3e9b] {\n  width: 750px;\n  margin-top: 54px;\n  justify-content: center;\n  align-items: center;\n}\n.active[data-v-70fd3e9b] {\n  width: 600px;\n  height: 600px;\n}\n.bottom[data-v-70fd3e9b]{\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  font-family: 'PingFangSC-Regular';\n  font-size: 28px;\n  color: #333333;\n  line-height: 40px;\n  margin-top: 79px;\n  margin-bottom: 37px;\n}\n.forget[data-v-70fd3e9b]{\n  margin-left: 31px;\n}\n.tab[data-v-70fd3e9b]{\n  margin-right: 30px;\n}\n", ""]);

// exports


/***/ }),
/* 62 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _c("title", {
      staticStyle: _vm.$processStyle(undefined),
      style: _vm.$processStyle(undefined),
      attrs: { title: _vm.Title, show: _vm.Show, bg: _vm.bg }
    }),
    _vm._v(" "),
    _c("image", {
      staticClass: "portrait",
      staticStyle: _vm.$processStyle(undefined),
      style: _vm.$processStyle(undefined),
      attrs: { src: _vm.portraitUrl, alt: "" }
    }),
    _vm._v(" "),
    _c(
      "text",
      {
        staticClass: "name",
        staticStyle: _vm.$processStyle(undefined),
        style: _vm.$processStyle(undefined)
      },
      [_vm._v("钱多多，您好")]
    ),
    _vm._v(" "),
    _c(
      "text",
      {
        staticClass: "prompt",
        staticStyle: _vm.$processStyle(undefined),
        style: _vm.$processStyle(undefined)
      },
      [_vm._v("请输入手势密码")]
    ),
    _vm._v(" "),
    _c(
      "div",
      {
        staticClass: "active-box",
        staticStyle: _vm.$processStyle(undefined),
        style: _vm.$processStyle(undefined)
      },
      [
        _c("weex-lockview", {
          ref: "lockview",
          staticClass: "active",
          staticStyle: _vm.$processStyle(undefined),
          style: _vm.$processStyle(undefined),
          attrs: {
            lineWidth: "8",
            normalColor: "#FFE0E0",
            selectColor: "#DF0314",
            errorColor: "#F84646",
            ratio: "0.6"
          },
          on: { onComplete: _vm.onComplete }
        })
      ],
      1
    ),
    _vm._v(" "),
    _c(
      "div",
      {
        staticClass: "bottom",
        staticStyle: _vm.$processStyle(undefined),
        style: _vm.$processStyle(undefined)
      },
      [
        _c(
          "text",
          {
            staticClass: "forget",
            staticStyle: _vm.$processStyle(undefined),
            style: _vm.$processStyle(undefined)
          },
          [_vm._v("忘记手势密码？")]
        ),
        _vm._v(" "),
        _c(
          "text",
          {
            staticClass: "tab",
            staticStyle: _vm.$processStyle(undefined),
            style: _vm.$processStyle(undefined)
          },
          [_vm._v("切换账号")]
        )
      ]
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-loader/node_modules/vue-hot-reload-api")      .rerender("data-v-70fd3e9b", esExports)
  }
}

/***/ }),
/* 63 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vuex__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__actions__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mutations__ = __webpack_require__(66);
// import Vue from 'vue'




// Vuex is auto installed on the web
if (WXEnvironment.platform !== 'Web') {
    Vue.use(__WEBPACK_IMPORTED_MODULE_0_vuex__["a" /* default */]);
}

const store = new __WEBPACK_IMPORTED_MODULE_0_vuex__["a" /* default */].Store({
    actions: __WEBPACK_IMPORTED_MODULE_1__actions__,
    mutations: __WEBPACK_IMPORTED_MODULE_2__mutations__,

    state: {
        jsonBaseUrl: "./json/",
        imgBaseUrl: "./imgs/",
        htmlBaseUrl: "./htmls/"
    },

    getters: {}
});

/* harmony default export */ __webpack_exports__["a"] = (store);

/***/ }),
/* 64 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/* unused harmony export Store */
/* unused harmony export install */
/* unused harmony export mapState */
/* unused harmony export mapMutations */
/* unused harmony export mapGetters */
/* unused harmony export mapActions */
/* unused harmony export createNamespacedHelpers */
/**
 * vuex v3.0.1
 * (c) 2017 Evan You
 * @license MIT
 */
var applyMixin = function (Vue) {
  var version = Number(Vue.version.split('.')[0]);

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit });
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    var _init = Vue.prototype._init;
    Vue.prototype._init = function (options) {
      if ( options === void 0 ) options = {};

      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit;
      _init.call(this, options);
    };
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    var options = this.$options;
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store;
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store;
    }
  }
};

var devtoolHook =
  typeof window !== 'undefined' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

function devtoolPlugin (store) {
  if (!devtoolHook) { return }

  store._devtoolHook = devtoolHook;

  devtoolHook.emit('vuex:init', store);

  devtoolHook.on('vuex:travel-to-state', function (targetState) {
    store.replaceState(targetState);
  });

  store.subscribe(function (mutation, state) {
    devtoolHook.emit('vuex:mutation', mutation, state);
  });
}

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */


/**
 * forEach for object
 */
function forEachValue (obj, fn) {
  Object.keys(obj).forEach(function (key) { return fn(obj[key], key); });
}

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

function isPromise (val) {
  return val && typeof val.then === 'function'
}

function assert (condition, msg) {
  if (!condition) { throw new Error(("[vuex] " + msg)) }
}

var Module = function Module (rawModule, runtime) {
  this.runtime = runtime;
  this._children = Object.create(null);
  this._rawModule = rawModule;
  var rawState = rawModule.state;
  this.state = (typeof rawState === 'function' ? rawState() : rawState) || {};
};

var prototypeAccessors$1 = { namespaced: { configurable: true } };

prototypeAccessors$1.namespaced.get = function () {
  return !!this._rawModule.namespaced
};

Module.prototype.addChild = function addChild (key, module) {
  this._children[key] = module;
};

Module.prototype.removeChild = function removeChild (key) {
  delete this._children[key];
};

Module.prototype.getChild = function getChild (key) {
  return this._children[key]
};

Module.prototype.update = function update (rawModule) {
  this._rawModule.namespaced = rawModule.namespaced;
  if (rawModule.actions) {
    this._rawModule.actions = rawModule.actions;
  }
  if (rawModule.mutations) {
    this._rawModule.mutations = rawModule.mutations;
  }
  if (rawModule.getters) {
    this._rawModule.getters = rawModule.getters;
  }
};

Module.prototype.forEachChild = function forEachChild (fn) {
  forEachValue(this._children, fn);
};

Module.prototype.forEachGetter = function forEachGetter (fn) {
  if (this._rawModule.getters) {
    forEachValue(this._rawModule.getters, fn);
  }
};

Module.prototype.forEachAction = function forEachAction (fn) {
  if (this._rawModule.actions) {
    forEachValue(this._rawModule.actions, fn);
  }
};

Module.prototype.forEachMutation = function forEachMutation (fn) {
  if (this._rawModule.mutations) {
    forEachValue(this._rawModule.mutations, fn);
  }
};

Object.defineProperties( Module.prototype, prototypeAccessors$1 );

var ModuleCollection = function ModuleCollection (rawRootModule) {
  // register root module (Vuex.Store options)
  this.register([], rawRootModule, false);
};

ModuleCollection.prototype.get = function get (path) {
  return path.reduce(function (module, key) {
    return module.getChild(key)
  }, this.root)
};

ModuleCollection.prototype.getNamespace = function getNamespace (path) {
  var module = this.root;
  return path.reduce(function (namespace, key) {
    module = module.getChild(key);
    return namespace + (module.namespaced ? key + '/' : '')
  }, '')
};

ModuleCollection.prototype.update = function update$1 (rawRootModule) {
  update([], this.root, rawRootModule);
};

ModuleCollection.prototype.register = function register (path, rawModule, runtime) {
    var this$1 = this;
    if ( runtime === void 0 ) runtime = true;

  if (process.env.NODE_ENV !== 'production') {
    assertRawModule(path, rawModule);
  }

  var newModule = new Module(rawModule, runtime);
  if (path.length === 0) {
    this.root = newModule;
  } else {
    var parent = this.get(path.slice(0, -1));
    parent.addChild(path[path.length - 1], newModule);
  }

  // register nested modules
  if (rawModule.modules) {
    forEachValue(rawModule.modules, function (rawChildModule, key) {
      this$1.register(path.concat(key), rawChildModule, runtime);
    });
  }
};

ModuleCollection.prototype.unregister = function unregister (path) {
  var parent = this.get(path.slice(0, -1));
  var key = path[path.length - 1];
  if (!parent.getChild(key).runtime) { return }

  parent.removeChild(key);
};

function update (path, targetModule, newModule) {
  if (process.env.NODE_ENV !== 'production') {
    assertRawModule(path, newModule);
  }

  // update target module
  targetModule.update(newModule);

  // update nested modules
  if (newModule.modules) {
    for (var key in newModule.modules) {
      if (!targetModule.getChild(key)) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(
            "[vuex] trying to add a new module '" + key + "' on hot reloading, " +
            'manual reload is needed'
          );
        }
        return
      }
      update(
        path.concat(key),
        targetModule.getChild(key),
        newModule.modules[key]
      );
    }
  }
}

var functionAssert = {
  assert: function (value) { return typeof value === 'function'; },
  expected: 'function'
};

var objectAssert = {
  assert: function (value) { return typeof value === 'function' ||
    (typeof value === 'object' && typeof value.handler === 'function'); },
  expected: 'function or object with "handler" function'
};

var assertTypes = {
  getters: functionAssert,
  mutations: functionAssert,
  actions: objectAssert
};

function assertRawModule (path, rawModule) {
  Object.keys(assertTypes).forEach(function (key) {
    if (!rawModule[key]) { return }

    var assertOptions = assertTypes[key];

    forEachValue(rawModule[key], function (value, type) {
      assert(
        assertOptions.assert(value),
        makeAssertionMessage(path, key, type, value, assertOptions.expected)
      );
    });
  });
}

function makeAssertionMessage (path, key, type, value, expected) {
  var buf = key + " should be " + expected + " but \"" + key + "." + type + "\"";
  if (path.length > 0) {
    buf += " in module \"" + (path.join('.')) + "\"";
  }
  buf += " is " + (JSON.stringify(value)) + ".";
  return buf
}

var Vue; // bind on install

var Store = function Store (options) {
  var this$1 = this;
  if ( options === void 0 ) options = {};

  // Auto install if it is not done yet and `window` has `Vue`.
  // To allow users to avoid auto-installation in some cases,
  // this code should be placed here. See #731
  if (!Vue && typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
  }

  if (process.env.NODE_ENV !== 'production') {
    assert(Vue, "must call Vue.use(Vuex) before creating a store instance.");
    assert(typeof Promise !== 'undefined', "vuex requires a Promise polyfill in this browser.");
    assert(this instanceof Store, "Store must be called with the new operator.");
  }

  var plugins = options.plugins; if ( plugins === void 0 ) plugins = [];
  var strict = options.strict; if ( strict === void 0 ) strict = false;

  var state = options.state; if ( state === void 0 ) state = {};
  if (typeof state === 'function') {
    state = state() || {};
  }

  // store internal state
  this._committing = false;
  this._actions = Object.create(null);
  this._actionSubscribers = [];
  this._mutations = Object.create(null);
  this._wrappedGetters = Object.create(null);
  this._modules = new ModuleCollection(options);
  this._modulesNamespaceMap = Object.create(null);
  this._subscribers = [];
  this._watcherVM = new Vue();

  // bind commit and dispatch to self
  var store = this;
  var ref = this;
  var dispatch = ref.dispatch;
  var commit = ref.commit;
  this.dispatch = function boundDispatch (type, payload) {
    return dispatch.call(store, type, payload)
  };
  this.commit = function boundCommit (type, payload, options) {
    return commit.call(store, type, payload, options)
  };

  // strict mode
  this.strict = strict;

  // init root module.
  // this also recursively registers all sub-modules
  // and collects all module getters inside this._wrappedGetters
  installModule(this, state, [], this._modules.root);

  // initialize the store vm, which is responsible for the reactivity
  // (also registers _wrappedGetters as computed properties)
  resetStoreVM(this, state);

  // apply plugins
  plugins.forEach(function (plugin) { return plugin(this$1); });

  if (Vue.config.devtools) {
    devtoolPlugin(this);
  }
};

var prototypeAccessors = { state: { configurable: true } };

prototypeAccessors.state.get = function () {
  return this._vm._data.$$state
};

prototypeAccessors.state.set = function (v) {
  if (process.env.NODE_ENV !== 'production') {
    assert(false, "Use store.replaceState() to explicit replace store state.");
  }
};

Store.prototype.commit = function commit (_type, _payload, _options) {
    var this$1 = this;

  // check object-style commit
  var ref = unifyObjectStyle(_type, _payload, _options);
    var type = ref.type;
    var payload = ref.payload;
    var options = ref.options;

  var mutation = { type: type, payload: payload };
  var entry = this._mutations[type];
  if (!entry) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(("[vuex] unknown mutation type: " + type));
    }
    return
  }
  this._withCommit(function () {
    entry.forEach(function commitIterator (handler) {
      handler(payload);
    });
  });
  this._subscribers.forEach(function (sub) { return sub(mutation, this$1.state); });

  if (
    process.env.NODE_ENV !== 'production' &&
    options && options.silent
  ) {
    console.warn(
      "[vuex] mutation type: " + type + ". Silent option has been removed. " +
      'Use the filter functionality in the vue-devtools'
    );
  }
};

Store.prototype.dispatch = function dispatch (_type, _payload) {
    var this$1 = this;

  // check object-style dispatch
  var ref = unifyObjectStyle(_type, _payload);
    var type = ref.type;
    var payload = ref.payload;

  var action = { type: type, payload: payload };
  var entry = this._actions[type];
  if (!entry) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(("[vuex] unknown action type: " + type));
    }
    return
  }

  this._actionSubscribers.forEach(function (sub) { return sub(action, this$1.state); });

  return entry.length > 1
    ? Promise.all(entry.map(function (handler) { return handler(payload); }))
    : entry[0](payload)
};

Store.prototype.subscribe = function subscribe (fn) {
  return genericSubscribe(fn, this._subscribers)
};

Store.prototype.subscribeAction = function subscribeAction (fn) {
  return genericSubscribe(fn, this._actionSubscribers)
};

Store.prototype.watch = function watch (getter, cb, options) {
    var this$1 = this;

  if (process.env.NODE_ENV !== 'production') {
    assert(typeof getter === 'function', "store.watch only accepts a function.");
  }
  return this._watcherVM.$watch(function () { return getter(this$1.state, this$1.getters); }, cb, options)
};

Store.prototype.replaceState = function replaceState (state) {
    var this$1 = this;

  this._withCommit(function () {
    this$1._vm._data.$$state = state;
  });
};

Store.prototype.registerModule = function registerModule (path, rawModule, options) {
    if ( options === void 0 ) options = {};

  if (typeof path === 'string') { path = [path]; }

  if (process.env.NODE_ENV !== 'production') {
    assert(Array.isArray(path), "module path must be a string or an Array.");
    assert(path.length > 0, 'cannot register the root module by using registerModule.');
  }

  this._modules.register(path, rawModule);
  installModule(this, this.state, path, this._modules.get(path), options.preserveState);
  // reset store to update getters...
  resetStoreVM(this, this.state);
};

Store.prototype.unregisterModule = function unregisterModule (path) {
    var this$1 = this;

  if (typeof path === 'string') { path = [path]; }

  if (process.env.NODE_ENV !== 'production') {
    assert(Array.isArray(path), "module path must be a string or an Array.");
  }

  this._modules.unregister(path);
  this._withCommit(function () {
    var parentState = getNestedState(this$1.state, path.slice(0, -1));
    Vue.delete(parentState, path[path.length - 1]);
  });
  resetStore(this);
};

Store.prototype.hotUpdate = function hotUpdate (newOptions) {
  this._modules.update(newOptions);
  resetStore(this, true);
};

Store.prototype._withCommit = function _withCommit (fn) {
  var committing = this._committing;
  this._committing = true;
  fn();
  this._committing = committing;
};

Object.defineProperties( Store.prototype, prototypeAccessors );

function genericSubscribe (fn, subs) {
  if (subs.indexOf(fn) < 0) {
    subs.push(fn);
  }
  return function () {
    var i = subs.indexOf(fn);
    if (i > -1) {
      subs.splice(i, 1);
    }
  }
}

function resetStore (store, hot) {
  store._actions = Object.create(null);
  store._mutations = Object.create(null);
  store._wrappedGetters = Object.create(null);
  store._modulesNamespaceMap = Object.create(null);
  var state = store.state;
  // init all modules
  installModule(store, state, [], store._modules.root, true);
  // reset vm
  resetStoreVM(store, state, hot);
}

function resetStoreVM (store, state, hot) {
  var oldVm = store._vm;

  // bind store public getters
  store.getters = {};
  var wrappedGetters = store._wrappedGetters;
  var computed = {};
  forEachValue(wrappedGetters, function (fn, key) {
    // use computed to leverage its lazy-caching mechanism
    computed[key] = function () { return fn(store); };
    Object.defineProperty(store.getters, key, {
      get: function () { return store._vm[key]; },
      enumerable: true // for local getters
    });
  });

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  var silent = Vue.config.silent;
  Vue.config.silent = true;
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed: computed
  });
  Vue.config.silent = silent;

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store);
  }

  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(function () {
        oldVm._data.$$state = null;
      });
    }
    Vue.nextTick(function () { return oldVm.$destroy(); });
  }
}

function installModule (store, rootState, path, module, hot) {
  var isRoot = !path.length;
  var namespace = store._modules.getNamespace(path);

  // register in namespace map
  if (module.namespaced) {
    store._modulesNamespaceMap[namespace] = module;
  }

  // set state
  if (!isRoot && !hot) {
    var parentState = getNestedState(rootState, path.slice(0, -1));
    var moduleName = path[path.length - 1];
    store._withCommit(function () {
      Vue.set(parentState, moduleName, module.state);
    });
  }

  var local = module.context = makeLocalContext(store, namespace, path);

  module.forEachMutation(function (mutation, key) {
    var namespacedType = namespace + key;
    registerMutation(store, namespacedType, mutation, local);
  });

  module.forEachAction(function (action, key) {
    var type = action.root ? key : namespace + key;
    var handler = action.handler || action;
    registerAction(store, type, handler, local);
  });

  module.forEachGetter(function (getter, key) {
    var namespacedType = namespace + key;
    registerGetter(store, namespacedType, getter, local);
  });

  module.forEachChild(function (child, key) {
    installModule(store, rootState, path.concat(key), child, hot);
  });
}

/**
 * make localized dispatch, commit, getters and state
 * if there is no namespace, just use root ones
 */
function makeLocalContext (store, namespace, path) {
  var noNamespace = namespace === '';

  var local = {
    dispatch: noNamespace ? store.dispatch : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if (process.env.NODE_ENV !== 'production' && !store._actions[type]) {
          console.error(("[vuex] unknown local action type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      return store.dispatch(type, payload)
    },

    commit: noNamespace ? store.commit : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if (process.env.NODE_ENV !== 'production' && !store._mutations[type]) {
          console.error(("[vuex] unknown local mutation type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      store.commit(type, payload, options);
    }
  };

  // getters and state object must be gotten lazily
  // because they will be changed by vm update
  Object.defineProperties(local, {
    getters: {
      get: noNamespace
        ? function () { return store.getters; }
        : function () { return makeLocalGetters(store, namespace); }
    },
    state: {
      get: function () { return getNestedState(store.state, path); }
    }
  });

  return local
}

function makeLocalGetters (store, namespace) {
  var gettersProxy = {};

  var splitPos = namespace.length;
  Object.keys(store.getters).forEach(function (type) {
    // skip if the target getter is not match this namespace
    if (type.slice(0, splitPos) !== namespace) { return }

    // extract local getter type
    var localType = type.slice(splitPos);

    // Add a port to the getters proxy.
    // Define as getter property because
    // we do not want to evaluate the getters in this time.
    Object.defineProperty(gettersProxy, localType, {
      get: function () { return store.getters[type]; },
      enumerable: true
    });
  });

  return gettersProxy
}

function registerMutation (store, type, handler, local) {
  var entry = store._mutations[type] || (store._mutations[type] = []);
  entry.push(function wrappedMutationHandler (payload) {
    handler.call(store, local.state, payload);
  });
}

function registerAction (store, type, handler, local) {
  var entry = store._actions[type] || (store._actions[type] = []);
  entry.push(function wrappedActionHandler (payload, cb) {
    var res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload, cb);
    if (!isPromise(res)) {
      res = Promise.resolve(res);
    }
    if (store._devtoolHook) {
      return res.catch(function (err) {
        store._devtoolHook.emit('vuex:error', err);
        throw err
      })
    } else {
      return res
    }
  });
}

function registerGetter (store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(("[vuex] duplicate getter key: " + type));
    }
    return
  }
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  };
}

function enableStrictMode (store) {
  store._vm.$watch(function () { return this._data.$$state }, function () {
    if (process.env.NODE_ENV !== 'production') {
      assert(store._committing, "Do not mutate vuex store state outside mutation handlers.");
    }
  }, { deep: true, sync: true });
}

function getNestedState (state, path) {
  return path.length
    ? path.reduce(function (state, key) { return state[key]; }, state)
    : state
}

function unifyObjectStyle (type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload;
    payload = type;
    type = type.type;
  }

  if (process.env.NODE_ENV !== 'production') {
    assert(typeof type === 'string', ("Expects string as the type, but found " + (typeof type) + "."));
  }

  return { type: type, payload: payload, options: options }
}

function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      );
    }
    return
  }
  Vue = _Vue;
  applyMixin(Vue);
}

var mapState = normalizeNamespace(function (namespace, states) {
  var res = {};
  normalizeMap(states).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedState () {
      var state = this.$store.state;
      var getters = this.$store.getters;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapState', namespace);
        if (!module) {
          return
        }
        state = module.context.state;
        getters = module.context.getters;
      }
      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapMutations = normalizeNamespace(function (namespace, mutations) {
  var res = {};
  normalizeMap(mutations).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedMutation () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var commit = this.$store.commit;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapMutations', namespace);
        if (!module) {
          return
        }
        commit = module.context.commit;
      }
      return typeof val === 'function'
        ? val.apply(this, [commit].concat(args))
        : commit.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var mapGetters = normalizeNamespace(function (namespace, getters) {
  var res = {};
  normalizeMap(getters).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    val = namespace + val;
    res[key] = function mappedGetter () {
      if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {
        return
      }
      if (process.env.NODE_ENV !== 'production' && !(val in this.$store.getters)) {
        console.error(("[vuex] unknown getter: " + val));
        return
      }
      return this.$store.getters[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapActions = normalizeNamespace(function (namespace, actions) {
  var res = {};
  normalizeMap(actions).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedAction () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var dispatch = this.$store.dispatch;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapActions', namespace);
        if (!module) {
          return
        }
        dispatch = module.context.dispatch;
      }
      return typeof val === 'function'
        ? val.apply(this, [dispatch].concat(args))
        : dispatch.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var createNamespacedHelpers = function (namespace) { return ({
  mapState: mapState.bind(null, namespace),
  mapGetters: mapGetters.bind(null, namespace),
  mapMutations: mapMutations.bind(null, namespace),
  mapActions: mapActions.bind(null, namespace)
}); };

function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(function (key) { return ({ key: key, val: key }); })
    : Object.keys(map).map(function (key) { return ({ key: key, val: map[key] }); })
}

function normalizeNamespace (fn) {
  return function (namespace, map) {
    if (typeof namespace !== 'string') {
      map = namespace;
      namespace = '';
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/';
    }
    return fn(namespace, map)
  }
}

function getModuleByNamespace (store, helper, namespace) {
  var module = store._modulesNamespaceMap[namespace];
  if (process.env.NODE_ENV !== 'production' && !module) {
    console.error(("[vuex] module namespace not found in " + helper + "(): " + namespace));
  }
  return module
}

var index_esm = {
  Store: Store,
  install: install,
  version: '3.0.1',
  mapState: mapState,
  mapMutations: mapMutations,
  mapGetters: mapGetters,
  mapActions: mapActions,
  createNamespacedHelpers: createNamespacedHelpers
};


/* harmony default export */ __webpack_exports__["a"] = (index_esm);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(5)))

/***/ }),
/* 65 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["SET_TITLE_ACTION"] = SET_TITLE_ACTION;
//设置标题
function SET_TITLE_ACTION({ commit, state }, { title }) {
    commit('SET_TITLE', { title });
}

/***/ }),
/* 66 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["SET_TITLE"] = SET_TITLE;
//设置标题
function SET_TITLE(state, { title }) {
    state.title = title;
}

/***/ }),
/* 67 */
/***/ (function(module, exports) {

exports.sync = function (store, router, options) {
  var moduleName = (options || {}).moduleName || 'route'

  store.registerModule(moduleName, {
    namespaced: true,
    state: cloneRoute(router.currentRoute),
    mutations: {
      'ROUTE_CHANGED': function ROUTE_CHANGED (state, transition) {
        store.state[moduleName] = cloneRoute(transition.to, transition.from)
      }
    }
  })

  var isTimeTraveling = false
  var currentPath

  // sync router on store change
  var storeUnwatch = store.watch(
    function (state) { return state[moduleName]; },
    function (route) {
      var fullPath = route.fullPath;
      if (fullPath === currentPath) {
        return
      }
      if (currentPath != null) {
        isTimeTraveling = true
        router.push(route)
      }
      currentPath = fullPath
    },
    { sync: true }
  )

  // sync store on router navigation
  var afterEachUnHook = router.afterEach(function (to, from) {
    if (isTimeTraveling) {
      isTimeTraveling = false
      return
    }
    currentPath = to.fullPath
    store.commit(moduleName + '/ROUTE_CHANGED', { to: to, from: from })
  })

  return function unsync () {
    // On unsync, remove router hook
    if (afterEachUnHook != null) {
      afterEachUnHook()
    }

    // On unsync, remove store watch
    if (storeUnwatch != null) {
      storeUnwatch()
    }

    // On unsync, unregister Module with store
    store.unregisterModule(moduleName)
  }
}

function cloneRoute (to, from) {
  var clone = {
    name: to.name,
    path: to.path,
    hash: to.hash,
    query: to.query,
    params: to.params,
    fullPath: to.fullPath,
    meta: to.meta
  }
  if (from) {
    clone.from = cloneRoute(from)
  }
  return Object.freeze(clone)
}



/***/ }),
/* 68 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//客户端扩展模块
const context = weex.requireModule('context');

/* harmony default export */ __webpack_exports__["a"] = ({
    methods: {
        //json转字符串，用在stream的body
        toParams(obj) {
            var param = "";
            for (const name in obj) {
                if (typeof obj[name] != 'function') {
                    param += "&" + name + "=" + encodeURI(obj[name]);
                }
            }
            return param.substring(1);
        },
        jump(to) {
            if (this.$router) {
                this.$router.push(to);
            }
        },
        //返回按钮
        goBack() {
            if (this.$router) {
                if (this.$route.path == "/login") {
                    context.finish();
                } else {
                    this.$router.back();
                }
            }
        },
        goHome() {
            context.finish();
        }
    }
});

/***/ })
/******/ ]);