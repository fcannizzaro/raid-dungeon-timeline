(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],3:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],4:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":2,"./encode":3}],5:[function(require,module,exports){
(function (setImmediate,clearImmediate){
var nextTick = require('process/browser.js').nextTick;
var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var immediateIds = {};
var nextImmediateId = 0;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) { timeout.close(); };

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// That's not how node.js implements it but the exposed api is the same.
exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
  var id = nextImmediateId++;
  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

  immediateIds[id] = true;

  nextTick(function onNextTick() {
    if (immediateIds[id]) {
      // fn.call() is faster so we optimize for the common use-case
      // @see http://jsperf.com/call-apply-segu
      if (args) {
        fn.apply(null, args);
      } else {
        fn.call(null);
      }
      // Prevent ids from leaking
      exports.clearImmediate(id);
    }
  });

  return id;
};

exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
  delete immediateIds[id];
};
}).call(this,require("timers").setImmediate,require("timers").clearImmediate)
},{"process/browser.js":1,"timers":5}],6:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BungieAPI = exports.retry = exports.delay = void 0;
var user_1 = require("./user");
var destiny_1 = require("./destiny");
// @ts-ignore
var querystring = require("querystring");
var DEFAULT_OPTIONS = { params: {} };
var timeoutPromise = function (timeout, err, promise) {
    return new Promise(function (resolve, reject) {
        promise.then(resolve, reject);
        setTimeout(reject.bind(null, err), timeout);
    });
};
exports.delay = function (ms) { return new Promise(function (res) { return setTimeout(res, ms); }); };
exports.retry = function (fn, time) {
    if (time === void 0) { time = 0; }
    return __awaiter(void 0, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (time > 5) {
                        throw new Error('5 times failed!');
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 6]);
                    return [4 /*yield*/, fn()];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    e_1 = _a.sent();
                    return [4 /*yield*/, exports.delay(2000)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, exports.retry(fn, time + 1)];
                case 5: return [2 /*return*/, _a.sent()];
                case 6: return [2 /*return*/];
            }
        });
    });
};
var BungieAPI = /** @class */ (function () {
    function BungieAPI(apikey) {
        var _this = this;
        this.apikey = apikey;
        var get = function (url, _a) {
            var params = (_a === void 0 ? DEFAULT_OPTIONS : _a).params;
            return __awaiter(_this, void 0, void 0, function () {
                var e_2;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, exports.retry(function () { return __awaiter(_this, void 0, void 0, function () {
                                    var qs, composed, res;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                qs = querystring.stringify(params, '&', '=');
                                                composed = 'https://www.bungie.net/Platform/' + url + (qs ? '?' + qs : '');
                                                console.log(composed);
                                                return [4 /*yield*/, timeoutPromise(5000, new Error('Timed Out!'), fetch(composed, {
                                                        headers: {
                                                            'X-API-Key': apikey,
                                                            Origin: 'http://localhost:3000'
                                                        }
                                                    }))];
                                            case 1:
                                                res = _a.sent();
                                                return [2 /*return*/, res.json()];
                                        }
                                    });
                                }); })];
                        case 1: return [2 /*return*/, _b.sent()];
                        case 2:
                            e_2 = _b.sent();
                            console.log(e_2, url, params);
                            return [2 /*return*/, {}];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        this.user = new user_1.UserAPI(get);
        this.destiny = new destiny_1.DestinyAPI(get);
    }
    return BungieAPI;
}());
exports.BungieAPI = BungieAPI;

},{"./destiny":7,"./user":8,"querystring":4}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DestinyAPI = exports.ActivityMode = void 0;
var ActivityMode;
(function (ActivityMode) {
    ActivityMode[ActivityMode["raid"] = 4] = "raid";
    ActivityMode[ActivityMode["story"] = 2] = "story";
    ActivityMode[ActivityMode["dungeon"] = 82] = "dungeon";
})(ActivityMode = exports.ActivityMode || (exports.ActivityMode = {}));
var DestinyAPI = /** @class */ (function () {
    function DestinyAPI(client) {
        this.client = client;
    }
    DestinyAPI.prototype.getPostGameCarnageReport = function (id) {
        return this.client("Destiny2/Stats/PostGameCarnageReport/" + id);
    };
    DestinyAPI.prototype.getActivityHistory = function (membershipType, destinyMembershipId, characterId, params) {
        return this.client("Destiny2/" + membershipType + "/Account/" + destinyMembershipId + "/Character/" + characterId + "/Stats/Activities/", { params: params });
    };
    return DestinyAPI;
}());
exports.DestinyAPI = DestinyAPI;

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAPI = void 0;
var UserAPI = /** @class */ (function () {
    function UserAPI(client) {
        this.client = client;
    }
    UserAPI.prototype.searchDestinyPlayer = function (membershipType, displayName) {
        return this.client("Destiny2/SearchDestinyPlayer/" + membershipType + "/" + displayName);
    };
    UserAPI.prototype.getMembershipFromHardLinkedCredential = function (steamId) {
        return this.client('User/GetMembershipFromHardLinkedCredential/SteamId/' + steamId);
    };
    UserAPI.prototype.getProfile = function (membershipType, destinyMembershipId, params) {
        return this.client("Destiny2/" + membershipType + "/Profile/" + destinyMembershipId + "/", { params: params });
    };
    return UserAPI;
}());
exports.UserAPI = UserAPI;

},{}],9:[function(require,module,exports){
module.exports={ "10898844": { "mode": "normal", "short": "Forge Ignition", "name": "Forge Ignition", "description": "Complete a forge ignition at the Bergusia Forge" }, "13813394": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Strange Terrain", "description": "Strange Terrain" }, "18699611": { "mode": "strange terrain", "short": "Nightfall", "name": "Nightfall: Strange Terrain", "description": "Defeat Nokris before he completes his ritual." }, "19982784": { "mode": "normal", "short": "Combat Mission", "name": "Combat Mission", "description": "" }, "29726492": { "mode": "normal", "short": "Private Match", "name": "Private Match", "description": "Create a custom PvP match with your fireteam, and best your comrades for personal glory… and bragging rights." }, "30240416": { "mode": "normal", "short": "Assassination Mission", "name": "Assassination Mission", "description": "" }, "37050217": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "" }, "40003746": { "mode": "normal", "short": "The Citadel", "name": "The Citadel", "description": "The Dreaming City" }, "41222998": { "mode": "grandmaster", "short": "The Ordeal", "name": "The Ordeal: Grandmaster", "description": "Grandmaster" }, "45113325": { "mode": "legendary", "short": "K1 Communion", "name": "K1 Communion (Legendary)", "description": "Head to K1 Communion and defeat the Nighmare of Rizaahn, the Lost to retrieve Warmind Bits.\n\nMatch Game: Fallen\n\nChampions: Barrier, Overload" }, "48090081": { "mode": "the inverted spire", "short": "Nightfall", "name": "Nightfall: The Inverted Spire", "description": "End the Red Legion expedition that's ripped open the planet's surface." }, "51408141": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "53954174": { "mode": "normal", "short": "Anti-Anti-Air", "name": "Anti-Anti-Air", "description": "Infiltrate the Red Legion base and disable their network of flak turrets." }, "54961125": { "mode": "grandmaster", "short": "The Ordeal", "name": "The Ordeal: Grandmaster: Exodus Crash", "description": "Exodus Crash" }, "57103244": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "" }, "68611392": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Legend", "description": "Exodus Crash" }, "68611393": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Hero", "description": "Exodus Crash" }, "68611394": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Adept", "description": "Exodus Crash" }, "68611398": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Grandmaster", "description": "Exodus Crash" }, "68611399": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Master", "description": "Exodus Crash" }, "74501540": { "mode": "normal", "short": "The Whisper", "name": "The Whisper", "description": "The Whisper", "release": "2018-07-21T12:00:00.000Z" }, "74956570": { "mode": "normal", "short": "New Arcadia", "name": "New Arcadia", "description": "Hellas Basin, Mars" }, "78673128": { "mode": "normal", "short": "Thief of Thieves", "name": "Thief of Thieves", "description": "Recover the supplies that the Fallen have taken." }, "80726883": { "mode": "normal", "short": "O Captain", "name": "O Captain", "description": "Complete mission \"O Captain\" on Nessus." }, "89727599": { "mode": "normal", "short": "Leviathan", "name": "Leviathan", "description": "\"Grow fat from strength.\"" }, "90389924": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "" }, "96442917": { "mode": "heroic red legion, black oil", "short": "", "name": "(Heroic) Red Legion, Black Oil", "description": "Destroy the dark liquid that the Cabal use to power their technology or contaminate it, for a subtler approach." }, "98112589": { "mode": "salvage", "short": "Field Assignment", "name": "Field Assignment: Salvage", "description": "" }, "104342360": { "mode": "normal", "short": "Combat Mission", "name": "Combat Mission", "description": "" }, "116352029": { "mode": "normal", "short": "Combat Mission", "name": "Combat Mission", "description": "" }, "117447065": { "mode": "normal", "short": "A Garden World", "name": "A Garden World", "description": "Help Osiris cut back an out-of-control Vex Mind." }, "119944200": { "mode": "normal", "short": "Leviathan, Spire of Stars", "name": "Leviathan, Spire of Stars: Normal", "description": "On the wings of Icarus.", "release": "2018-05-11T19:00:00.000Z" }, "122988657": { "mode": "normal", "short": "Red Legion, Black Oil", "name": "Red Legion, Black Oil", "description": "Destroy the dark liquid that the Cabal use to power their technology or contaminate it, for a subtler approach." }, "129918239": { "mode": "hope", "short": "Daily Heroic Story Mission", "name": "Daily Heroic Story Mission: Hope", "description": "Complete the Daily Heroic story mission." }, "130838713": { "mode": "salvage", "short": "Field Assignment", "name": "Field Assignment: Salvage", "description": "" }, "135537449": { "mode": "normal", "short": "Survival", "name": "Survival", "description": "\"Outlive your foes, and there can be no possible outcome but victory.\" —Lord Shaxx\n\nFight for Glory by depleting your opponents' shared life pool, then eliminating them." }, "135872552": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Legend", "description": "Broodhold" }, "135872553": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Hero", "description": "Broodhold" }, "135872554": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Adept", "description": "Broodhold" }, "135872558": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Grandmaster", "description": "Broodhold" }, "135872559": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Master", "description": "Broodhold" }, "143647473": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "145136689": { "mode": "normal", "short": "Combat mission", "name": "Combat mission", "description": "" }, "145302664": { "mode": "the arms dealer", "short": "Nightfall", "name": "Nightfall: The Arms Dealer: Normal", "description": "Shut down the operations of an ironmonger providing weapons to the Red Legion." }, "148937731": { "mode": "normal", "short": "Wormhaven", "name": "Wormhaven", "description": "New Pacific Arcology, Titan" }, "153537894": { "mode": "normal", "short": "A New Frontier", "name": "A New Frontier", "description": "Explore the European Dead Zone as Devrim provides support from the church." }, "158022875": { "mode": "normal", "short": "European Aerial Zone", "name": "European Aerial Zone", "description": "The Vanguard is dispatching Guardians to the EAZ for combat drills and meditation. Join them." }, "160315036": { "mode": "the mindbender", "short": "Target", "name": "Target: The Mindbender", "description": "Avenge Cayde's death by crossing the Scorned Baron known as the Mindbender off your list." }, "175598161": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "185515551": { "mode": "heroic invitation from the emperor", "short": "", "name": "(Heroic) Invitation from the Emperor", "description": "Cayde's worried about a mysterious message drawing the Red Legion to a remote corner of Nessus." }, "186006588": { "mode": "gravetide summoner", "short": "WANTED", "name": "WANTED: Gravetide Summoner", "description": "Hunt down the wanted Gravetide Summoner who escaped from the Prison of Elders." }, "189324537": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "189477140": { "mode": "normal", "short": "Open the Gate", "name": "Open the Gate", "description": "Open the Infinite Forest entrance to free Saint-14." }, "197670945": { "mode": "normal", "short": "Assassination Mission", "name": "Assassination Mission", "description": "" }, "204298081": { "mode": "normal", "short": "Analysis Mission", "name": "Analysis Mission", "description": "" }, "224295651": { "mode": "normal", "short": "The Corrupted", "name": "The Corrupted", "description": "Hunt down one of Queen Mara's most trusted advisors and free her from Taken possession." }, "228586976": { "mode": "normal", "short": "The Menagerie", "name": "The Menagerie", "description": "Pleasure and delight await you." }, "228586977": { "mode": "normal", "short": "The Menagerie", "name": "The Menagerie", "description": "Pleasure and delight await you." }, "228586978": { "mode": "normal", "short": "The Menagerie", "name": "The Menagerie", "description": "Pleasure and delight await you." }, "228586979": { "mode": "normal", "short": "The Menagerie", "name": "The Menagerie", "description": "Pleasure and delight await you." }, "228586980": { "mode": "normal", "short": "The Menagerie", "name": "The Menagerie", "description": "Pleasure and delight await you." }, "228586981": { "mode": "normal", "short": "The Menagerie", "name": "The Menagerie", "description": "Pleasure and delight await you." }, "228586983": { "mode": "normal", "short": "The Menagerie", "name": "The Menagerie", "description": "Pleasure and delight await you." }, "228586990": { "mode": "normal", "short": "The Menagerie", "name": "The Menagerie", "description": "Pleasure and delight await you." }, "228586991": { "mode": "normal", "short": "The Menagerie", "name": "The Menagerie", "description": "Pleasure and delight await you." }, "234065414": { "mode": "normal", "short": "Spark", "name": "Spark", "description": "Relive the Spark experience." }, "244166221": { "mode": "normal", "short": "Kell's Grave", "name": "Kell's Grave", "description": "Tangled Shore, The Reef" }, "245243704": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Legend", "description": "The Corrupted" }, "245243705": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Hero", "description": "The Corrupted" }, "245243706": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Adept", "description": "The Corrupted" }, "245243710": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Grandmaster", "description": "The Corrupted" }, "245243711": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Master", "description": "The Corrupted" }, "248066530": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "249656167": { "mode": "normal", "short": "Legion's Folly", "name": "Legion's Folly", "description": "Arcadian Valley, Nessus" }, "261349035": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "265024472": { "mode": "legendary", "short": "Sanctum of Bones", "name": "Sanctum of Bones (Legendary)", "description": "Head to the Sanctum of Bones and defeat Ghalar, the Fugitive to retrieve Warmind Bits.\n\nMatch Game: Cabal\n\nChampions: Barrier, Unstoppable" }, "265024475": { "mode": "legendary", "short": "Aphix Conduit", "name": "Aphix Conduit (Legendary)", "description": "Head to Aphix Conduit and defeat the Ruined Mind to retrieve Warmind Bits.\n\nMatch Game: Vex\n\nChampions: Barrier, Overload" }, "271962655": { "mode": "utopia", "short": "Daily Heroic Story Mission", "name": "Daily Heroic Story Mission: Utopia", "description": "Complete the Daily Heroic story mission." }, "272852450": { "mode": "will of the thousands", "short": "Nightfall", "name": "Nightfall: Will of the Thousands", "description": "Defeat Xol before everything is destroyed." }, "282844296": { "mode": "active duty", "short": "Field Assignment", "name": "Field Assignment: Active Duty", "description": "" }, "286324446": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "286562305": { "mode": "normal", "short": "The Inverted Spire", "name": "The Inverted Spire", "description": "End the Red Legion expedition that's ripped open the planet's surface." }, "287649202": { "mode": "normal", "short": "Leviathan", "name": "Leviathan", "description": "\"Grow fat from strength.\"" }, "293858112": { "mode": "normal", "short": "Combat Mission", "name": "Combat Mission", "description": "" }, "294136201": { "mode": "normal", "short": "Classified", "name": "Classified", "description": "Keep it secret.  Keep it safe." }, "298747401": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "" }, "298793060": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "313572698": { "mode": "normal", "short": "Shard of the Traveler", "name": "Shard of the Traveler", "description": "Return to the Shard of the Traveler and restore your connection to the Light." }, "319240296": { "mode": "heroic deathless", "short": "", "name": "(Heroic) Deathless", "description": "Clear out the Knight that's keeping Sloane's crews from their work." }, "320680002": { "mode": "normal", "short": "Supply and Demand", "name": "Supply and Demand", "description": "An old friend is looking for Red Legion supplies to… reappropriate. Scour Fallen territory for anything to scavenge." }, "322277826": { "mode": "exodus crash", "short": "Nightfall", "name": "Nightfall: Exodus Crash", "description": "Purge the Fallen infestation of the Exodus Black." }, "330545737": { "mode": "normal", "short": "The Farm", "name": "The Farm", "description": "A refugee camp set up during the Red War for Guardians and non Guardians alike, on the outskirts of the EDZ." }, "332234118": { "mode": "normal", "short": "Vostok", "name": "Vostok", "description": "Felwinter Peak, Earth" }, "338662534": { "mode": "normal", "short": "The Inverted Spire", "name": "The Inverted Spire", "description": "End the Red Legion expedition that's ripped open the planet's surface." }, "340004423": { "mode": "normal", "short": "Hephaestus", "name": "Hephaestus", "description": "Destroy dangerous information before it falls into the wrong hands." }, "346345236": { "mode": "normal", "short": "The Scarlet Keep", "name": "The Scarlet Keep", "description": "Investigate the recently erected Scarlet Keep and discover its dark purpose." }, "352668024": { "mode": "normal", "short": "The Menagerie", "name": "The Menagerie", "description": "Pleasure and delight await you." }, "355984230": { "mode": "normal", "short": "Assassination Mission", "name": "Assassination Mission", "description": "" }, "359488722": { "mode": "normal", "short": "Hack the Planet", "name": "Hack the Planet", "description": "Ghost has a plan to interface with the Nessus core. But he'll need Failsafe's help." }, "373475104": { "mode": "a garden world", "short": "Nightfall", "name": "Nightfall: A Garden World", "description": "Help Osiris cut back an out-of-control Vex Mind." }, "379330092": { "mode": "normal", "short": "Shard of the Traveler", "name": "Shard of the Traveler", "description": "Return to the Shard of the Traveler and restore your connection to the Light." }, "380956400": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Master", "description": "Warden of Nothing" }, "380956401": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Grandmaster", "description": "Warden of Nothing" }, "380956405": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Adept", "description": "Warden of Nothing" }, "380956406": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Hero", "description": "Warden of Nothing" }, "380956407": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Legend", "description": "Warden of Nothing" }, "386959931": { "mode": "gravetide summoner", "short": "WANTED", "name": "WANTED: Gravetide Summoner", "description": "Hunt down the wanted Gravetide Summoner who escaped from the Prison of Elders." }, "387171436": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "387373040": { "mode": "normal", "short": "Heroic Strikes Playlist", "name": "Heroic Strikes Playlist", "description": "Launches a random Destiny 2 or Curse of Osiris Heroic strike." }, "387373043": { "mode": "normal", "short": "Heroic Strikes Playlist", "name": "Heroic Strikes Playlist", "description": "Launches a random Destiny 2 or Warmind Heroic strike." }, "388289443": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "" }, "392815422": { "mode": "normal", "short": "Disturbance on Mercury", "name": "Disturbance on Mercury", "description": "Meet Osiris in the Sundial Spire." }, "399506119": { "mode": "normal", "short": "Endless Vale", "name": "Endless Vale", "description": "Arcadian Valley, Nessus" }, "411726442": { "mode": "a garden world", "short": "Nightfall", "name": "Nightfall: A Garden World", "description": "Help Osiris cut back an out-of-control Vex Mind." }, "415388387": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "" }, "417231112": { "mode": "prestige", "short": "Leviathan", "name": "Leviathan: Prestige", "description": "\"Grow fat from strength.\"", "release": "2017-10-18T19:00:00.000Z" }, "417691069": { "mode": "active duty", "short": "Field Assignment", "name": "Field Assignment: Active Duty", "description": "" }, "424670797": { "mode": "normal", "short": "Risk/Reward", "name": "Risk/Reward", "description": "Search the Cosmodrome for a secret stash. Find it to claim your reward." }, "429361491": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "434462141": { "mode": "normal", "short": "Heroic Strikes Playlist", "name": "Heroic Strikes Playlist", "description": "Launches a random Destiny 2 Heroic strike without expansion content." }, "435989417": { "mode": "normal", "short": "Analysis Mission", "name": "Analysis Mission", "description": "" }, "442671778": { "mode": "normal", "short": "The Arms Dealer", "name": "The Arms Dealer", "description": "Shut down the operations of an ironmonger providing weapons to the Red Legion." }, "444087412": { "mode": "normal", "short": "Combat Mission", "name": "Combat Mission", "description": "" }, "449926115": { "mode": "heroic postmodern prometheus", "short": "", "name": "(Heroic) Postmodern Prometheus", "description": "Ikora is reluctantly allowing Asher to explore a plan where he'd convert the Traveler's energy into a form of synthetic Light." }, "451430877": { "mode": "normal", "short": "Bannerfall", "name": "Bannerfall", "description": "The Last City, Earth" }, "459955094": { "mode": "normal", "short": "Analysis Mission", "name": "Analysis Mission", "description": "" }, "461203479": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "" }, "466447952": { "mode": "shadowkeep", "short": "Destiny 2", "name": "Destiny 2: Shadowkeep", "description": "New nightmares have emerged from the shadows of our Moon. Called forth by haunting visions, Eris Morn has returned. Join her to slay these nightmares before they reach out beyond the Moon to cast humanity back into an age of darkness." }, "467266668": { "mode": "normal", "short": "The Inverted Spire", "name": "The Inverted Spire", "description": "End the Red Legion expedition that's ripped open the planet's surface." }, "471727774": { "mode": "normal", "short": "In the Deep", "name": "In the Deep", "description": "Somewhere in the horrific depths of the Hellmouth lies the Hive Cryptoglyph. With it, Eris Morn can craft further Dreambane armor for your quest to find a way inside the Pyramid.\n\nThe Cryptoglyph is yours to take from the Hive… if you can." }, "474193231": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "" }, "474380713": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "492869759": { "mode": "normal", "short": "Vanguard Strikes", "name": "Vanguard Strikes", "description": "Launches a random Destiny 2, Curse of Osiris, or Warmind strike." }, "494635832": { "mode": "silent fang", "short": "WANTED", "name": "WANTED: Silent Fang", "description": "Hunt down the wanted Silent Fang who escaped from the Prison of Elders." }, "497583046": { "mode": "gravetide summoner", "short": "WANTED", "name": "WANTED: Gravetide Summoner", "description": "Hunt down the wanted Gravetide Summoner who escaped from the Prison of Elders." }, "498220076": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "501703034": { "mode": "normal", "short": "The Reckoning", "name": "The Reckoning", "description": "Venture into the mysterious Haul that the Drifter tows behind his ship to reckon with greater powers." }, "502780971": { "mode": "active duty", "short": "Field Assignment", "name": "Field Assignment: Active Duty", "description": "" }, "504444892": { "mode": "normal", "short": "Doubles", "name": "Doubles", "description": "Fight alongside a teammate, and work together to crush your opponents." }, "508802457": { "mode": "prestige", "short": "Leviathan", "name": "Leviathan: Prestige", "description": "\"Grow fat from strength.\"", "release": "2017-10-18T19:00:00.000Z" }, "521403014": { "mode": "normal", "short": "Last Call", "name": "Last Call", "description": "Fight alongside Cayde-6 to help Petra Venj regain control of the dangerous Prison of Elders." }, "522318687": { "mode": "strange terrain", "short": "Nightfall", "name": "Nightfall: Strange Terrain", "description": "Defeat Nokris before he completes his ritual." }, "530720427": { "mode": "normal", "short": "High Plains Blues", "name": "High Plains Blues", "description": "Search the Tangled Shore for Cayde's killers." }, "532383918": { "mode": "normal", "short": "Radiant Cliffs", "name": "Radiant Cliffs", "description": "Mercury's Past, Infinite Forest" }, "539897061": { "mode": "normal", "short": "Reversing the Polarity", "name": "Reversing the Polarity", "description": "The Cabal tend to use a single technology to power everything in their arsenal. Take advantage of that design flaw to send them a message." }, "545240418": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "" }, "548750096": { "mode": "normal", "short": "Scourge of the Past", "name": "Scourge of the Past", "description": "Beneath the ruins of the Last City lies the Black Armory's most precious vault, now under siege by Siviks and his crew, the Kell's Scourge.", "release": "2018-12-07T18:00:00.000Z" }, "549123191": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "" }, "553537971": { "mode": "normal", "short": "Chosen", "name": "Chosen", "description": "The Almighty is finished. Time to go home, save the Traveler, take back the City, and end this war. Be brave." }, "561345572": { "mode": "normal", "short": "Tree of Probabilities", "name": "Tree of Probabilities", "description": "Contain a rampant army of Red Legion within the Infinite Forest." }, "561345573": { "mode": "normal", "short": "Tree of Probabilities", "name": "Tree of Probabilities", "description": "Contain a rampant army of Red Legion within the Infinite Forest." }, "561345575": { "mode": "normal", "short": "Tree of Probabilities", "name": "Tree of Probabilities", "description": "Contain a rampant army of Red Legion within the Infinite Forest." }, "562078030": { "mode": "the pyramidion", "short": "Nightfall", "name": "Nightfall: The Pyramidion", "description": "Seek vengeance against the Vex Mind that corrupted Asher's arm." }, "563435123": { "mode": "normal", "short": "Payback", "name": "Payback", "description": "Relive the Payback experience." }, "571058904": { "mode": "anguish", "short": "Nightmare Hunt", "name": "Nightmare Hunt: Anguish: Master", "description": "Defeat the Nightmare of Omnigul." }, "571058905": { "mode": "anguish", "short": "Nightmare Hunt", "name": "Nightmare Hunt: Anguish: Legend", "description": "Defeat the Nightmare of Omnigul." }, "571058910": { "mode": "anguish", "short": "Nightmare Hunt", "name": "Nightmare Hunt: Anguish: Hero", "description": "Defeat the Nightmare of Omnigul." }, "571058911": { "mode": "anguish", "short": "Nightmare Hunt", "name": "Nightmare Hunt: Anguish: Adept", "description": "Defeat the Nightmare of Omnigul." }, "581323290": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "" }, "585071442": { "mode": "savathûn's song", "short": "Nightfall", "name": "Nightfall: Savathûn's Song: Prestige", "description": "Delve deep into the Hive-infested Arcology in search of missing fireteams." }, "585322760": { "mode": "normal", "short": "Armsweek", "name": "Armsweek", "description": "Use the prescribed loadout." }, "589157009": { "mode": "1au", "short": "Daily Heroic Story Mission", "name": "Daily Heroic Story Mission: 1AU", "description": "Complete the Daily Heroic story mission." }, "601540706": { "mode": "the arms dealer", "short": "Nightfall", "name": "Nightfall: The Arms Dealer: Prestige", "description": "Shut down the operations of an ironmonger providing weapons to the Red Legion." }, "606484622": { "mode": "normal", "short": "Black Armory signature", "name": "Black Armory signature", "description": "The source of the Vex transponder signal has been located.\n\nGo to this unexplored area of Nessus and track the signal that is using a Black Armory signature." }, "609844331": { "mode": "normal", "short": "Rusted Lands", "name": "Rusted Lands", "description": "Eastern Flood Zone, Earth" }, "619321468": { "mode": "normal", "short": "The Damnation", "name": "The Damnation", "description": "The artifact is calling to something dark.\n\nUncover a dark ritual on Titan and stop the twisted ceremony." }, "622895925": { "mode": "normal", "short": "Arecibo", "name": "Arecibo", "description": "Investigate a mysterious broadcast that only you and your Ghost can hear." }, "625165976": { "mode": "heroic", "short": "The Trickster", "name": "The Trickster (Heroic)", "description": "Avenge Cayde's death by crossing the Scorned Baron known as the Trickster off your list." }, "625845730": { "mode": "normal", "short": "The Lighthouse", "name": "The Lighthouse", "description": "Unique reward space for the best of the best. You must be found worthy by achieving 7 wins with no losses to gain access." }, "629542775": { "mode": "the festering core", "short": "Nightfall", "name": "Nightfall: The Festering Core", "description": "Descend into the heart of Io's Pyramidion and root out a burgeoning infestation." }, "632790902": { "mode": "normal", "short": "Cliffhanger", "name": "Cliffhanger", "description": "Asher has information about the Vex's next conversion site, and he wants it stopped." }, "642256373": { "mode": "exodus crash", "short": "Nightfall", "name": "Nightfall: Exodus Crash", "description": "Purge the Fallen infestation of the Exodus Black." }, "642277473": { "mode": "the pyramidion", "short": "Nightfall", "name": "Nightfall: The Pyramidion", "description": "Seek vengeance against the Vex Mind that corrupted Asher's arm." }, "649648599": { "mode": "normal", "short": "Savathûn's Song", "name": "Savathûn's Song", "description": "Delve deep into the Hive-infested Arcology in search of missing fireteams." }, "656703508": { "mode": "normal", "short": "A Garden World", "name": "A Garden World", "description": "Help Osiris cut back an out-of-control Vex Mind." }, "661325298": { "mode": "normal", "short": "In Search of Answers", "name": "In Search of Answers", "description": "\"In Search of Answers\" completed" }, "661855681": { "mode": "normal", "short": "Lake of Shadows", "name": "Lake of Shadows", "description": "Stem the tide of Taken flowing into the European Dead Zone from beneath the waves." }, "666063689": { "mode": "normal", "short": "Last Call", "name": "Last Call", "description": "Fight alongside Cayde-6 to help Petra Venj regain control of the dangerous Prison of Elders." }, "666770290": { "mode": "normal", "short": "Altar of Flame", "name": "Altar of Flame", "description": "Caloris Basin, Mercury" }, "671904429": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "673053667": { "mode": "normal", "short": "Deep Six", "name": "Deep Six", "description": "New Pacific Archology, Titan" }, "685590036": { "mode": "the festering core", "short": "Nightfall", "name": "Nightfall: The Festering Core", "description": "Descend into the heart of Io's Pyramidion and root out a burgeoning infestation." }, "689927878": { "mode": "normal", "short": "A Garden World", "name": "A Garden World", "description": "Help Osiris cut back an out-of-control Vex Mind." }, "690795956": { "mode": "active duty", "short": "Field Assignment", "name": "Field Assignment: Active Duty", "description": "" }, "703311712": { "mode": "normal", "short": "Shard of the Traveler", "name": "Shard of the Traveler", "description": "Return to the Shard of the Traveler and restore your connection to the Light." }, "707826522": { "mode": "normal", "short": "Firewalled Haunted Forest", "name": "Firewalled Haunted Forest", "description": "A darkened instance of the Infinite Forest. Descend into its depths and see how far you can get before it disintegrates.\n\nThe Firewalled Haunted Forest has no matchmaking." }, "709854835": { "mode": "normal", "short": "Niobe's Torment", "name": "Niobe's Torment", "description": "Unlock the Antechamber." }, "712032579": { "mode": "normal", "short": "Deep Six", "name": "Deep Six", "description": "New Pacific Archology, Titan" }, "715306877": { "mode": "normal", "short": "Combat Mission", "name": "Combat Mission", "description": "" }, "719906507": { "mode": "normal", "short": "The Third Spire", "name": "The Third Spire", "description": "You have no idea where it is, but somehow you know exactly how to get there..." }, "722882932": { "mode": "normal", "short": "Defeat the Target", "name": "Defeat the Target", "description": "Defeat the Hive Knight." }, "723733266": { "mode": "heroic", "short": "The Runner", "name": "The Runner (Heroic)", "description": "Stop a Cabal simulation carrying heavily encrypted data." }, "724887049": { "mode": "normal", "short": "Survey the Hive", "name": "Survey the Hive", "description": "Survey Hive activity." }, "740422335": { "mode": "normal", "short": "Survival", "name": "Survival", "description": "\"Outlive your foes, and there can be no possible outcome but victory.\" —Lord Shaxx\n\nFight for Valor by depleting your opponents' shared life pool, then eliminating them." }, "740891329": { "mode": "freelance", "short": "Survival", "name": "Survival: Freelance", "description": "\"Outlive your foes, and there can be no possible outcome but victory.\" —Lord Shaxx\n\nFight for Glory by depleting your opponents' shared life pool, then eliminating them." }, "743100125": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "743963294": { "mode": "normal", "short": "Strange Terrain", "name": "Strange Terrain", "description": "Defeat Nokris before he completes his ritual." }, "750001803": { "mode": "normal", "short": "Altar of Flame", "name": "Altar of Flame", "description": "Caloris Basin, Mercury" }, "750649238": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "757116822": { "mode": "prestige", "short": "Leviathan", "name": "Leviathan: Prestige", "description": "\"Grow fat from strength.\"", "release": "2017-10-18T19:00:00.000Z" }, "762489193": { "mode": "normal", "short": "The Anomaly", "name": "The Anomaly", "description": "Mare Cognitum, Moon" }, "766116576": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Grandmaster", "description": "The Festering Core" }, "766116577": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Master", "description": "The Festering Core" }, "766116580": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Adept", "description": "The Festering Core" }, "766116582": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Legend", "description": "The Festering Core" }, "766116583": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Hero", "description": "The Festering Core" }, "770196931": { "mode": "normal", "short": "The Arms Dealer", "name": "The Arms Dealer", "description": "Shut down the operations of an ironmonger providing weapons to the Red Legion." }, "770505917": { "mode": "[solar] day", "short": "European Aerial Zone", "name": "European Aerial Zone: [Solar] Day", "description": "Solar energies blast through the EAZ, filling the air with the smell of sunbaked earth.\n\nEquip your Solar subclass and weapons to generate Solar orbs, then collect them to become Solar Empowered. While empowered, Guardians emit a burning wave of energy." }, "771164842": { "mode": "prestige", "short": "Leviathan", "name": "Leviathan: Prestige", "description": "\"Grow fat from strength.\"", "release": "2017-10-18T19:00:00.000Z" }, "774103043": { "mode": "active duty", "short": "Field Assignment", "name": "Field Assignment: Active Duty", "description": "" }, "777592567": { "mode": "normal", "short": "Midtown", "name": "Midtown", "description": "The Last City, Earth" }, "778271008": { "mode": "normal", "short": "Emperor's Respite", "name": "Emperor's Respite", "description": "Prison Barge, Leviathan" }, "778535230": { "mode": "normal", "short": "Beyond", "name": "Beyond", "description": "What secrets lie within the Pyramid? It sits in silence, waiting for you.\n\nHead to the Enduring Abyss, past the Pyramid's warding, and find a way inside." }, "781749295": { "mode": "normal", "short": "Private Match", "name": "Private Match", "description": "Create a custom PvP match with your fireteam, and best your comrades for personal glory… and bragging rights." }, "782175145": { "mode": "normal", "short": "Assassination Mission", "name": "Assassination Mission", "description": "" }, "782290869": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "" }, "785871069": { "mode": "heroic unbreakable", "short": "", "name": "(Heroic) Unbreakable", "description": "Failsafe has caught wind of Vex tech that could result in unstoppable barriers." }, "787912925": { "mode": "normal", "short": "The Sundial", "name": "The Sundial: Normal", "description": "Stop the Cabal from rewriting history and laying claim to the future." }, "789332628": { "mode": "normal", "short": "Thief of Thieves", "name": "Thief of Thieves", "description": "Recover the supplies that the Fallen have taken." }, "798143184": { "mode": "normal", "short": "Combat Mission", "name": "Combat Mission", "description": "" }, "801458995": { "mode": "heroic unexpected guests", "short": "", "name": "(Heroic) Unexpected Guests", "description": "Ikora's worried about some Taken emanations from beneath the moon's surface." }, "806094750": { "mode": "normal", "short": "Javelin-4", "name": "Javelin-4", "description": "Warsat Launch Facility, Io" }, "808931822": { "mode": "normal", "short": "Postmodern Prometheus", "name": "Postmodern Prometheus", "description": "Ikora is reluctantly allowing Asher to explore a plan where he'd convert the Traveler's energy into a form of synthetic Light." }, "809170886": { "mode": "prestige", "short": "Leviathan, Eater of Worlds", "name": "Leviathan, Eater of Worlds: Prestige", "description": "\"In the belly of the beast.\"", "release": "2018-07-17T20:00:00.000Z" }, "837763871": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "840467755": { "mode": "assassination", "short": "Field Assignment", "name": "Field Assignment: Assassination", "description": "" }, "840678113": { "mode": "normal", "short": "Tree of Probabilities", "name": "Tree of Probabilities", "description": "Contain a rampant army of Red Legion within the Infinite Forest." }, "849242583": { "mode": "normal", "short": "Analysis Mission", "name": "Analysis Mission", "description": "" }, "851841785": { "mode": "normal", "short": "The Machinist", "name": "The Machinist", "description": "Battle across the toxic wastelands to take down the Scorned Baron known as the Machinist." }, "854211606": { "mode": "normal", "short": "New Arcadia", "name": "New Arcadia", "description": "Hellas Basin, Mars" }, "855989781": { "mode": "normal", "short": "Reignite the Izanami Forge", "name": "Reignite the Izanami Forge", "description": "Now that the igniter is fully repaired, use it to reignite the Izanami Forge." }, "856342832": { "mode": "heroic deep conversation", "short": "", "name": "(Heroic) Deep Conversation", "description": "Failsafe has a plan to retrieve Vex data. But she'll need Ghost's help." }, "861639649": { "mode": "normal", "short": "Strange Terrain", "name": "Strange Terrain", "description": "Defeat Nokris before he completes his ritual." }, "861639650": { "mode": "normal", "short": "Strange Terrain", "name": "Strange Terrain", "description": "Defeat Nokris before he completes his ritual." }, "861639651": { "mode": "normal", "short": "Strange Terrain", "name": "Strange Terrain", "description": "Defeat Nokris before he completes his ritual." }, "874607482": { "mode": "normal", "short": "Bug in the System", "name": "Bug in the System", "description": "Corrupt a Vex data-harvesting operation by withstanding an onslaught of Hive." }, "877831883": { "mode": "normal", "short": "Homecoming", "name": "Homecoming", "description": "Relive the Homecoming experience." }, "880665770": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "" }, "882238722": { "mode": "normal", "short": "Lake of Shadows", "name": "Lake of Shadows", "description": "Stem the tide of Taken flowing into the European Dead Zone from beneath the waves." }, "884226738": { "mode": "normal", "short": "Spider's Safehouse", "name": "Spider's Safehouse", "description": "A lawless cantina overlooking the Tangled Shore and run by the Spider himself." }, "887176537": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Master", "description": "The Scarlet Keep" }, "887176540": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Adept", "description": "The Scarlet Keep" }, "887176542": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Legend", "description": "The Scarlet Keep" }, "887176543": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Hero", "description": "The Scarlet Keep" }, "897272366": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "903584917": { "mode": "normal", "short": "Mayhem", "name": "Mayhem", "description": "Faster Supers, abilities, and Heavy ammo spawns—withstand and engage in a whirlwind of chaos." }, "914148167": { "mode": "normal", "short": "Rumble", "name": "Rumble", "description": "\"It's you against the world. Make them remember your name.\" —Lord Shaxx\n\nFight for Valor by defeating opponents. No teams. No allegiance. A free-for-all where the leader had better watch their back." }, "917844293": { "mode": "normal", "short": "The Menagerie", "name": "The Menagerie", "description": "Pleasure and delight await you." }, "917887719": { "mode": "normal", "short": "Supremacy", "name": "Supremacy", "description": "Defeat opponents and claim their crests." }, "919252154": { "mode": "normal", "short": "Dark Alliance", "name": "Dark Alliance", "description": "Red Legion Psions are meddling with forces best left alone. Investigate their connection to dark forces in the region." }, "920826395": { "mode": "normal", "short": "Doubles", "name": "Doubles", "description": "\"Take risks and learn the art of war. You have one focus: The enemy must fall.\" —Lord Shaxx \n\nFight for Valor in more focused combat scenarios." }, "921878495": { "mode": "normal", "short": "Interference", "name": "Interference", "description": "Break Savathûn's assault and help Eris secure the Cradle." }, "926012363": { "mode": "normal", "short": "Assassination Mission", "name": "Assassination Mission", "description": "" }, "926940962": { "mode": "the pyramidion", "short": "Nightfall", "name": "Nightfall: The Pyramidion: Normal", "description": "Seek vengeance against the Vex Mind that corrupted Asher's arm." }, "927242860": { "mode": "normal", "short": "Ace in the Hole", "name": "Ace in the Hole", "description": "Track down Cayde's personal stash so you can repair the Ace of Spades." }, "927394522": { "mode": "the insight terminus", "short": "Nightfall", "name": "Nightfall: The Insight Terminus", "description": "Break into the ancient Vex installation." }, "928954298": { "mode": "normal", "short": "The Anomaly", "name": "The Anomaly", "description": "Mare Cognitum, Moon" }, "931636133": { "mode": "normal", "short": "Radiant Cliffs", "name": "Radiant Cliffs", "description": "Mercury's Past, Infinite Forest" }, "936308438": { "mode": "a garden world", "short": "Nightfall", "name": "Nightfall: A Garden World", "description": "Help Osiris cut back an out-of-control Vex Mind." }, "938512773": { "mode": "normal", "short": "Unbroken", "name": "Unbroken", "description": "Find Thumos the Unbroken and take the key codes he carries—by any means necessary." }, "940394831": { "mode": "exodus crash", "short": "QUEST", "name": "QUEST: Exodus Crash", "description": "Purge the Fallen infestation of the Exodus Black." }, "952725781": { "mode": "normal", "short": "Legion's Folly", "name": "Legion's Folly", "description": "Arcadian Valley, Nessus" }, "952904835": { "mode": "normal", "short": "Momentum Control", "name": "Momentum Control", "description": "\"You've been capturing zones and destroying your enemies for a long time, haven't you? Let's pick up the pace a bit.\" —Lord Shaxx\n\nFight for Valor by capturing zones and defeating opponents. All weapons are more lethal, abilities replenish only on kills, and tracker is disabled." }, "955852466": { "mode": "normal", "short": "1AU", "name": "1AU", "description": "The time has come to stop the Almighty. Board the ship, and shut down its annihilation weapon." }, "955874134": { "mode": "normal", "short": "The Hollowed Lair", "name": "The Hollowed Lair", "description": "The Fanatic has returned. Take him down and finish the job you started." }, "957727787": { "mode": "normal", "short": "Gofannon Forge", "name": "Gofannon Forge", "description": "Bring any Black Armory weapon frame or research frame to the Gofannon Forge to be crafted." }, "958578340": { "mode": "will of the thousands", "short": "Nightfall", "name": "Nightfall: Will of the Thousands: Normal", "description": "Liberate Rasputin by bringing an end to Xol's infestation of Mars." }, "960175301": { "mode": "normal", "short": "Crown of Sorrow", "name": "Crown of Sorrow: Normal", "description": "Grow [weak] with [pride].", "release": "2019-06-04T01:00:00.000Z" }, "962547783": { "mode": "normal", "short": "Emerald Coast", "name": "Emerald Coast", "description": "European Dead Zone, Earth" }, "963938931": { "mode": "normal", "short": "Deep Conversation", "name": "Deep Conversation", "description": "Failsafe has a plan to retrieve Vex data. But she'll need Ghost's help." }, "964196803": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "965849694": { "mode": "normal", "short": "Protocol \"Perfected Form\"", "name": "Protocol \"Perfected Form\"", "description": "Xol has surfaced and is attacking Rasputin. You're out of time. But Ana has one last plan." }, "969385987": { "mode": "normal", "short": "Lighting the Dark", "name": "Lighting the Dark", "description": "" }, "981383200": { "mode": "normal", "short": "Savathûn's Song", "name": "Savathûn's Song", "description": "Delve deep into the Hive-infested Arcology in search of missing fireteams." }, "981383201": { "mode": "normal", "short": "Savathûn's Song", "name": "Savathûn's Song", "description": "Delve deep into the Hive-infested Arcology in search of missing fireteams." }, "981383202": { "mode": "normal", "short": "Savathûn's Song", "name": "Savathûn's Song", "description": "Delve deep into the Hive-infested Arcology in search of missing fireteams." }, "989294159": { "mode": "tree of probabilities", "short": "Nightfall", "name": "Nightfall: Tree of Probabilities", "description": "Contain a rampant army of Red Legion within the Infinite Forest." }, "990984849": { "mode": "normal", "short": "Retribution", "name": "Retribution", "description": "Upper Stratosphere, Mars" }, "993152361": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "993905880": { "mode": "heroic supply and demand", "short": "", "name": "(Heroic) Supply and Demand", "description": "An old friend is looking for Red Legion supplies to… reappropriate. Scour Fallen territory for anything to scavenge." }, "996543292": { "mode": "normal", "short": "The Up and Up", "name": "The Up and Up", "description": "Prevent the Vex from completing a simulation of Fallen combat tactics." }, "996637433": { "mode": "active duty", "short": "Field Assignment", "name": "Field Assignment: Active Duty", "description": "" }, "999972877": { "mode": "heroic stop and go", "short": "", "name": "(Heroic) Stop and Go", "description": "Power generators in the Red Legion base are open to attack—but only for a short time. Speed into the subterranean complex and shut them down." }, "1002145272": { "mode": "normal", "short": "Tree of Probabilities", "name": "Tree of Probabilities", "description": "Now you know where to find the map of the Infinite Forest. Go and get it." }, "1002842615": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: A Garden World", "description": "A Garden World" }, "1003889713": { "mode": "normal", "short": "Javelin-4", "name": "Javelin-4", "description": "Warsat Launch Facility, Io" }, "1003955024": { "mode": "blood cleaver", "short": "WANTED", "name": "WANTED: Blood Cleaver", "description": "Hunt down the wanted Blood Cleaver that escaped from the Prison of Elders." }, "1011304245": { "mode": "normal", "short": "Chosen", "name": "Chosen", "description": "Relive the Chosen experience." }, "1018040791": { "mode": "heroic getting your hands dirty", "short": "", "name": "(Heroic) Getting Your Hands Dirty", "description": "Seize upon the Taken invasion of the EDZ, direct their assault against the Red Legion, and end it before it gets out of control." }, "1018385878": { "mode": "heroic dark alliance", "short": "", "name": "(Heroic) Dark Alliance", "description": "Red Legion Psions are meddling with forces best left alone. Investigate their connection to dark forces in the region." }, "1019949956": { "mode": "normal", "short": "Forge Ignition", "name": "Forge Ignition", "description": "Complete a forge ignition at the Volundr Forge" }, "1021495354": { "mode": "normal", "short": "Ice and Shadow", "name": "Ice and Shadow", "description": "A friendly Guardian has requested assistance on Mars. Help her investigate falling Warsats and battle a new threat." }, "1023966646": { "mode": "payback", "short": "Daily Heroic Story Mission", "name": "Daily Heroic Story Mission: Payback", "description": "Complete the Daily Heroic story mission." }, "1031809538": { "mode": "normal", "short": "Kell's Grave", "name": "Kell's Grave", "description": "Tangled Shore, The Reef" }, "1034003646": { "mode": "the insight terminus", "short": "Nightfall", "name": "Nightfall: The Insight Terminus", "description": "Break into the ancient Vex installation." }, "1035135049": { "mode": "normal", "short": "The Pyramidion", "name": "The Pyramidion", "description": "Seek vengeance against the Vex Mind that corrupted Asher's arm." }, "1035850837": { "mode": "normal", "short": "The Festering Core", "name": "The Festering Core", "description": "Descend into the heart of Io's Pyramidion and root out a burgeoning infestation." }, "1037070105": { "mode": "normal", "short": "Cathedral of Scars", "name": "Cathedral of Scars", "description": "The Dreaming City, The Vestian Web" }, "1038710420": { "mode": "normal", "short": "Assassination Mission", "name": "Assassination Mission", "description": "" }, "1043946881": { "mode": "normal", "short": "New Arcadia", "name": "New Arcadia", "description": "Hellas Basin, Mars" }, "1049899965": { "mode": "normal", "short": "Beyond Infinity", "name": "Beyond Infinity", "description": "It's time to enter the Infinite Forest and find Osiris. Be prepared for anything." }, "1053141615": { "mode": "normal", "short": "Assassination Mission", "name": "Assassination Mission", "description": "" }, "1057017675": { "mode": "normal", "short": "The Gateway", "name": "The Gateway", "description": "Osiris's damaged Ghost appeared on Mercury—along with a Vex army. That can't be a coincidence." }, "1060539534": { "mode": "despair", "short": "Nightmare Hunt", "name": "Nightmare Hunt: Despair", "description": "Defeat the Nightmare of Crota, Son of Oryx." }, "1063969232": { "mode": "normal", "short": "Invitation from the Emperor", "name": "Invitation from the Emperor", "description": "Cayde's worried about a mysterious message drawing the Red Legion to a remote corner of Nessus." }, "1065452335": { "mode": "normal", "short": "Legion's Folly", "name": "Legion's Folly", "description": "Arcadian Valley, Nessus" }, "1070049743": { "mode": "high plains blues", "short": "Daily Heroic Story Mission", "name": "Daily Heroic Story Mission: High Plains Blues", "description": "Complete the Daily Heroic story mission." }, "1073289414": { "mode": "normal", "short": "Landing Zone", "name": "Landing Zone", "description": "Fly directly to this Landing Zone." }, "1075001832": { "mode": "assassination", "short": "Field Assignment", "name": "Field Assignment: Assassination", "description": "" }, "1075152813": { "mode": "normal", "short": "European Dead Zone", "name": "European Dead Zone", "description": "Earth" }, "1076851943": { "mode": "normal", "short": "Assassination Mission", "name": "Assassination Mission", "description": "" }, "1082553800": { "mode": "beyond light", "short": "Destiny 2", "name": "Destiny 2: Beyond Light", "description": "Go beyond the Light and discover dark secrets held within the frozen frontier of Europa." }, "1085523978": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "" }, "1090267699": { "mode": "normal", "short": "Assassination Mission", "name": "Assassination Mission", "description": "" }, "1099158615": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "Survey mission" }, "1099555105": { "mode": "heroic", "short": "The Whisper", "name": "The Whisper (Heroic)", "description": "The Whisper (Heroic)", "release": "2018-07-21T12:00:00.000Z" }, "1101792305": { "mode": "normal", "short": "Savathûn's Song", "name": "Savathûn's Song", "description": "Delve deep into the Hive-infested Arcology in search of missing fireteams." }, "1102379070": { "mode": "normal", "short": "Mayhem", "name": "Mayhem", "description": "\"Enjoy yourselves, Guardians. You've earned it.\" —Lord Shaxx\n\nFight for Valor by defeating opponents. Abilities and Supers regenerate faster. Heavy ammo spawns more frequently." }, "1102824603": { "mode": "normal", "short": "Assassination Mission", "name": "Assassination Mission", "description": "" }, "1105211124": { "mode": "normal", "short": "Analysis Mission", "name": "Analysis Mission", "description": "" }, "1107208644": { "mode": "normal", "short": "Hack the Planet", "name": "Hack the Planet", "description": "Ghost has a plan to interface with the Nessus core. But he'll need Failsafe's help." }, "1107473294": { "mode": "normal", "short": "The Inverted Spire", "name": "The Inverted Spire", "description": "End the Red Legion expedition that's ripped open the planet's surface." }, "1111101131": { "mode": "silent fang", "short": "WANTED", "name": "WANTED: Silent Fang", "description": "Hunt down the wanted Silent Fang who escaped from the Prison of Elders." }, "1120584691": { "mode": "normal", "short": "Salvage mission", "name": "Salvage mission", "description": "" }, "1129066976": { "mode": "the pyramidion", "short": "Nightfall", "name": "Nightfall: The Pyramidion: Prestige", "description": "Seek vengeance against the Vex Mind that corrupted Asher's arm." }, "1132291813": { "mode": "scorned", "short": "Daily Heroic Story Mission", "name": "Daily Heroic Story Mission: Scorned", "description": "Complete the Daily Heroic story mission." }, "1134446996": { "mode": "normal", "short": "Warden of Nothing", "name": "Warden of Nothing", "description": "Help the Drifter restore order at the Prison of Elders." }, "1134562791": { "mode": "nessus", "short": "Origin", "name": "Origin: Nessus", "description": "Kell's Scourge operatives intercepted on Nessus revealed Siviks's center of operations here on Nessus.\n\nInvestigate Siviks's center of operations to track the origin of the tainted Black Armory gear." }, "1151331757": { "mode": "normal", "short": "Showdown", "name": "Showdown", "description": "All-out team warfare. Revive a defeated teammate to steal back the point your opponents scored." }, "1153409123": { "mode": "normal", "short": "Convergence", "name": "Convergence", "description": "Infinite Forest, Mercury" }, "1154661682": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "1159314159": { "mode": "normal", "short": "Poor Reception", "name": "Poor Reception", "description": "The Fallen are trying to block all communications in the EDZ. Find the source of the interference and shut it down." }, "1164772243": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "1166237584": { "mode": "normal", "short": "Pilgrimage", "name": "Pilgrimage", "description": "You've discovered the fabled BrayTech Futurescape. Investigate and search for traces of the Warmind." }, "1166905690": { "mode": "normal", "short": "Trials of Osiris", "name": "Trials of Osiris", "description": "Compete in a fireteam-required event version of Elimination. Earn as many wins on a ticket as you can. Three losses and you're out." }, "1175770231": { "mode": "normal", "short": "The Gateway", "name": "The Gateway", "description": "Osiris's damaged Ghost appeared on Mercury—along with a Vex army. That can't be a coincidence." }, "1182517645": { "mode": "normal", "short": "Legacy Strikes", "name": "Legacy Strikes", "description": "The Vanguard seeks Guardians to undertake high-priority missions against the City's enemies." }, "1183187383": { "mode": "normal", "short": "Gambit Prime", "name": "Gambit Prime", "description": "Choose your role in this intense single-round evolution of Gambit. Send Blockers to drain Motes from the enemy's bank. Create a Well of Light by defeating envoys. Stand in the Well to burn down the Primeval and win." }, "1188363426": { "mode": "servitude", "short": "Nightmare Hunt", "name": "Nightmare Hunt: Servitude: Master", "description": "Defeat the Nightmare of Zydron, Gate Lord." }, "1188363427": { "mode": "servitude", "short": "Nightmare Hunt", "name": "Nightmare Hunt: Servitude: Legend", "description": "Defeat the Nightmare of Zydron, Gate Lord." }, "1188363428": { "mode": "servitude", "short": "Nightmare Hunt", "name": "Nightmare Hunt: Servitude: Hero", "description": "Defeat the Nightmare of Zydron, Gate Lord." }, "1188363429": { "mode": "servitude", "short": "Nightmare Hunt", "name": "Nightmare Hunt: Servitude: Adept", "description": "Defeat the Nightmare of Zydron, Gate Lord." }, "1194986370": { "mode": "normal", "short": "Ice and Shadow", "name": "Ice and Shadow", "description": "A friendly Guardian has requested assistance on Mars. Help her investigate falling Warsats and battle a new threat." }, "1198216109": { "mode": "normal", "short": "Will of the Thousands", "name": "Will of the Thousands", "description": "Defeat Xol before everything is destroyed." }, "1199493030": { "mode": "[arc] day", "short": "European Aerial Zone", "name": "European Aerial Zone: [Arc] Day", "description": "Arc energies crackle through the EAZ, filling the air with the smell of ozone.\n\nEquip your Arc subclass and weapons to generate Arc orbs, then collect them to become Arc Empowered. While empowered, Guardians move with enhanced speed, deal greater melee and Sword damage, and drain Super energy half as quickly." }, "1202325606": { "mode": "normal", "short": "Ice and Shadow", "name": "Ice and Shadow", "description": "A friendly Guardian has requested assistance on Mars. Help her investigate falling Warsats and battle a new threat." }, "1202325607": { "mode": "normal", "short": "Ice and Shadow", "name": "Ice and Shadow", "description": "A friendly Guardian has requested assistance on Mars. Help her investigate falling Warsats and battle a new threat." }, "1206154103": { "mode": "normal", "short": "Assassination Mission", "name": "Assassination Mission", "description": "" }, "1207505828": { "mode": "the arms dealer", "short": "QUEST", "name": "QUEST: The Arms Dealer: Prestige", "description": "Shut down the operations of an ironmonger providing weapons to the Red Legion." }, "1218001922": { "mode": "normal", "short": "Private Match", "name": "Private Match", "description": "Create a custom PvP match with your fireteam, and best your comrades for personal glory… and bragging rights." }, "1219083526": { "mode": "normal", "short": "Team Scorched", "name": "Team Scorched", "description": "\"You've got a Scorch Cannon, they've got Scorch Cannons. Make a mess.\" —Lord Shaxx\n\nFight for Valor by defeating opponents using Scorch Cannons." }, "1225970098": { "mode": "normal", "short": "Lost Crew", "name": "Lost Crew", "description": "Help Failsafe find two long-lost members of her crew." }, "1228327586": { "mode": "normal", "short": "Anti-Anti-Air", "name": "Anti-Anti-Air", "description": "Infiltrate the Red Legion base and disable their network of flak turrets." }, "1228482987": { "mode": "normal", "short": "Cathedral of Scars", "name": "Cathedral of Scars", "description": "The Dreaming City, The Vestian Web" }, "1229540554": { "mode": "active duty", "short": "Field Assignment", "name": "Field Assignment: Active Duty", "description": "" }, "1232183849": { "mode": "the hangman", "short": "Target", "name": "Target: The Hangman", "description": "Avenge Cayde's death by crossing the Scorned Baron known as the Hangman off your list." }, "1233767907": { "mode": "normal", "short": "Hellas Basin", "name": "Hellas Basin", "description": "Fly directly to this Landing Zone." }, "1242943383": { "mode": "normal", "short": "Cauldron", "name": "Cauldron", "description": "Ocean of Storms, Moon" }, "1243390694": { "mode": "normal", "short": "Larceny", "name": "Larceny", "description": "Break into the Red Legion base and steal the personal shuttle of Thumos the no-longer-Unbroken." }, "1249965655": { "mode": "normal", "short": "Analysis Mission", "name": "Analysis Mission", "description": "" }, "1250426564": { "mode": "normal", "short": "Assassination Mission", "name": "Assassination Mission", "description": "" }, "1254004276": { "mode": "active duty", "short": "Field Assignment", "name": "Field Assignment: Active Duty", "description": "" }, "1254990192": { "mode": "normal", "short": "No Safe Distance", "name": "No Safe Distance", "description": "The Red Legion base is full of explosives even more dangerous than usual. Find and neutralize them before they can enter the field." }, "1259766043": { "mode": "beyond infinity", "short": "Daily Heroic Story Mission", "name": "Daily Heroic Story Mission: Beyond Infinity", "description": "Complete the Daily Heroic story mission." }, "1263901594": { "mode": "normal", "short": "Tree of Probabilities", "name": "Tree of Probabilities", "description": "Contain a rampant army of Red Legion within the Infinite Forest." }, "1265390366": { "mode": "normal", "short": "Poor Reception", "name": "Poor Reception", "description": "The Fallen are trying to block all communications in the EDZ. Find the source of the interference and shut it down." }, "1267556998": { "mode": "normal", "short": "Analysis Mission", "name": "Analysis Mission", "description": "" }, "1275562432": { "mode": "heroic thief of thieves", "short": "", "name": "(Heroic) Thief of Thieves", "description": "Recover the supplies that the Fallen have taken." }, "1276739382": { "mode": "normal", "short": "Breakthrough", "name": "Breakthrough", "description": "Deploy the Breaker to expose your opponents' vault. Then, hack their vault to plunder it." }, "1278641935": { "mode": "normal", "short": "A Garden World", "name": "A Garden World", "description": "Enter the Infinite Forest and steal the algorithm that will let you track Panoptes in the present." }, "1279862229": { "mode": "normal", "short": "Bug in the System", "name": "Bug in the System", "description": "Corrupt a Vex data-harvesting operation by withstanding an onslaught of Hive." }, "1281404748": { "mode": "normal", "short": "The Reckoning", "name": "The Reckoning", "description": "Venture into the mysterious Haul that the Drifter tows behind his ship to reckon with greater powers." }, "1282886582": { "mode": "exodus crash", "short": "Nightfall", "name": "Nightfall: Exodus Crash", "description": "Purge the Fallen infestation of the Exodus Black." }, "1288602363": { "mode": "legendary", "short": "Scavenger's Den", "name": "Scavenger's Den (Legendary)", "description": "Head to Scavenger's Den and defeat Graxus, Blind Captain to retrieve Warmind Bits.\n\nMatch Game: Fallen\n\nChampions: Overload, Barrier" }, "1289867188": { "mode": "normal", "short": "Unbreakable", "name": "Unbreakable", "description": "Failsafe has caught wind of Vex tech that could result in unstoppable barriers." }, "1290744998": { "mode": "normal", "short": "The Farm", "name": "The Farm", "description": "A refugee camp set up during the Red War for Guardians and non Guardians alike, on the outskirts of the EDZ." }, "1292137709": { "mode": "normal", "short": "New Arcadia", "name": "New Arcadia", "description": "Hellas Basin, Mars" }, "1294490226": { "mode": "normal", "short": "Deathly Tremors", "name": "Deathly Tremors", "description": "Investigate the strange Hive signals." }, "1295173537": { "mode": "normal", "short": "The Insight Terminus", "name": "The Insight Terminus", "description": "Break into the ancient Vex installation." }, "1296063136": { "mode": "normal", "short": "Faculties of the Skull", "name": "Faculties of the Skull", "description": "Eris Morn believes the Hive's wicked science can be turned against them. Help her investigate the Circle of Bones beneath the Moon." }, "1302437673": { "mode": "heroic a frame job", "short": "", "name": "(Heroic) A Frame Job", "description": "Travel deep into enemy territory, ambush the Red Legion, and trick them into retaliating against the Fallen." }, "1302909042": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Master", "description": "Lake of Shadows" }, "1302909043": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Grandmaster", "description": "Lake of Shadows" }, "1302909044": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Hero", "description": "Lake of Shadows" }, "1302909045": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Legend", "description": "Lake of Shadows" }, "1302909047": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Adept", "description": "Lake of Shadows" }, "1309646866": { "mode": "normal", "short": "The Farm", "name": "The Farm", "description": "A refugee camp set up during the Red War for Guardians and non Guardians alike, on the outskirts of the EDZ." }, "1310854805": { "mode": "normal", "short": "Rumble", "name": "Rumble", "description": "No teams. No allegiance. A free-for-all where the leader had better watch their back." }, "1312786953": { "mode": "normal", "short": "Mayhem", "name": "Mayhem", "description": "Faster Supers, abilities, and Heavy ammo spawns—withstand and engage in a whirlwind of chaos." }, "1313648352": { "mode": "looped", "short": "Daily Heroic Story Mission", "name": "Daily Heroic Story Mission: Looped", "description": "Complete the Daily Heroic story mission." }, "1313738982": { "mode": "normal", "short": "Dark Monastery", "name": "Dark Monastery", "description": "Provide recon for Petra's forces by investigating strange enemy activity in Rheasilvia." }, "1317492847": { "mode": "normal", "short": "Will of the Thousands", "name": "Will of the Thousands", "description": "Defeat Xol before everything is destroyed." }, "1326496189": { "mode": "normal", "short": "Beyond", "name": "Beyond", "description": "What secrets lie within the Pyramid? It sits in silence, waiting for you.\n\nHead to the Enduring Abyss, past the Pyramid's warding, and find a way inside." }, "1331268141": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "" }, "1332567112": { "mode": "normal", "short": "The Pyramidion", "name": "The Pyramidion", "description": "Seek vengeance against the Vex Mind that corrupted Asher's arm." }, "1332567114": { "mode": "normal", "short": "The Pyramidion", "name": "The Pyramidion", "description": "Seek vengeance against the Vex Mind that corrupted Asher's arm." }, "1332567115": { "mode": "normal", "short": "The Pyramidion", "name": "The Pyramidion", "description": "Seek vengeance against the Vex Mind that corrupted Asher's arm." }, "1333621919": { "mode": "heroic unsafe at any speed", "short": "", "name": "(Heroic) Unsafe at Any Speed", "description": "A nasty Fallen Pike gang is wreaking havoc in the area. Capture enemy vehicles and use them to even the odds." }, "1338487764": { "mode": "normal", "short": "A Hum of Starlight", "name": "A Hum of Starlight", "description": "Complete mission \"A Hum of Starlight.\"" }, "1342492674": { "mode": "fear", "short": "Nightmare Hunt", "name": "Nightmare Hunt: Fear: Legend", "description": "Defeat the Nightmare of Phogoth." }, "1342492675": { "mode": "fear", "short": "Nightmare Hunt", "name": "Nightmare Hunt: Fear: Master", "description": "Defeat the Nightmare of Phogoth." }, "1342492676": { "mode": "fear", "short": "Nightmare Hunt", "name": "Nightmare Hunt: Fear: Adept", "description": "Defeat the Nightmare of Phogoth." }, "1342492677": { "mode": "fear", "short": "Nightmare Hunt", "name": "Nightmare Hunt: Fear: Hero", "description": "Defeat the Nightmare of Phogoth." }, "1352934668": { "mode": "legendary", "short": "K1 Logistics", "name": "K1 Logistics (Legendary)", "description": "Head to K1 Logistics and defeat the Nightmare of Kelnix Reborn to retrieve Warmind Bits.\n\nMatch Game: Fallen\n\nChampions: Barrier, Overload" }, "1357019430": { "mode": "exodus crash", "short": "Nightfall", "name": "Nightfall: Exodus Crash: Normal", "description": "Purge the Fallen infestation of the Exodus Black." }, "1358255449": { "mode": "normal", "short": "Crimson Days", "name": "Crimson Days", "description": "\"Your partner is your life.\" —Lord Shaxx \n\nFight alongside a teammate and work together to crush your opponents." }, "1358381368": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Adept", "description": "The Arms Dealer" }, "1358381370": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Legend", "description": "The Arms Dealer" }, "1358381371": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Hero", "description": "The Arms Dealer" }, "1358381372": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Grandmaster", "description": "The Arms Dealer" }, "1358381373": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Master", "description": "The Arms Dealer" }, "1360385764": { "mode": "normal", "short": "Warden of Nothing", "name": "Warden of Nothing", "description": "Help the Drifter restore order at the Prison of Elders." }, "1360385765": { "mode": "normal", "short": "Warden of Nothing", "name": "Warden of Nothing", "description": "Help the Drifter restore order at the Prison of Elders." }, "1360385767": { "mode": "normal", "short": "Warden of Nothing", "name": "Warden of Nothing", "description": "Help the Drifter restore order at the Prison of Elders." }, "1367215417": { "mode": "normal", "short": "Lost Souvenir", "name": "Lost Souvenir", "description": "The Antechamber requires a new passcode." }, "1375089621": { "mode": "normal", "short": "Pit of Heresy", "name": "Pit of Heresy: Normal", "description": "Deep beneath Sorrow's Harbor, the Hive keep their darkest secrets.", "release": "2019-10-29T18:00:00.000Z" }, "1375839088": { "mode": "normal", "short": "Analysis Mission", "name": "Analysis Mission", "description": "" }, "1391780798": { "mode": "broodhold", "short": "Nightfall", "name": "Nightfall: Broodhold", "description": "Eradicate a Hive infestation seething in the depths of the Tangled Shore." }, "1396849690": { "mode": "normal", "short": "Choir of the Damned", "name": "Choir of the Damned", "description": "Fight your way into the depths of the Circle of Bones, survive the Aria, and defeat the Deathsinger, Ir Airâm. Then, bring her skull to Eris Morn." }, "1399384455": { "mode": "active duty", "short": "Field Assignment", "name": "Field Assignment: Active Duty", "description": "" }, "1406685380": { "mode": "normal", "short": "Exploring the Corridors of Time", "name": "Exploring the Corridors of Time", "description": "You've saved Saint-14, but you've left the Corridors of Time largely unexplored. See what you can find." }, "1411733329": { "mode": "legendary", "short": "K1 Crew Quarters", "name": "K1 Crew Quarters (Legendary)", "description": "Head to K1 Crew Quarters and defeat the Nightmare of Reyiks, Actuator to retrieve Warmind Bits.\n\nMatch Game: Fallen\n\nChampions: Barrier, Overload" }, "1416597166": { "mode": "normal", "short": "Supply and Demand", "name": "Supply and Demand", "description": "An old friend is looking for Red Legion supplies to… reappropriate. Scour Fallen territory for anything to scavenge." }, "1418217191": { "mode": "heroic", "short": "The Up and Up", "name": "The Up and Up (Heroic)", "description": "Prevent the Vex from completing a simulation of Fallen combat tactics." }, "1419459505": { "mode": "normal", "short": "Off-World Recovery", "name": "Off-World Recovery", "description": "You need something to draw out Xol. A fragment of the Traveler has been located in the EDZ. Recover it." }, "1426391278": { "mode": "normal", "short": "Deep Storage", "name": "Deep Storage", "description": "Search the Pyramidion on Io for a map of the Infinite Forest to guide you to Panoptes." }, "1428050875": { "mode": "normal", "short": "My Captain", "name": "My Captain", "description": "Complete mission \"My Captain\" on Nessus." }, "1431348899": { "mode": "the pyramidion", "short": "Unidentified Frame", "name": "Unidentified Frame: The Pyramidion", "description": "Complete the strike \"The Pyramidion\" to collect Radiant Phaseglass for the Unidentified Frame." }, "1434072700": { "mode": "normal", "short": "Bergusia Forge", "name": "Bergusia Forge", "description": "Bring any Black Armory weapon frame or research frame to the Bergusia Forge to be crafted." }, "1435054848": { "mode": "normal", "short": "Midtown", "name": "Midtown", "description": "The Last City, Earth" }, "1446606128": { "mode": "tier iii", "short": "The Reckoning", "name": "The Reckoning: Tier III", "description": "Venture into the mysterious Haul that the Drifter tows behind his ship to reckon with greater powers." }, "1448435553": { "mode": "normal", "short": "Emperor's Respite", "name": "Emperor's Respite", "description": "Prison Barge, Leviathan" }, "1451946951": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "1454880421": { "mode": "normal", "short": "Haunted Forest", "name": "Haunted Forest", "description": "A darkened instance of the Infinite Forest. Descend into its depths with a fireteam, and see how far you can get before it disintegrates." }, "1457072306": { "mode": "normal", "short": "Showdown", "name": "Showdown", "description": "\"This combat drill will test you from start to finish. Stay on your game, lest you find yourself on the wrong end of the final showdown.\" —Lord Shaxx\n\nFight for Valor by defeating opponents and preventing revives. Win the most rounds or face off in an elimination showdown." }, "1465939129": { "mode": "the hollowed lair", "short": "Nightfall", "name": "Nightfall: The Hollowed Lair", "description": "The Fanatic has returned. Take him down and finish the job you started." }, "1466550401": { "mode": "normal", "short": "Unsafe at Any Speed", "name": "Unsafe at Any Speed", "description": "A nasty Fallen Pike gang is wreaking havoc in the area. Capture enemy vehicles and use them to even the odds." }, "1475539136": { "mode": "normal", "short": "The Hollowed Lair", "name": "The Hollowed Lair", "description": "The Fanatic has returned. Take him down and finish the job you started." }, "1475539137": { "mode": "normal", "short": "The Hollowed Lair", "name": "The Hollowed Lair", "description": "The Fanatic has returned. Take him down and finish the job you started." }, "1475539139": { "mode": "normal", "short": "The Hollowed Lair", "name": "The Hollowed Lair", "description": "The Fanatic has returned. Take him down and finish the job you started." }, "1476184507": { "mode": "the rifleman", "short": "Target", "name": "Target: The Rifleman", "description": "Avenge Cayde's death by crossing the Scorned Baron known as the Rifleman off your list." }, "1478171612": { "mode": "normal", "short": "Elimination", "name": "Elimination", "description": "\"This is the ultimate test of your skill as a fireteam, Guardians! Make me proud.\" —Lord Shaxx\n\nFight for Valor by eliminating all opponents in this round-based mode." }, "1482206498": { "mode": "normal", "short": "Convergence", "name": "Convergence", "description": "Infinite Forest, Mercury" }, "1483179969": { "mode": "normal", "short": "Forge Ignition", "name": "Forge Ignition", "description": "Complete a forge ignition at the Gofannon Forge" }, "1489679220": { "mode": "normal", "short": "Endless Vale", "name": "Endless Vale", "description": "Arcadian Valley, Nessus" }, "1490848577": { "mode": "normal", "short": "Looped", "name": "Looped", "description": "No one's heard from Cayde-6 since the Hunter took off for an uncharted world. Track him down." }, "1491022087": { "mode": "normal", "short": "Exodus Siege", "name": "Exodus Siege", "description": "The Fallen prepare to attack Failsafe's mainframe aboard the Exodus Black." }, "1495993294": { "mode": "normal", "short": "Lake of Shadows", "name": "Lake of Shadows", "description": "Stem the tide of Taken flowing into the European Dead Zone from beneath the waves." }, "1498466193": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "1502633527": { "mode": "normal", "short": "Tower", "name": "Tower", "description": "Home of the Guardians, where you can regroup, rearm, and form new alliances before venturing beyond." }, "1503376677": { "mode": "normal", "short": "Hephaestus", "name": "Hephaestus", "description": "Destroy dangerous information before it falls into the wrong hands." }, "1503474689": { "mode": "lake of shadows", "short": "Nightfall", "name": "Nightfall: Lake of Shadows", "description": "Stem the tide of Taken flowing into the European Dead Zone from beneath the waves." }, "1506080581": { "mode": "normal", "short": "Volundr Forge", "name": "Volundr Forge", "description": "Bring any Black Armory weapon frame or research frame to the Volundr Forge to be crafted." }, "1506810517": { "mode": "normal", "short": "The Menagerie", "name": "The Menagerie", "description": "Pleasure and delight await you." }, "1512980468": { "mode": "normal", "short": "The Gateway", "name": "The Gateway", "description": "Osiris's damaged Ghost appeared on Mercury—along with a Vex army. That can't be a coincidence." }, "1513386090": { "mode": "last call", "short": "Daily Heroic Story Mission", "name": "Daily Heroic Story Mission: Last Call", "description": "Complete the Daily Heroic story mission." }, "1525152742": { "mode": "normal", "short": "Assassination Mission", "name": "Assassination Mission", "description": "" }, "1525633702": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "1534123682": { "mode": "unbroken", "short": "Daily Heroic Story Mission", "name": "Daily Heroic Story Mission: Unbroken", "description": "Complete the Daily Heroic story mission." }, "1536764325": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "" }, "1542611209": { "mode": "normal", "short": "Savathûn's Song", "name": "Savathûn's Song", "description": "Delve deep into the Hive-infested Arcology in search of missing fireteams." }, "1549614516": { "mode": "normal", "short": "Exodus Crash", "name": "Exodus Crash", "description": "Purge the Fallen infestation of the Exodus Black." }, "1552357266": { "mode": "legendary", "short": "Grove of Ulan-Tan", "name": "Grove of Ulan-Tan (Legendary)", "description": "Head to the Grove of Ulan-Tan and defeat Qeldron, Keeper to retrieve Warmind Bits.\n\nMatch Game: Vex\n\nChampions: Barrier, Overload" }, "1557641249": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "1563393783": { "mode": "normal", "short": "Exodus Crash", "name": "Exodus Crash", "description": "Purge the Fallen infestation of the Exodus Black." }, "1568750156": { "mode": "normal", "short": "The Farm", "name": "The Farm", "description": "A refugee camp set up during the Red War for Guardians and non Guardians alike, on the outskirts of the EDZ." }, "1570598249": { "mode": "normal", "short": "The Runner", "name": "The Runner", "description": "Stop a Cabal simulation carrying heavily encrypted data." }, "1581219251": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "" }, "1583254851": { "mode": "normal", "short": "The Fortress", "name": "The Fortress", "description": "European Dead Zone, Earth" }, "1597801559": { "mode": "normal", "short": "The Farm", "name": "The Farm", "description": "A refugee camp set up during the Red War for Guardians and non Guardians alike, on the outskirts of the EDZ." }, "1602328239": { "mode": "six", "short": "Daily Heroic Story Mission", "name": "Daily Heroic Story Mission: Six", "description": "Complete the Daily Heroic story mission." }, "1603374112": { "mode": "normal", "short": "The Pyramidion", "name": "The Pyramidion", "description": "Seek vengeance against the Vex Mind that corrupted Asher's arm." }, "1612844171": { "mode": "normal", "short": "Festival of the Lost… Sector", "name": "Festival of the Lost… Sector", "description": "Amanda asked you to put on your mask and \"show the bad guys they can't keep us down.\" What better place during this holiday season than the Sanctum of Bones?" }, "1614692057": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "1640956655": { "mode": "normal", "short": "Broken Courier", "name": "Broken Courier", "description": "Respond to a distress call in the Strand." }, "1643069750": { "mode": "normal", "short": "Incursion", "name": "Incursion", "description": "Stop the Cabal scavengers." }, "1646729752": { "mode": "normal", "short": "Armsweek Strikes", "name": "Armsweek Strikes", "description": "Launches a random Destiny 2 or Curse of Osiris strike—requiring a specific weapon loadout." }, "1651979106": { "mode": "normal", "short": "Postmodern Prometheus", "name": "Postmodern Prometheus", "description": "Ikora is reluctantly allowing Asher to explore a plan where he'd convert the Traveler's energy into a form of synthetic Light." }, "1657356109": { "mode": "heroic", "short": "Psionic Potential", "name": "Psionic Potential (Heroic)", "description": "Locate the stolen supplies." }, "1657533742": { "mode": "normal", "short": "Corridors of Time Part 2", "name": "Corridors of Time Part 2", "description": "The Sundial is ready for another time jump. Use it to travel back to the coordinates broadcast to you by the Perfect Paradox Shotgun." }, "1658347443": { "mode": "normal", "short": "Homecoming", "name": "Homecoming", "description": "The Last City is under attack by the Red Legion. It's time to fight back." }, "1661734046": { "mode": "normal", "short": "Last Wish", "name": "Last Wish: Normal", "description": "\"The opportunity of a lifetime.\"" }, "1671235700": { "mode": "heroic release", "short": "", "name": "(Heroic) Release", "description": "The Vex appear to be capturing the Fallen, and Failsafe wants it stopped." }, "1673114595": { "mode": "normal", "short": "Pacifica", "name": "Pacifica", "description": "Tidal Anchor, Titan" }, "1679453803": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "1679518121": { "mode": "normal", "short": "The Arms Dealer", "name": "The Arms Dealer", "description": "Shut down the operations of an ironmonger providing weapons to the Red Legion." }, "1682036469": { "mode": "heroic", "short": "Deathly Tremors", "name": "Deathly Tremors (Heroic)", "description": "Investigate the strange Hive signals." }, "1685065161": { "mode": "prestige", "short": "Leviathan", "name": "Leviathan: Prestige", "description": "\"Grow fat from strength.\"", "release": "2017-10-18T19:00:00.000Z" }, "1685237649": { "mode": "normal", "short": "Assassination Mission", "name": "Assassination Mission", "description": "" }, "1689885469": { "mode": "pilgrimage", "short": "Field Assignment", "name": "Field Assignment: Pilgrimage", "description": "" }, "1691057182": { "mode": "normal", "short": "Analysis Mission", "name": "Analysis Mission", "description": "" }, "1694456220": { "mode": "normal", "short": "Visions of Light", "name": "Visions of Light", "description": "Your visions have led you to Io. Follow where they lead you." }, "1694936744": { "mode": "normal", "short": "Private Match", "name": "Private Match", "description": "Create a custom PvP match with your fireteam, and best your comrades for personal glory… and bragging rights." }, "1699948563": { "mode": "normal", "short": "Leviathan", "name": "Leviathan", "description": "\"Grow fat from strength.\"" }, "1701995982": { "mode": "suros regime", "short": "Armsweek Nightfall", "name": "Armsweek Nightfall: SUROS Regime: Prestige", "description": "Defeat Xol's necromancer, Nokris, and his army of Frozen Hive." }, "1702649201": { "mode": "normal", "short": "Vostok", "name": "Vostok", "description": "Felwinter Peak, Earth" }, "1705677315": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "" }, "1709912095": { "mode": "normal", "short": "Crucible Labs", "name": "Crucible Labs", "description": "Participate in experimental, work-in-progress Crucible experiences. For more information on Crucible Labs, visit bungie.net." }, "1711620427": { "mode": "normal", "short": "Legion's Gulch", "name": "Legion's Gulch", "description": "European Dead Zone, Earth" }, "1725302079": { "mode": "normal", "short": "The Up and Up", "name": "The Up and Up", "description": "Prevent the Vex from completing a simulation of Fallen combat tactics." }, "1733006874": { "mode": "normal", "short": "Legion's Gulch", "name": "Legion's Gulch", "description": "European Dead Zone, Earth" }, "1740310101": { "mode": "heroic", "short": "Bug in the System", "name": "Bug in the System (Heroic)", "description": "Corrupt a Vex data-harvesting operation by withstanding an onslaught of Hive." }, "1743518000": { "mode": "normal", "short": "The Inverted Spire", "name": "The Inverted Spire", "description": "End the Red Legion expedition that's ripped open the planet's surface." }, "1743518001": { "mode": "normal", "short": "The Inverted Spire", "name": "The Inverted Spire", "description": "End the Red Legion expedition that's ripped open the planet's surface." }, "1743518003": { "mode": "normal", "short": "The Inverted Spire", "name": "The Inverted Spire", "description": "End the Red Legion expedition that's ripped open the planet's surface." }, "1746163491": { "mode": "normal", "short": "Supremacy", "name": "Supremacy", "description": "Defeat opponents and claim their crests." }, "1755484011": { "mode": "normal", "short": "Classified", "name": "Classified", "description": "Keep it secret.  Keep it safe." }, "1756055546": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "1760460831": { "mode": "normal", "short": "Fury", "name": "Fury", "description": "Help Ikora use the Warmind on Io to learn more about the Almighty—and turn the tide of the war." }, "1773400654": { "mode": "normal", "short": "Invitation from the Emperor", "name": "Invitation from the Emperor", "description": "Cayde's worried about a mysterious message drawing the Red Legion to a remote corner of Nessus." }, "1775791936": { "mode": "normal", "short": "The Scarlet Keep", "name": "The Scarlet Keep", "description": "Investigate the recently erected Scarlet Keep and discover its dark purpose." }, "1778450722": { "mode": "normal", "short": "Analysis Mission", "name": "Analysis Mission", "description": "" }, "1778527052": { "mode": "normal", "short": "Broodhold", "name": "Broodhold", "description": "Eradicate a Hive infestation seething in the depths of the Tangled Shore." }, "1778527054": { "mode": "normal", "short": "Broodhold", "name": "Broodhold", "description": "Eradicate a Hive infestation seething in the depths of the Tangled Shore." }, "1778527055": { "mode": "normal", "short": "Broodhold", "name": "Broodhold", "description": "Eradicate a Hive infestation seething in the depths of the Tangled Shore." }, "1783922093": { "mode": "heroic", "short": "Incursion", "name": "Incursion (Heroic)", "description": "Stop the Cabal scavengers." }, "1786054751": { "mode": "normal", "short": "Premeditation", "name": "Premeditation", "description": "Ikora's agents have reported unusual Taken activity on the plateaus of Io. Confirm the intel." }, "1790343591": { "mode": "normal", "short": "Shard of the Traveler", "name": "Shard of the Traveler", "description": "Return to the Shard of the Traveler and restore your connection to the Light." }, "1792985204": { "mode": "exodus crash", "short": "Nightfall", "name": "Nightfall: Exodus Crash: Prestige", "description": "Purge the Fallen infestation of the Exodus Black." }, "1794007817": { "mode": "strange terrain", "short": "Nightfall", "name": "Nightfall: Strange Terrain: Prestige", "description": "Defeat Xol's necromancer, Nokris, and his army of Frozen Hive." }, "1799380107": { "mode": "normal", "short": "The Lost Cryptarch", "name": "The Lost Cryptarch", "description": "" }, "1800508819": { "mode": "prestige", "short": "Leviathan", "name": "Leviathan: Prestige", "description": "\"Grow fat from strength.\"", "release": "2017-10-18T19:00:00.000Z" }, "1800749202": { "mode": "heroic", "short": "The Rider", "name": "The Rider (Heroic)", "description": "Avenge Cayde's death by crossing the Scorned Baron known as the Rider off your list." }, "1801803624": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Hero", "description": "The Inverted Spire" }, "1801803625": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Legend", "description": "The Inverted Spire" }, "1801803627": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Adept", "description": "The Inverted Spire" }, "1801803630": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Master", "description": "The Inverted Spire" }, "1811228210": { "mode": "heroic", "short": "Psionic Potential", "name": "Psionic Potential (Heroic)", "description": "Locate the stolen supplies." }, "1815340083": { "mode": "normal", "short": "Equinox", "name": "Equinox", "description": "Unknown Space" }, "1823921651": { "mode": "normal", "short": "The Up and Up", "name": "The Up and Up", "description": "Prevent the Vex from completing a simulation of Fallen combat tactics." }, "1824067376": { "mode": "normal", "short": "Road Rage", "name": "Road Rage", "description": "Asher's worked up about Vex interest in the Io Vault. He's got an unusual suggestion for how to deal with the problem." }, "1829866365": { "mode": "normal", "short": "Getting Your Hands Dirty", "name": "Getting Your Hands Dirty", "description": "Seize upon the Taken invasion of the EDZ, direct their assault against the Red Legion, and end it before it gets out of control." }, "1831470693": { "mode": "the menagerie", "short": "The Menagerie", "name": "The Menagerie: The Menagerie (Heroic) Matchmaking", "description": "Pleasure and delight await you." }, "1848339284": { "mode": "normal", "short": "Neutralize the Target", "name": "Neutralize the Target", "description": "Neutralize the target." }, "1859507212": { "mode": "normal", "short": "Private Match", "name": "Private Match", "description": "Create a custom PvP match with your fireteam, and best your comrades for personal glory… and bragging rights." }, "1863334927": { "mode": "savathûn's song", "short": "Nightfall", "name": "Nightfall: Savathûn's Song", "description": "Delve deep into the Hive-infested Arcology in search of missing fireteams." }, "1872813880": { "mode": "deep storage", "short": "Daily Heroic Story Mission", "name": "Daily Heroic Story Mission: Deep Storage", "description": "Complete the Daily Heroic story mission." }, "1874578888": { "mode": "heroic", "short": "Bug in the System", "name": "Bug in the System (Heroic)", "description": "Corrupt a Vex data-harvesting operation by withstanding an onslaught of Hive." }, "1875726950": { "mode": "normal", "short": "Leviathan", "name": "Leviathan", "description": "\"Grow fat from strength.\"" }, "1878615566": { "mode": "normal", "short": "Forge Ignition", "name": "Forge Ignition", "description": "Complete a forge ignition at the Izanami Forge" }, "1882259272": { "mode": "the gateway", "short": "Daily Heroic Story Mission", "name": "Daily Heroic Story Mission: The Gateway", "description": "Complete the Daily Heroic story mission." }, "1887396202": { "mode": "normal", "short": "Private Match", "name": "Private Match", "description": "Create a custom PvP match with your fireteam, and best your comrades for personal glory… and bragging rights." }, "1891220709": { "mode": "normal", "short": "Will of the Thousands", "name": "Will of the Thousands", "description": "Defeat Xol before everything is destroyed." }, "1893059148": { "mode": "normal", "short": "The Shattered Throne", "name": "The Shattered Throne", "description": "Strike back at the curse that plagues the Dreaming City.", "release": "2018-09-25T18:00:00.000Z" }, "1895583725": { "mode": "level 50", "short": "Vanguard Strikes", "name": "Vanguard Strikes: Level 50", "description": "The Vanguard seeks Guardians to undertake high-priority missions against the City's enemies." }, "1895583726": { "mode": "level 40", "short": "Vanguard Strikes", "name": "Vanguard Strikes: Level 40", "description": "The Vanguard seeks Guardians to undertake high-priority missions against the City's enemies." }, "1895583727": { "mode": "level 30", "short": "Vanguard Strikes", "name": "Vanguard Strikes: Level 30", "description": "The Vanguard seeks Guardians to undertake high-priority missions against the City's enemies." }, "1899006128": { "mode": "normal", "short": "Emerald Coast", "name": "Emerald Coast", "description": "European Dead Zone, Earth" }, "1903826490": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "Survey mission" }, "1906514856": { "mode": "chosen", "short": "Daily Heroic Story Mission", "name": "Daily Heroic Story Mission: Chosen", "description": "Complete the Daily Heroic story mission." }, "1907493624": { "mode": "pride", "short": "Nightmare Hunt", "name": "Nightmare Hunt: Pride: Legend", "description": "Defeat the Nightmare of Skolas, Kell of Kells." }, "1907493625": { "mode": "pride", "short": "Nightmare Hunt", "name": "Nightmare Hunt: Pride: Master", "description": "Defeat the Nightmare of Skolas, Kell of Kells." }, "1907493630": { "mode": "pride", "short": "Nightmare Hunt", "name": "Nightmare Hunt: Pride: Adept", "description": "Defeat the Nightmare of Skolas, Kell of Kells." }, "1907493631": { "mode": "pride", "short": "Nightmare Hunt", "name": "Nightmare Hunt: Pride: Hero", "description": "Defeat the Nightmare of Skolas, Kell of Kells." }, "1926167080": { "mode": "normal", "short": "Strange Terrain", "name": "Strange Terrain", "description": "Enter Hive territory and find Xol's feeding ground. Draw him out and stop him before he can surface." }, "1928964032": { "mode": "normal", "short": "The Tangled Shore", "name": "The Tangled Shore", "description": "A patchwork wasteland on the edge of the Reef, in the Asteroid Belt." }, "1928964033": { "mode": "normal", "short": "The Tangled Shore", "name": "The Tangled Shore", "description": "A patchwork wasteland on the edge of the Reef, in the Asteroid Belt." }, "1930116820": { "mode": "normal", "short": "Exodus Crash", "name": "Exodus Crash", "description": "Purge the Fallen infestation of the Exodus Black." }, "1930116822": { "mode": "normal", "short": "Exodus Crash", "name": "Exodus Crash", "description": "Purge the Fallen infestation of the Exodus Black." }, "1930116823": { "mode": "normal", "short": "Exodus Crash", "name": "Exodus Crash", "description": "Purge the Fallen infestation of the Exodus Black." }, "1949546348": { "mode": "normal", "short": "Assassination Mission", "name": "Assassination Mission", "description": "" }, "1952521609": { "mode": "normal", "short": "Shard of the Traveler", "name": "Shard of the Traveler", "description": "Return to the Shard of the Traveler and restore your connection to the Light." }, "1956541147": { "mode": "normal", "short": "Calling Them Home", "name": "Calling Them Home", "description": "Hawthorne is broadcasting a message from the Farm to guide refugees there. Help her amplify it to reach the entire region." }, "1962592775": { "mode": "active duty", "short": "Field Assignment", "name": "Field Assignment: Active Duty", "description": "" }, "1967025365": { "mode": "normal", "short": "Ice and Shadow", "name": "Ice and Shadow", "description": "A friendly Guardian has requested assistance on Mars. Help her investigate falling Warsats and battle a new threat." }, "1967175017": { "mode": "final assault", "short": "Vex Offensive", "name": "Vex Offensive: Final Assault", "description": "Summon the Undying Mind from thousands of different timelines. Destroy it to secure the Black Garden and contain the Vex incursion on the Moon." }, "1969800443": { "mode": "normal", "short": "Arecibo", "name": "Arecibo", "description": "Investigate a mysterious broadcast that only you and your Ghost can hear." }, "1971154629": { "mode": "normal", "short": "Unsafe at Any Speed", "name": "Unsafe at Any Speed", "description": "A nasty Fallen Pike gang is wreaking havoc in the area. Capture enemy vehicles and use them to even the odds." }, "1971847299": { "mode": "the mad bomber", "short": "Target", "name": "Target: The Mad Bomber", "description": "Avenge Cayde's death by crossing the Scorned Baron known as the Mad Bomber off your list." }, "1975064760": { "mode": "savathûn's song", "short": "Nightfall", "name": "Nightfall: Savathûn's Song: Normal", "description": "Delve deep into the Hive-infested Arcology in search of missing fireteams." }, "1980705864": { "mode": "normal", "short": "Collect Hive Tablets", "name": "Collect Hive Tablets", "description": "Defeat Hive to collect Hive Tablets." }, "1981289329": { "mode": "normal", "short": "Exodus Siege", "name": "Exodus Siege", "description": "The Fallen prepare to attack Failsafe's mainframe aboard the Exodus Black." }, "1984315274": { "mode": "normal", "short": "Vanguard Strikes", "name": "Vanguard Strikes", "description": "Launches a random Destiny 2 strike." }, "1987624188": { "mode": "heroic", "short": "The Up and Up", "name": "The Up and Up (Heroic)", "description": "Prevent the Vex from completing a simulation of Fallen combat tactics." }, "1992706528": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "" }, "1996247142": { "mode": "salvage", "short": "Field Assignment", "name": "Field Assignment: Salvage", "description": "" }, "1998911089": { "mode": "normal", "short": "Dead Drop", "name": "Dead Drop", "description": "The Jerky is dialed into a Fallen transponder somewhere on Titan. You'll need to pick up the goods in person to complete your errand for Drifter.\n\nComplete a heroic reprise of adventure \"Thief of Thieves\" on Titan." }, "2000185095": { "mode": "fury", "short": "Daily Heroic Story Mission", "name": "Daily Heroic Story Mission: Fury", "description": "Complete the Daily Heroic story mission." }, "2001433484": { "mode": "normal", "short": "Assassination Mission", "name": "Assassination Mission", "description": "" }, "2014552458": { "mode": "normal", "short": "Iron Banner Supremacy", "name": "Iron Banner Supremacy", "description": "\"A Guardian's crest represents the lineage and combat techniques of her class. Hold onto yours and take them from your opponents.\" —Lord Saladin \n\nDefeat your opponents and take their crests." }, "2021843353": { "mode": "normal", "short": "Private Match", "name": "Private Match", "description": "Create a custom PvP match with your fireteam, and best your comrades for personal glory… and bragging rights." }, "2022812188": { "mode": "normal", "short": "Deep Six", "name": "Deep Six", "description": "New Pacific Archology, Titan" }, "2023667984": { "mode": "grandmaster", "short": "The Ordeal", "name": "The Ordeal: Grandmaster: Tree of Probabilities", "description": "Tree of Probabilities" }, "2025057095": { "mode": "normal", "short": "Combat Mission", "name": "Combat Mission", "description": "" }, "2026037412": { "mode": "normal", "short": "Heroic Strikes Playlist", "name": "Heroic Strikes Playlist", "description": "Launches a random Destiny 2 or Curse of Osiris strike." }, "2032534090": { "mode": "normal", "short": "The Shattered Throne", "name": "The Shattered Throne", "description": "Strike back at the curse that plagues the Dreaming City.", "release": "2018-09-25T18:00:00.000Z" }, "2044882505": { "mode": "normal", "short": "Defeat enemies", "name": "Defeat enemies", "description": "Defeat enemies." }, "2046332536": { "mode": "tree of probabilities", "short": "Nightfall", "name": "Nightfall: Tree of Probabilities: Normal", "description": "Contain a rampant army of Red Legion within the Infinite Forest." }, "2047813119": { "mode": "normal", "short": "The Dreaming City", "name": "The Dreaming City", "description": "A long-hidden stronghold sacred to the Awoken of the Reef." }, "2050338234": { "mode": "normal", "short": "Exodus Blue", "name": "Exodus Blue", "description": "Cosmodrome, Earth" }, "2052289205": { "mode": "normal", "short": "Combustion", "name": "Combustion", "description": "Hawthorne's waiting on the cliffs above the salt mines. Help her get the word out: we rally at the Farm." }, "2056035210": { "mode": "normal", "short": "Classified", "name": "Classified", "description": "Keep it secret.  Keep it safe." }, "2062544704": { "mode": "normal", "short": "Mystery and Potential", "name": "Mystery and Potential", "description": "The Derelict is vast. The Haul is unknowable. Take time to examine your surroundings." }, "2063575880": { "mode": "normal", "short": "Doubles", "name": "Doubles", "description": "Fight alongside a teammate, and work together to crush your opponents." }, "2067233851": { "mode": "normal", "short": "Not Even the Darkness", "name": "Not Even the Darkness", "description": "Find Saint-14." }, "2068689865": { "mode": "forsaken", "short": "Destiny 2", "name": "Destiny 2: Forsaken", "description": "Return to the Reef, a lawless frontier and home to a broken people.\n\nHunt down a murderer and his gang, ally with the underbelly of the system, and walk the wrong side of right to see justice served." }, "2068785595": { "mode": "normal", "short": "Gambit Preview", "name": "Gambit Preview", "description": "Defeat the enemies of humanity, collect their Motes, and bank them to summon a Primeval. First team to destroy their Primeval wins." }, "2069143995": { "mode": "heroic lost crew", "short": "", "name": "(Heroic) Lost Crew", "description": "Help Failsafe find two long-lost members of her crew." }, "2079994698": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "" }, "2080275457": { "mode": "normal", "short": "The Arms Dealer", "name": "The Arms Dealer", "description": "Shut down the operations of an ironmonger providing weapons to the Red Legion." }, "2086906937": { "mode": "normal", "short": "Emerald Coast", "name": "Emerald Coast", "description": "European Dead Zone, Earth" }, "2087163649": { "mode": "normal", "short": "Rumble", "name": "Rumble", "description": "No teams. No allegiance. A free-for-all where the leader had better watch their back." }, "2087242261": { "mode": "the trickster", "short": "Target", "name": "Target: The Trickster", "description": "Avenge Cayde's death by crossing the Scorned Baron known as the Trickster off your list." }, "2090903475": { "mode": "final assault", "short": "Vex Offensive", "name": "Vex Offensive: Final Assault", "description": "Summon the Undying Mind from thousands of different timelines. Destroy it to secure the Black Garden and contain the Vex incursion on the Moon." }, "2091731913": { "mode": "normal", "short": "Legacy Code", "name": "Legacy Code", "description": "Investigate the blank spot in Rasputin's system memory." }, "2113712124": { "mode": "normal", "short": "Sacrilege", "name": "Sacrilege", "description": "Since the loss of her Light, Ikora has many questions—and she's not leaving Io without answers." }, "2122313384": { "mode": "level 55", "short": "Last Wish", "name": "Last Wish: Level 55", "description": "\"The opportunity of a lifetime.\"", "release": "2018-09-14T19:00:00.000Z" }, "2124407811": { "mode": "normal", "short": "The Insight Terminus", "name": "The Insight Terminus", "description": "Break into the ancient Vex installation." }, "2134290761": { "mode": "normal", "short": "Defeat Enemies", "name": "Defeat Enemies", "description": "Defeat enemies." }, "2140443708": { "mode": "normal", "short": "Kell's Grave", "name": "Kell's Grave", "description": "Tangled Shore, The Reef" }, "2146977720": { "mode": "nothing left to say", "short": "Daily Heroic Story Mission", "name": "Daily Heroic Story Mission: Nothing Left to Say", "description": "Complete the Daily Heroic story mission." }, "2151274060": { "mode": "normal", "short": "Analysis Mission", "name": "Analysis Mission", "description": "" }, "2159219121": { "mode": "normal", "short": "Combat Mission", "name": "Combat Mission", "description": "" }, "2163254576": { "mode": "normal", "short": "Corridors of Time Part 1", "name": "Corridors of Time Part 1", "description": "Use the Sundial to travel back in time and attempt the impossible: saving Saint-14." }, "2164432138": { "mode": "normal", "short": "Leviathan, Eater of Worlds", "name": "Leviathan, Eater of Worlds", "description": "\"In the belly of the beast.\"" }, "2168858559": { "mode": "grandmaster", "short": "The Ordeal", "name": "The Ordeal: Grandmaster: Savathûn's Song", "description": "Savathûn's Song" }, "2174556965": { "mode": "normal", "short": "A Frame Job", "name": "A Frame Job", "description": "Travel deep into enemy territory, ambush the Red Legion, and trick them into retaliating against the Fallen." }, "2179568029": { "mode": "strange terrain", "short": "Nightfall", "name": "Nightfall: Strange Terrain: Normal", "description": "Defeat Xol's necromancer, Nokris, and his army of Frozen Hive." }, "2184866967": { "mode": "normal", "short": "Analysis Mission", "name": "Analysis Mission", "description": "" }, "2187073261": { "mode": "normal", "short": "Analysis Mission", "name": "Analysis Mission", "description": "" }, "2199986157": { "mode": "normal", "short": "Hijacked", "name": "Hijacked", "description": "You need a Vex Mind to help you read the map of the Infinite Forest. Head to Nessus to find one." }, "2205768006": { "mode": "normal", "short": "New Arcadia", "name": "New Arcadia", "description": "Hellas Basin, Mars" }, "2207037656": { "mode": "normal", "short": "Assassination Mission", "name": "Assassination Mission", "description": "" }, "2211843879": { "mode": "normal", "short": "Sundial Spire", "name": "Sundial Spire", "description": "Travel to the Sundial Spire to visit Osiris." }, "2214608156": { "mode": "level 58", "short": "Last Wish", "name": "Last Wish: Level 58", "description": "\"The opportunity of a lifetime.\"" }, "2214608157": { "mode": "level 55", "short": "Last Wish", "name": "Last Wish: Level 55", "description": "\"The opportunity of a lifetime.\"", "release": "2018-09-14T19:00:00.000Z" }, "2219006909": { "mode": "heroic arecibo", "short": "", "name": "(Heroic) Arecibo", "description": "Investigate a mysterious broadcast that only you and your Ghost can hear." }, "2229749170": { "mode": "the pyramidion", "short": "Nightfall", "name": "Nightfall: The Pyramidion: Prestige", "description": "Seek vengeance against the Vex Mind that corrupted Asher's arm." }, "2230236212": { "mode": "normal", "short": "A Garden World", "name": "A Garden World", "description": "Help Osiris cut back an out-of-control Vex Mind." }, "2230236214": { "mode": "normal", "short": "A Garden World", "name": "A Garden World", "description": "Help Osiris cut back an out-of-control Vex Mind." }, "2230236215": { "mode": "normal", "short": "A Garden World", "name": "A Garden World", "description": "Help Osiris cut back an out-of-control Vex Mind." }, "2231840083": { "mode": "normal", "short": "Siren Song", "name": "Siren Song", "description": "Disrupt a Hive Ritual to keep the Rig from sinking." }, "2233665874": { "mode": "normal", "short": "Eternity", "name": "Eternity", "description": "Unknown Space" }, "2237396749": { "mode": "normal", "short": "Vex Offensive", "name": "Vex Offensive", "description": "Enter a portal to the Black Garden and fight on the frontlines of an ongoing battle against the Vex." }, "2243336789": { "mode": "normal", "short": "Combat Mission", "name": "Combat Mission", "description": "" }, "2245202378": { "mode": "heroic anti-anti-air", "short": "", "name": "(Heroic) Anti-Anti-Air", "description": "Infiltrate the Red Legion base and disable their network of flak turrets." }, "2248296964": { "mode": "normal", "short": "Strange Terrain", "name": "Strange Terrain", "description": "Defeat Nokris before he completes his ritual." }, "2249739266": { "mode": "normal", "short": "The Reckoning", "name": "The Reckoning", "description": "Venture into the mysterious Haul that the Drifter tows behind his ship to reckon with greater powers." }, "2250935166": { "mode": "normal", "short": "Deathless", "name": "Deathless", "description": "Clear out the Knight that's keeping Sloane's crews from their work." }, "2258250028": { "mode": "the arms dealer", "short": "Nightfall", "name": "Nightfall: The Arms Dealer", "description": "Shut down the operations of an ironmonger providing weapons to the Red Legion." }, "2258680077": { "mode": "heroic", "short": "The Mindbender", "name": "The Mindbender (Heroic)", "description": "Avenge Cayde's death by crossing the Scorned Baron known as the Mindbender off your list." }, "2259811067": { "mode": "normal", "short": "Shard of the Traveler", "name": "Shard of the Traveler", "description": "Return to the Shard of the Traveler and restore your connection to the Light." }, "2261527950": { "mode": "normal", "short": "Analysis Mission", "name": "Analysis Mission", "description": "" }, "2262757213": { "mode": "normal", "short": "Solitude", "name": "Solitude", "description": "Warmind Facility Hellas, Mars" }, "2268816265": { "mode": "normal", "short": "Exodus Blue", "name": "Exodus Blue", "description": "Cosmodrome, Earth" }, "2271820498": { "mode": "normal", "short": "The Burnout", "name": "The Burnout", "description": "Vex Future, Infinite Forest" }, "2272383802": { "mode": "salvage", "short": "Field Assignment", "name": "Field Assignment: Salvage", "description": "" }, "2274172949": { "mode": "normal", "short": "Control", "name": "Control", "description": "Fight for Valor in large-scale combat scenarios." }, "2276121440": { "mode": "normal", "short": "Firebase Echo", "name": "Firebase Echo", "description": "Arcadian Valley, Nessus" }, "2276204547": { "mode": "normal", "short": "Omega", "name": "Omega", "description": "It's now or never. Enter the Infinite Forest and defeat Panoptes now, before the Vex future victory becomes inevitable." }, "2278374121": { "mode": "normal", "short": "Unknown Space", "name": "Unknown Space", "description": "Unknown Space" }, "2279197206": { "mode": "normal", "short": "A Deadly Trial", "name": "A Deadly Trial", "description": "Brother Vance says there's a Temple of Osiris in the EDZ where you can revive Sagira." }, "2279262916": { "mode": "rage", "short": "Nightmare Hunt", "name": "Nightmare Hunt: Rage", "description": "Defeat the Nightmare of Dominus Ghaul." }, "2287222467": { "mode": "normal", "short": "Analysis Mission", "name": "Analysis Mission", "description": "" }, "2288260902": { "mode": "normal", "short": "Assassination Mission", "name": "Assassination Mission", "description": "" }, "2288451134": { "mode": "rat king", "short": "Armsweek Nightfall", "name": "Armsweek Nightfall: Rat King: Prestige", "description": "Delve deep into the Hive-infested Arcology in search of missing fireteams." }, "2291549972": { "mode": "normal", "short": "Enhance!", "name": "Enhance!", "description": "Devrim has spotted Fallen in the area that are behaving strangely. Find the source of the strangeness." }, "2297638408": { "mode": "normal", "short": "Fury", "name": "Fury", "description": "Help Ikora use the Warmind on Io to learn more about the Almighty—and turn the tide of the war." }, "2301390667": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "" }, "2302677459": { "mode": "normal", "short": "Psionic Potential", "name": "Psionic Potential", "description": "Locate the stolen supplies." }, "2303927902": { "mode": "normal", "short": "Clash", "name": "Clash", "description": "\"The Crucible is a strange thing when you think about it. We die over and over, that we may live in the end.\" —Lord Shaxx\n\nFight for Valor by defeating opponents." }, "2304691867": { "mode": "normal", "short": "Classic Mix", "name": "Classic Mix", "description": "\"To novices, the Crucible is filled with tough lessons. For veterans like you, it is a litany of lessons yet to be taught. Teach well, my friend.\" —Lord Shaxx\n\nFight for Valor in a variety of game modes using connection-based matchmaking." }, "2306231495": { "mode": "normal", "short": "A Mysterious Disturbance", "name": "A Mysterious Disturbance", "description": "Travel to the Moon and stave off the Hive resurgence alongside your fellow Guardians." }, "2307090074": { "mode": "normal", "short": "Signal Light", "name": "Signal Light", "description": "Locate the source of the familiar signal inside the Infinite Forest." }, "2310677039": { "mode": "heroic calling them home", "short": "", "name": "(Heroic) Calling Them Home", "description": "Hawthorne is broadcasting a message from the Farm to guide refugees there. Help her amplify it to reach the entire region." }, "2315447242": { "mode": "active duty", "short": "Field Assignment", "name": "Field Assignment: Active Duty", "description": "" }, "2318812547": { "mode": "normal", "short": "The Pyramidion", "name": "The Pyramidion", "description": "Seek vengeance against the Vex Mind that corrupted Asher's arm." }, "2319065780": { "mode": "normal", "short": "Iron Banner Clash", "name": "Iron Banner Clash", "description": "\"Bring the full force of your Light. Nothing less will do.\" —Lord Saladin \n\nAll-out team warfare. Destroy the enemy." }, "2322829199": { "mode": "a garden world", "short": "Nightfall", "name": "Nightfall: A Garden World: Normal", "description": "Help Osiris cut back an out-of-control Vex Mind." }, "2327656989": { "mode": "normal", "short": "Combat Mission", "name": "Combat Mission", "description": "" }, "2327658858": { "mode": "normal", "short": "Analysis Mission", "name": "Analysis Mission", "description": "" }, "2336998357": { "mode": "normal", "short": "The Long Play", "name": "The Long Play", "description": "The Taken are assembling a new army to march on the Vex Collective. It is essential to stop them." }, "2340776707": { "mode": "heroic poor reception", "short": "", "name": "(Heroic) Poor Reception", "description": "The Fallen are trying to block all communications in the EDZ. Find the source of the interference and shut it down." }, "2345788617": { "mode": "normal", "short": "Scorned", "name": "Scorned", "description": "Follow Spider's tip to the Scorned Barons' hideout and avenge Cayde-6." }, "2351745587": { "mode": "normal", "short": "The Gateway", "name": "The Gateway", "description": "Osiris's damaged Ghost appeared on Mercury—along with a Vex army. That can't be a coincidence." }, "2359594803": { "mode": "normal", "short": "Savathûn's Song", "name": "Savathûn's Song", "description": "Delve deep into the Hive-infested Arcology in search of missing fireteams." }, "2375911307": { "mode": "normal", "short": "Unidentified Radiant Frame", "name": "Unidentified Radiant Frame", "description": "The Unidentified Radiant Frame needs to be crafted in the Bergusia Forge.\n\nComplete the quest \"Lock and Key\" in the EDZ." }, "2378719024": { "mode": "normal", "short": "The Arms Dealer", "name": "The Arms Dealer", "description": "Shut down the operations of an ironmonger providing weapons to the Red Legion." }, "2378719025": { "mode": "normal", "short": "The Arms Dealer", "name": "The Arms Dealer", "description": "Shut down the operations of an ironmonger providing weapons to the Red Legion." }, "2378719026": { "mode": "normal", "short": "The Arms Dealer", "name": "The Arms Dealer", "description": "Shut down the operations of an ironmonger providing weapons to the Red Legion." }, "2379494367": { "mode": "normal", "short": "Analysis Mission", "name": "Analysis Mission", "description": "" }, "2383858990": { "mode": "will of the thousands", "short": "Nightfall", "name": "Nightfall: Will of the Thousands: Prestige", "description": "Liberate Rasputin by bringing an end to Xol's infestation of Mars." }, "2397821612": { "mode": "normal", "short": "Deep Six", "name": "Deep Six", "description": "New Pacific Archology, Titan" }, "2400767363": { "mode": "active duty", "short": "Field Assignment", "name": "Field Assignment: Active Duty", "description": "" }, "2404525917": { "mode": "normal", "short": "Private Match", "name": "Private Match", "description": "Create a custom PvP match with your fireteam, and best your comrades for personal glory… and bragging rights." }, "2416546450": { "mode": "tree of probabilities", "short": "Nightfall", "name": "Nightfall: Tree of Probabilities: Prestige", "description": "Contain a rampant army of Red Legion within the Infinite Forest." }, "2420240009": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "2421741347": { "mode": "normal", "short": "The Chasm of Screams", "name": "The Chasm of Screams", "description": "While you were speaking to Tyra, she mentioned something called the Hated Path, a sort of primer to transform an ordinary Hand Cannon into a Thorn. Bathe your Light in horrors. Feed your weapon with death. Bind it with sickness. Horrors, death, sickness… that all sounds like the Hive nests on Titan to you.\n\nDefeat the Arbiters, Sardav and Telesh, then defeat Savathûn's Song in an epic reprise of strike \"Savathûn's Song\" on Titan." }, "2428036886": { "mode": "normal", "short": "Widow's Court", "name": "Widow's Court", "description": "European Dead Zone, Earth" }, "2428492447": { "mode": "normal", "short": "Emerald Coast", "name": "Emerald Coast", "description": "European Dead Zone, Earth" }, "2428721124": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "2429391832": { "mode": "[void] day", "short": "European Aerial Zone", "name": "European Aerial Zone: [Void] Day", "description": "Void energies pulse through the EAZ, filling the air with the smell of potential.\n\nEquip your Void subclass and weapons to generate Void orbs, then collect them to become Void Empowered. While empowered, Guardians can crouch to become invisible, gain Truesight, and enhance ability energy regeneration." }, "2431838030": { "mode": "arcadian chord", "short": "WANTED", "name": "WANTED: Arcadian Chord", "description": "Hunt down the wanted Arcadian Chord that escaped from the Prison of Elders." }, "2436539922": { "mode": "normal", "short": "Kell's Grave", "name": "Kell's Grave", "description": "Tangled Shore, The Reef" }, "2444356384": { "mode": "normal", "short": "Rusted Lands", "name": "Rusted Lands", "description": "Eastern Flood Zone, Earth" }, "2444890541": { "mode": "normal", "short": "Crimson Days", "name": "Crimson Days", "description": "\"Your partner is your life.\" —Lord Shaxx \n\nFight alongside a teammate and work together to crush your opponents." }, "2445164291": { "mode": "normal", "short": "Assassination Mission", "name": "Assassination Mission", "description": "" }, "2446907856": { "mode": "normal", "short": "A Mysterious Disturbance", "name": "A Mysterious Disturbance", "description": "Travel to the Moon and stave off the Hive resurgence alongside your fellow Guardians." }, "2449714930": { "mode": "prestige", "short": "Leviathan", "name": "Leviathan: Prestige", "description": "\"Grow fat from strength.\"", "release": "2017-10-18T19:00:00.000Z" }, "2450170730": { "mode": "despair", "short": "Nightmare Hunt", "name": "Nightmare Hunt: Despair: Legend", "description": "Defeat the Nightmare of Crota, Son of Oryx." }, "2450170731": { "mode": "despair", "short": "Nightmare Hunt", "name": "Nightmare Hunt: Despair: Master", "description": "Defeat the Nightmare of Crota, Son of Oryx." }, "2450170732": { "mode": "despair", "short": "Nightmare Hunt", "name": "Nightmare Hunt: Despair: Adept", "description": "Defeat the Nightmare of Crota, Son of Oryx." }, "2450170733": { "mode": "despair", "short": "Nightmare Hunt", "name": "Nightmare Hunt: Despair: Hero", "description": "Defeat the Nightmare of Crota, Son of Oryx." }, "2459350930": { "mode": "normal", "short": "Private Match", "name": "Private Match", "description": "Create a custom PvP match with your fireteam, and best your comrades for personal glory… and bragging rights." }, "2461888874": { "mode": "normal", "short": "Private Match", "name": "Private Match", "description": "Create a custom Gambit or Gambit Prime match with your fireteam. Bang knuckles with your crew for personal glory and bragging rights." }, "2468202005": { "mode": "normal", "short": "Shard of the Traveler", "name": "Shard of the Traveler", "description": "Return to the Shard of the Traveler and restore your connection to the Light." }, "2472211469": { "mode": "metropolis", "short": "Contested Zone", "name": "Contested Zone: Metropolis", "description": "Kill the invading Fallen and Hive. Collect what they drop before opposing factions do." }, "2473919228": { "mode": "normal", "short": "Meltdown", "name": "Meltdown", "description": "Clovis Bray Special Projects, Mars" }, "2479262829": { "mode": "normal", "short": "Exodus Crash", "name": "Exodus Crash", "description": "Purge the Fallen infestation of the Exodus Black." }, "2491790989": { "mode": "warden of nothing", "short": "Nightfall", "name": "Nightfall: Warden of Nothing", "description": "Help the Drifter restore order at the Prison of Elders." }, "2491884566": { "mode": "normal", "short": "Private Match", "name": "Private Match", "description": "Create a custom PvP match with your fireteam, and best your comrades for personal glory… and bragging rights." }, "2503939905": { "mode": "normal", "short": "The Moon", "name": "The Moon", "description": "" }, "2508299477": { "mode": "servitude", "short": "Nightmare Hunt", "name": "Nightmare Hunt: Servitude", "description": "Defeat the Nightmare of Zydron, Gate Lord." }, "2509539864": { "mode": "the menagerie", "short": "The Menagerie", "name": "The Menagerie: The Menagerie (Heroic)", "description": "Pleasure and delight await you." }, "2509539865": { "mode": "the menagerie", "short": "The Menagerie", "name": "The Menagerie: The Menagerie (Heroic)", "description": "Pleasure and delight await you." }, "2509539867": { "mode": "the menagerie", "short": "The Menagerie", "name": "The Menagerie: The Menagerie (Heroic)", "description": "Pleasure and delight await you." }, "2517540332": { "mode": "normal", "short": "No Safe Distance", "name": "No Safe Distance", "description": "The Red Legion base is full of explosives even more dangerous than usual. Find and neutralize them before they can enter the field." }, "2519564410": { "mode": "normal", "short": "Assassination Mission", "name": "Assassination Mission", "description": "" }, "2524369154": { "mode": "normal", "short": "Firewalled Verdant Forest", "name": "Firewalled Verdant Forest", "description": "Matchmaking disabled" }, "2533203704": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Adept", "description": "A Garden World" }, "2533203706": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Legend", "description": "A Garden World" }, "2533203707": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Hero", "description": "A Garden World" }, "2533203708": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Grandmaster", "description": "A Garden World" }, "2533203709": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Master", "description": "A Garden World" }, "2536491635": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "" }, "2558926634": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "" }, "2559374368": { "mode": "legend", "short": "Pit of Heresy", "name": "Pit of Heresy: Legend", "description": "Deep beneath Sorrow's Harbor, the Hive keep their darkest secrets." }, "2559374374": { "mode": "master", "short": "Pit of Heresy", "name": "Pit of Heresy: Master", "description": "Deep beneath Sorrow's Harbor, the Hive keep their darkest secrets." }, "2559374375": { "mode": "master", "short": "Pit of Heresy", "name": "Pit of Heresy: Master", "description": "Deep beneath Sorrow's Harbor, the Hive keep their darkest secrets." }, "2559514952": { "mode": "normal", "short": "Utopia", "name": "Utopia", "description": "Venture deep into the heart of the Hive to retrieve a powerful Golden Age CPU—and make it out alive." }, "2561308143": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "" }, "2568845238": { "mode": "off-world recovery", "short": "Daily Heroic Story Mission", "name": "Daily Heroic Story Mission: Off-World Recovery", "description": "Complete the Daily Heroic story mission." }, "2573702057": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "2574607799": { "mode": "normal", "short": "Bad Neighbors", "name": "Bad Neighbors", "description": "Resolve a dangerous conflict between the Fallen and the Hive." }, "2575990417": { "mode": "normal", "short": "Combat Mission", "name": "Combat Mission", "description": "" }, "2576491016": { "mode": "active duty", "short": "Field Assignment", "name": "Field Assignment: Active Duty", "description": "" }, "2579344189": { "mode": "normal", "short": "A Garden World", "name": "A Garden World", "description": "Help Osiris cut back an out-of-control Vex Mind." }, "2580713007": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "" }, "2588220738": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "" }, "2591737171": { "mode": "normal", "short": "Gambler's Ruin", "name": "Gambler's Ruin", "description": "The Tangled Shore" }, "2598372743": { "mode": "normal", "short": "Crucible Labs", "name": "Crucible Labs", "description": "Participate in experimental, work-in-progress Crucible experiences. For more information on Crucible Labs, visit bungie.net." }, "2604307096": { "mode": "normal", "short": "Another Lost Forge", "name": "Another Lost Forge", "description": "The scan of Siviks's Black Armory crates revealed the true origin of the tainted gear: a second Black Armory forge.\n\nExplore an uncharted location on Nessus and locate the lost forge." }, "2610112492": { "mode": "normal", "short": "Analysis Mission", "name": "Analysis Mission", "description": "" }, "2619236227": { "mode": "normal", "short": "Analysis Mission", "name": "Analysis Mission", "description": "" }, "2622431190": { "mode": "fear", "short": "Nightmare Hunt", "name": "Nightmare Hunt: Fear", "description": "Defeat the Nightmare of Phogoth." }, "2624692004": { "mode": "normal", "short": "Private Match", "name": "Private Match", "description": "Create a custom Gambit or Gambit Prime match with your fireteam. Bang knuckles with your crew for personal glory and bragging rights." }, "2629975203": { "mode": "normal", "short": "Combat Mission", "name": "Combat Mission", "description": "" }, "2629998776": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "2630091888": { "mode": "normal", "short": "Lake of Shadows", "name": "Lake of Shadows", "description": "Stem the tide of Taken flowing into the European Dead Zone from beneath the waves." }, "2630091889": { "mode": "normal", "short": "Lake of Shadows", "name": "Lake of Shadows", "description": "Stem the tide of Taken flowing into the European Dead Zone from beneath the waves." }, "2630091891": { "mode": "normal", "short": "Lake of Shadows", "name": "Lake of Shadows", "description": "Stem the tide of Taken flowing into the European Dead Zone from beneath the waves." }, "2631170088": { "mode": "normal", "short": "The Lighthouse", "name": "The Lighthouse", "description": "Unique reward space for the best of the best. You must be found worthy by achieving 7 wins with no losses to gain access." }, "2638957477": { "mode": "active duty", "short": "Field Assignment", "name": "Field Assignment: Active Duty", "description": "" }, "2639045396": { "mode": "normal", "short": "Scourge of the Armory", "name": "Scourge of the Armory", "description": "Siviks's syndicate, the Kell's Scourge, is fearless and growing fast. The Fallen are distributing his tainted Black Armory gear everywhere.\n\nTrack the origin of the tainted gear by investigating Fallen caches in the EDZ." }, "2639701096": { "mode": "insanity", "short": "Nightmare Hunt", "name": "Nightmare Hunt: Insanity: Adept", "description": "Defeat the Nightmare of the Fanatic." }, "2639701097": { "mode": "insanity", "short": "Nightmare Hunt", "name": "Nightmare Hunt: Insanity: Hero", "description": "Defeat the Nightmare of the Fanatic." }, "2639701102": { "mode": "insanity", "short": "Nightmare Hunt", "name": "Nightmare Hunt: Insanity: Legend", "description": "Defeat the Nightmare of the Fanatic." }, "2639701103": { "mode": "insanity", "short": "Nightmare Hunt", "name": "Nightmare Hunt: Insanity: Master", "description": "Defeat the Nightmare of the Fanatic." }, "2642769170": { "mode": "normal", "short": "Six", "name": "Six", "description": "A crashed colony ship, an interspecies war... Cayde-6 got that adventure he wanted. Go save him from it." }, "2651851341": { "mode": "normal", "short": "Analysis Mission", "name": "Analysis Mission", "description": "" }, "2653420456": { "mode": "normal", "short": "Deep Six", "name": "Deep Six", "description": "New Pacific Archology, Titan" }, "2656947700": { "mode": "normal", "short": "Izanami Forge", "name": "Izanami Forge", "description": "Bring any Black Armory weapon frame or research frame to the Izanami Forge to be crafted." }, "2659723068": { "mode": "normal", "short": "Garden of Salvation", "name": "Garden of Salvation", "description": "\"The Garden calls out to you.\"", "release": "2019-10-05T19:00:00.000Z" }, "2660895412": { "mode": "ice and shadow", "short": "Daily Heroic Story Mission", "name": "Daily Heroic Story Mission: Ice and Shadow", "description": "Complete the Daily Heroic story mission." }, "2660931442": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Master", "description": "Tree of Probabilities" }, "2660931443": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Grandmaster", "description": "Tree of Probabilities" }, "2660931444": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Hero", "description": "Tree of Probabilities" }, "2660931445": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Legend", "description": "Tree of Probabilities" }, "2660931447": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Adept", "description": "Tree of Probabilities" }, "2665134323": { "mode": "normal", "short": "Release", "name": "Release", "description": "The Vex appear to be capturing the Fallen, and Failsafe wants it stopped." }, "2666761222": { "mode": "normal", "short": "Distant Shore", "name": "Distant Shore", "description": "Arcadian Strand, Nessus" }, "2675435236": { "mode": "normal", "short": "Bug in the System", "name": "Bug in the System", "description": "Corrupt a Vex data-harvesting operation by withstanding an onslaught of Hive." }, "2678510381": { "mode": "normal", "short": "Tree of Probabilities", "name": "Tree of Probabilities", "description": "Contain a rampant army of Red Legion within the Infinite Forest." }, "2684121894": { "mode": "normal", "short": "Tree of Probabilities", "name": "Tree of Probabilities", "description": "Contain a rampant army of Red Legion within the Infinite Forest." }, "2684479494": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "2688061647": { "mode": "a garden world", "short": "Nightfall", "name": "Nightfall: A Garden World: Prestige", "description": "Help Osiris cut back an out-of-control Vex Mind." }, "2693136600": { "mode": "normal", "short": "Leviathan", "name": "Leviathan: Normal", "description": "\"Grow fat from strength.\"", "release": "2017-09-13T19:00:00.000Z" }, "2693136601": { "mode": "normal", "short": "Leviathan", "name": "Leviathan: Normal", "description": "\"Grow fat from strength.\"", "release": "2017-09-13T19:00:00.000Z" }, "2693136602": { "mode": "normal", "short": "Leviathan", "name": "Leviathan: Normal", "description": "\"Grow fat from strength.\"", "release": "2017-09-13T19:00:00.000Z" }, "2693136603": { "mode": "normal", "short": "Leviathan", "name": "Leviathan: Normal", "description": "\"Grow fat from strength.\"", "release": "2017-09-13T19:00:00.000Z" }, "2693136604": { "mode": "normal", "short": "Leviathan", "name": "Leviathan: Normal", "description": "\"Grow fat from strength.\"", "release": "2017-09-13T19:00:00.000Z" }, "2693136605": { "mode": "normal", "short": "Leviathan", "name": "Leviathan: Normal", "description": "\"Grow fat from strength.\"", "release": "2017-09-13T19:00:00.000Z" }, "2694576755": { "mode": "grandmaster", "short": "The Ordeal", "name": "The Ordeal: Grandmaster: The Insight Terminus", "description": "The Insight Terminus" }, "2695348045": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "Survey mission" }, "2704613535": { "mode": "normal", "short": "The Pyramidion", "name": "The Pyramidion", "description": "Seek vengeance against the Vex Mind that corrupted Asher's arm." }, "2711970723": { "mode": "normal", "short": "The Insight Terminus", "name": "The Insight Terminus", "description": "Break into the ancient Vex installation." }, "2718696427": { "mode": "normal", "short": "Will of the Thousands", "name": "Will of the Thousands", "description": "Xol has surfaced and is attacking Rasputin. You're out of time. But Ana has one last plan." }, "2724706103": { "mode": "normal", "short": "The Arms Dealer", "name": "The Arms Dealer", "description": "Shut down the operations of an ironmonger providing weapons to the Red Legion." }, "2731208666": { "mode": "heroic", "short": "Zero Hour", "name": "Zero Hour (Heroic)", "description": "Thwart a heist alongside a new ally.", "release": "2019-05-07T18:00:00.000Z" }, "2735529319": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "Survey mission" }, "2737374369": { "mode": "normal", "short": "Trials of the Nine", "name": "Trials of the Nine", "description": "Enter the Trials of the Nine to face your fellow Guardians. Prepare to be judged." }, "2737739053": { "mode": "normal", "short": "Deep Conversation", "name": "Deep Conversation", "description": "Failsafe has a plan to retrieve Vex data. But she'll need Ghost's help." }, "2748633318": { "mode": "normal", "short": "Wormhaven", "name": "Wormhaven", "description": "New Pacific Arcology, Titan" }, "2752743635": { "mode": "heroic", "short": "Hephaestus", "name": "Hephaestus (Heroic)", "description": "Destroy dangerous information before it falls into the wrong hands." }, "2753180142": { "mode": "normal", "short": "The Inverted Spire", "name": "The Inverted Spire", "description": "End the Red Legion expedition that's ripped open the planet's surface." }, "2768347363": { "mode": "normal", "short": "Assassination Mission", "name": "Assassination Mission", "description": "" }, "2772894447": { "mode": "larceny", "short": "Daily Heroic Story Mission", "name": "Daily Heroic Story Mission: Larceny", "description": "Complete the Daily Heroic story mission." }, "2773222353": { "mode": "normal", "short": "Analysis Mission", "name": "Analysis Mission", "description": "" }, "2776154899": { "mode": "sacrilege", "short": "Daily Heroic Story Mission", "name": "Daily Heroic Story Mission: Sacrilege", "description": "Complete the Daily Heroic story mission." }, "2776929937": { "mode": "normal", "short": "Differential Diagnosis", "name": "Differential Diagnosis", "description": "Search for any remaining trace of enhanced Ether in the region and destroy it before the Fallen rise again." }, "2782300570": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "2784803584": { "mode": "normal", "short": "Combat Mission", "name": "Combat Mission", "description": "" }, "2791761949": { "mode": "normal", "short": "Tower Approach", "name": "Tower Approach", "description": "Welcome to the Last Safe City." }, "2798856614": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "" }, "2799837309": { "mode": "normal", "short": "The Pyramidion", "name": "The Pyramidion", "description": "Seek vengeance against the Vex Mind that corrupted Asher's arm." }, "2800919246": { "mode": "normal", "short": "The Fortress", "name": "The Fortress", "description": "European Dead Zone, Earth" }, "2810171920": { "mode": "normal", "short": "Bannerfall", "name": "Bannerfall", "description": "The Last City, Earth" }, "2812525063": { "mode": "normal", "short": "Scourge of the Past", "name": "Scourge of the Past", "description": "Beneath the ruins of the Last City lies the Black Armory's most precious vault, now under siege by Siviks and his crew, the Kell's Scourge.", "release": "2018-12-07T18:00:00.000Z" }, "2814410372": { "mode": "normal", "short": "Assassination Mission", "name": "Assassination Mission", "description": "" }, "2814646673": { "mode": "normal", "short": "The Dreaming City", "name": "The Dreaming City", "description": "A long-hidden stronghold sacred to the Awoken of the Reef." }, "2830257365": { "mode": "normal", "short": "Emerald Coast", "name": "Emerald Coast", "description": "European Dead Zone, Earth" }, "2831644165": { "mode": "heroic reversing the polarity", "short": "", "name": "(Heroic) Reversing the Polarity", "description": "The Cabal tend to use a single technology to power everything in their arsenal. Take advantage of that design flaw to send them a message." }, "2838151085": { "mode": "normal", "short": "Legacy Strikes", "name": "Legacy Strikes", "description": "The Vanguard seeks Guardians to undertake high-priority missions against the City's enemies." }, "2838151086": { "mode": "normal", "short": "Legacy Strikes", "name": "Legacy Strikes", "description": "The Vanguard seeks Guardians to undertake high-priority missions against the City's enemies." }, "2846775197": { "mode": "normal", "short": "Combat Mission", "name": "Combat Mission", "description": "" }, "2867288098": { "mode": "normal", "short": "Classified", "name": "Classified", "description": "Keep it secret.  Keep it safe." }, "2886394453": { "mode": "hard light", "short": "Armsweek Nightfall", "name": "Armsweek Nightfall: Hard Light: Prestige", "description": "Delve deep into the Hive-infested Arcology in search of missing fireteams." }, "2892775311": { "mode": "normal", "short": "Combat Mission", "name": "Combat Mission", "description": "" }, "2896212196": { "mode": "normal", "short": "Collect Supplies", "name": "Collect Supplies", "description": "Defeat Psions to collect Red Legion supplies." }, "2903879783": { "mode": "normal", "short": "Private Match", "name": "Private Match", "description": "Create a custom PvP match with your fireteam, and best your comrades for personal glory… and bragging rights." }, "2904672719": { "mode": "normal", "short": "Deep Six", "name": "Deep Six", "description": "New Pacific Archology, Titan" }, "2905427653": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "2908287325": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "" }, "2918838311": { "mode": "anguish", "short": "Nightmare Hunt", "name": "Nightmare Hunt: Anguish", "description": "Defeat the Nightmare of Omnigul." }, "2926767881": { "mode": "normal", "short": "Payback", "name": "Payback", "description": "Time for Zavala's grand entrance—finally attacking the Red Legion base in the EDZ head-on." }, "2934103434": { "mode": "normal", "short": "Classified", "name": "Classified", "description": "Keep it secret.  Keep it safe." }, "2947109551": { "mode": "normal", "short": "Survival", "name": "Survival", "description": "Fight for Glory in more focused combat scenarios." }, "2948690563": { "mode": "forsaken annual pass", "short": "Destiny 2", "name": "Destiny 2: Forsaken Annual Pass", "description": "Annual Pass delivers additional activity and rewards content throughout the year (Sept. 2018–Aug. 2019)." }, "2949941834": { "mode": "normal", "short": "Unexpected Guests", "name": "Unexpected Guests", "description": "Ikora's worried about some Taken emanations from beneath the moon's surface." }, "2962137994": { "mode": "ace in the hole", "short": "Daily Heroic Story Mission", "name": "Daily Heroic Story Mission: Ace in the Hole", "description": "Complete the Daily Heroic story mission." }, "2966841322": { "mode": "normal", "short": "Incursion", "name": "Incursion", "description": "Stop the Cabal scavengers." }, "2969403085": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "" }, "2971335647": { "mode": "normal", "short": "Exodus Crash", "name": "Exodus Crash", "description": "Purge the Fallen infestation of the Exodus Black." }, "2974605887": { "mode": "normal", "short": "Awakening", "name": "Awakening", "description": "\"The gates of hell are open night and day; smooth the descent, and easy is the way: but to return, and view the cheerful skies, in this the task and mighty labor lies.\" —Dryden" }, "2978154446": { "mode": "normal", "short": "Equinox", "name": "Equinox", "description": "Unknown Space" }, "2992505404": { "mode": "normal", "short": "Strange Terrain", "name": "Strange Terrain", "description": "Defeat Nokris before he completes his ritual." }, "2999911583": { "mode": "normal", "short": "Vex Offensive", "name": "Vex Offensive", "description": "Enter a portal to the Black Garden and fight on the frontlines of an ongoing battle against the Vex." }, "3002511278": { "mode": "normal", "short": "Dark Alliance", "name": "Dark Alliance", "description": "Red Legion Psions are meddling with forces best left alone. Investigate their connection to dark forces in the region." }, "3004605630": { "mode": "normal", "short": "Leviathan, Spire of Stars", "name": "Leviathan, Spire of Stars", "description": "On the wings of Icarus." }, "3008658049": { "mode": "pilgrimage", "short": "Daily Heroic Story Mission", "name": "Daily Heroic Story Mission: Pilgrimage", "description": "Complete the Daily Heroic story mission." }, "3011324617": { "mode": "normal", "short": "Breakthrough", "name": "Breakthrough", "description": "\"Deploying the Breaker makes a wager with your opponents. Don't let them call your bluff.\" —Lord Shaxx\n\nFight for Valor by deploying the Breaker and hacking the opposing vault or by defending your own vault." }, "3013465842": { "mode": "normal", "short": "The Runner", "name": "The Runner", "description": "Stop a Cabal simulation carrying heavily encrypted data." }, "3015346707": { "mode": "heroic bad neighbors", "short": "", "name": "(Heroic) Bad Neighbors", "description": "Resolve a dangerous conflict between the Fallen and the Hive." }, "3026637018": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "" }, "3033151437": { "mode": "heroic siren song", "short": "", "name": "(Heroic) Siren Song", "description": "Disrupt a Hive Ritual to keep the Rig from sinking." }, "3034843176": { "mode": "the corrupted", "short": "Nightfall", "name": "Nightfall: The Corrupted", "description": "Hunt down one of Queen Mara's most trusted advisors and free her from Taken possession." }, "3038694763": { "mode": "normal", "short": "Assassination Mission", "name": "Assassination Mission", "description": "" }, "3042112297": { "mode": "heroic hack the planet", "short": "", "name": "(Heroic) Hack the Planet", "description": "Ghost has a plan to interface with the Nessus core. But he'll need Failsafe's help." }, "3049122128": { "mode": "normal", "short": "Analysis Mission", "name": "Analysis Mission", "description": "" }, "3050465729": { "mode": "the inverted spire", "short": "Nightfall", "name": "Nightfall: The Inverted Spire: Prestige", "description": "End the Red Legion expedition that has ripped open the planet's surface." }, "3053137570": { "mode": "normal", "short": "The Scarlet Keep", "name": "The Scarlet Keep", "description": "Investigate the recently erected Scarlet Keep and discover its dark purpose." }, "3062197616": { "mode": "normal", "short": "Survival", "name": "Survival", "description": "Fight for Glory in more focused combat scenarios." }, "3069330044": { "mode": "heroic", "short": "The Hangman", "name": "The Hangman (Heroic)", "description": "Avenge Cayde's death by crossing the Scorned Baron known as the Hangman off your list." }, "3078057004": { "mode": "pilgrimage", "short": "Field Assignment", "name": "Field Assignment: Pilgrimage", "description": "" }, "3083820154": { "mode": "normal", "short": "A Shadow Overhead", "name": "A Shadow Overhead", "description": "Beneath the last place touched by the Traveler." }, "3089205900": { "mode": "normal", "short": "Leviathan, Eater of Worlds", "name": "Leviathan, Eater of Worlds: Normal", "description": "\"In the belly of the beast.\"", "release": "2017-12-08T19:00:00.000Z" }, "3094124867": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "3105090879": { "mode": "normal", "short": "Adieu", "name": "Adieu", "description": "The Red Legion has overrun the Last City. The Light is gone. You are powerless. Live to fight another day." }, "3107795800": { "mode": "the menagerie", "short": "The Menagerie", "name": "The Menagerie: The Menagerie (Heroic) Matchmaking", "description": "Pleasure and delight await you." }, "3108278497": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "3108813009": { "mode": "warden of nothing", "short": "Nightfall", "name": "Nightfall: Warden of Nothing", "description": "Help the Drifter restore order at the Prison of Elders." }, "3111608341": { "mode": "active duty", "short": "Field Assignment", "name": "Field Assignment: Active Duty", "description": "" }, "3115455134": { "mode": "the menagerie", "short": "The Menagerie", "name": "The Menagerie: The Menagerie (Heroic) Matchmaking", "description": "Pleasure and delight await you." }, "3128368823": { "mode": "normal", "short": "Legion's Folly", "name": "Legion's Folly", "description": "Arcadian Valley, Nessus" }, "3132003003": { "mode": "will of the thousands", "short": "Nightfall", "name": "Nightfall: Will of the Thousands: Normal", "description": "Liberate Rasputin by bringing an end to Xol's infestation of Mars." }, "3135101885": { "mode": "normal", "short": "Crucible Labs", "name": "Crucible Labs", "description": "Participate in experimental, work-in-progress Crucible experiences. For more information on Crucible Labs, visit bungie.net." }, "3140524926": { "mode": "normal", "short": "Unbreakable", "name": "Unbreakable", "description": "Failsafe has caught wind of Vex tech that could result in unstoppable barriers." }, "3143659188": { "mode": "tier i", "short": "The Reckoning", "name": "The Reckoning: Tier I", "description": "Venture into the mysterious Haul that the Drifter tows behind his ship to reckon with greater powers." }, "3143798436": { "mode": "normal", "short": "European Dead Zone", "name": "European Dead Zone", "description": "" }, "3145298904": { "mode": "the arms dealer", "short": "Nightfall", "name": "Nightfall: The Arms Dealer", "description": "Shut down the operations of an ironmonger providing weapons to the Red Legion." }, "3146127059": { "mode": "normal", "short": "Kell's Grave", "name": "Kell's Grave", "description": "Tangled Shore, The Reef" }, "3147707814": { "mode": "normal", "short": "Riptide", "name": "Riptide", "description": "Without power, Zavala's resistance has hit a wall. Travel deeper into the Arcology and help them past it." }, "3148431353": { "mode": "normal", "short": "Getting Your Hands Dirty", "name": "Getting Your Hands Dirty", "description": "Seize upon the Taken invasion of the EDZ, direct their assault against the Red Legion, and end it before it gets out of control." }, "3149513022": { "mode": "normal", "short": "A Hum of Starlight", "name": "A Hum of Starlight", "description": "Return to the Watchtower, and this time, pass through the door at its top." }, "3150153711": { "mode": "normal", "short": "Chances and Choices", "name": "Chances and Choices", "description": "" }, "3151789989": { "mode": "normal", "short": "???", "name": "???", "description": "???" }, "3164915257": { "mode": "normal", "short": "The Dead Cliffs", "name": "The Dead Cliffs", "description": "European Dead Zone, Earth" }, "3172367001": { "mode": "normal", "short": "Shard of the Traveler", "name": "Shard of the Traveler", "description": "Return to the Shard of the Traveler and restore your connection to the Light." }, "3173130826": { "mode": "normal", "short": "Combat Mission", "name": "Combat Mission", "description": "" }, "3176544780": { "mode": "normal", "short": "Control", "name": "Control", "description": "\"The key to victory is not simply capturing territory, but knowing exactly how and when to push your advantage.\" —Lord Shaxx\n\nFight for Valor by capturing zones and defeating opponents." }, "3191123858": { "mode": "normal", "short": "Savathûn's Song", "name": "Savathûn's Song", "description": "Delve deep into the Hive-infested Arcology in search of missing fireteams." }, "3200108048": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Grandmaster", "description": "The Insight Terminus" }, "3200108049": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Master", "description": "The Insight Terminus" }, "3200108052": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Adept", "description": "The Insight Terminus" }, "3200108054": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Legend", "description": "The Insight Terminus" }, "3200108055": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Hero", "description": "The Insight Terminus" }, "3204449126": { "mode": "normal", "short": "A Piece of the Past", "name": "A Piece of the Past", "description": "Return to Rasputin with the mysterious engram." }, "3205253944": { "mode": "isolation", "short": "Nightmare Hunt", "name": "Nightmare Hunt: Isolation: Legend", "description": "Defeat the Nightmare of Taniks, the Scarred." }, "3205253945": { "mode": "isolation", "short": "Nightmare Hunt", "name": "Nightmare Hunt: Isolation: Master", "description": "Defeat the Nightmare of Taniks, the Scarred." }, "3205253950": { "mode": "isolation", "short": "Nightmare Hunt", "name": "Nightmare Hunt: Isolation: Adept", "description": "Defeat the Nightmare of Taniks, the Scarred." }, "3205253951": { "mode": "isolation", "short": "Nightmare Hunt", "name": "Nightmare Hunt: Isolation: Hero", "description": "Defeat the Nightmare of Taniks, the Scarred." }, "3205547455": { "mode": "riptide", "short": "Daily Heroic Story Mission", "name": "Daily Heroic Story Mission: Riptide", "description": "Complete the Daily Heroic story mission." }, "3208779612": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "3211303924": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "3211568383": { "mode": "normal", "short": "Siren Song", "name": "Siren Song", "description": "Disrupt a Hive Ritual to keep the Rig from sinking." }, "3212348372": { "mode": "normal", "short": "Gambler's Ruin", "name": "Gambler's Ruin", "description": "The Tangled Shore" }, "3213556450": { "mode": "prestige", "short": "Leviathan, Spire of Stars", "name": "Leviathan, Spire of Stars: Prestige", "description": "On the wings of Icarus.", "release": "2018-07-18T19:00:00.000Z" }, "3226038743": { "mode": "normal", "short": "High Plains Blues", "name": "High Plains Blues", "description": "Search the Tangled Shore for Cayde's killers." }, "3231065327": { "mode": "normal", "short": "Analysis Mission", "name": "Analysis Mission", "description": "" }, "3232506937": { "mode": "normal", "short": "Zero Hour", "name": "Zero Hour", "description": "Thwart a heist alongside a new ally.", "release": "2019-05-07T18:00:00.000Z" }, "3233852802": { "mode": "normal", "short": "The Dead Cliffs", "name": "The Dead Cliffs", "description": "European Dead Zone, Earth" }, "3239164160": { "mode": "normal", "short": "Lockdown", "name": "Lockdown", "description": "\"Hold your ground. Yield to no one.\" —Lord Shaxx\n\nFight for Valor by capturing and holding zones. Win rounds instantly by capturing all three." }, "3243161126": { "mode": "normal", "short": "Control", "name": "Control", "description": "Fight for Valor in large-scale combat scenarios." }, "3243244011": { "mode": "normal", "short": "Lockdown", "name": "Lockdown", "description": "Seize at least two zones to make capture progress. Control all three for a Lockdown to win the round early." }, "3248193378": { "mode": "heroic", "short": "The Up and Up", "name": "The Up and Up (Heroic)", "description": "Prevent the Vex from completing a simulation of Fallen combat tactics." }, "3255524827": { "mode": "heroic cliffhanger", "short": "", "name": "(Heroic) Cliffhanger", "description": "Asher has information about the Vex's next conversion site, and he wants it stopped." }, "3264501078": { "mode": "tier ii", "short": "The Reckoning", "name": "The Reckoning: Tier II", "description": "Venture into the mysterious Haul that the Drifter tows behind his ship to reckon with greater powers." }, "3265488360": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Adept", "description": "The Pyramidion" }, "3265488362": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Legend", "description": "The Pyramidion" }, "3265488363": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Hero", "description": "The Pyramidion" }, "3265488365": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Master", "description": "The Pyramidion" }, "3268684190": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "3271773240": { "mode": "combustion", "short": "Daily Heroic Story Mission", "name": "Daily Heroic Story Mission: Combustion", "description": "Complete the Daily Heroic story mission." }, "3272002712": { "mode": "normal", "short": "Hope", "name": "Hope", "description": "Commander Zavala is building a resistance at a moon of Saturn. Make contact and join the fight." }, "3277510674": { "mode": "normal", "short": "Deathless", "name": "Deathless", "description": "Clear out the Knight that's keeping Sloane's crews from their work." }, "3280234344": { "mode": "savathûn's song", "short": "Nightfall", "name": "Nightfall: Savathûn's Song", "description": "Delve deep into the Hive-infested Arcology in search of missing fireteams." }, "3283790633": { "mode": "normal", "short": "A Frame Job", "name": "A Frame Job", "description": "Travel deep into enemy territory, ambush the Red Legion, and trick them into retaliating against the Fallen." }, "3289589202": { "mode": "the pyramidion", "short": "Nightfall", "name": "Nightfall: The Pyramidion", "description": "Seek vengeance against the Vex Mind that corrupted Asher's arm." }, "3289681664": { "mode": "normal", "short": "Lost Crew", "name": "Lost Crew", "description": "Help Failsafe find two long-lost members of her crew." }, "3292922825": { "mode": "normal", "short": "Firebase Echo", "name": "Firebase Echo", "description": "Arcadian Valley, Nessus" }, "3298775062": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "" }, "3303685562": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "3304835347": { "mode": "normal", "short": "Calling Them Home", "name": "Calling Them Home", "description": "Hawthorne is broadcasting a message from the Farm to guide refugees there. Help her amplify it to reach the entire region." }, "3326586101": { "mode": "tree of probabilities", "short": "Nightfall", "name": "Nightfall: Tree of Probabilities", "description": "Contain a rampant army of Red Legion within the Infinite Forest." }, "3333172150": { "mode": "normal", "short": "Crown of Sorrow", "name": "Crown of Sorrow: Normal", "description": "Grow [weak] with [pride].", "release": "2019-06-04T01:00:00.000Z" }, "3337731612": { "mode": "normal", "short": "Combat Mission", "name": "Combat Mission", "description": "" }, "3344441646": { "mode": "normal", "short": "Private Match", "name": "Private Match", "description": "Create a custom PvP match with your fireteam, and best your comrades for personal glory… and bragging rights." }, "3346345105": { "mode": "normal", "short": "Experimental Treatment", "name": "Experimental Treatment", "description": "Search for the Fallen in charge of the enhanced Ether production and dissemination—and eliminate them." }, "3346680969": { "mode": "normal", "short": "Combat Mission", "name": "Combat Mission", "description": "" }, "3349246768": { "mode": "normal", "short": "Solitude", "name": "Solitude", "description": "Warmind Facility Hellas, Mars" }, "3352425710": { "mode": "normal", "short": "Looking for a Lead", "name": "Looking for a Lead", "description": "Spider told you Drifter might be planning something on Titan. Aunor agrees it's worth taking a look around. Without any sense of where to start, you set a course for the Rig.\n\nComplete a Heroic reprise of adventure \"Siren Song\" on Titan." }, "3354105309": { "mode": "grandmaster", "short": "The Ordeal", "name": "The Ordeal: Grandmaster: The Corrupted", "description": "The Corrupted" }, "3359466010": { "mode": "normal", "short": "Spark", "name": "Spark", "description": "While Hawthorne offers shelter to those who fled the City, a vision points to a long-forgotten place." }, "3368226533": { "mode": "the inverted spire", "short": "Nightfall", "name": "Nightfall: The Inverted Spire: Normal", "description": "End the Red Legion expedition that has ripped open the planet's surface." }, "3370527053": { "mode": "heroic", "short": "The Runner", "name": "The Runner (Heroic)", "description": "Stop a Cabal simulation carrying heavily encrypted data." }, "3370944873": { "mode": "normal", "short": "Legion's Folly", "name": "Legion's Folly", "description": "Arcadian Valley, Nessus" }, "3371785215": { "mode": "normal", "short": "Collect Hive Tablets", "name": "Collect Hive Tablets", "description": "Defeat Acolytes to collect Hive Tablets." }, "3372160277": { "mode": "lake of shadows", "short": "Nightfall", "name": "Nightfall: Lake of Shadows", "description": "Stem the tide of Taken flowing into the European Dead Zone from beneath the waves." }, "3374205760": { "mode": "normal", "short": "The Corrupted", "name": "The Corrupted", "description": "Hunt down one of Queen Mara's most trusted advisors and free her from Taken possession." }, "3374205761": { "mode": "normal", "short": "The Corrupted", "name": "The Corrupted", "description": "Hunt down one of Queen Mara's most trusted advisors and free her from Taken possession." }, "3374205762": { "mode": "normal", "short": "The Corrupted", "name": "The Corrupted", "description": "Hunt down one of Queen Mara's most trusted advisors and free her from Taken possession." }, "3376869257": { "mode": "normal", "short": "Salvage mission", "name": "Salvage mission", "description": "" }, "3377331506": { "mode": "normal", "short": "Survey the Area", "name": "Survey the Area", "description": "Survey Cabal activity." }, "3379039897": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "3384410381": { "mode": "normal", "short": "Psionic Potential", "name": "Psionic Potential", "description": "Locate the stolen supplies." }, "3388474648": { "mode": "normal", "short": "The Corrupted", "name": "The Corrupted", "description": "Hunt down one of Queen Mara's most trusted advisors and free her from Taken possession." }, "3404623499": { "mode": "normal", "short": "The Citadel", "name": "The Citadel", "description": "The Dreaming City" }, "3406133130": { "mode": "normal", "short": "Vanguard Strikes", "name": "Vanguard Strikes", "description": "Launches a random Destiny 2 strike without expansion content." }, "3410237988": { "mode": "normal", "short": "1AU", "name": "1AU", "description": "Relive the 1AU experience." }, "3410530777": { "mode": "normal", "short": "Calculated Action", "name": "Calculated Action", "description": "Ikora fears that the Taken may have new leadership. Figure out what they're up to." }, "3423042035": { "mode": "normal", "short": "Distant Shore", "name": "Distant Shore", "description": "Arcadian Strand, Nessus" }, "3434499700": { "mode": "normal", "short": "Initiation", "name": "Initiation", "description": "Locate the entrance to the Black Armory." }, "3446541099": { "mode": "prestige", "short": "Leviathan", "name": "Leviathan: Prestige", "description": "\"Grow fat from strength.\"", "release": "2017-10-18T19:00:00.000Z" }, "3447375316": { "mode": "the corrupted", "short": "Nightfall", "name": "Nightfall: The Corrupted", "description": "Hunt down one of Queen Mara's most trusted advisors and free her from Taken possession." }, "3454691355": { "mode": "normal", "short": "Fragment", "name": "Fragment", "description": "Unknown, The Infinite Forest" }, "3455414851": { "mode": "grandmaster", "short": "The Ordeal", "name": "The Ordeal: Grandmaster: The Festering Core", "description": "The Festering Core" }, "3459379696": { "mode": "isolation", "short": "Nightmare Hunt", "name": "Nightmare Hunt: Isolation", "description": "Defeat the Nightmare of Taniks, the Scarred." }, "3467071851": { "mode": "pilgrimage", "short": "Field Assignment", "name": "Field Assignment: Pilgrimage", "description": "" }, "3474760008": { "mode": "normal", "short": "Worthy", "name": "Worthy", "description": "Provide tremendous support toward the Restoration effort and rekindle the Lighthouse to usher in a new age of Guardians." }, "3479544154": { "mode": "normal", "short": "Combat Mission", "name": "Combat Mission", "description": "" }, "3481058226": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "" }, "3485876484": { "mode": "normal", "short": "Road Rage", "name": "Road Rage", "description": "Asher's worked up about Vex interest in the Io Vault. He's got an unusual suggestion for how to deal with the problem." }, "3487576414": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "" }, "3489692681": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "" }, "3500791146": { "mode": "normal", "short": "Cliffhanger", "name": "Cliffhanger", "description": "Asher has information about the Vex's next conversion site, and he wants it stopped." }, "3510043585": { "mode": "normal", "short": "Will of the Thousands", "name": "Will of the Thousands", "description": "Defeat Xol before everything is destroyed." }, "3515770727": { "mode": "normal", "short": "Analysis Mission", "name": "Analysis Mission", "description": "" }, "3527700562": { "mode": "active duty", "short": "Field Assignment", "name": "Field Assignment: Active Duty", "description": "" }, "3535117433": { "mode": "assassination", "short": "Field Assignment", "name": "Field Assignment: Assassination", "description": "" }, "3535622620": { "mode": "normal", "short": "Assassination Mission", "name": "Assassination Mission", "description": "" }, "3536651661": { "mode": "normal", "short": "The Other Side", "name": "The Other Side", "description": "Some bones live on after death." }, "3543680867": { "mode": "normal", "short": "Strange Terrain", "name": "Strange Terrain", "description": "Enter Hive territory and find Xol's feeding ground. Draw him out and stop him before he can surface." }, "3559661941": { "mode": "normal", "short": "Nothing Left to Say", "name": "Nothing Left to Say", "description": "Climb the Watchtower to stop Uldren and the Fanatic." }, "3577607128": { "mode": "normal", "short": "Gambit", "name": "Gambit", "description": "Defeat the enemies of humanity, collect their Motes, and bank them to summon a Primeval. First team to destroy their Primeval wins." }, "3585977417": { "mode": "normal", "short": "Legion's Folly", "name": "Legion's Folly", "description": "Arcadian Valley, Nessus" }, "3596828104": { "mode": "normal", "short": "The Festering Core", "name": "The Festering Core", "description": "Descend into the heart of Io's Pyramidion and root out a burgeoning infestation." }, "3597372938": { "mode": "grandmaster", "short": "The Ordeal", "name": "The Ordeal: Grandmaster: Warden of Nothing", "description": "Warden of Nothing" }, "3601218952": { "mode": "heroic", "short": "The Rifleman", "name": "The Rifleman (Heroic)", "description": "Avenge Cayde's death by crossing the Scorned Baron known as the Rifleman off your list." }, "3601558330": { "mode": "salvage", "short": "Field Assignment", "name": "Field Assignment: Salvage", "description": "" }, "3611556688": { "mode": "legend", "short": "The Sundial", "name": "The Sundial: Legend", "description": "Stop the Cabal from rewriting history and laying claim to the future." }, "3612741503": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "" }, "3614852628": { "mode": "normal", "short": "Repair the Izanami Igniter", "name": "Repair the Izanami Igniter", "description": "Complete this advanced version of \"The Insight Terminus\" and collect a Cabal component from the boss to fully repair the Izanami igniter." }, "3616746132": { "mode": "normal", "short": "Iron Banner Control", "name": "Iron Banner Control", "description": "\"There will come a day when the Tower falls again. Our ability to hold territory is paramount.\" —Lord Saladin\n\nCapture zones to increase points for every kill." }, "3617269021": { "mode": "normal", "short": "Crucible Labs", "name": "Crucible Labs", "description": "Participate in experimental, work-in-progress Crucible experiences. For more information on Crucible Labs, visit bungie.net." }, "3625752472": { "mode": "the scarlet keep", "short": "Nightfall", "name": "Nightfall: The Scarlet Keep", "description": "Investigate the recently erected Scarlet Keep and discover its dark purpose." }, "3627094182": { "mode": "normal", "short": "Combat Mission", "name": "Combat Mission", "description": "" }, "3628257792": { "mode": "normal", "short": "The Conversation", "name": "The Conversation", "description": "Enkaar, the Hive weapon master, is hiding in Hellrise Canyon in the Tangled Shore.\n\nHunt him down!" }, "3631476566": { "mode": "normal", "short": "The Farm", "name": "The Farm", "description": "A refugee camp set up during the Red War for Guardians and non Guardians alike, on the outskirts of the EDZ." }, "3633867161": { "mode": "normal", "short": "Cathedral of Scars", "name": "Cathedral of Scars", "description": "The Dreaming City, The Vestian Web" }, "3633915199": { "mode": "normal", "short": "Crimson Days", "name": "Crimson Days", "description": "\"Your partner is your life.\" —Lord Shaxx \n\nFight alongside a teammate and work together to crush your opponents." }, "3634370598": { "mode": "active duty", "short": "Field Assignment", "name": "Field Assignment: Active Duty", "description": "" }, "3641102502": { "mode": "normal", "short": "Refurbished Izanami Igniter", "name": "Refurbished Izanami Igniter", "description": "Survive waves of Vex while collecting energy." }, "3644215993": { "mode": "heroic road rage", "short": "", "name": "(Heroic) Road Rage", "description": "Asher's worked up about Vex interest in the Io Vault. He's got an unusual suggestion for how to deal with the problem." }, "3645117987": { "mode": "normal", "short": "Bad Neighbors", "name": "Bad Neighbors", "description": "Resolve a dangerous conflict between the Fallen and the Hive." }, "3646079260": { "mode": "normal", "short": "Countdown", "name": "Countdown", "description": "\"I hope the remaining Red Legion can see this: weapons they brought to destroy us, used as mere toys in training exercises. Do be mindful of the blast radius, though.\" —Lord Shaxx\n\nFight for Valor by detonating a charge, defusing the opposing charge, or eliminating all opponents." }, "3652531274": { "mode": "normal", "short": "Shard of the Traveler", "name": "Shard of the Traveler", "description": "Return to the Shard of the Traveler and restore your connection to the Light." }, "3653399243": { "mode": "normal", "short": "Cathedral of Scars", "name": "Cathedral of Scars", "description": "The Dreaming City, The Vestian Web" }, "3655015216": { "mode": "pride", "short": "Nightmare Hunt", "name": "Nightmare Hunt: Pride", "description": "Defeat the Nightmare of Skolas, Kell of Kells." }, "3662124488": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "" }, "3664729722": { "mode": "heroic exodus siege", "short": "", "name": "(Heroic) Exodus Siege", "description": "The Fallen prepare to attack Failsafe's mainframe aboard the Exodus Black." }, "3664915501": { "mode": "normal", "short": "Red Legion, Black Oil", "name": "Red Legion, Black Oil", "description": "Destroy the dark liquid that the Cabal use to power their technology or contaminate it, for a subtler approach." }, "3667472273": { "mode": "the rider", "short": "Target", "name": "Target: The Rider", "description": "Avenge Cayde's death by crossing the Scorned Baron known as the Rider off your list." }, "3669054326": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "3676029623": { "mode": "normal", "short": "A Garden World", "name": "A Garden World", "description": "Help Osiris cut back an out-of-control Vex Mind." }, "3676143304": { "mode": "arcadian chord", "short": "WANTED", "name": "WANTED: Arcadian Chord", "description": "Hunt down the wanted Arcadian Chord that escaped from the Prison of Elders." }, "3678597432": { "mode": "the prospector", "short": "Armsweek Nightfall", "name": "Armsweek Nightfall: The Prospector: Prestige", "description": "Shut down the operations of an ironmonger providing weapons to the Red Legion." }, "3679941640": { "mode": "normal", "short": "Homecoming", "name": "Homecoming", "description": "Relive the Homecoming experience." }, "3679946187": { "mode": "silent fang", "short": "WANTED", "name": "WANTED: Silent Fang", "description": "Hunt down the wanted Silent Fang who escaped from the Prison of Elders." }, "3688464794": { "mode": "normal", "short": "The Importance of Networking", "name": "The Importance of Networking", "description": "" }, "3691789482": { "mode": "heroic no safe distance", "short": "", "name": "(Heroic) No Safe Distance", "description": "The Red Legion base is full of explosives even more dangerous than usual. Find and neutralize them before they can enter the field." }, "3692509130": { "mode": "broodhold", "short": "Nightfall", "name": "Nightfall: Broodhold", "description": "Eradicate a Hive infestation seething in the depths of the Tangled Shore." }, "3700722865": { "mode": "normal", "short": "Release", "name": "Release", "description": "The Vex appear to be capturing the Fallen, and Failsafe wants it stopped." }, "3701132453": { "mode": "the hollowed lair", "short": "Nightfall", "name": "Nightfall: The Hollowed Lair", "description": "The Fanatic has returned. Take him down and finish the job you started." }, "3702064261": { "mode": "normal", "short": "Data Requisition", "name": "Data Requisition", "description": "" }, "3705383694": { "mode": "normal", "short": "Emerald Coast", "name": "Emerald Coast", "description": "European Dead Zone, Earth" }, "3711627564": { "mode": "normal", "short": "Lake of Shadows", "name": "Lake of Shadows", "description": "Stem the tide of Taken flowing into the European Dead Zone from beneath the waves." }, "3718330161": { "mode": "tree of probabilities", "short": "Nightfall", "name": "Nightfall: Tree of Probabilities", "description": "Contain a rampant army of Red Legion within the Infinite Forest." }, "3726640183": { "mode": "grandmaster", "short": "The Ordeal", "name": "The Ordeal: Grandmaster: The Arms Dealer", "description": "The Arms Dealer" }, "3734723183": { "mode": "normal", "short": "Eternity", "name": "Eternity", "description": "Unknown Space" }, "3735153516": { "mode": "normal", "short": "The Insight Terminus", "name": "The Insight Terminus", "description": "Break into the ancient Vex installation." }, "3735153518": { "mode": "normal", "short": "The Insight Terminus", "name": "The Insight Terminus", "description": "Break into the ancient Vex installation." }, "3735153519": { "mode": "normal", "short": "The Insight Terminus", "name": "The Insight Terminus", "description": "Break into the ancient Vex installation." }, "3739410406": { "mode": "normal", "short": "Classified", "name": "Classified", "description": "Keep it secret.  Keep it safe." }, "3742073480": { "mode": "active duty", "short": "Field Assignment", "name": "Field Assignment: Active Duty", "description": "" }, "3746811765": { "mode": "normal", "short": "The Oracle Engine", "name": "The Oracle Engine", "description": "The Taken threaten to take control of an irreplaceable Awoken communications device." }, "3751421841": { "mode": "normal", "short": "The Insight Terminus", "name": "The Insight Terminus", "description": "Break into the ancient Vex installation." }, "3752039537": { "mode": "normal", "short": "Reversing the Polarity", "name": "Reversing the Polarity", "description": "The Cabal tend to use a single technology to power everything in their arsenal. Take advantage of that design flaw to send them a message." }, "3753505781": { "mode": "normal", "short": "Iron Banner", "name": "Iron Banner", "description": "\"There will come a day when the Tower falls again. Our ability to hold territory is paramount.\" —Lord Saladin\n\nCapture zones to increase points for every kill." }, "3755158996": { "mode": "normal", "short": "Fragment", "name": "Fragment", "description": "Unknown, The Infinite Forest" }, "3767360267": { "mode": "normal", "short": "Private Match", "name": "Private Match", "description": "Create a custom PvP match with your fireteam, and best your comrades for personal glory… and bragging rights." }, "3774573332": { "mode": "arcadian chord", "short": "WANTED", "name": "WANTED: Arcadian Chord", "description": "Hunt down the wanted Arcadian Chord that escaped from the Prison of Elders." }, "3780095688": { "mode": "normal", "short": "Supremacy", "name": "Supremacy", "description": "\"Secure those crests, and send a clear message of dominance to your opponents. Just don't forget to give them back after the match. We're not monsters.\" —Lord Shaxx\n\nFight for Valor by defeating opponents and securing the crests they drop. Recover friendly crests to deny them from opponents." }, "3780356141": { "mode": "normal", "short": "Stop and Go", "name": "Stop and Go", "description": "Power generators in the Red Legion base are open to attack—but only for a short time. Speed into the subterranean complex and shut them down." }, "3780441058": { "mode": "active duty", "short": "Field Assignment", "name": "Field Assignment: Active Duty", "description": "" }, "3788594815": { "mode": "normal", "short": "Meltdown", "name": "Meltdown", "description": "Clovis Bray Special Projects, Mars" }, "3792746061": { "mode": "normal", "short": "Combat Mission", "name": "Combat Mission", "description": "" }, "3792818796": { "mode": "legendary", "short": "Skydock IV", "name": "Skydock IV (Legendary)", "description": "Head to Skydock IV and defeat Devourer Darg to retrieve Warmind Bits.\n\nMatch Game: Cabal\n\nChampions: Unstoppable, Barrier" }, "3792818799": { "mode": "legendary", "short": "The Quarry", "name": "The Quarry (Legendary)", "description": "Head to the Quarry and defeat Fortifier Yann to retrieve Warmind Bits.\n\nMatch Game: Cabal\n\nChampions: Unstoppable, Barrier" }, "3799743268": { "mode": "normal", "short": "Trials of the Nine", "name": "Trials of the Nine", "description": "Enter the Trials of the Nine to face your fellow Guardians. Prepare to be judged." }, "3801775390": { "mode": "normal", "short": "Strange Terrain", "name": "Strange Terrain", "description": "Defeat Nokris before he completes his ritual." }, "3805779101": { "mode": "combustor valus", "short": "WANTED", "name": "WANTED: Combustor Valus", "description": "Hunt down the wanted Combustor Valus that escaped from the Prison of Elders." }, "3806583577": { "mode": "normal", "short": "Assassination Mission", "name": "Assassination Mission", "description": "" }, "3807442201": { "mode": "normal", "short": "Vanguard Strikes", "name": "Vanguard Strikes", "description": "Launches a random Destiny 2 or Curse of Osiris strike." }, "3807442202": { "mode": "normal", "short": "Vanguard Strikes", "name": "Vanguard Strikes", "description": "Launches a random Destiny 2 or Warmind strike." }, "3808599336": { "mode": "normal", "short": "Private Match", "name": "Private Match", "description": "Create a custom PvP match with your fireteam, and best your comrades for personal glory… and bragging rights." }, "3813623455": { "mode": "normal", "short": "Broodhold", "name": "Broodhold", "description": "Eradicate a Hive infestation seething in the depths of the Tangled Shore." }, "3815730356": { "mode": "savathûn's song", "short": "Nightfall", "name": "Nightfall: Savathûn's Song", "description": "Delve deep into the Hive-infested Arcology in search of missing fireteams." }, "3828168919": { "mode": "normal", "short": "Tower", "name": "Tower", "description": "Home of the Guardians, where you can regroup, rearm, and form new alliances before venturing beyond." }, "3834639884": { "mode": "normal", "short": "Analysis Mission", "name": "Analysis Mission", "description": "" }, "3835150701": { "mode": "normal", "short": "The Verdant Forest", "name": "The Verdant Forest", "description": "Matchmaking enabled" }, "3836086286": { "mode": "normal", "short": "Unexpected Guests", "name": "Unexpected Guests", "description": "Ikora's worried about some Taken emanations from beneath the moon's surface." }, "3840133183": { "mode": "normal", "short": "European Aerial Zone", "name": "European Aerial Zone", "description": "The Vanguard is dispatching Guardians to the EAZ for combat drills and meditation. Join them." }, "3845997235": { "mode": "normal", "short": "Garden of Salvation", "name": "Garden of Salvation", "description": "\"The Garden calls out to you.\"", "release": "2019-10-05T19:00:00.000Z" }, "3849697856": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Adept", "description": "Savathûn's Song" }, "3849697858": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Legend", "description": "Savathûn's Song" }, "3849697859": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Hero", "description": "Savathûn's Song" }, "3849697860": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Grandmaster", "description": "Savathûn's Song" }, "3849697861": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Master", "description": "Savathûn's Song" }, "3849796864": { "mode": "normal", "short": "Retribution", "name": "Retribution", "description": "Upper Stratosphere, Mars" }, "3856436847": { "mode": "the scarlet keep", "short": "Nightfall", "name": "Nightfall: The Scarlet Keep", "description": "Investigate the recently erected Scarlet Keep and discover its dark purpose." }, "3857338478": { "mode": "prestige", "short": "Leviathan", "name": "Leviathan: Prestige", "description": "\"Grow fat from strength.\"", "release": "2017-10-18T19:00:00.000Z" }, "3858493935": { "mode": "normal", "short": "The Tribute Hall", "name": "The Tribute Hall", "description": "A golden hall of wonders created by the Emperor to celebrate your legacy." }, "3872525353": { "mode": "normal", "short": "Stop and Go", "name": "Stop and Go", "description": "Power generators in the Red Legion base are open to attack—but only for a short time. Speed into the subterranean complex and shut them down." }, "3874292246": { "mode": "normal", "short": "Haunted Forest", "name": "Haunted Forest", "description": "In the Infinite Forest, a new threat rises—a spooky threat. Put on your mask and celebrate Festival of the Lost by exploring the depths of the Haunted Forest." }, "3879143309": { "mode": "normal", "short": "The Scarlet Keep", "name": "The Scarlet Keep", "description": "Investigate the recently erected Scarlet Keep and discover its dark purpose." }, "3879860661": { "mode": "prestige", "short": "Leviathan", "name": "Leviathan: Prestige", "description": "\"Grow fat from strength.\"", "release": "2017-10-18T19:00:00.000Z" }, "3879949581": { "mode": "grandmaster", "short": "The Ordeal", "name": "The Ordeal: Grandmaster: Broodhold", "description": "Broodhold" }, "3883876600": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Master", "description": "Strange Terrain" }, "3883876601": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Grandmaster", "description": "Strange Terrain" }, "3883876605": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Adept", "description": "Strange Terrain" }, "3883876606": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Hero", "description": "Strange Terrain" }, "3883876607": { "mode": "the ordeal", "short": "Nightfall", "name": "Nightfall: The Ordeal: Legend", "description": "Strange Terrain" }, "3897198695": { "mode": "normal", "short": "The Farm", "name": "The Farm", "description": "A refugee camp set up during the Red War for Guardians and non Guardians alike, on the outskirts of the EDZ." }, "3897312654": { "mode": "normal", "short": "Pacifica", "name": "Pacifica", "description": "Tidal Anchor, Titan" }, "3903562778": { "mode": "normal", "short": "Tower", "name": "Tower", "description": "Home of the Guardians, where you can regroup, rearm, and form new alliances before venturing beyond." }, "3903562779": { "mode": "normal", "short": "Tower", "name": "Tower", "description": "Home of the Guardians, where you can regroup, rearm, and form new alliances before venturing beyond." }, "3907468134": { "mode": "will of the thousands", "short": "Nightfall", "name": "Nightfall: Will of the Thousands", "description": "Defeat Xol before everything is destroyed." }, "3909841711": { "mode": "heroic", "short": "Psionic Potential", "name": "Psionic Potential (Heroic)", "description": "Locate the stolen supplies." }, "3912437239": { "mode": "prestige", "short": "Leviathan", "name": "Leviathan: Prestige", "description": "\"Grow fat from strength.\"", "release": "2017-10-18T19:00:00.000Z" }, "3914655049": { "mode": "normal", "short": "Collect Supplies", "name": "Collect Supplies", "description": "Defeat Cabal to collect Red Legion supplies." }, "3916343513": { "mode": "normal", "short": "Leviathan", "name": "Leviathan", "description": "\"Grow fat from strength.\"" }, "3917379285": { "mode": "normal", "short": "Twilight Gap", "name": "Twilight Gap", "description": "Last City Perimeter, Earth" }, "3919254032": { "mode": "grandmaster", "short": "The Ordeal", "name": "The Ordeal: Grandmaster: Lake of Shadows", "description": "Lake of Shadows" }, "3920569453": { "mode": "heroic", "short": "Bug in the System", "name": "Bug in the System (Heroic)", "description": "Corrupt a Vex data-harvesting operation by withstanding an onslaught of Hive." }, "3920643231": { "mode": "the arms dealer", "short": "Nightfall", "name": "Nightfall: The Arms Dealer", "description": "Shut down the operations of an ironmonger providing weapons to the Red Legion." }, "3923970483": { "mode": "normal", "short": "Cathedral of Scars", "name": "Cathedral of Scars", "description": "The Dreaming City, The Vestian Web" }, "3944547192": { "mode": "normal", "short": "Will of the Thousands", "name": "Will of the Thousands", "description": "Defeat Xol before everything is destroyed." }, "3944547194": { "mode": "normal", "short": "Will of the Thousands", "name": "Will of the Thousands", "description": "Defeat Xol before everything is destroyed." }, "3944547195": { "mode": "normal", "short": "Will of the Thousands", "name": "Will of the Thousands", "description": "Defeat Xol before everything is destroyed." }, "3945952280": { "mode": "normal", "short": "Twilight Gap", "name": "Twilight Gap", "description": "Last City Perimeter, Earth" }, "3957909528": { "mode": "blood cleaver", "short": "WANTED", "name": "WANTED: Blood Cleaver", "description": "Hunt down the wanted Blood Cleaver that escaped from the Prison of Elders." }, "3958400416": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "" }, "3966792859": { "mode": "normal", "short": "Nessus, Unstable Centaur", "name": "Nessus, Unstable Centaur", "description": "Fly directly to this Landing Zone." }, "3978357488": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "3982116234": { "mode": "normal", "short": "New Light", "name": "New Light", "description": "Welcome, Guardian. Fight through the Cosmodrome to find a ship and make your escape." }, "3996138539": { "mode": "normal", "short": "New Arcadia", "name": "New Arcadia", "description": "Hellas Basin, Mars" }, "4002737048": { "mode": "normal", "short": "Kell's Grave", "name": "Kell's Grave", "description": "Tangled Shore, The Reef" }, "4003594394": { "mode": "insanity", "short": "Nightmare Hunt", "name": "Nightmare Hunt: Insanity", "description": "Defeat the Nightmare of the Fanatic." }, "4009655461": { "mode": "the machinist", "short": "Daily Heroic Story Mission", "name": "Daily Heroic Story Mission: The Machinist", "description": "Complete the Daily Heroic story mission." }, "4012915511": { "mode": "normal", "short": "The Burnout", "name": "The Burnout", "description": "Vex Future, Infinite Forest" }, "4034557395": { "mode": "normal", "short": "Homecoming", "name": "Homecoming", "description": "The Last City is under attack by the Red Legion. It's time to fight back." }, "4039317196": { "mode": "normal", "short": "Leviathan", "name": "Leviathan", "description": "\"Grow fat from strength.\"" }, "4043714237": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "" }, "4047570705": { "mode": "normal", "short": "Combat Mission", "name": "Combat Mission", "description": "" }, "4050886070": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "" }, "4052671056": { "mode": "normal", "short": "Heroic Strikes Playlist", "name": "Heroic Strikes Playlist", "description": "Launches a random Destiny 2, Curse of Osiris, or Warmind Heroic strike." }, "4054968718": { "mode": "the inverted spire", "short": "Nightfall", "name": "Nightfall: The Inverted Spire", "description": "End the Red Legion expedition that has ripped open the planet's surface." }, "4085493024": { "mode": "normal", "short": "Tree of Probabilities", "name": "Tree of Probabilities", "description": "Contain a rampant army of Red Legion within the Infinite Forest." }, "4094398454": { "mode": "normal", "short": "Deathly Tremors", "name": "Deathly Tremors", "description": "Investigate the strange Hive signals." }, "4095207117": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "4098556690": { "mode": "rage", "short": "Nightmare Hunt", "name": "Nightmare Hunt: Rage: Adept", "description": "Defeat the Nightmare of Dominus Ghaul." }, "4098556691": { "mode": "rage", "short": "Nightmare Hunt", "name": "Nightmare Hunt: Rage: Hero", "description": "Defeat the Nightmare of Dominus Ghaul." }, "4098556692": { "mode": "rage", "short": "Nightmare Hunt", "name": "Nightmare Hunt: Rage: Legend", "description": "Defeat the Nightmare of Dominus Ghaul." }, "4098556693": { "mode": "rage", "short": "Nightmare Hunt", "name": "Nightmare Hunt: Rage: Master", "description": "Defeat the Nightmare of Dominus Ghaul." }, "4103844069": { "mode": "normal", "short": "Assassination Mission", "name": "Assassination Mission", "description": "" }, "4126301197": { "mode": "normal", "short": "Widow's Court", "name": "Widow's Court", "description": "European Dead Zone, Earth" }, "4134816102": { "mode": "normal", "short": "Lake of Shadows", "name": "Lake of Shadows", "description": "Stem the tide of Taken flowing into the European Dead Zone from beneath the waves." }, "4148187374": { "mode": "normal", "short": "Prophecy", "name": "Prophecy", "description": "Enter the realm of the Nine and ask the question: \"What is the nature of the Darkness?\"", "release": "2020-06-09T02:00:00.000Z" }, "4150577752": { "mode": "the eye in the dark", "short": "WANTED", "name": "WANTED: The Eye in the Dark", "description": "Hunt down the wanted Eye in the Dark that was taken from the Prison of Elders." }, "4159221189": { "mode": "normal", "short": "Io", "name": "Io", "description": "" }, "4163641477": { "mode": "normal", "short": "Cathedral of Scars", "name": "Cathedral of Scars", "description": "The Dreaming City, The Vestian Web" }, "4166562681": { "mode": "normal", "short": "Titan", "name": "Titan", "description": "" }, "4167922031": { "mode": "normal", "short": "In the Deep", "name": "In the Deep", "description": "Somewhere in the horrific depths of the Hellmouth lies the Hive Cryptoglyph. With it, Eris Morn can craft further Dreambane armor for your quest to find a way inside the Pyramid.\n\nThe Cryptoglyph is yours to take from the Hive… if you can." }, "4168439466": { "mode": "normal", "short": "Cauldron", "name": "Cauldron", "description": "Ocean of Storms, Moon" }, "4174103238": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "4199058482": { "mode": "the eye in the dark", "short": "WANTED", "name": "WANTED: The Eye in the Dark", "description": "Hunt down the wanted Eye in the Dark that was taken from the Prison of Elders." }, "4204849452": { "mode": "normal", "short": "Nothing Left to Say", "name": "Nothing Left to Say", "description": "Climb the Watchtower to stop Uldren and the Fanatic." }, "4206123728": { "mode": "prestige", "short": "Leviathan", "name": "Leviathan: Prestige", "description": "\"Grow fat from strength.\"", "release": "2017-10-18T19:00:00.000Z" }, "4209226441": { "mode": "normal", "short": "Hardware", "name": "Hardware", "description": "Fight for Valor in large-scale combat scenarios." }, "4209774794": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "4216926874": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "4231544111": { "mode": "normal", "short": "Survey mission", "name": "Survey mission", "description": "" }, "4234327344": { "mode": "a deadly trial", "short": "Daily Heroic Story Mission", "name": "Daily Heroic Story Mission: A Deadly Trial", "description": "Complete the Daily Heroic story mission." }, "4237009519": { "mode": "omega", "short": "Daily Heroic Story Mission", "name": "Daily Heroic Story Mission: Omega", "description": "Complete the Daily Heroic story mission." }, "4238309598": { "mode": "heroic", "short": "The Mad Bomber", "name": "The Mad Bomber (Heroic)", "description": "" }, "4242525388": { "mode": "normal", "short": "Private Match", "name": "Private Match", "description": "Create a custom PvP match with your fireteam, and best your comrades for personal glory… and bragging rights." }, "4244464899": { "mode": "hijacked", "short": "Daily Heroic Story Mission", "name": "Daily Heroic Story Mission: Hijacked", "description": "Complete the Daily Heroic story mission." }, "4252456044": { "mode": "normal", "short": "Vanguard Strikes", "name": "Vanguard Strikes", "description": "The Vanguard seeks Guardians to undertake high-priority missions against the City's enemies." }, "4254776501": { "mode": "normal", "short": "Salvage Mission", "name": "Salvage Mission", "description": "" }, "4259769141": { "mode": "the inverted spire", "short": "Nightfall", "name": "Nightfall: The Inverted Spire", "description": "End the Red Legion expedition that's ripped open the planet's surface." }, "4260306233": { "mode": "normal", "short": "Exodus Crash", "name": "Exodus Crash", "description": "Purge the Fallen infestation of the Exodus Black." }, "4261351281": { "mode": "normal", "short": "The Pyramidion", "name": "The Pyramidion", "description": "Seek vengeance against the Vex Mind that corrupted Asher's arm." }, "4269241421": { "mode": "normal", "short": "Legacy Strikes", "name": "Legacy Strikes", "description": "The Vanguard seeks Guardians to undertake high-priority missions against the City's enemies." }, "4275462311": { "mode": "blood cleaver", "short": "WANTED", "name": "WANTED: Blood Cleaver", "description": "Hunt down the wanted Blood Cleaver that escaped from the Prison of Elders." }, "4279557030": { "mode": "strange terrain", "short": "Nightfall", "name": "Nightfall: Strange Terrain: Normal", "description": "Defeat Xol's necromancer, Nokris, and his army of Frozen Hive." }, "4283649349": { "mode": "normal", "short": "Assassination Mission", "name": "Assassination Mission", "description": "" } }

},{}],10:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("./bungie/client");
var user_1 = require("./util/user");
var activity_1 = require("./util/activity");
// @ts-ignore
var swivel = require("swivel");
var db_1 = require("./util/db");
var bungie = new client_1.BungieAPI('387dbc6ecb3b48ed9983ad926fea5a8e');
var user = new user_1.User(bungie);
var db = new db_1.RaidDungeonDb();
var activity = new activity_1.Activity(bungie, db);
self.addEventListener('activate', function () {
    console.log('activated');
    swivel.broadcast('activated');
});
swivel.on('activate', function (ctx, payload) { return __awaiter(void 0, void 0, void 0, function () {
    var results;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, user.search(payload.query)];
            case 1:
                results = _a.sent();
                ctx.reply('res/search', results);
                return [2 /*return*/];
        }
    });
}); });
swivel.on('req/search', function (ctx, payload) { return __awaiter(void 0, void 0, void 0, function () {
    var results;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, user.search(payload.query)];
            case 1:
                results = _a.sent();
                ctx.reply('res/search', results);
                return [2 /*return*/];
        }
    });
}); });
swivel.on('req/activities', function (ctx, _a) {
    var type = _a.type, id = _a.id, characters = _a.characters, refresh = _a.refresh;
    return __awaiter(void 0, void 0, void 0, function () {
        var flawless;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, user.flawless(type, id)];
                case 1:
                    flawless = _b.sent();
                    return [4 /*yield*/, activity.activities(type, id, characters, refresh, flawless, ctx.reply)];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
});
swivel.on('req/profile', function (ctx, _a) {
    var type = _a.type, id = _a.id;
    return __awaiter(void 0, void 0, void 0, function () {
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _c = (_b = ctx).reply;
                    _d = ['res/profile'];
                    return [4 /*yield*/, user.profile(type, id)];
                case 1:
                    _c.apply(_b, _d.concat([_e.sent()]));
                    return [2 /*return*/];
            }
        });
    });
});
swivel.on('req/characters', function (ctx, _a) {
    var type = _a.type, id = _a.id;
    return __awaiter(void 0, void 0, void 0, function () {
        var characters;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, user.characters(type, id)];
                case 1:
                    characters = _b.sent();
                    ctx.reply('res/characters', { characters: characters, id: id });
                    return [2 /*return*/];
            }
        });
    });
});

},{"./bungie/client":6,"./util/activity":11,"./util/db":13,"./util/user":15,"swivel":28}],11:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Activity = void 0;
var client_1 = require("../bungie/client");
var destiny_1 = require("../bungie/destiny");
var moment = require("moment");
var underscore_1 = require("underscore");
var constant_1 = require("./constant");
var tags_1 = require("./tags");
var DEFINITIONS = require("../definitions.json");
var COVER_IMAGES = {
    "Crown of Sorrow: Normal": "crown",
    "The Whisper": "whisper",
    "The Whisper (Heroic)": "whisper",
    "Zero Hour (Heroic)": "zero-hour",
    "Zero Hour": "zero-hour",
    "Last Wish: Level 55": "last-wish",
    "Scourge of the Past": "sotp",
    "Garden of Salvation": "garden",
    "Prophecy": "prophecy",
    "Pit of Heresy: Normal": "pit",
    "The Shattered Throne": "shattered-throne",
    "Leviathan: Normal": "leviathan",
    "Leviathan: Prestige": "leviathan",
    "Leviathan, Eater of Worlds: Normal": "eater-of-worlds",
    "Leviathan, Eater of Worlds: Prestige": "eater-of-worlds",
    "Leviathan, Spire of Stars: Normal": "spire-of-stars",
    "Leviathan, Spire of Stars: Prestige": "spire-of-stars",
};
var Activity = /** @class */ (function () {
    function Activity(bungie, db) {
        this.bungie = bungie;
        this.db = db;
    }
    Activity.prototype.report = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client_1.retry(function () { return __awaiter(_this, void 0, void 0, function () {
                            var Response, players;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.bungie.destiny.getPostGameCarnageReport(id)];
                                    case 1:
                                        Response = (_a.sent()).Response;
                                        players = underscore_1.sortBy(Response.entries.map(function (_a) {
                                            var player = _a.player, values = _a.values;
                                            return ({
                                                id: player.destinyUserInfo.membershipId,
                                                name: player.destinyUserInfo.displayName,
                                                icon: "https://bungie.net" + player.destinyUserInfo.iconPath,
                                                type: player.destinyUserInfo.membershipType,
                                                class: player.characterClass,
                                                light: player.lightLevel,
                                                deaths: values.deaths.basic.value,
                                                flawless: values.deaths.basic.value === 0,
                                                completed: values.completed.basic.value === 1
                                            });
                                        }), function (it) { return it.completed; });
                                        return [2 /*return*/, {
                                                fresh: Response.startingPhaseIndex === 0,
                                                playersCount: new Set(players.map(function (it) { return it['id']; })).size,
                                                players: players,
                                            }];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Activity.prototype.activitiesPerPage = function (membershipType, destinyMembershipId, character, mode, parsed, page) {
        if (page === void 0) { page = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var Response_1, isStory_1, items, _a, _b, e_1;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.bungie.destiny.getActivityHistory(membershipType, destinyMembershipId, character, {
                                count: 250,
                                mode: mode,
                                page: page
                            })];
                    case 1:
                        Response_1 = (_c.sent()).Response;
                        isStory_1 = mode === destiny_1.ActivityMode.story;
                        if (!Response_1.activities) {
                            return [2 /*return*/, []];
                        }
                        return [4 /*yield*/, Promise.all(Response_1.activities
                                .filter(function (_a) {
                                var values = _a.values;
                                return values.completionReason.basic.value === 0 && values.completed.basic.value === 1;
                            })
                                .map(function (it) { return __awaiter(_this, void 0, void 0, function () {
                                var id, indexed, hash, display, activity, _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            id = it.activityDetails.instanceId;
                                            return [4 /*yield*/, this.db.activities.get({ id: id })];
                                        case 1:
                                            indexed = _b.sent();
                                            if (indexed) {
                                                indexed.period = moment(indexed.period);
                                                return [2 /*return*/, indexed];
                                            }
                                            hash = it.activityDetails.directorActivityHash;
                                            if (isStory_1 && !constant_1.VALID_HASHES[hash] || parsed[id]) {
                                                return [2 /*return*/, null];
                                            }
                                            parsed[id] = true;
                                            display = DEFINITIONS[hash];
                                            _a = [{ id: id, period: moment(it.period), type: mode, hash: hash }];
                                            return [4 /*yield*/, this.report(id)];
                                        case 2:
                                            activity = __assign.apply(void 0, [__assign.apply(void 0, _a.concat([(_b.sent())])), { image: "/cover/" + COVER_IMAGES[display.name] + ".png", display: display }]);
                                            this.db.activities.put(__assign(__assign({}, activity), { user: destinyMembershipId, period: it.period }));
                                            return [2 /*return*/, activity];
                                    }
                                });
                            }); }))];
                    case 2:
                        items = _c.sent();
                        _b = (_a = items
                            .filter(function (it) { return it; })).concat;
                        return [4 /*yield*/, this.activitiesPerPage(membershipType, destinyMembershipId, character, mode, parsed, page + 1)];
                    case 3: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                    case 4:
                        e_1 = _c.sent();
                        console.log(e_1, character, page, mode);
                        return [2 /*return*/, []];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Activity.prototype.activities = function (membershipType, destinyMembershipId, characters, refresh, flawless, emit) {
        if (refresh === void 0) { refresh = false; }
        return __awaiter(this, void 0, void 0, function () {
            var modes, items, parsed, _loop_1, _i, characters_1, character, e_2, unique, _a, _b, _c;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        modes = [destiny_1.ActivityMode.raid, destiny_1.ActivityMode.dungeon, destiny_1.ActivityMode.story];
                        items = [];
                        parsed = {};
                        if (!!refresh) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.db.activities.where({ user: destinyMembershipId }).toArray()];
                    case 1:
                        items = _d.sent();
                        items.forEach(function (it) { return it.period = moment(it.period); });
                        _d.label = 2;
                    case 2:
                        if (!(!items.length || refresh)) return [3 /*break*/, 9];
                        _d.label = 3;
                    case 3:
                        _d.trys.push([3, 8, , 9]);
                        _loop_1 = function (character) {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, Promise.all(modes.map(function (mode) { return __awaiter(_this, void 0, void 0, function () {
                                            var _a, _b, _c;
                                            return __generator(this, function (_d) {
                                                switch (_d.label) {
                                                    case 0:
                                                        emit('res/progress', { character: character, mode: mode, id: destinyMembershipId, completed: false });
                                                        _b = (_a = items.push).apply;
                                                        _c = [items];
                                                        return [4 /*yield*/, this.activitiesPerPage(membershipType, destinyMembershipId, character, mode, parsed)];
                                                    case 1:
                                                        _b.apply(_a, _c.concat([_d.sent()]));
                                                        emit('res/progress', { character: character, mode: mode, id: destinyMembershipId, completed: true });
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); }))];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        _i = 0, characters_1 = characters;
                        _d.label = 4;
                    case 4:
                        if (!(_i < characters_1.length)) return [3 /*break*/, 7];
                        character = characters_1[_i];
                        return [5 /*yield**/, _loop_1(character)];
                    case 5:
                        _d.sent();
                        _d.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        e_2 = _d.sent();
                        console.log(e_2);
                        return [3 /*break*/, 9];
                    case 9:
                        unique = underscore_1.uniq(items, function (it) { return it.id; });
                        unique.forEach(tags_1.assignTags);
                        _a = emit;
                        _b = ['res/activities'];
                        _c = [{ id: destinyMembershipId, flawless: flawless }];
                        return [4 /*yield*/, tags_1.indexActivities(unique)];
                    case 10:
                        _a.apply(void 0, _b.concat([__assign.apply(void 0, _c.concat([_d.sent()]))]));
                        return [2 /*return*/];
                }
            });
        });
    };
    return Activity;
}());
exports.Activity = Activity;

},{"../bungie/client":6,"../bungie/destiny":7,"../definitions.json":9,"./constant":12,"./tags":14,"moment":25,"underscore":31}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VALID_HASHES = void 0;
exports.VALID_HASHES = {
    2731208666: true,
    3232506937: true,
    74501540: true,
    1099555105: true,
    1893059148: true,
    2032534090: true
};

},{}],13:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaidDungeonDb = void 0;
var dexie_1 = require("dexie");
var RaidDungeonDb = /** @class */ (function (_super) {
    __extends(RaidDungeonDb, _super);
    function RaidDungeonDb() {
        var _this = _super.call(this, "RaidDungeonDb") || this;
        _this.version(10).stores({
            activities: '++id,user,hash',
            display: '++id,hash',
        });
        _this.activities = _this.table("activities");
        return _this;
    }
    return RaidDungeonDb;
}(dexie_1.Dexie));
exports.RaidDungeonDb = RaidDungeonDb;

},{"dexie":24}],14:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexActivities = exports.assignTags = void 0;
var underscore_1 = require("underscore");
var destiny_1 = require("../bungie/destiny");
var TAGS;
(function (TAGS) {
    TAGS["solo"] = "solo";
    TAGS["flawless"] = "flawless";
    TAGS["soloFlawless"] = "solo-flawless";
    TAGS["threeMan"] = "3-man";
    TAGS["twoMan"] = "2-man";
})(TAGS || (TAGS = {}));
var TIME_TAGS;
(function (TIME_TAGS) {
    TIME_TAGS["dayOne"] = "day-one";
    TIME_TAGS["dayTwo"] = "day-two";
    TIME_TAGS["weekOne"] = "week-one";
})(TIME_TAGS || (TIME_TAGS = {}));
var ELAPSED_TIME;
(function (ELAPSED_TIME) {
    ELAPSED_TIME[ELAPSED_TIME["one_day"] = 1440] = "one_day";
    ELAPSED_TIME[ELAPSED_TIME["two_days"] = 2880] = "two_days";
    ELAPSED_TIME[ELAPSED_TIME["week"] = 10080] = "week";
})(ELAPSED_TIME || (ELAPSED_TIME = {}));
var checkIfButtonsRaid = function (name) { return name.startsWith('Last Wish') || name.startsWith('Crown of Sorrow') || name.startsWith('Scourge of the Past'); };
var wasTrolled = function (activity, isRaid) {
    if (isRaid && checkIfButtonsRaid(activity.display.name)) {
        var trolledPercent = underscore_1.reduce(activity.players.map(function (it) { return Number(it.flawless); }), function (memo, num) { return memo + num; }, 0) / activity.playersCount;
        activity.trolled = trolledPercent > 0.7;
        return activity.trolled;
    }
    return false;
};
exports.assignTags = function (activity) {
    var playersCount = activity.playersCount, players = activity.players, fresh = activity.fresh, type = activity.type;
    var tags = [];
    if (players.every(function (it) { return !it.name; })) {
        activity.tags = [];
        return;
    }
    var isRaid = type === destiny_1.ActivityMode.raid;
    switch (playersCount) {
        case 1:
            if (!players[0].flawless) {
                if (isRaid) {
                    tags.push(TAGS.solo);
                }
                else {
                    fresh && tags.push(TAGS.solo);
                }
            }
            else if (fresh) {
                fresh && tags.push(TAGS.soloFlawless);
            }
            break;
        case 2:
            isRaid && tags.push(TAGS.twoMan);
            break;
        case 3:
            isRaid && tags.push(TAGS.threeMan);
            break;
    }
    if (fresh && playersCount > 1 && (players.every(function (it) { return it.flawless; }) || wasTrolled(activity, isRaid))) {
        tags.push(TAGS.flawless);
    }
    var diff = activity.period.diff(activity.display.release, 'minutes');
    diff <= ELAPSED_TIME.week && tags.push(diff <= ELAPSED_TIME.one_day ? TIME_TAGS.dayOne :
        diff <= ELAPSED_TIME.two_days ? TIME_TAGS.dayTwo :
            TIME_TAGS.weekOne);
    activity.tags = tags;
};
exports.indexActivities = function (items) {
    var sorted = underscore_1.sortBy(items, function (it) { return it.period; });
    var tags = Object.values(TAGS);
    var index = __assign({ first: {} }, underscore_1.object(tags.map(function (it) { return [it, {}]; })));
    var totals = {};
    var checkForKeep = function (key, tag, activity) {
        if (!index[tag][key] && activity.tags.includes(tag)) {
            index[tag][key] = true;
            activity.keep = true;
        }
    };
    sorted.forEach(function (activity) {
        var _a = activity.display, name = _a.name, short = _a.short, mode = _a.mode;
        if (!index.first[name]) {
            index.first[name] = true;
            activity.tags = __spreadArrays((activity.tags || []), ['first-completion']);
            activity.keep = true;
        }
        if (!totals[short] && mode) {
            totals[short] = {};
        }
        var value = (mode ? totals[short][mode] : totals[short]) || 0;
        if (mode) {
            totals[short][mode] = value + 1;
        }
        else {
            totals[short] = value + 1;
        }
        tags.forEach(function (tag) { return checkForKeep(name, tag, activity); });
        activity.period = activity.period.toString();
    });
    return {
        items: sorted.filter(function (it) { return it.keep; }),
        totals: totals
    };
};

},{"../bungie/destiny":7,"underscore":31}],15:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var id_1 = require("@node-steam/id");
var CLASSES = ['Titan', 'Hunter', 'Warlock'];
var User = /** @class */ (function () {
    function User(bungie) {
        this.bungie = bungie;
    }
    User.prototype.characters = function (membershipType, destinyMembershipId) {
        return __awaiter(this, void 0, void 0, function () {
            var Response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.bungie.user.getProfile(membershipType, destinyMembershipId, { components: [200] })];
                    case 1:
                        Response = (_a.sent()).Response;
                        try {
                            return [2 /*return*/, Object.values(Response.characters.data).map(function (it) { return ({
                                    id: it.characterId,
                                    image: 'https://bungie.net' + it.emblemBackgroundPath,
                                    icon: 'https://bungie.net' + it.emblemPath,
                                    class: CLASSES[it.classType],
                                    light: it.light
                                }); })];
                        }
                        catch (e) {
                            return [2 /*return*/, []];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.profile = function (membershipType, membershipId) {
        return __awaiter(this, void 0, void 0, function () {
            var profile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.bungie.user.getProfile(membershipType, membershipId, {
                            components: [100]
                        })];
                    case 1:
                        profile = _a.sent();
                        return [2 /*return*/, profile.Response.profile.data.userInfo.displayName];
                }
            });
        });
    };
    User.prototype.flawless = function (membershipType, membershipId) {
        return __awaiter(this, void 0, void 0, function () {
            var profile, check;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.bungie.user.getProfile(membershipType, membershipId, {
                            components: [900]
                        })];
                    case 1:
                        profile = _a.sent();
                        check = function (hash) { return (profile.Response.profileRecords.data.records[hash].state & 1) === 1; };
                        return [2 /*return*/, {
                                'Crown of Sorrow': check(1558682416),
                                'Last Wish': check(4177910003),
                                'Scourge of the Past': check(2648109757),
                                'Garden of Salvation': check(3144827156)
                            }];
                }
            });
        });
    };
    User.prototype.search = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var isSteamID, request, Response_1, membershipType, membershipId, profile, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        try {
                            isSteamID = new id_1.ID(id).isValid();
                        }
                        catch (e) {
                            isSteamID = false;
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        request = isSteamID ?
                            this.bungie.user.getMembershipFromHardLinkedCredential(id) :
                            this.bungie.user.searchDestinyPlayer(-1, id);
                        return [4 /*yield*/, request];
                    case 2:
                        Response_1 = (_a.sent()).Response;
                        if (!isSteamID) return [3 /*break*/, 4];
                        membershipType = Response_1.membershipType, membershipId = Response_1.membershipId;
                        return [4 /*yield*/, this.bungie.user.getProfile(membershipType, membershipId, {
                                components: [100]
                            })];
                    case 3:
                        profile = _a.sent();
                        Response_1.displayName = profile.Response.profile.data.userInfo.displayName;
                        _a.label = 4;
                    case 4: return [2 /*return*/, (Array.isArray(Response_1) ? Response_1 : [Response_1]).map(function (it) { return ({
                            type: it.membershipType,
                            name: it.displayName,
                            icon: 'https://bungie.net' + (it.iconPath || '/img/theme/bungienet/icons/steamLogo.png'),
                            id: it.membershipId
                        }); })];
                    case 5:
                        e_1 = _a.sent();
                        console.log(e_1);
                        return [2 /*return*/, []];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return User;
}());
exports.User = User;

},{"@node-steam/id":17}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Universe;
(function (Universe) {
    Universe[Universe["INVALID"] = 0] = "INVALID";
    Universe[Universe["PUBLIC"] = 1] = "PUBLIC";
    Universe[Universe["BETA"] = 2] = "BETA";
    Universe[Universe["INTERNAL"] = 3] = "INTERNAL";
    Universe[Universe["DEV"] = 4] = "DEV";
})(Universe = exports.Universe || (exports.Universe = {}));
var Type;
(function (Type) {
    Type[Type["INVALID"] = 0] = "INVALID";
    Type[Type["INDIVIDUAL"] = 1] = "INDIVIDUAL";
    Type[Type["MULTISEAT"] = 2] = "MULTISEAT";
    Type[Type["GAMESERVER"] = 3] = "GAMESERVER";
    Type[Type["ANON_GAMESERVER"] = 4] = "ANON_GAMESERVER";
    Type[Type["PENDING"] = 5] = "PENDING";
    Type[Type["CONTENT_SERVER"] = 6] = "CONTENT_SERVER";
    Type[Type["CLAN"] = 7] = "CLAN";
    Type[Type["CHAT"] = 8] = "CHAT";
    Type[Type["P2P_SUPER_SEEDER"] = 9] = "P2P_SUPER_SEEDER";
    Type[Type["ANON_USER"] = 10] = "ANON_USER";
})(Type = exports.Type || (exports.Type = {}));
var Instance;
(function (Instance) {
    Instance[Instance["ALL"] = 0] = "ALL";
    Instance[Instance["DESKTOP"] = 1] = "DESKTOP";
    Instance[Instance["CONSOLE"] = 2] = "CONSOLE";
    Instance[Instance["WEB"] = 4] = "WEB";
})(Instance = exports.Instance || (exports.Instance = {}));
var TypeChar;
(function (TypeChar) {
    TypeChar[TypeChar["I"] = 0] = "I";
    TypeChar[TypeChar["U"] = 1] = "U";
    TypeChar[TypeChar["M"] = 2] = "M";
    TypeChar[TypeChar["G"] = 3] = "G";
    TypeChar[TypeChar["A"] = 4] = "A";
    TypeChar[TypeChar["P"] = 5] = "P";
    TypeChar[TypeChar["C"] = 6] = "C";
    TypeChar[TypeChar["g"] = 7] = "g";
    TypeChar[TypeChar["T"] = 8] = "T";
    TypeChar[TypeChar["a"] = 10] = "a";
})(TypeChar = exports.TypeChar || (exports.TypeChar = {}));

},{}],17:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var cuint_1 = require("cuint");
var enums_1 = require("./enums");
exports.AccountIDMask = 0xFFFFFFFF;
exports.AccountInstanceMask = 0x000FFFFF;
exports.ChatInstanceFlags = {
    Clan: (exports.AccountInstanceMask + 1) >> 1,
    Lobby: (exports.AccountInstanceMask + 1) >> 2,
    MMSLobby: (exports.AccountInstanceMask + 1) >> 3,
};
var regex = {
    steam2: /^STEAM_([0-5]):([0-1]):([0-9]+)$/,
    steam3: /^\[([a-zA-Z]):([0-5]):([0-9]+)(:[0-9]+)?\]$/,
};
var getTypeFromChar = function (char) {
    if (enums_1.TypeChar[char])
        return enums_1.TypeChar[char];
    return enums_1.Type.INVALID;
};
var ID = (function () {
    function ID(input) {
        var _this = this;
        this.isValid = function () {
            if (_this.type <= enums_1.Type.INVALID || _this.type > enums_1.Type.ANON_USER) {
                return false;
            }
            if (_this.universe <= enums_1.Universe.INVALID || _this.universe > enums_1.Universe.DEV) {
                return false;
            }
            if (_this.type === enums_1.Type.INDIVIDUAL && (_this.accountid === 0 || _this.instance > enums_1.Instance.WEB)) {
                return false;
            }
            if (_this.type === enums_1.Type.CLAN && (_this.accountid === 0 || _this.instance !== enums_1.Instance.ALL)) {
                return false;
            }
            if (_this.type === enums_1.Type.GAMESERVER && _this.accountid === 0) {
                return false;
            }
            return true;
        };
        this.isGroupChat = function () {
            return !!(_this.type === enums_1.Type.CHAT && _this.instance & exports.ChatInstanceFlags.Clan);
        };
        this.isLobby = function () {
            return !!(_this.type === enums_1.Type.CHAT && (_this.instance & exports.ChatInstanceFlags.Lobby || _this.instance & exports.ChatInstanceFlags.MMSLobby));
        };
        this.getSteamID2 = function (format) {
            if (_this.type !== enums_1.Type.INDIVIDUAL) {
                throw new Error("Can't get Steam2 rendered ID for non-individual ID");
            }
            else {
                var universe = _this.universe;
                if (!format && universe === 1) {
                    universe = 0;
                }
                return "STEAM_" + universe + ":" + (_this.accountid & 1) + ":" + Math.floor(_this.accountid / 2);
            }
        };
        this.getSteamID3 = function () {
            var char = enums_1.TypeChar[_this.type] || 'i';
            if (_this.instance & exports.ChatInstanceFlags.Clan) {
                char = 'c';
            }
            else if (_this.instance & exports.ChatInstanceFlags.Lobby) {
                char = 'L';
            }
            var renderInstance = (_this.type === enums_1.Type.ANON_GAMESERVER ||
                _this.type === enums_1.Type.MULTISEAT ||
                (_this.type === enums_1.Type.INDIVIDUAL && _this.instance !== enums_1.Instance.DESKTOP));
            return "[" + char + ":" + _this.universe + ":" + _this.accountid + (renderInstance ? ':' + _this.instance : '') + "]";
        };
        this.getSteamID64 = function () {
            return new cuint_1.UINT64(_this.accountid, (_this.universe << 24) | (_this.type << 20) | (_this.instance)).toString();
        };
        this.get2 = this.getSteamID2;
        this.steam2 = this.getSteamID2;
        this.getSteam2RenderedID = this.getSteamID2;
        this.get3 = this.getSteamID3;
        this.steam3 = this.getSteamID3;
        this.getSteam3RenderedID = this.getSteamID3;
        this.get64 = this.getSteamID64;
        this.steam64 = this.getSteamID64;
        this.toString = this.getSteamID64;
        this.getUniverse = function () {
            return enums_1.Universe[_this.universe];
        };
        this.getType = function () {
            return enums_1.Type[_this.type];
        };
        this.getInstance = function () {
            return enums_1.Instance[_this.instance];
        };
        this.getUniverseID = function () {
            return _this.universe;
        };
        this.getTypeID = function () {
            return _this.type;
        };
        this.getInstanceID = function () {
            return _this.instance;
        };
        this.getAccountID = function () {
            return _this.accountid;
        };
        this.getFormat = function () {
            return _this.format;
        };
        this.universe = enums_1.Universe.INVALID;
        this.type = enums_1.Type.INVALID;
        this.instance = enums_1.Instance.ALL;
        this.accountid = 0;
        this.format = 'none';
        if (!input) {
            return;
        }
        if (input.match(regex.steam2)) {
            var matches = input.match(regex.steam2);
            this.format = 'steam2';
            this.universe = parseInt(matches[1], 10) || enums_1.Universe.PUBLIC;
            this.type = enums_1.Type.INDIVIDUAL;
            this.instance = enums_1.Instance.DESKTOP;
            this.accountid = (parseInt(matches[3], 10) * 2) + parseInt(matches[2], 10);
        }
        else if (input.match(regex.steam3)) {
            var matches = input.match(regex.steam3);
            var char = matches[1];
            this.format = 'steam3';
            this.universe = parseInt(matches[2], 10);
            this.accountid = parseInt(matches[3], 10);
            if (matches[4]) {
                this.instance = parseInt(matches[4].substring(1), 10);
            }
            else if (char === 'U') {
                this.instance = enums_1.Instance.DESKTOP;
            }
            if (char === 'c') {
                this.instance |= exports.ChatInstanceFlags.Clan;
                this.type = enums_1.Type.CHAT;
            }
            else if (char === 'L') {
                this.instance |= exports.ChatInstanceFlags.Lobby;
                this.type = enums_1.Type.CHAT;
            }
            else {
                this.type = getTypeFromChar(char);
            }
        }
        else if (isNaN(input)) {
            throw new Error("Unknown SteamID input format \"" + input + "\"");
        }
        else {
            var x = new cuint_1.UINT64(input, 10);
            this.format = 'steam64';
            this.accountid = (x.toNumber() & 0xFFFFFFFF) >>> 0;
            this.instance = x.shiftRight(32).toNumber() & 0xFFFFF;
            this.type = x.shiftRight(20).toNumber() & 0xF;
            this.universe = x.shiftRight(4).toNumber();
        }
    }
    return ID;
}());
exports.ID = ID;
exports.fromAccountID = function (accountid) {
    var x = new ID();
    x.universe = enums_1.Universe.PUBLIC;
    x.type = enums_1.Type.INDIVIDUAL;
    x.instance = enums_1.Instance.DESKTOP;
    x.accountid = isNaN(accountid) ? 0 : accountid;
    x.format = 'accountid';
    return x;
};
exports.fromIndividualAccountID = exports.fromAccountID;
__export(require("./enums"));

},{"./enums":16,"cuint":21}],18:[function(require,module,exports){
module.exports = function atoa (a, n) { return Array.prototype.slice.call(a, n); }

},{}],19:[function(require,module,exports){
'use strict';

var ticky = require('ticky');

module.exports = function debounce (fn, args, ctx) {
  if (!fn) { return; }
  ticky(function run () {
    fn.apply(ctx || null, args || []);
  });
};

},{"ticky":30}],20:[function(require,module,exports){
'use strict';

var atoa = require('atoa');
var debounce = require('./debounce');

module.exports = function emitter (thing, options) {
  var opts = options || {};
  var evt = {};
  if (thing === undefined) { thing = {}; }
  thing.on = function (type, fn) {
    if (!evt[type]) {
      evt[type] = [fn];
    } else {
      evt[type].push(fn);
    }
    return thing;
  };
  thing.once = function (type, fn) {
    fn._once = true; // thing.off(fn) still works!
    thing.on(type, fn);
    return thing;
  };
  thing.off = function (type, fn) {
    var c = arguments.length;
    if (c === 1) {
      delete evt[type];
    } else if (c === 0) {
      evt = {};
    } else {
      var et = evt[type];
      if (!et) { return thing; }
      et.splice(et.indexOf(fn), 1);
    }
    return thing;
  };
  thing.emit = function () {
    var args = atoa(arguments);
    return thing.emitterSnapshot(args.shift()).apply(this, args);
  };
  thing.emitterSnapshot = function (type) {
    var et = (evt[type] || []).slice(0);
    return function () {
      var args = atoa(arguments);
      var ctx = this || thing;
      if (type === 'error' && opts.throws !== false && !et.length) { throw args.length === 1 ? args[0] : args; }
      et.forEach(function emitter (listen) {
        if (opts.async) { debounce(listen, args, ctx); } else { listen.apply(ctx, args); }
        if (listen._once) { thing.off(type, listen); }
      });
      return thing;
    };
  };
  return thing;
};

},{"./debounce":19,"atoa":18}],21:[function(require,module,exports){
exports.UINT32 = require('./lib/uint32')
exports.UINT64 = require('./lib/uint64')
},{"./lib/uint32":22,"./lib/uint64":23}],22:[function(require,module,exports){
/**
	C-like unsigned 32 bits integers in Javascript
	Copyright (C) 2013, Pierre Curto
	MIT license
 */
;(function (root) {

	// Local cache for typical radices
	var radixPowerCache = {
		36: UINT32( Math.pow(36, 5) )
	,	16: UINT32( Math.pow(16, 7) )
	,	10: UINT32( Math.pow(10, 9) )
	,	2:  UINT32( Math.pow(2, 30) )
	}
	var radixCache = {
		36: UINT32(36)
	,	16: UINT32(16)
	,	10: UINT32(10)
	,	2:  UINT32(2)
	}

	/**
	 *	Represents an unsigned 32 bits integer
	 * @constructor
	 * @param {Number|String|Number} low bits     | integer as a string 		 | integer as a number
	 * @param {Number|Number|Undefined} high bits | radix (optional, default=10)
	 * @return 
	 */
	function UINT32 (l, h) {
		if ( !(this instanceof UINT32) )
			return new UINT32(l, h)

		this._low = 0
		this._high = 0
		this.remainder = null
		if (typeof h == 'undefined')
			return fromNumber.call(this, l)

		if (typeof l == 'string')
			return fromString.call(this, l, h)

		fromBits.call(this, l, h)
	}

	/**
	 * Set the current _UINT32_ object with its low and high bits
	 * @method fromBits
	 * @param {Number} low bits
	 * @param {Number} high bits
	 * @return ThisExpression
	 */
	function fromBits (l, h) {
		this._low = l | 0
		this._high = h | 0

		return this
	}
	UINT32.prototype.fromBits = fromBits

	/**
	 * Set the current _UINT32_ object from a number
	 * @method fromNumber
	 * @param {Number} number
	 * @return ThisExpression
	 */
	function fromNumber (value) {
		this._low = value & 0xFFFF
		this._high = value >>> 16

		return this
	}
	UINT32.prototype.fromNumber = fromNumber

	/**
	 * Set the current _UINT32_ object from a string
	 * @method fromString
	 * @param {String} integer as a string
	 * @param {Number} radix (optional, default=10)
	 * @return ThisExpression
	 */
	function fromString (s, radix) {
		var value = parseInt(s, radix || 10)

		this._low = value & 0xFFFF
		this._high = value >>> 16

		return this
	}
	UINT32.prototype.fromString = fromString

	/**
	 * Convert this _UINT32_ to a number
	 * @method toNumber
	 * @return {Number} the converted UINT32
	 */
	UINT32.prototype.toNumber = function () {
		return (this._high * 65536) + this._low
	}

	/**
	 * Convert this _UINT32_ to a string
	 * @method toString
	 * @param {Number} radix (optional, default=10)
	 * @return {String} the converted UINT32
	 */
	UINT32.prototype.toString = function (radix) {
		return this.toNumber().toString(radix || 10)
	}

	/**
	 * Add two _UINT32_. The current _UINT32_ stores the result
	 * @method add
	 * @param {Object} other UINT32
	 * @return ThisExpression
	 */
	UINT32.prototype.add = function (other) {
		var a00 = this._low + other._low
		var a16 = a00 >>> 16

		a16 += this._high + other._high

		this._low = a00 & 0xFFFF
		this._high = a16 & 0xFFFF

		return this
	}

	/**
	 * Subtract two _UINT32_. The current _UINT32_ stores the result
	 * @method subtract
	 * @param {Object} other UINT32
	 * @return ThisExpression
	 */
	UINT32.prototype.subtract = function (other) {
		//TODO inline
		return this.add( other.clone().negate() )
	}

	/**
	 * Multiply two _UINT32_. The current _UINT32_ stores the result
	 * @method multiply
	 * @param {Object} other UINT32
	 * @return ThisExpression
	 */
	UINT32.prototype.multiply = function (other) {
		/*
			a = a00 + a16
			b = b00 + b16
			a*b = (a00 + a16)(b00 + b16)
				= a00b00 + a00b16 + a16b00 + a16b16

			a16b16 overflows the 32bits
		 */
		var a16 = this._high
		var a00 = this._low
		var b16 = other._high
		var b00 = other._low

/* Removed to increase speed under normal circumstances (i.e. not multiplying by 0 or 1)
		// this == 0 or other == 1: nothing to do
		if ((a00 == 0 && a16 == 0) || (b00 == 1 && b16 == 0)) return this

		// other == 0 or this == 1: this = other
		if ((b00 == 0 && b16 == 0) || (a00 == 1 && a16 == 0)) {
			this._low = other._low
			this._high = other._high
			return this
		}
*/

		var c16, c00
		c00 = a00 * b00
		c16 = c00 >>> 16

		c16 += a16 * b00
		c16 &= 0xFFFF		// Not required but improves performance
		c16 += a00 * b16

		this._low = c00 & 0xFFFF
		this._high = c16 & 0xFFFF

		return this
	}

	/**
	 * Divide two _UINT32_. The current _UINT32_ stores the result.
	 * The remainder is made available as the _remainder_ property on
	 * the _UINT32_ object. It can be null, meaning there are no remainder.
	 * @method div
	 * @param {Object} other UINT32
	 * @return ThisExpression
	 */
	UINT32.prototype.div = function (other) {
		if ( (other._low == 0) && (other._high == 0) ) throw Error('division by zero')

		// other == 1
		if (other._high == 0 && other._low == 1) {
			this.remainder = new UINT32(0)
			return this
		}

		// other > this: 0
		if ( other.gt(this) ) {
			this.remainder = this.clone()
			this._low = 0
			this._high = 0
			return this
		}
		// other == this: 1
		if ( this.eq(other) ) {
			this.remainder = new UINT32(0)
			this._low = 1
			this._high = 0
			return this
		}

		// Shift the divisor left until it is higher than the dividend
		var _other = other.clone()
		var i = -1
		while ( !this.lt(_other) ) {
			// High bit can overflow the default 16bits
			// Its ok since we right shift after this loop
			// The overflown bit must be kept though
			_other.shiftLeft(1, true)
			i++
		}

		// Set the remainder
		this.remainder = this.clone()
		// Initialize the current result to 0
		this._low = 0
		this._high = 0
		for (; i >= 0; i--) {
			_other.shiftRight(1)
			// If shifted divisor is smaller than the dividend
			// then subtract it from the dividend
			if ( !this.remainder.lt(_other) ) {
				this.remainder.subtract(_other)
				// Update the current result
				if (i >= 16) {
					this._high |= 1 << (i - 16)
				} else {
					this._low |= 1 << i
				}
			}
		}

		return this
	}

	/**
	 * Negate the current _UINT32_
	 * @method negate
	 * @return ThisExpression
	 */
	UINT32.prototype.negate = function () {
		var v = ( ~this._low & 0xFFFF ) + 1
		this._low = v & 0xFFFF
		this._high = (~this._high + (v >>> 16)) & 0xFFFF

		return this
	}

	/**
	 * Equals
	 * @method eq
	 * @param {Object} other UINT32
	 * @return {Boolean}
	 */
	UINT32.prototype.equals = UINT32.prototype.eq = function (other) {
		return (this._low == other._low) && (this._high == other._high)
	}

	/**
	 * Greater than (strict)
	 * @method gt
	 * @param {Object} other UINT32
	 * @return {Boolean}
	 */
	UINT32.prototype.greaterThan = UINT32.prototype.gt = function (other) {
		if (this._high > other._high) return true
		if (this._high < other._high) return false
		return this._low > other._low
	}

	/**
	 * Less than (strict)
	 * @method lt
	 * @param {Object} other UINT32
	 * @return {Boolean}
	 */
	UINT32.prototype.lessThan = UINT32.prototype.lt = function (other) {
		if (this._high < other._high) return true
		if (this._high > other._high) return false
		return this._low < other._low
	}

	/**
	 * Bitwise OR
	 * @method or
	 * @param {Object} other UINT32
	 * @return ThisExpression
	 */
	UINT32.prototype.or = function (other) {
		this._low |= other._low
		this._high |= other._high

		return this
	}

	/**
	 * Bitwise AND
	 * @method and
	 * @param {Object} other UINT32
	 * @return ThisExpression
	 */
	UINT32.prototype.and = function (other) {
		this._low &= other._low
		this._high &= other._high

		return this
	}

	/**
	 * Bitwise NOT
	 * @method not
	 * @return ThisExpression
	 */
	UINT32.prototype.not = function() {
		this._low = ~this._low & 0xFFFF
		this._high = ~this._high & 0xFFFF

		return this
	}

	/**
	 * Bitwise XOR
	 * @method xor
	 * @param {Object} other UINT32
	 * @return ThisExpression
	 */
	UINT32.prototype.xor = function (other) {
		this._low ^= other._low
		this._high ^= other._high

		return this
	}

	/**
	 * Bitwise shift right
	 * @method shiftRight
	 * @param {Number} number of bits to shift
	 * @return ThisExpression
	 */
	UINT32.prototype.shiftRight = UINT32.prototype.shiftr = function (n) {
		if (n > 16) {
			this._low = this._high >> (n - 16)
			this._high = 0
		} else if (n == 16) {
			this._low = this._high
			this._high = 0
		} else {
			this._low = (this._low >> n) | ( (this._high << (16-n)) & 0xFFFF )
			this._high >>= n
		}

		return this
	}

	/**
	 * Bitwise shift left
	 * @method shiftLeft
	 * @param {Number} number of bits to shift
	 * @param {Boolean} allow overflow
	 * @return ThisExpression
	 */
	UINT32.prototype.shiftLeft = UINT32.prototype.shiftl = function (n, allowOverflow) {
		if (n > 16) {
			this._high = this._low << (n - 16)
			this._low = 0
			if (!allowOverflow) {
				this._high &= 0xFFFF
			}
		} else if (n == 16) {
			this._high = this._low
			this._low = 0
		} else {
			this._high = (this._high << n) | (this._low >> (16-n))
			this._low = (this._low << n) & 0xFFFF
			if (!allowOverflow) {
				// Overflow only allowed on the high bits...
				this._high &= 0xFFFF
			}
		}

		return this
	}

	/**
	 * Bitwise rotate left
	 * @method rotl
	 * @param {Number} number of bits to rotate
	 * @return ThisExpression
	 */
	UINT32.prototype.rotateLeft = UINT32.prototype.rotl = function (n) {
		var v = (this._high << 16) | this._low
		v = (v << n) | (v >>> (32 - n))
		this._low = v & 0xFFFF
		this._high = v >>> 16

		return this
	}

	/**
	 * Bitwise rotate right
	 * @method rotr
	 * @param {Number} number of bits to rotate
	 * @return ThisExpression
	 */
	UINT32.prototype.rotateRight = UINT32.prototype.rotr = function (n) {
		var v = (this._high << 16) | this._low
		v = (v >>> n) | (v << (32 - n))
		this._low = v & 0xFFFF
		this._high = v >>> 16

		return this
	}

	/**
	 * Clone the current _UINT32_
	 * @method clone
	 * @return {Object} cloned UINT32
	 */
	UINT32.prototype.clone = function () {
		return new UINT32(this._low, this._high)
	}

	if (typeof define != 'undefined' && define.amd) {
		// AMD / RequireJS
		define([], function () {
			return UINT32
		})
	} else if (typeof module != 'undefined' && module.exports) {
		// Node.js
		module.exports = UINT32
	} else {
		// Browser
		root['UINT32'] = UINT32
	}

})(this)

},{}],23:[function(require,module,exports){
/**
	C-like unsigned 64 bits integers in Javascript
	Copyright (C) 2013, Pierre Curto
	MIT license
 */
;(function (root) {

	// Local cache for typical radices
	var radixPowerCache = {
		16: UINT64( Math.pow(16, 5) )
	,	10: UINT64( Math.pow(10, 5) )
	,	2:  UINT64( Math.pow(2, 5) )
	}
	var radixCache = {
		16: UINT64(16)
	,	10: UINT64(10)
	,	2:  UINT64(2)
	}

	/**
	 *	Represents an unsigned 64 bits integer
	 * @constructor
	 * @param {Number} first low bits (8)
	 * @param {Number} second low bits (8)
	 * @param {Number} first high bits (8)
	 * @param {Number} second high bits (8)
	 * or
	 * @param {Number} low bits (32)
	 * @param {Number} high bits (32)
	 * or
	 * @param {String|Number} integer as a string 		 | integer as a number
	 * @param {Number|Undefined} radix (optional, default=10)
	 * @return 
	 */
	function UINT64 (a00, a16, a32, a48) {
		if ( !(this instanceof UINT64) )
			return new UINT64(a00, a16, a32, a48)

		this.remainder = null
		if (typeof a00 == 'string')
			return fromString.call(this, a00, a16)

		if (typeof a16 == 'undefined')
			return fromNumber.call(this, a00)

		fromBits.apply(this, arguments)
	}

	/**
	 * Set the current _UINT64_ object with its low and high bits
	 * @method fromBits
	 * @param {Number} first low bits (8)
	 * @param {Number} second low bits (8)
	 * @param {Number} first high bits (8)
	 * @param {Number} second high bits (8)
	 * or
	 * @param {Number} low bits (32)
	 * @param {Number} high bits (32)
	 * @return ThisExpression
	 */
	function fromBits (a00, a16, a32, a48) {
		if (typeof a32 == 'undefined') {
			this._a00 = a00 & 0xFFFF
			this._a16 = a00 >>> 16
			this._a32 = a16 & 0xFFFF
			this._a48 = a16 >>> 16
			return this
		}

		this._a00 = a00 | 0
		this._a16 = a16 | 0
		this._a32 = a32 | 0
		this._a48 = a48 | 0

		return this
	}
	UINT64.prototype.fromBits = fromBits

	/**
	 * Set the current _UINT64_ object from a number
	 * @method fromNumber
	 * @param {Number} number
	 * @return ThisExpression
	 */
	function fromNumber (value) {
		this._a00 = value & 0xFFFF
		this._a16 = value >>> 16
		this._a32 = 0
		this._a48 = 0

		return this
	}
	UINT64.prototype.fromNumber = fromNumber

	/**
	 * Set the current _UINT64_ object from a string
	 * @method fromString
	 * @param {String} integer as a string
	 * @param {Number} radix (optional, default=10)
	 * @return ThisExpression
	 */
	function fromString (s, radix) {
		radix = radix || 10

		this._a00 = 0
		this._a16 = 0
		this._a32 = 0
		this._a48 = 0

		/*
			In Javascript, bitwise operators only operate on the first 32 bits 
			of a number, even though parseInt() encodes numbers with a 53 bits 
			mantissa.
			Therefore UINT64(<Number>) can only work on 32 bits.
			The radix maximum value is 36 (as per ECMA specs) (26 letters + 10 digits)
			maximum input value is m = 32bits as 1 = 2^32 - 1
			So the maximum substring length n is:
			36^(n+1) - 1 = 2^32 - 1
			36^(n+1) = 2^32
			(n+1)ln(36) = 32ln(2)
			n = 32ln(2)/ln(36) - 1
			n = 5.189644915687692
			n = 5
		 */
		var radixUint = radixPowerCache[radix] || new UINT64( Math.pow(radix, 5) )

		for (var i = 0, len = s.length; i < len; i += 5) {
			var size = Math.min(5, len - i)
			var value = parseInt( s.slice(i, i + size), radix )
			this.multiply(
					size < 5
						? new UINT64( Math.pow(radix, size) )
						: radixUint
				)
				.add( new UINT64(value) )
		}

		return this
	}
	UINT64.prototype.fromString = fromString

	/**
	 * Convert this _UINT64_ to a number (last 32 bits are dropped)
	 * @method toNumber
	 * @return {Number} the converted UINT64
	 */
	UINT64.prototype.toNumber = function () {
		return (this._a16 * 65536) + this._a00
	}

	/**
	 * Convert this _UINT64_ to a string
	 * @method toString
	 * @param {Number} radix (optional, default=10)
	 * @return {String} the converted UINT64
	 */
	UINT64.prototype.toString = function (radix) {
		radix = radix || 10
		var radixUint = radixCache[radix] || new UINT64(radix)

		if ( !this.gt(radixUint) ) return this.toNumber().toString(radix)

		var self = this.clone()
		var res = new Array(64)
		for (var i = 63; i >= 0; i--) {
			self.div(radixUint)
			res[i] = self.remainder.toNumber().toString(radix)
			if ( !self.gt(radixUint) ) break
		}
		res[i-1] = self.toNumber().toString(radix)

		return res.join('')
	}

	/**
	 * Add two _UINT64_. The current _UINT64_ stores the result
	 * @method add
	 * @param {Object} other UINT64
	 * @return ThisExpression
	 */
	UINT64.prototype.add = function (other) {
		var a00 = this._a00 + other._a00

		var a16 = a00 >>> 16
		a16 += this._a16 + other._a16

		var a32 = a16 >>> 16
		a32 += this._a32 + other._a32

		var a48 = a32 >>> 16
		a48 += this._a48 + other._a48

		this._a00 = a00 & 0xFFFF
		this._a16 = a16 & 0xFFFF
		this._a32 = a32 & 0xFFFF
		this._a48 = a48 & 0xFFFF

		return this
	}

	/**
	 * Subtract two _UINT64_. The current _UINT64_ stores the result
	 * @method subtract
	 * @param {Object} other UINT64
	 * @return ThisExpression
	 */
	UINT64.prototype.subtract = function (other) {
		return this.add( other.clone().negate() )
	}

	/**
	 * Multiply two _UINT64_. The current _UINT64_ stores the result
	 * @method multiply
	 * @param {Object} other UINT64
	 * @return ThisExpression
	 */
	UINT64.prototype.multiply = function (other) {
		/*
			a = a00 + a16 + a32 + a48
			b = b00 + b16 + b32 + b48
			a*b = (a00 + a16 + a32 + a48)(b00 + b16 + b32 + b48)
				= a00b00 + a00b16 + a00b32 + a00b48
				+ a16b00 + a16b16 + a16b32 + a16b48
				+ a32b00 + a32b16 + a32b32 + a32b48
				+ a48b00 + a48b16 + a48b32 + a48b48

			a16b48, a32b32, a48b16, a48b32 and a48b48 overflow the 64 bits
			so it comes down to:
			a*b	= a00b00 + a00b16 + a00b32 + a00b48
				+ a16b00 + a16b16 + a16b32
				+ a32b00 + a32b16
				+ a48b00
				= a00b00
				+ a00b16 + a16b00
				+ a00b32 + a16b16 + a32b00
				+ a00b48 + a16b32 + a32b16 + a48b00
		 */
		var a00 = this._a00
		var a16 = this._a16
		var a32 = this._a32
		var a48 = this._a48
		var b00 = other._a00
		var b16 = other._a16
		var b32 = other._a32
		var b48 = other._a48

		var c00 = a00 * b00

		var c16 = c00 >>> 16
		c16 += a00 * b16
		var c32 = c16 >>> 16
		c16 &= 0xFFFF
		c16 += a16 * b00

		c32 += c16 >>> 16
		c32 += a00 * b32
		var c48 = c32 >>> 16
		c32 &= 0xFFFF
		c32 += a16 * b16
		c48 += c32 >>> 16
		c32 &= 0xFFFF
		c32 += a32 * b00

		c48 += c32 >>> 16
		c48 += a00 * b48
		c48 &= 0xFFFF
		c48 += a16 * b32
		c48 &= 0xFFFF
		c48 += a32 * b16
		c48 &= 0xFFFF
		c48 += a48 * b00

		this._a00 = c00 & 0xFFFF
		this._a16 = c16 & 0xFFFF
		this._a32 = c32 & 0xFFFF
		this._a48 = c48 & 0xFFFF

		return this
	}

	/**
	 * Divide two _UINT64_. The current _UINT64_ stores the result.
	 * The remainder is made available as the _remainder_ property on
	 * the _UINT64_ object. It can be null, meaning there are no remainder.
	 * @method div
	 * @param {Object} other UINT64
	 * @return ThisExpression
	 */
	UINT64.prototype.div = function (other) {
		if ( (other._a16 == 0) && (other._a32 == 0) && (other._a48 == 0) ) {
			if (other._a00 == 0) throw Error('division by zero')

			// other == 1: this
			if (other._a00 == 1) {
				this.remainder = new UINT64(0)
				return this
			}
		}

		// other > this: 0
		if ( other.gt(this) ) {
			this.remainder = this.clone()
			this._a00 = 0
			this._a16 = 0
			this._a32 = 0
			this._a48 = 0
			return this
		}
		// other == this: 1
		if ( this.eq(other) ) {
			this.remainder = new UINT64(0)
			this._a00 = 1
			this._a16 = 0
			this._a32 = 0
			this._a48 = 0
			return this
		}

		// Shift the divisor left until it is higher than the dividend
		var _other = other.clone()
		var i = -1
		while ( !this.lt(_other) ) {
			// High bit can overflow the default 16bits
			// Its ok since we right shift after this loop
			// The overflown bit must be kept though
			_other.shiftLeft(1, true)
			i++
		}

		// Set the remainder
		this.remainder = this.clone()
		// Initialize the current result to 0
		this._a00 = 0
		this._a16 = 0
		this._a32 = 0
		this._a48 = 0
		for (; i >= 0; i--) {
			_other.shiftRight(1)
			// If shifted divisor is smaller than the dividend
			// then subtract it from the dividend
			if ( !this.remainder.lt(_other) ) {
				this.remainder.subtract(_other)
				// Update the current result
				if (i >= 48) {
					this._a48 |= 1 << (i - 48)
				} else if (i >= 32) {
					this._a32 |= 1 << (i - 32)
				} else if (i >= 16) {
					this._a16 |= 1 << (i - 16)
				} else {
					this._a00 |= 1 << i
				}
			}
		}

		return this
	}

	/**
	 * Negate the current _UINT64_
	 * @method negate
	 * @return ThisExpression
	 */
	UINT64.prototype.negate = function () {
		var v = ( ~this._a00 & 0xFFFF ) + 1
		this._a00 = v & 0xFFFF
		v = (~this._a16 & 0xFFFF) + (v >>> 16)
		this._a16 = v & 0xFFFF
		v = (~this._a32 & 0xFFFF) + (v >>> 16)
		this._a32 = v & 0xFFFF
		this._a48 = (~this._a48 + (v >>> 16)) & 0xFFFF

		return this
	}

	/**

	 * @method eq
	 * @param {Object} other UINT64
	 * @return {Boolean}
	 */
	UINT64.prototype.equals = UINT64.prototype.eq = function (other) {
		return (this._a48 == other._a48) && (this._a00 == other._a00)
			 && (this._a32 == other._a32) && (this._a16 == other._a16)
	}

	/**
	 * Greater than (strict)
	 * @method gt
	 * @param {Object} other UINT64
	 * @return {Boolean}
	 */
	UINT64.prototype.greaterThan = UINT64.prototype.gt = function (other) {
		if (this._a48 > other._a48) return true
		if (this._a48 < other._a48) return false
		if (this._a32 > other._a32) return true
		if (this._a32 < other._a32) return false
		if (this._a16 > other._a16) return true
		if (this._a16 < other._a16) return false
		return this._a00 > other._a00
	}

	/**
	 * Less than (strict)
	 * @method lt
	 * @param {Object} other UINT64
	 * @return {Boolean}
	 */
	UINT64.prototype.lessThan = UINT64.prototype.lt = function (other) {
		if (this._a48 < other._a48) return true
		if (this._a48 > other._a48) return false
		if (this._a32 < other._a32) return true
		if (this._a32 > other._a32) return false
		if (this._a16 < other._a16) return true
		if (this._a16 > other._a16) return false
		return this._a00 < other._a00
	}

	/**
	 * Bitwise OR
	 * @method or
	 * @param {Object} other UINT64
	 * @return ThisExpression
	 */
	UINT64.prototype.or = function (other) {
		this._a00 |= other._a00
		this._a16 |= other._a16
		this._a32 |= other._a32
		this._a48 |= other._a48

		return this
	}

	/**
	 * Bitwise AND
	 * @method and
	 * @param {Object} other UINT64
	 * @return ThisExpression
	 */
	UINT64.prototype.and = function (other) {
		this._a00 &= other._a00
		this._a16 &= other._a16
		this._a32 &= other._a32
		this._a48 &= other._a48

		return this
	}

	/**
	 * Bitwise XOR
	 * @method xor
	 * @param {Object} other UINT64
	 * @return ThisExpression
	 */
	UINT64.prototype.xor = function (other) {
		this._a00 ^= other._a00
		this._a16 ^= other._a16
		this._a32 ^= other._a32
		this._a48 ^= other._a48

		return this
	}

	/**
	 * Bitwise NOT
	 * @method not
	 * @return ThisExpression
	 */
	UINT64.prototype.not = function() {
		this._a00 = ~this._a00 & 0xFFFF
		this._a16 = ~this._a16 & 0xFFFF
		this._a32 = ~this._a32 & 0xFFFF
		this._a48 = ~this._a48 & 0xFFFF

		return this
	}

	/**
	 * Bitwise shift right
	 * @method shiftRight
	 * @param {Number} number of bits to shift
	 * @return ThisExpression
	 */
	UINT64.prototype.shiftRight = UINT64.prototype.shiftr = function (n) {
		n %= 64
		if (n >= 48) {
			this._a00 = this._a48 >> (n - 48)
			this._a16 = 0
			this._a32 = 0
			this._a48 = 0
		} else if (n >= 32) {
			n -= 32
			this._a00 = ( (this._a32 >> n) | (this._a48 << (16-n)) ) & 0xFFFF
			this._a16 = (this._a48 >> n) & 0xFFFF
			this._a32 = 0
			this._a48 = 0
		} else if (n >= 16) {
			n -= 16
			this._a00 = ( (this._a16 >> n) | (this._a32 << (16-n)) ) & 0xFFFF
			this._a16 = ( (this._a32 >> n) | (this._a48 << (16-n)) ) & 0xFFFF
			this._a32 = (this._a48 >> n) & 0xFFFF
			this._a48 = 0
		} else {
			this._a00 = ( (this._a00 >> n) | (this._a16 << (16-n)) ) & 0xFFFF
			this._a16 = ( (this._a16 >> n) | (this._a32 << (16-n)) ) & 0xFFFF
			this._a32 = ( (this._a32 >> n) | (this._a48 << (16-n)) ) & 0xFFFF
			this._a48 = (this._a48 >> n) & 0xFFFF
		}

		return this
	}

	/**
	 * Bitwise shift left
	 * @method shiftLeft
	 * @param {Number} number of bits to shift
	 * @param {Boolean} allow overflow
	 * @return ThisExpression
	 */
	UINT64.prototype.shiftLeft = UINT64.prototype.shiftl = function (n, allowOverflow) {
		n %= 64
		if (n >= 48) {
			this._a48 = this._a00 << (n - 48)
			this._a32 = 0
			this._a16 = 0
			this._a00 = 0
		} else if (n >= 32) {
			n -= 32
			this._a48 = (this._a16 << n) | (this._a00 >> (16-n))
			this._a32 = (this._a00 << n) & 0xFFFF
			this._a16 = 0
			this._a00 = 0
		} else if (n >= 16) {
			n -= 16
			this._a48 = (this._a32 << n) | (this._a16 >> (16-n))
			this._a32 = ( (this._a16 << n) | (this._a00 >> (16-n)) ) & 0xFFFF
			this._a16 = (this._a00 << n) & 0xFFFF
			this._a00 = 0
		} else {
			this._a48 = (this._a48 << n) | (this._a32 >> (16-n))
			this._a32 = ( (this._a32 << n) | (this._a16 >> (16-n)) ) & 0xFFFF
			this._a16 = ( (this._a16 << n) | (this._a00 >> (16-n)) ) & 0xFFFF
			this._a00 = (this._a00 << n) & 0xFFFF
		}
		if (!allowOverflow) {
			this._a48 &= 0xFFFF
		}

		return this
	}

	/**
	 * Bitwise rotate left
	 * @method rotl
	 * @param {Number} number of bits to rotate
	 * @return ThisExpression
	 */
	UINT64.prototype.rotateLeft = UINT64.prototype.rotl = function (n) {
		n %= 64
		if (n == 0) return this
		if (n >= 32) {
			// A.B.C.D
			// B.C.D.A rotl(16)
			// C.D.A.B rotl(32)
			var v = this._a00
			this._a00 = this._a32
			this._a32 = v
			v = this._a48
			this._a48 = this._a16
			this._a16 = v
			if (n == 32) return this
			n -= 32
		}

		var high = (this._a48 << 16) | this._a32
		var low = (this._a16 << 16) | this._a00

		var _high = (high << n) | (low >>> (32 - n))
		var _low = (low << n) | (high >>> (32 - n))

		this._a00 = _low & 0xFFFF
		this._a16 = _low >>> 16
		this._a32 = _high & 0xFFFF
		this._a48 = _high >>> 16

		return this
	}

	/**
	 * Bitwise rotate right
	 * @method rotr
	 * @param {Number} number of bits to rotate
	 * @return ThisExpression
	 */
	UINT64.prototype.rotateRight = UINT64.prototype.rotr = function (n) {
		n %= 64
		if (n == 0) return this
		if (n >= 32) {
			// A.B.C.D
			// D.A.B.C rotr(16)
			// C.D.A.B rotr(32)
			var v = this._a00
			this._a00 = this._a32
			this._a32 = v
			v = this._a48
			this._a48 = this._a16
			this._a16 = v
			if (n == 32) return this
			n -= 32
		}

		var high = (this._a48 << 16) | this._a32
		var low = (this._a16 << 16) | this._a00

		var _high = (high >>> n) | (low << (32 - n))
		var _low = (low >>> n) | (high << (32 - n))

		this._a00 = _low & 0xFFFF
		this._a16 = _low >>> 16
		this._a32 = _high & 0xFFFF
		this._a48 = _high >>> 16

		return this
	}

	/**
	 * Clone the current _UINT64_
	 * @method clone
	 * @return {Object} cloned UINT64
	 */
	UINT64.prototype.clone = function () {
		return new UINT64(this._a00, this._a16, this._a32, this._a48)
	}

	if (typeof define != 'undefined' && define.amd) {
		// AMD / RequireJS
		define([], function () {
			return UINT64
		})
	} else if (typeof module != 'undefined' && module.exports) {
		// Node.js
		module.exports = UINT64
	} else {
		// Browser
		root['UINT64'] = UINT64
	}

})(this)

},{}],24:[function(require,module,exports){
(function (global,setImmediate){
/*
 * Dexie.js - a minimalistic wrapper for IndexedDB
 * ===============================================
 *
 * By David Fahlander, david.fahlander@gmail.com
 *
 * Version 3.0.1, Thu May 07 2020
 *
 * http://dexie.org
 *
 * Apache License Version 2.0, January 2004, http://www.apache.org/licenses/
 */
 
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Dexie = factory());
}(this, (function () { 'use strict';

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};










function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

var keys = Object.keys;
var isArray = Array.isArray;
var _global = typeof self !== 'undefined' ? self :
    typeof window !== 'undefined' ? window :
        global;
if (typeof Promise !== 'undefined' && !_global.Promise) {
    _global.Promise = Promise;
}
function extend(obj, extension) {
    if (typeof extension !== 'object')
        return obj;
    keys(extension).forEach(function (key) {
        obj[key] = extension[key];
    });
    return obj;
}
var getProto = Object.getPrototypeOf;
var _hasOwn = {}.hasOwnProperty;
function hasOwn(obj, prop) {
    return _hasOwn.call(obj, prop);
}
function props(proto, extension) {
    if (typeof extension === 'function')
        extension = extension(getProto(proto));
    keys(extension).forEach(function (key) {
        setProp(proto, key, extension[key]);
    });
}
var defineProperty = Object.defineProperty;
function setProp(obj, prop, functionOrGetSet, options) {
    defineProperty(obj, prop, extend(functionOrGetSet && hasOwn(functionOrGetSet, "get") && typeof functionOrGetSet.get === 'function' ?
        { get: functionOrGetSet.get, set: functionOrGetSet.set, configurable: true } :
        { value: functionOrGetSet, configurable: true, writable: true }, options));
}
function derive(Child) {
    return {
        from: function (Parent) {
            Child.prototype = Object.create(Parent.prototype);
            setProp(Child.prototype, "constructor", Child);
            return {
                extend: props.bind(null, Child.prototype)
            };
        }
    };
}
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
function getPropertyDescriptor(obj, prop) {
    var pd = getOwnPropertyDescriptor(obj, prop);
    var proto;
    return pd || (proto = getProto(obj)) && getPropertyDescriptor(proto, prop);
}
var _slice = [].slice;
function slice(args, start, end) {
    return _slice.call(args, start, end);
}
function override(origFunc, overridedFactory) {
    return overridedFactory(origFunc);
}
function assert(b) {
    if (!b)
        throw new Error("Assertion Failed");
}
function asap(fn) {
    if (_global.setImmediate)
        setImmediate(fn);
    else
        setTimeout(fn, 0);
}

function arrayToObject(array, extractor) {
    return array.reduce(function (result, item, i) {
        var nameAndValue = extractor(item, i);
        if (nameAndValue)
            result[nameAndValue[0]] = nameAndValue[1];
        return result;
    }, {});
}

function tryCatch(fn, onerror, args) {
    try {
        fn.apply(null, args);
    }
    catch (ex) {
        onerror && onerror(ex);
    }
}
function getByKeyPath(obj, keyPath) {
    if (hasOwn(obj, keyPath))
        return obj[keyPath];
    if (!keyPath)
        return obj;
    if (typeof keyPath !== 'string') {
        var rv = [];
        for (var i = 0, l = keyPath.length; i < l; ++i) {
            var val = getByKeyPath(obj, keyPath[i]);
            rv.push(val);
        }
        return rv;
    }
    var period = keyPath.indexOf('.');
    if (period !== -1) {
        var innerObj = obj[keyPath.substr(0, period)];
        return innerObj === undefined ? undefined : getByKeyPath(innerObj, keyPath.substr(period + 1));
    }
    return undefined;
}
function setByKeyPath(obj, keyPath, value) {
    if (!obj || keyPath === undefined)
        return;
    if ('isFrozen' in Object && Object.isFrozen(obj))
        return;
    if (typeof keyPath !== 'string' && 'length' in keyPath) {
        assert(typeof value !== 'string' && 'length' in value);
        for (var i = 0, l = keyPath.length; i < l; ++i) {
            setByKeyPath(obj, keyPath[i], value[i]);
        }
    }
    else {
        var period = keyPath.indexOf('.');
        if (period !== -1) {
            var currentKeyPath = keyPath.substr(0, period);
            var remainingKeyPath = keyPath.substr(period + 1);
            if (remainingKeyPath === "")
                if (value === undefined) {
                    if (isArray(obj) && !isNaN(parseInt(currentKeyPath)))
                        obj.splice(currentKeyPath, 1);
                    else
                        delete obj[currentKeyPath];
                }
                else
                    obj[currentKeyPath] = value;
            else {
                var innerObj = obj[currentKeyPath];
                if (!innerObj)
                    innerObj = (obj[currentKeyPath] = {});
                setByKeyPath(innerObj, remainingKeyPath, value);
            }
        }
        else {
            if (value === undefined) {
                if (isArray(obj) && !isNaN(parseInt(keyPath)))
                    obj.splice(keyPath, 1);
                else
                    delete obj[keyPath];
            }
            else
                obj[keyPath] = value;
        }
    }
}
function delByKeyPath(obj, keyPath) {
    if (typeof keyPath === 'string')
        setByKeyPath(obj, keyPath, undefined);
    else if ('length' in keyPath)
        [].map.call(keyPath, function (kp) {
            setByKeyPath(obj, kp, undefined);
        });
}
function shallowClone(obj) {
    var rv = {};
    for (var m in obj) {
        if (hasOwn(obj, m))
            rv[m] = obj[m];
    }
    return rv;
}
var concat = [].concat;
function flatten(a) {
    return concat.apply([], a);
}
var intrinsicTypeNames = "Boolean,String,Date,RegExp,Blob,File,FileList,ArrayBuffer,DataView,Uint8ClampedArray,ImageData,Map,Set"
    .split(',').concat(flatten([8, 16, 32, 64].map(function (num) { return ["Int", "Uint", "Float"].map(function (t) { return t + num + "Array"; }); }))).filter(function (t) { return _global[t]; });
var intrinsicTypes = intrinsicTypeNames.map(function (t) { return _global[t]; });
var intrinsicTypeNameSet = arrayToObject(intrinsicTypeNames, function (x) { return [x, true]; });
function deepClone(any) {
    if (!any || typeof any !== 'object')
        return any;
    var rv;
    if (isArray(any)) {
        rv = [];
        for (var i = 0, l = any.length; i < l; ++i) {
            rv.push(deepClone(any[i]));
        }
    }
    else if (intrinsicTypes.indexOf(any.constructor) >= 0) {
        rv = any;
    }
    else {
        rv = any.constructor ? Object.create(any.constructor.prototype) : {};
        for (var prop in any) {
            if (hasOwn(any, prop)) {
                rv[prop] = deepClone(any[prop]);
            }
        }
    }
    return rv;
}
var toString = {}.toString;
function toStringTag(o) {
    return toString.call(o).slice(8, -1);
}
var getValueOf = function (val, type) {
    return type === "Array" ? '' + val.map(function (v) { return getValueOf(v, toStringTag(v)); }) :
        type === "ArrayBuffer" ? '' + new Uint8Array(val) :
            type === "Date" ? val.getTime() :
                ArrayBuffer.isView(val) ? '' + new Uint8Array(val.buffer) :
                    val;
};
function getObjectDiff(a, b, rv, prfx) {
    rv = rv || {};
    prfx = prfx || '';
    keys(a).forEach(function (prop) {
        if (!hasOwn(b, prop))
            rv[prfx + prop] = undefined;
        else {
            var ap = a[prop], bp = b[prop];
            if (typeof ap === 'object' && typeof bp === 'object' && ap && bp) {
                var apTypeName = toStringTag(ap);
                var bpTypeName = toStringTag(bp);
                if (apTypeName === bpTypeName) {
                    if (intrinsicTypeNameSet[apTypeName]) {
                        if (getValueOf(ap, apTypeName) !== getValueOf(bp, bpTypeName)) {
                            rv[prfx + prop] = b[prop];
                        }
                    }
                    else {
                        getObjectDiff(ap, bp, rv, prfx + prop + ".");
                    }
                }
                else {
                    rv[prfx + prop] = b[prop];
                }
            }
            else if (ap !== bp)
                rv[prfx + prop] = b[prop];
        }
    });
    keys(b).forEach(function (prop) {
        if (!hasOwn(a, prop)) {
            rv[prfx + prop] = b[prop];
        }
    });
    return rv;
}
var iteratorSymbol = typeof Symbol !== 'undefined' && Symbol.iterator;
var getIteratorOf = iteratorSymbol ? function (x) {
    var i;
    return x != null && (i = x[iteratorSymbol]) && i.apply(x);
} : function () { return null; };
var NO_CHAR_ARRAY = {};
function getArrayOf(arrayLike) {
    var i, a, x, it;
    if (arguments.length === 1) {
        if (isArray(arrayLike))
            return arrayLike.slice();
        if (this === NO_CHAR_ARRAY && typeof arrayLike === 'string')
            return [arrayLike];
        if ((it = getIteratorOf(arrayLike))) {
            a = [];
            while (x = it.next(), !x.done)
                a.push(x.value);
            return a;
        }
        if (arrayLike == null)
            return [arrayLike];
        i = arrayLike.length;
        if (typeof i === 'number') {
            a = new Array(i);
            while (i--)
                a[i] = arrayLike[i];
            return a;
        }
        return [arrayLike];
    }
    i = arguments.length;
    a = new Array(i);
    while (i--)
        a[i] = arguments[i];
    return a;
}
var isAsyncFunction = typeof Symbol !== 'undefined'
    ? function (fn) { return fn[Symbol.toStringTag] === 'AsyncFunction'; }
    : function () { return false; };

var debug = typeof location !== 'undefined' &&
    /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
function setDebug(value, filter) {
    debug = value;
    libraryFilter = filter;
}
var libraryFilter = function () { return true; };
var NEEDS_THROW_FOR_STACK = !new Error("").stack;
function getErrorWithStack() {
    if (NEEDS_THROW_FOR_STACK)
        try {
            throw new Error();
        }
        catch (e) {
            return e;
        }
    return new Error();
}
function prettyStack(exception, numIgnoredFrames) {
    var stack = exception.stack;
    if (!stack)
        return "";
    numIgnoredFrames = (numIgnoredFrames || 0);
    if (stack.indexOf(exception.name) === 0)
        numIgnoredFrames += (exception.name + exception.message).split('\n').length;
    return stack.split('\n')
        .slice(numIgnoredFrames)
        .filter(libraryFilter)
        .map(function (frame) { return "\n" + frame; })
        .join('');
}

var dexieErrorNames = [
    'Modify',
    'Bulk',
    'OpenFailed',
    'VersionChange',
    'Schema',
    'Upgrade',
    'InvalidTable',
    'MissingAPI',
    'NoSuchDatabase',
    'InvalidArgument',
    'SubTransaction',
    'Unsupported',
    'Internal',
    'DatabaseClosed',
    'PrematureCommit',
    'ForeignAwait'
];
var idbDomErrorNames = [
    'Unknown',
    'Constraint',
    'Data',
    'TransactionInactive',
    'ReadOnly',
    'Version',
    'NotFound',
    'InvalidState',
    'InvalidAccess',
    'Abort',
    'Timeout',
    'QuotaExceeded',
    'Syntax',
    'DataClone'
];
var errorList = dexieErrorNames.concat(idbDomErrorNames);
var defaultTexts = {
    VersionChanged: "Database version changed by other database connection",
    DatabaseClosed: "Database has been closed",
    Abort: "Transaction aborted",
    TransactionInactive: "Transaction has already completed or failed"
};
function DexieError(name, msg) {
    this._e = getErrorWithStack();
    this.name = name;
    this.message = msg;
}
derive(DexieError).from(Error).extend({
    stack: {
        get: function () {
            return this._stack ||
                (this._stack = this.name + ": " + this.message + prettyStack(this._e, 2));
        }
    },
    toString: function () { return this.name + ": " + this.message; }
});
function getMultiErrorMessage(msg, failures) {
    return msg + ". Errors: " + Object.keys(failures)
        .map(function (key) { return failures[key].toString(); })
        .filter(function (v, i, s) { return s.indexOf(v) === i; })
        .join('\n');
}
function ModifyError(msg, failures, successCount, failedKeys) {
    this._e = getErrorWithStack();
    this.failures = failures;
    this.failedKeys = failedKeys;
    this.successCount = successCount;
    this.message = getMultiErrorMessage(msg, failures);
}
derive(ModifyError).from(DexieError);
function BulkError(msg, failures) {
    this._e = getErrorWithStack();
    this.name = "BulkError";
    this.failures = failures;
    this.message = getMultiErrorMessage(msg, failures);
}
derive(BulkError).from(DexieError);
var errnames = errorList.reduce(function (obj, name) { return (obj[name] = name + "Error", obj); }, {});
var BaseException = DexieError;
var exceptions = errorList.reduce(function (obj, name) {
    var fullName = name + "Error";
    function DexieError(msgOrInner, inner) {
        this._e = getErrorWithStack();
        this.name = fullName;
        if (!msgOrInner) {
            this.message = defaultTexts[name] || fullName;
            this.inner = null;
        }
        else if (typeof msgOrInner === 'string') {
            this.message = "" + msgOrInner + (!inner ? '' : '\n ' + inner);
            this.inner = inner || null;
        }
        else if (typeof msgOrInner === 'object') {
            this.message = msgOrInner.name + " " + msgOrInner.message;
            this.inner = msgOrInner;
        }
    }
    derive(DexieError).from(BaseException);
    obj[name] = DexieError;
    return obj;
}, {});
exceptions.Syntax = SyntaxError;
exceptions.Type = TypeError;
exceptions.Range = RangeError;
var exceptionMap = idbDomErrorNames.reduce(function (obj, name) {
    obj[name + "Error"] = exceptions[name];
    return obj;
}, {});
function mapError(domError, message) {
    if (!domError || domError instanceof DexieError || domError instanceof TypeError || domError instanceof SyntaxError || !domError.name || !exceptionMap[domError.name])
        return domError;
    var rv = new exceptionMap[domError.name](message || domError.message, domError);
    if ("stack" in domError) {
        setProp(rv, "stack", { get: function () {
                return this.inner.stack;
            } });
    }
    return rv;
}
var fullNameExceptions = errorList.reduce(function (obj, name) {
    if (["Syntax", "Type", "Range"].indexOf(name) === -1)
        obj[name + "Error"] = exceptions[name];
    return obj;
}, {});
fullNameExceptions.ModifyError = ModifyError;
fullNameExceptions.DexieError = DexieError;
fullNameExceptions.BulkError = BulkError;

function nop() { }
function mirror(val) { return val; }
function pureFunctionChain(f1, f2) {
    if (f1 == null || f1 === mirror)
        return f2;
    return function (val) {
        return f2(f1(val));
    };
}
function callBoth(on1, on2) {
    return function () {
        on1.apply(this, arguments);
        on2.apply(this, arguments);
    };
}
function hookCreatingChain(f1, f2) {
    if (f1 === nop)
        return f2;
    return function () {
        var res = f1.apply(this, arguments);
        if (res !== undefined)
            arguments[0] = res;
        var onsuccess = this.onsuccess,
        onerror = this.onerror;
        this.onsuccess = null;
        this.onerror = null;
        var res2 = f2.apply(this, arguments);
        if (onsuccess)
            this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
        if (onerror)
            this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
        return res2 !== undefined ? res2 : res;
    };
}
function hookDeletingChain(f1, f2) {
    if (f1 === nop)
        return f2;
    return function () {
        f1.apply(this, arguments);
        var onsuccess = this.onsuccess,
        onerror = this.onerror;
        this.onsuccess = this.onerror = null;
        f2.apply(this, arguments);
        if (onsuccess)
            this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
        if (onerror)
            this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
    };
}
function hookUpdatingChain(f1, f2) {
    if (f1 === nop)
        return f2;
    return function (modifications) {
        var res = f1.apply(this, arguments);
        extend(modifications, res);
        var onsuccess = this.onsuccess,
        onerror = this.onerror;
        this.onsuccess = null;
        this.onerror = null;
        var res2 = f2.apply(this, arguments);
        if (onsuccess)
            this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
        if (onerror)
            this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
        return res === undefined ?
            (res2 === undefined ? undefined : res2) :
            (extend(res, res2));
    };
}
function reverseStoppableEventChain(f1, f2) {
    if (f1 === nop)
        return f2;
    return function () {
        if (f2.apply(this, arguments) === false)
            return false;
        return f1.apply(this, arguments);
    };
}

function promisableChain(f1, f2) {
    if (f1 === nop)
        return f2;
    return function () {
        var res = f1.apply(this, arguments);
        if (res && typeof res.then === 'function') {
            var thiz = this, i = arguments.length, args = new Array(i);
            while (i--)
                args[i] = arguments[i];
            return res.then(function () {
                return f2.apply(thiz, args);
            });
        }
        return f2.apply(this, arguments);
    };
}

var INTERNAL = {};
var LONG_STACKS_CLIP_LIMIT = 100;
var MAX_LONG_STACKS = 20;
var ZONE_ECHO_LIMIT = 100;
var _a = typeof Promise === 'undefined' ?
    [] :
    (function () {
        var globalP = Promise.resolve();
        if (typeof crypto === 'undefined' || !crypto.subtle)
            return [globalP, globalP.__proto__, globalP];
        var nativeP = crypto.subtle.digest("SHA-512", new Uint8Array([0]));
        return [
            nativeP,
            nativeP.__proto__,
            globalP
        ];
    })();
var resolvedNativePromise = _a[0];
var nativePromiseProto = _a[1];
var resolvedGlobalPromise = _a[2];
var nativePromiseThen = nativePromiseProto && nativePromiseProto.then;
var NativePromise = resolvedNativePromise && resolvedNativePromise.constructor;
var patchGlobalPromise = !!resolvedGlobalPromise;
var stack_being_generated = false;
var schedulePhysicalTick = resolvedGlobalPromise ?
    function () { resolvedGlobalPromise.then(physicalTick); }
    :
        _global.setImmediate ?
            setImmediate.bind(null, physicalTick) :
            _global.MutationObserver ?
                function () {
                    var hiddenDiv = document.createElement("div");
                    (new MutationObserver(function () {
                        physicalTick();
                        hiddenDiv = null;
                    })).observe(hiddenDiv, { attributes: true });
                    hiddenDiv.setAttribute('i', '1');
                } :
                function () { setTimeout(physicalTick, 0); };
var asap$1 = function (callback, args) {
    microtickQueue.push([callback, args]);
    if (needsNewPhysicalTick) {
        schedulePhysicalTick();
        needsNewPhysicalTick = false;
    }
};
var isOutsideMicroTick = true;
var needsNewPhysicalTick = true;
var unhandledErrors = [];
var rejectingErrors = [];
var currentFulfiller = null;
var rejectionMapper = mirror;
var globalPSD = {
    id: 'global',
    global: true,
    ref: 0,
    unhandleds: [],
    onunhandled: globalError,
    pgp: false,
    env: {},
    finalize: function () {
        this.unhandleds.forEach(function (uh) {
            try {
                globalError(uh[0], uh[1]);
            }
            catch (e) { }
        });
    }
};
var PSD = globalPSD;
var microtickQueue = [];
var numScheduledCalls = 0;
var tickFinalizers = [];
function DexiePromise(fn) {
    if (typeof this !== 'object')
        throw new TypeError('Promises must be constructed via new');
    this._listeners = [];
    this.onuncatched = nop;
    this._lib = false;
    var psd = (this._PSD = PSD);
    if (debug) {
        this._stackHolder = getErrorWithStack();
        this._prev = null;
        this._numPrev = 0;
    }
    if (typeof fn !== 'function') {
        if (fn !== INTERNAL)
            throw new TypeError('Not a function');
        this._state = arguments[1];
        this._value = arguments[2];
        if (this._state === false)
            handleRejection(this, this._value);
        return;
    }
    this._state = null;
    this._value = null;
    ++psd.ref;
    executePromiseTask(this, fn);
}
var thenProp = {
    get: function () {
        var psd = PSD, microTaskId = totalEchoes;
        function then(onFulfilled, onRejected) {
            var _this = this;
            var possibleAwait = !psd.global && (psd !== PSD || microTaskId !== totalEchoes);
            if (possibleAwait)
                decrementExpectedAwaits();
            var rv = new DexiePromise(function (resolve, reject) {
                propagateToListener(_this, new Listener(nativeAwaitCompatibleWrap(onFulfilled, psd, possibleAwait), nativeAwaitCompatibleWrap(onRejected, psd, possibleAwait), resolve, reject, psd));
            });
            debug && linkToPreviousPromise(rv, this);
            return rv;
        }
        then.prototype = INTERNAL;
        return then;
    },
    set: function (value) {
        setProp(this, 'then', value && value.prototype === INTERNAL ?
            thenProp :
            {
                get: function () {
                    return value;
                },
                set: thenProp.set
            });
    }
};
props(DexiePromise.prototype, {
    then: thenProp,
    _then: function (onFulfilled, onRejected) {
        propagateToListener(this, new Listener(null, null, onFulfilled, onRejected, PSD));
    },
    catch: function (onRejected) {
        if (arguments.length === 1)
            return this.then(null, onRejected);
        var type = arguments[0], handler = arguments[1];
        return typeof type === 'function' ? this.then(null, function (err) {
            return err instanceof type ? handler(err) : PromiseReject(err);
        })
            : this.then(null, function (err) {
                return err && err.name === type ? handler(err) : PromiseReject(err);
            });
    },
    finally: function (onFinally) {
        return this.then(function (value) {
            onFinally();
            return value;
        }, function (err) {
            onFinally();
            return PromiseReject(err);
        });
    },
    stack: {
        get: function () {
            if (this._stack)
                return this._stack;
            try {
                stack_being_generated = true;
                var stacks = getStack(this, [], MAX_LONG_STACKS);
                var stack = stacks.join("\nFrom previous: ");
                if (this._state !== null)
                    this._stack = stack;
                return stack;
            }
            finally {
                stack_being_generated = false;
            }
        }
    },
    timeout: function (ms, msg) {
        var _this = this;
        return ms < Infinity ?
            new DexiePromise(function (resolve, reject) {
                var handle = setTimeout(function () { return reject(new exceptions.Timeout(msg)); }, ms);
                _this.then(resolve, reject).finally(clearTimeout.bind(null, handle));
            }) : this;
    }
});
if (typeof Symbol !== 'undefined' && Symbol.toStringTag)
    setProp(DexiePromise.prototype, Symbol.toStringTag, 'Dexie.Promise');
globalPSD.env = snapShot();
function Listener(onFulfilled, onRejected, resolve, reject, zone) {
    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
    this.resolve = resolve;
    this.reject = reject;
    this.psd = zone;
}
props(DexiePromise, {
    all: function () {
        var values = getArrayOf.apply(null, arguments)
            .map(onPossibleParallellAsync);
        return new DexiePromise(function (resolve, reject) {
            if (values.length === 0)
                resolve([]);
            var remaining = values.length;
            values.forEach(function (a, i) { return DexiePromise.resolve(a).then(function (x) {
                values[i] = x;
                if (!--remaining)
                    resolve(values);
            }, reject); });
        });
    },
    resolve: function (value) {
        if (value instanceof DexiePromise)
            return value;
        if (value && typeof value.then === 'function')
            return new DexiePromise(function (resolve, reject) {
                value.then(resolve, reject);
            });
        var rv = new DexiePromise(INTERNAL, true, value);
        linkToPreviousPromise(rv, currentFulfiller);
        return rv;
    },
    reject: PromiseReject,
    race: function () {
        var values = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
        return new DexiePromise(function (resolve, reject) {
            values.map(function (value) { return DexiePromise.resolve(value).then(resolve, reject); });
        });
    },
    PSD: {
        get: function () { return PSD; },
        set: function (value) { return PSD = value; }
    },
    newPSD: newScope,
    usePSD: usePSD,
    scheduler: {
        get: function () { return asap$1; },
        set: function (value) { asap$1 = value; }
    },
    rejectionMapper: {
        get: function () { return rejectionMapper; },
        set: function (value) { rejectionMapper = value; }
    },
    follow: function (fn, zoneProps) {
        return new DexiePromise(function (resolve, reject) {
            return newScope(function (resolve, reject) {
                var psd = PSD;
                psd.unhandleds = [];
                psd.onunhandled = reject;
                psd.finalize = callBoth(function () {
                    var _this = this;
                    run_at_end_of_this_or_next_physical_tick(function () {
                        _this.unhandleds.length === 0 ? resolve() : reject(_this.unhandleds[0]);
                    });
                }, psd.finalize);
                fn();
            }, zoneProps, resolve, reject);
        });
    }
});
if (NativePromise) {
    if (NativePromise.allSettled)
        setProp(DexiePromise, "allSettled", function () {
            var possiblePromises = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
            return new DexiePromise(function (resolve) {
                if (possiblePromises.length === 0)
                    resolve([]);
                var remaining = possiblePromises.length;
                var results = new Array(remaining);
                possiblePromises.forEach(function (p, i) { return DexiePromise.resolve(p).then(function (value) { return results[i] = { status: "fulfilled", value: value }; }, function (reason) { return results[i] = { status: "rejected", reason: reason }; })
                    .then(function () { return --remaining || resolve(results); }); });
            });
        });
    if (NativePromise.any && typeof AggregateError !== 'undefined')
        setProp(DexiePromise, "any", function () {
            var possiblePromises = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
            return new DexiePromise(function (resolve, reject) {
                if (possiblePromises.length === 0)
                    reject(new AggregateError([]));
                var remaining = possiblePromises.length;
                var failures = new Array(remaining);
                possiblePromises.forEach(function (p, i) { return DexiePromise.resolve(p).then(function (value) { return resolve(value); }, function (failure) {
                    failures[i] = failure;
                    if (!--remaining)
                        reject(new AggregateError(failures));
                }); });
            });
        });
}
function executePromiseTask(promise, fn) {
    try {
        fn(function (value) {
            if (promise._state !== null)
                return;
            if (value === promise)
                throw new TypeError('A promise cannot be resolved with itself.');
            var shouldExecuteTick = promise._lib && beginMicroTickScope();
            if (value && typeof value.then === 'function') {
                executePromiseTask(promise, function (resolve, reject) {
                    value instanceof DexiePromise ?
                        value._then(resolve, reject) :
                        value.then(resolve, reject);
                });
            }
            else {
                promise._state = true;
                promise._value = value;
                propagateAllListeners(promise);
            }
            if (shouldExecuteTick)
                endMicroTickScope();
        }, handleRejection.bind(null, promise));
    }
    catch (ex) {
        handleRejection(promise, ex);
    }
}
function handleRejection(promise, reason) {
    rejectingErrors.push(reason);
    if (promise._state !== null)
        return;
    var shouldExecuteTick = promise._lib && beginMicroTickScope();
    reason = rejectionMapper(reason);
    promise._state = false;
    promise._value = reason;
    debug && reason !== null && typeof reason === 'object' && !reason._promise && tryCatch(function () {
        var origProp = getPropertyDescriptor(reason, "stack");
        reason._promise = promise;
        setProp(reason, "stack", {
            get: function () {
                return stack_being_generated ?
                    origProp && (origProp.get ?
                        origProp.get.apply(reason) :
                        origProp.value) :
                    promise.stack;
            }
        });
    });
    addPossiblyUnhandledError(promise);
    propagateAllListeners(promise);
    if (shouldExecuteTick)
        endMicroTickScope();
}
function propagateAllListeners(promise) {
    var listeners = promise._listeners;
    promise._listeners = [];
    for (var i = 0, len = listeners.length; i < len; ++i) {
        propagateToListener(promise, listeners[i]);
    }
    var psd = promise._PSD;
    --psd.ref || psd.finalize();
    if (numScheduledCalls === 0) {
        ++numScheduledCalls;
        asap$1(function () {
            if (--numScheduledCalls === 0)
                finalizePhysicalTick();
        }, []);
    }
}
function propagateToListener(promise, listener) {
    if (promise._state === null) {
        promise._listeners.push(listener);
        return;
    }
    var cb = promise._state ? listener.onFulfilled : listener.onRejected;
    if (cb === null) {
        return (promise._state ? listener.resolve : listener.reject)(promise._value);
    }
    ++listener.psd.ref;
    ++numScheduledCalls;
    asap$1(callListener, [cb, promise, listener]);
}
function callListener(cb, promise, listener) {
    try {
        currentFulfiller = promise;
        var ret, value = promise._value;
        if (promise._state) {
            ret = cb(value);
        }
        else {
            if (rejectingErrors.length)
                rejectingErrors = [];
            ret = cb(value);
            if (rejectingErrors.indexOf(value) === -1)
                markErrorAsHandled(promise);
        }
        listener.resolve(ret);
    }
    catch (e) {
        listener.reject(e);
    }
    finally {
        currentFulfiller = null;
        if (--numScheduledCalls === 0)
            finalizePhysicalTick();
        --listener.psd.ref || listener.psd.finalize();
    }
}
function getStack(promise, stacks, limit) {
    if (stacks.length === limit)
        return stacks;
    var stack = "";
    if (promise._state === false) {
        var failure = promise._value, errorName, message;
        if (failure != null) {
            errorName = failure.name || "Error";
            message = failure.message || failure;
            stack = prettyStack(failure, 0);
        }
        else {
            errorName = failure;
            message = "";
        }
        stacks.push(errorName + (message ? ": " + message : "") + stack);
    }
    if (debug) {
        stack = prettyStack(promise._stackHolder, 2);
        if (stack && stacks.indexOf(stack) === -1)
            stacks.push(stack);
        if (promise._prev)
            getStack(promise._prev, stacks, limit);
    }
    return stacks;
}
function linkToPreviousPromise(promise, prev) {
    var numPrev = prev ? prev._numPrev + 1 : 0;
    if (numPrev < LONG_STACKS_CLIP_LIMIT) {
        promise._prev = prev;
        promise._numPrev = numPrev;
    }
}
function physicalTick() {
    beginMicroTickScope() && endMicroTickScope();
}
function beginMicroTickScope() {
    var wasRootExec = isOutsideMicroTick;
    isOutsideMicroTick = false;
    needsNewPhysicalTick = false;
    return wasRootExec;
}
function endMicroTickScope() {
    var callbacks, i, l;
    do {
        while (microtickQueue.length > 0) {
            callbacks = microtickQueue;
            microtickQueue = [];
            l = callbacks.length;
            for (i = 0; i < l; ++i) {
                var item = callbacks[i];
                item[0].apply(null, item[1]);
            }
        }
    } while (microtickQueue.length > 0);
    isOutsideMicroTick = true;
    needsNewPhysicalTick = true;
}
function finalizePhysicalTick() {
    var unhandledErrs = unhandledErrors;
    unhandledErrors = [];
    unhandledErrs.forEach(function (p) {
        p._PSD.onunhandled.call(null, p._value, p);
    });
    var finalizers = tickFinalizers.slice(0);
    var i = finalizers.length;
    while (i)
        finalizers[--i]();
}
function run_at_end_of_this_or_next_physical_tick(fn) {
    function finalizer() {
        fn();
        tickFinalizers.splice(tickFinalizers.indexOf(finalizer), 1);
    }
    tickFinalizers.push(finalizer);
    ++numScheduledCalls;
    asap$1(function () {
        if (--numScheduledCalls === 0)
            finalizePhysicalTick();
    }, []);
}
function addPossiblyUnhandledError(promise) {
    if (!unhandledErrors.some(function (p) { return p._value === promise._value; }))
        unhandledErrors.push(promise);
}
function markErrorAsHandled(promise) {
    var i = unhandledErrors.length;
    while (i)
        if (unhandledErrors[--i]._value === promise._value) {
            unhandledErrors.splice(i, 1);
            return;
        }
}
function PromiseReject(reason) {
    return new DexiePromise(INTERNAL, false, reason);
}
function wrap(fn, errorCatcher) {
    var psd = PSD;
    return function () {
        var wasRootExec = beginMicroTickScope(), outerScope = PSD;
        try {
            switchToZone(psd, true);
            return fn.apply(this, arguments);
        }
        catch (e) {
            errorCatcher && errorCatcher(e);
        }
        finally {
            switchToZone(outerScope, false);
            if (wasRootExec)
                endMicroTickScope();
        }
    };
}
var task = { awaits: 0, echoes: 0, id: 0 };
var taskCounter = 0;
var zoneStack = [];
var zoneEchoes = 0;
var totalEchoes = 0;
var zone_id_counter = 0;
function newScope(fn, props$$1, a1, a2) {
    var parent = PSD, psd = Object.create(parent);
    psd.parent = parent;
    psd.ref = 0;
    psd.global = false;
    psd.id = ++zone_id_counter;
    var globalEnv = globalPSD.env;
    psd.env = patchGlobalPromise ? {
        Promise: DexiePromise,
        PromiseProp: { value: DexiePromise, configurable: true, writable: true },
        all: DexiePromise.all,
        race: DexiePromise.race,
        allSettled: DexiePromise.allSettled,
        any: DexiePromise.any,
        resolve: DexiePromise.resolve,
        reject: DexiePromise.reject,
        nthen: getPatchedPromiseThen(globalEnv.nthen, psd),
        gthen: getPatchedPromiseThen(globalEnv.gthen, psd)
    } : {};
    if (props$$1)
        extend(psd, props$$1);
    ++parent.ref;
    psd.finalize = function () {
        --this.parent.ref || this.parent.finalize();
    };
    var rv = usePSD(psd, fn, a1, a2);
    if (psd.ref === 0)
        psd.finalize();
    return rv;
}
function incrementExpectedAwaits() {
    if (!task.id)
        task.id = ++taskCounter;
    ++task.awaits;
    task.echoes += ZONE_ECHO_LIMIT;
    return task.id;
}
function decrementExpectedAwaits(sourceTaskId) {
    if (!task.awaits || (sourceTaskId && sourceTaskId !== task.id))
        return;
    if (--task.awaits === 0)
        task.id = 0;
    task.echoes = task.awaits * ZONE_ECHO_LIMIT;
}
if (('' + nativePromiseThen).indexOf('[native code]') === -1) {
    incrementExpectedAwaits = decrementExpectedAwaits = nop;
}
function onPossibleParallellAsync(possiblePromise) {
    if (task.echoes && possiblePromise && possiblePromise.constructor === NativePromise) {
        incrementExpectedAwaits();
        return possiblePromise.then(function (x) {
            decrementExpectedAwaits();
            return x;
        }, function (e) {
            decrementExpectedAwaits();
            return rejection(e);
        });
    }
    return possiblePromise;
}
function zoneEnterEcho(targetZone) {
    ++totalEchoes;
    if (!task.echoes || --task.echoes === 0) {
        task.echoes = task.id = 0;
    }
    zoneStack.push(PSD);
    switchToZone(targetZone, true);
}
function zoneLeaveEcho() {
    var zone = zoneStack[zoneStack.length - 1];
    zoneStack.pop();
    switchToZone(zone, false);
}
function switchToZone(targetZone, bEnteringZone) {
    var currentZone = PSD;
    if (bEnteringZone ? task.echoes && (!zoneEchoes++ || targetZone !== PSD) : zoneEchoes && (!--zoneEchoes || targetZone !== PSD)) {
        enqueueNativeMicroTask(bEnteringZone ? zoneEnterEcho.bind(null, targetZone) : zoneLeaveEcho);
    }
    if (targetZone === PSD)
        return;
    PSD = targetZone;
    if (currentZone === globalPSD)
        globalPSD.env = snapShot();
    if (patchGlobalPromise) {
        var GlobalPromise_1 = globalPSD.env.Promise;
        var targetEnv = targetZone.env;
        nativePromiseProto.then = targetEnv.nthen;
        GlobalPromise_1.prototype.then = targetEnv.gthen;
        if (currentZone.global || targetZone.global) {
            Object.defineProperty(_global, 'Promise', targetEnv.PromiseProp);
            GlobalPromise_1.all = targetEnv.all;
            GlobalPromise_1.race = targetEnv.race;
            GlobalPromise_1.resolve = targetEnv.resolve;
            GlobalPromise_1.reject = targetEnv.reject;
            if (targetEnv.allSettled)
                GlobalPromise_1.allSettled = targetEnv.allSettled;
            if (targetEnv.any)
                GlobalPromise_1.any = targetEnv.any;
        }
    }
}
function snapShot() {
    var GlobalPromise = _global.Promise;
    return patchGlobalPromise ? {
        Promise: GlobalPromise,
        PromiseProp: Object.getOwnPropertyDescriptor(_global, "Promise"),
        all: GlobalPromise.all,
        race: GlobalPromise.race,
        allSettled: GlobalPromise.allSettled,
        any: GlobalPromise.any,
        resolve: GlobalPromise.resolve,
        reject: GlobalPromise.reject,
        nthen: nativePromiseProto.then,
        gthen: GlobalPromise.prototype.then
    } : {};
}
function usePSD(psd, fn, a1, a2, a3) {
    var outerScope = PSD;
    try {
        switchToZone(psd, true);
        return fn(a1, a2, a3);
    }
    finally {
        switchToZone(outerScope, false);
    }
}
function enqueueNativeMicroTask(job) {
    nativePromiseThen.call(resolvedNativePromise, job);
}
function nativeAwaitCompatibleWrap(fn, zone, possibleAwait) {
    return typeof fn !== 'function' ? fn : function () {
        var outerZone = PSD;
        if (possibleAwait)
            incrementExpectedAwaits();
        switchToZone(zone, true);
        try {
            return fn.apply(this, arguments);
        }
        finally {
            switchToZone(outerZone, false);
        }
    };
}
function getPatchedPromiseThen(origThen, zone) {
    return function (onResolved, onRejected) {
        return origThen.call(this, nativeAwaitCompatibleWrap(onResolved, zone, false), nativeAwaitCompatibleWrap(onRejected, zone, false));
    };
}
var UNHANDLEDREJECTION = "unhandledrejection";
function globalError(err, promise) {
    var rv;
    try {
        rv = promise.onuncatched(err);
    }
    catch (e) { }
    if (rv !== false)
        try {
            var event, eventData = { promise: promise, reason: err };
            if (_global.document && document.createEvent) {
                event = document.createEvent('Event');
                event.initEvent(UNHANDLEDREJECTION, true, true);
                extend(event, eventData);
            }
            else if (_global.CustomEvent) {
                event = new CustomEvent(UNHANDLEDREJECTION, { detail: eventData });
                extend(event, eventData);
            }
            if (event && _global.dispatchEvent) {
                dispatchEvent(event);
                if (!_global.PromiseRejectionEvent && _global.onunhandledrejection)
                    try {
                        _global.onunhandledrejection(event);
                    }
                    catch (_) { }
            }
            if (debug && event && !event.defaultPrevented) {
                console.warn("Unhandled rejection: " + (err.stack || err));
            }
        }
        catch (e) { }
}
var rejection = DexiePromise.reject;

function tempTransaction(db, mode, storeNames, fn) {
    if (!db._state.openComplete && (!PSD.letThrough)) {
        if (!db._state.isBeingOpened) {
            if (!db._options.autoOpen)
                return rejection(new exceptions.DatabaseClosed());
            db.open().catch(nop);
        }
        return db._state.dbReadyPromise.then(function () { return tempTransaction(db, mode, storeNames, fn); });
    }
    else {
        var trans = db._createTransaction(mode, storeNames, db._dbSchema);
        try {
            trans.create();
        }
        catch (ex) {
            return rejection(ex);
        }
        return trans._promise(mode, function (resolve, reject) {
            return newScope(function () {
                PSD.trans = trans;
                return fn(resolve, reject, trans);
            });
        }).then(function (result) {
            return trans._completion.then(function () { return result; });
        });
    }
}

var DEXIE_VERSION = '3.0.1';
var maxString = String.fromCharCode(65535);
var minKey = -Infinity;
var INVALID_KEY_ARGUMENT = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.";
var STRING_EXPECTED = "String expected.";
var connections = [];
var isIEOrEdge = typeof navigator !== 'undefined' && /(MSIE|Trident|Edge)/.test(navigator.userAgent);
var hasIEDeleteObjectStoreBug = isIEOrEdge;
var hangsOnDeleteLargeKeyRange = isIEOrEdge;
var dexieStackFrameFilter = function (frame) { return !/(dexie\.js|dexie\.min\.js)/.test(frame); };
var DBNAMES_DB = '__dbnames';
var READONLY = 'readonly';
var READWRITE = 'readwrite';

function combine(filter1, filter2) {
    return filter1 ?
        filter2 ?
            function () { return filter1.apply(this, arguments) && filter2.apply(this, arguments); } :
            filter1 :
        filter2;
}

var AnyRange = {
    type: 3          ,
    lower: -Infinity,
    lowerOpen: false,
    upper: [[]],
    upperOpen: false
};

var Table =               (function () {
    function Table() {
    }
    Table.prototype._trans = function (mode, fn, writeLocked) {
        var trans = this._tx || PSD.trans;
        var tableName = this.name;
        function checkTableInTransaction(resolve, reject, trans) {
            if (!trans.schema[tableName])
                throw new exceptions.NotFound("Table " + tableName + " not part of transaction");
            return fn(trans.idbtrans, trans);
        }
        var wasRootExec = beginMicroTickScope();
        try {
            return trans && trans.db === this.db ?
                trans === PSD.trans ?
                    trans._promise(mode, checkTableInTransaction, writeLocked) :
                    newScope(function () { return trans._promise(mode, checkTableInTransaction, writeLocked); }, { trans: trans, transless: PSD.transless || PSD }) :
                tempTransaction(this.db, mode, [this.name], checkTableInTransaction);
        }
        finally {
            if (wasRootExec)
                endMicroTickScope();
        }
    };
    Table.prototype.get = function (keyOrCrit, cb) {
        var _this = this;
        if (keyOrCrit && keyOrCrit.constructor === Object)
            return this.where(keyOrCrit).first(cb);
        return this._trans('readonly', function (trans) {
            return _this.core.get({ trans: trans, key: keyOrCrit })
                .then(function (res) { return _this.hook.reading.fire(res); });
        }).then(cb);
    };
    Table.prototype.where = function (indexOrCrit) {
        if (typeof indexOrCrit === 'string')
            return new this.db.WhereClause(this, indexOrCrit);
        if (isArray(indexOrCrit))
            return new this.db.WhereClause(this, "[" + indexOrCrit.join('+') + "]");
        var keyPaths = keys(indexOrCrit);
        if (keyPaths.length === 1)
            return this
                .where(keyPaths[0])
                .equals(indexOrCrit[keyPaths[0]]);
        var compoundIndex = this.schema.indexes.concat(this.schema.primKey).filter(function (ix) {
            return ix.compound &&
                keyPaths.every(function (keyPath) { return ix.keyPath.indexOf(keyPath) >= 0; }) &&
                ix.keyPath.every(function (keyPath) { return keyPaths.indexOf(keyPath) >= 0; });
        })[0];
        if (compoundIndex && this.db._maxKey !== maxString)
            return this
                .where(compoundIndex.name)
                .equals(compoundIndex.keyPath.map(function (kp) { return indexOrCrit[kp]; }));
        if (!compoundIndex && debug)
            console.warn("The query " + JSON.stringify(indexOrCrit) + " on " + this.name + " would benefit of a " +
                ("compound index [" + keyPaths.join('+') + "]"));
        var idxByName = this.schema.idxByName;
        var idb = this.db._deps.indexedDB;
        function equals(a, b) {
            try {
                return idb.cmp(a, b) === 0;
            }
            catch (e) {
                return false;
            }
        }
        var _a = keyPaths.reduce(function (_a, keyPath) {
            var prevIndex = _a[0], prevFilterFn = _a[1];
            var index = idxByName[keyPath];
            var value = indexOrCrit[keyPath];
            return [
                prevIndex || index,
                prevIndex || !index ?
                    combine(prevFilterFn, index && index.multi ?
                        function (x) {
                            var prop = getByKeyPath(x, keyPath);
                            return isArray(prop) && prop.some(function (item) { return equals(value, item); });
                        } : function (x) { return equals(value, getByKeyPath(x, keyPath)); })
                    : prevFilterFn
            ];
        }, [null, null]), idx = _a[0], filterFunction = _a[1];
        return idx ?
            this.where(idx.name).equals(indexOrCrit[idx.keyPath])
                .filter(filterFunction) :
            compoundIndex ?
                this.filter(filterFunction) :
                this.where(keyPaths).equals('');
    };
    Table.prototype.filter = function (filterFunction) {
        return this.toCollection().and(filterFunction);
    };
    Table.prototype.count = function (thenShortcut) {
        return this.toCollection().count(thenShortcut);
    };
    Table.prototype.offset = function (offset) {
        return this.toCollection().offset(offset);
    };
    Table.prototype.limit = function (numRows) {
        return this.toCollection().limit(numRows);
    };
    Table.prototype.each = function (callback) {
        return this.toCollection().each(callback);
    };
    Table.prototype.toArray = function (thenShortcut) {
        return this.toCollection().toArray(thenShortcut);
    };
    Table.prototype.toCollection = function () {
        return new this.db.Collection(new this.db.WhereClause(this));
    };
    Table.prototype.orderBy = function (index) {
        return new this.db.Collection(new this.db.WhereClause(this, isArray(index) ?
            "[" + index.join('+') + "]" :
            index));
    };
    Table.prototype.reverse = function () {
        return this.toCollection().reverse();
    };
    Table.prototype.mapToClass = function (constructor) {
        this.schema.mappedClass = constructor;
        var readHook = function (obj) {
            if (!obj)
                return obj;
            var res = Object.create(constructor.prototype);
            for (var m in obj)
                if (hasOwn(obj, m))
                    try {
                        res[m] = obj[m];
                    }
                    catch (_) { }
            return res;
        };
        if (this.schema.readHook) {
            this.hook.reading.unsubscribe(this.schema.readHook);
        }
        this.schema.readHook = readHook;
        this.hook("reading", readHook);
        return constructor;
    };
    Table.prototype.defineClass = function () {
        function Class(content) {
            extend(this, content);
        }
        
        return this.mapToClass(Class);
    };
    Table.prototype.add = function (obj, key) {
        var _this = this;
        return this._trans('readwrite', function (trans) {
            return _this.core.mutate({ trans: trans, type: 'add', keys: key != null ? [key] : null, values: [obj] });
        }).then(function (res) { return res.numFailures ? DexiePromise.reject(res.failures[0]) : res.lastResult; })
            .then(function (lastResult) {
            if (!_this.core.schema.primaryKey.outbound) {
                try {
                    setByKeyPath(obj, _this.core.schema.primaryKey.keyPath, lastResult);
                }
                catch (_) { }
                
            }
            return lastResult;
        });
    };
    Table.prototype.update = function (keyOrObject, modifications) {
        if (typeof modifications !== 'object' || isArray(modifications))
            throw new exceptions.InvalidArgument("Modifications must be an object.");
        if (typeof keyOrObject === 'object' && !isArray(keyOrObject)) {
            keys(modifications).forEach(function (keyPath) {
                setByKeyPath(keyOrObject, keyPath, modifications[keyPath]);
            });
            var key = getByKeyPath(keyOrObject, this.schema.primKey.keyPath);
            if (key === undefined)
                return rejection(new exceptions.InvalidArgument("Given object does not contain its primary key"));
            return this.where(":id").equals(key).modify(modifications);
        }
        else {
            return this.where(":id").equals(keyOrObject).modify(modifications);
        }
    };
    Table.prototype.put = function (obj, key) {
        var _this = this;
        return this._trans('readwrite', function (trans) { return _this.core.mutate({ trans: trans, type: 'put', values: [obj], keys: key != null ? [key] : null }); })
            .then(function (res) { return res.numFailures ? DexiePromise.reject(res.failures[0]) : res.lastResult; })
            .then(function (lastResult) {
            if (!_this.core.schema.primaryKey.outbound) {
                try {
                    setByKeyPath(obj, _this.core.schema.primaryKey.keyPath, lastResult);
                }
                catch (_) { }
                
            }
            return lastResult;
        });
    };
    Table.prototype.delete = function (key) {
        var _this = this;
        return this._trans('readwrite', function (trans) { return _this.core.mutate({ trans: trans, type: 'delete', keys: [key] }); })
            .then(function (res) { return res.numFailures ? DexiePromise.reject(res.failures[0]) : undefined; });
    };
    Table.prototype.clear = function () {
        var _this = this;
        return this._trans('readwrite', function (trans) { return _this.core.mutate({ trans: trans, type: 'deleteRange', range: AnyRange }); })
            .then(function (res) { return res.numFailures ? DexiePromise.reject(res.failures[0]) : undefined; });
    };
    Table.prototype.bulkGet = function (keys$$1) {
        var _this = this;
        return this._trans('readonly', function (trans) {
            return _this.core.getMany({
                keys: keys$$1,
                trans: trans
            });
        });
    };
    Table.prototype.bulkAdd = function (objects, keysOrOptions, options) {
        var _this = this;
        var keys$$1 = Array.isArray(keysOrOptions) ? keysOrOptions : undefined;
        options = options || (keys$$1 ? undefined : keysOrOptions);
        var wantResults = options ? options.allKeys : undefined;
        return this._trans('readwrite', function (trans) {
            var outbound = _this.core.schema.primaryKey.outbound;
            if (!outbound && keys$$1)
                throw new exceptions.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
            if (keys$$1 && keys$$1.length !== objects.length)
                throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
            var numObjects = objects.length;
            return _this.core.mutate({ trans: trans, type: 'add', keys: keys$$1, values: objects, wantResults: wantResults })
                .then(function (_a) {
                var numFailures = _a.numFailures, results = _a.results, lastResult = _a.lastResult, failures = _a.failures;
                var result = wantResults ? results : lastResult;
                if (numFailures === 0)
                    return result;
                throw new BulkError(_this.name + ".bulkAdd(): " + numFailures + " of " + numObjects + " operations failed", Object.keys(failures).map(function (pos) { return failures[pos]; }));
            });
        });
    };
    Table.prototype.bulkPut = function (objects, keysOrOptions, options) {
        var _this = this;
        var keys$$1 = Array.isArray(keysOrOptions) ? keysOrOptions : undefined;
        options = options || (keys$$1 ? undefined : keysOrOptions);
        var wantResults = options ? options.allKeys : undefined;
        return this._trans('readwrite', function (trans) {
            var outbound = _this.core.schema.primaryKey.outbound;
            if (!outbound && keys$$1)
                throw new exceptions.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
            if (keys$$1 && keys$$1.length !== objects.length)
                throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
            var numObjects = objects.length;
            return _this.core.mutate({ trans: trans, type: 'put', keys: keys$$1, values: objects, wantResults: wantResults })
                .then(function (_a) {
                var numFailures = _a.numFailures, results = _a.results, lastResult = _a.lastResult, failures = _a.failures;
                var result = wantResults ? results : lastResult;
                if (numFailures === 0)
                    return result;
                throw new BulkError(_this.name + ".bulkPut(): " + numFailures + " of " + numObjects + " operations failed", Object.keys(failures).map(function (pos) { return failures[pos]; }));
            });
        });
    };
    Table.prototype.bulkDelete = function (keys$$1) {
        var _this = this;
        var numKeys = keys$$1.length;
        return this._trans('readwrite', function (trans) {
            return _this.core.mutate({ trans: trans, type: 'delete', keys: keys$$1 });
        }).then(function (_a) {
            var numFailures = _a.numFailures, lastResult = _a.lastResult, failures = _a.failures;
            if (numFailures === 0)
                return lastResult;
            throw new BulkError(_this.name + ".bulkDelete(): " + numFailures + " of " + numKeys + " operations failed", failures);
        });
    };
    return Table;
}());

function Events(ctx) {
    var evs = {};
    var rv = function (eventName, subscriber) {
        if (subscriber) {
            var i = arguments.length, args = new Array(i - 1);
            while (--i)
                args[i - 1] = arguments[i];
            evs[eventName].subscribe.apply(null, args);
            return ctx;
        }
        else if (typeof (eventName) === 'string') {
            return evs[eventName];
        }
    };
    rv.addEventType = add;
    for (var i = 1, l = arguments.length; i < l; ++i) {
        add(arguments[i]);
    }
    return rv;
    function add(eventName, chainFunction, defaultFunction) {
        if (typeof eventName === 'object')
            return addConfiguredEvents(eventName);
        if (!chainFunction)
            chainFunction = reverseStoppableEventChain;
        if (!defaultFunction)
            defaultFunction = nop;
        var context = {
            subscribers: [],
            fire: defaultFunction,
            subscribe: function (cb) {
                if (context.subscribers.indexOf(cb) === -1) {
                    context.subscribers.push(cb);
                    context.fire = chainFunction(context.fire, cb);
                }
            },
            unsubscribe: function (cb) {
                context.subscribers = context.subscribers.filter(function (fn) { return fn !== cb; });
                context.fire = context.subscribers.reduce(chainFunction, defaultFunction);
            }
        };
        evs[eventName] = rv[eventName] = context;
        return context;
    }
    function addConfiguredEvents(cfg) {
        keys(cfg).forEach(function (eventName) {
            var args = cfg[eventName];
            if (isArray(args)) {
                add(eventName, cfg[eventName][0], cfg[eventName][1]);
            }
            else if (args === 'asap') {
                var context = add(eventName, mirror, function fire() {
                    var i = arguments.length, args = new Array(i);
                    while (i--)
                        args[i] = arguments[i];
                    context.subscribers.forEach(function (fn) {
                        asap(function fireEvent() {
                            fn.apply(null, args);
                        });
                    });
                });
            }
            else
                throw new exceptions.InvalidArgument("Invalid event config");
        });
    }
}

function makeClassConstructor(prototype, constructor) {
    derive(constructor).from({ prototype: prototype });
    return constructor;
}

function createTableConstructor(db) {
    return makeClassConstructor(Table.prototype, function Table$$1(name, tableSchema, trans) {
        this.db = db;
        this._tx = trans;
        this.name = name;
        this.schema = tableSchema;
        this.hook = db._allTables[name] ? db._allTables[name].hook : Events(null, {
            "creating": [hookCreatingChain, nop],
            "reading": [pureFunctionChain, mirror],
            "updating": [hookUpdatingChain, nop],
            "deleting": [hookDeletingChain, nop]
        });
    });
}

function isPlainKeyRange(ctx, ignoreLimitFilter) {
    return !(ctx.filter || ctx.algorithm || ctx.or) &&
        (ignoreLimitFilter ? ctx.justLimit : !ctx.replayFilter);
}
function addFilter(ctx, fn) {
    ctx.filter = combine(ctx.filter, fn);
}
function addReplayFilter(ctx, factory, isLimitFilter) {
    var curr = ctx.replayFilter;
    ctx.replayFilter = curr ? function () { return combine(curr(), factory()); } : factory;
    ctx.justLimit = isLimitFilter && !curr;
}
function addMatchFilter(ctx, fn) {
    ctx.isMatch = combine(ctx.isMatch, fn);
}
function getIndexOrStore(ctx, coreSchema) {
    if (ctx.isPrimKey)
        return coreSchema.primaryKey;
    var index = coreSchema.getIndexByKeyPath(ctx.index);
    if (!index)
        throw new exceptions.Schema("KeyPath " + ctx.index + " on object store " + coreSchema.name + " is not indexed");
    return index;
}
function openCursor(ctx, coreTable, trans) {
    var index = getIndexOrStore(ctx, coreTable.schema);
    return coreTable.openCursor({
        trans: trans,
        values: !ctx.keysOnly,
        reverse: ctx.dir === 'prev',
        unique: !!ctx.unique,
        query: {
            index: index,
            range: ctx.range
        }
    });
}
function iter(ctx, fn, coreTrans, coreTable) {
    var filter = ctx.replayFilter ? combine(ctx.filter, ctx.replayFilter()) : ctx.filter;
    if (!ctx.or) {
        return iterate(openCursor(ctx, coreTable, coreTrans), combine(ctx.algorithm, filter), fn, !ctx.keysOnly && ctx.valueMapper);
    }
    else {
        var set_1 = {};
        var union = function (item, cursor, advance) {
            if (!filter || filter(cursor, advance, function (result) { return cursor.stop(result); }, function (err) { return cursor.fail(err); })) {
                var primaryKey = cursor.primaryKey;
                var key = '' + primaryKey;
                if (key === '[object ArrayBuffer]')
                    key = '' + new Uint8Array(primaryKey);
                if (!hasOwn(set_1, key)) {
                    set_1[key] = true;
                    fn(item, cursor, advance);
                }
            }
        };
        return Promise.all([
            ctx.or._iterate(union, coreTrans),
            iterate(openCursor(ctx, coreTable, coreTrans), ctx.algorithm, union, !ctx.keysOnly && ctx.valueMapper)
        ]);
    }
}
function iterate(cursorPromise, filter, fn, valueMapper) {
    var mappedFn = valueMapper ? function (x, c, a) { return fn(valueMapper(x), c, a); } : fn;
    var wrappedFn = wrap(mappedFn);
    return cursorPromise.then(function (cursor) {
        if (cursor) {
            return cursor.start(function () {
                var c = function () { return cursor.continue(); };
                if (!filter || filter(cursor, function (advancer) { return c = advancer; }, function (val) { cursor.stop(val); c = nop; }, function (e) { cursor.fail(e); c = nop; }))
                    wrappedFn(cursor.value, cursor, function (advancer) { return c = advancer; });
                c();
            });
        }
    });
}

var Collection =               (function () {
    function Collection() {
    }
    Collection.prototype._read = function (fn, cb) {
        var ctx = this._ctx;
        return ctx.error ?
            ctx.table._trans(null, rejection.bind(null, ctx.error)) :
            ctx.table._trans('readonly', fn).then(cb);
    };
    Collection.prototype._write = function (fn) {
        var ctx = this._ctx;
        return ctx.error ?
            ctx.table._trans(null, rejection.bind(null, ctx.error)) :
            ctx.table._trans('readwrite', fn, "locked");
    };
    Collection.prototype._addAlgorithm = function (fn) {
        var ctx = this._ctx;
        ctx.algorithm = combine(ctx.algorithm, fn);
    };
    Collection.prototype._iterate = function (fn, coreTrans) {
        return iter(this._ctx, fn, coreTrans, this._ctx.table.core);
    };
    Collection.prototype.clone = function (props$$1) {
        var rv = Object.create(this.constructor.prototype), ctx = Object.create(this._ctx);
        if (props$$1)
            extend(ctx, props$$1);
        rv._ctx = ctx;
        return rv;
    };
    Collection.prototype.raw = function () {
        this._ctx.valueMapper = null;
        return this;
    };
    Collection.prototype.each = function (fn) {
        var ctx = this._ctx;
        return this._read(function (trans) { return iter(ctx, fn, trans, ctx.table.core); });
    };
    Collection.prototype.count = function (cb) {
        var _this = this;
        return this._read(function (trans) {
            var ctx = _this._ctx;
            var coreTable = ctx.table.core;
            if (isPlainKeyRange(ctx, true)) {
                return coreTable.count({
                    trans: trans,
                    query: {
                        index: getIndexOrStore(ctx, coreTable.schema),
                        range: ctx.range
                    }
                }).then(function (count) { return Math.min(count, ctx.limit); });
            }
            else {
                var count = 0;
                return iter(ctx, function () { ++count; return false; }, trans, coreTable)
                    .then(function () { return count; });
            }
        }).then(cb);
    };
    Collection.prototype.sortBy = function (keyPath, cb) {
        var parts = keyPath.split('.').reverse(), lastPart = parts[0], lastIndex = parts.length - 1;
        function getval(obj, i) {
            if (i)
                return getval(obj[parts[i]], i - 1);
            return obj[lastPart];
        }
        var order = this._ctx.dir === "next" ? 1 : -1;
        function sorter(a, b) {
            var aVal = getval(a, lastIndex), bVal = getval(b, lastIndex);
            return aVal < bVal ? -order : aVal > bVal ? order : 0;
        }
        return this.toArray(function (a) {
            return a.sort(sorter);
        }).then(cb);
    };
    Collection.prototype.toArray = function (cb) {
        var _this = this;
        return this._read(function (trans) {
            var ctx = _this._ctx;
            if (ctx.dir === 'next' && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
                var valueMapper_1 = ctx.valueMapper;
                var index = getIndexOrStore(ctx, ctx.table.core.schema);
                return ctx.table.core.query({
                    trans: trans,
                    limit: ctx.limit,
                    values: true,
                    query: {
                        index: index,
                        range: ctx.range
                    }
                }).then(function (_a) {
                    var result = _a.result;
                    return valueMapper_1 ? result.map(valueMapper_1) : result;
                });
            }
            else {
                var a_1 = [];
                return iter(ctx, function (item) { return a_1.push(item); }, trans, ctx.table.core).then(function () { return a_1; });
            }
        }, cb);
    };
    Collection.prototype.offset = function (offset) {
        var ctx = this._ctx;
        if (offset <= 0)
            return this;
        ctx.offset += offset;
        if (isPlainKeyRange(ctx)) {
            addReplayFilter(ctx, function () {
                var offsetLeft = offset;
                return function (cursor, advance) {
                    if (offsetLeft === 0)
                        return true;
                    if (offsetLeft === 1) {
                        --offsetLeft;
                        return false;
                    }
                    advance(function () {
                        cursor.advance(offsetLeft);
                        offsetLeft = 0;
                    });
                    return false;
                };
            });
        }
        else {
            addReplayFilter(ctx, function () {
                var offsetLeft = offset;
                return function () { return (--offsetLeft < 0); };
            });
        }
        return this;
    };
    Collection.prototype.limit = function (numRows) {
        this._ctx.limit = Math.min(this._ctx.limit, numRows);
        addReplayFilter(this._ctx, function () {
            var rowsLeft = numRows;
            return function (cursor, advance, resolve) {
                if (--rowsLeft <= 0)
                    advance(resolve);
                return rowsLeft >= 0;
            };
        }, true);
        return this;
    };
    Collection.prototype.until = function (filterFunction, bIncludeStopEntry) {
        addFilter(this._ctx, function (cursor, advance, resolve) {
            if (filterFunction(cursor.value)) {
                advance(resolve);
                return bIncludeStopEntry;
            }
            else {
                return true;
            }
        });
        return this;
    };
    Collection.prototype.first = function (cb) {
        return this.limit(1).toArray(function (a) { return a[0]; }).then(cb);
    };
    Collection.prototype.last = function (cb) {
        return this.reverse().first(cb);
    };
    Collection.prototype.filter = function (filterFunction) {
        addFilter(this._ctx, function (cursor) {
            return filterFunction(cursor.value);
        });
        addMatchFilter(this._ctx, filterFunction);
        return this;
    };
    Collection.prototype.and = function (filter) {
        return this.filter(filter);
    };
    Collection.prototype.or = function (indexName) {
        return new this.db.WhereClause(this._ctx.table, indexName, this);
    };
    Collection.prototype.reverse = function () {
        this._ctx.dir = (this._ctx.dir === "prev" ? "next" : "prev");
        if (this._ondirectionchange)
            this._ondirectionchange(this._ctx.dir);
        return this;
    };
    Collection.prototype.desc = function () {
        return this.reverse();
    };
    Collection.prototype.eachKey = function (cb) {
        var ctx = this._ctx;
        ctx.keysOnly = !ctx.isMatch;
        return this.each(function (val, cursor) { cb(cursor.key, cursor); });
    };
    Collection.prototype.eachUniqueKey = function (cb) {
        this._ctx.unique = "unique";
        return this.eachKey(cb);
    };
    Collection.prototype.eachPrimaryKey = function (cb) {
        var ctx = this._ctx;
        ctx.keysOnly = !ctx.isMatch;
        return this.each(function (val, cursor) { cb(cursor.primaryKey, cursor); });
    };
    Collection.prototype.keys = function (cb) {
        var ctx = this._ctx;
        ctx.keysOnly = !ctx.isMatch;
        var a = [];
        return this.each(function (item, cursor) {
            a.push(cursor.key);
        }).then(function () {
            return a;
        }).then(cb);
    };
    Collection.prototype.primaryKeys = function (cb) {
        var ctx = this._ctx;
        if (ctx.dir === 'next' && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
            return this._read(function (trans) {
                var index = getIndexOrStore(ctx, ctx.table.core.schema);
                return ctx.table.core.query({
                    trans: trans,
                    values: false,
                    limit: ctx.limit,
                    query: {
                        index: index,
                        range: ctx.range
                    }
                });
            }).then(function (_a) {
                var result = _a.result;
                return result;
            }).then(cb);
        }
        ctx.keysOnly = !ctx.isMatch;
        var a = [];
        return this.each(function (item, cursor) {
            a.push(cursor.primaryKey);
        }).then(function () {
            return a;
        }).then(cb);
    };
    Collection.prototype.uniqueKeys = function (cb) {
        this._ctx.unique = "unique";
        return this.keys(cb);
    };
    Collection.prototype.firstKey = function (cb) {
        return this.limit(1).keys(function (a) { return a[0]; }).then(cb);
    };
    Collection.prototype.lastKey = function (cb) {
        return this.reverse().firstKey(cb);
    };
    Collection.prototype.distinct = function () {
        var ctx = this._ctx, idx = ctx.index && ctx.table.schema.idxByName[ctx.index];
        if (!idx || !idx.multi)
            return this;
        var set = {};
        addFilter(this._ctx, function (cursor) {
            var strKey = cursor.primaryKey.toString();
            var found = hasOwn(set, strKey);
            set[strKey] = true;
            return !found;
        });
        return this;
    };
    Collection.prototype.modify = function (changes) {
        var _this = this;
        var ctx = this._ctx;
        return this._write(function (trans) {
            var modifyer;
            if (typeof changes === 'function') {
                modifyer = changes;
            }
            else {
                var keyPaths = keys(changes);
                var numKeys = keyPaths.length;
                modifyer = function (item) {
                    var anythingModified = false;
                    for (var i = 0; i < numKeys; ++i) {
                        var keyPath = keyPaths[i], val = changes[keyPath];
                        if (getByKeyPath(item, keyPath) !== val) {
                            setByKeyPath(item, keyPath, val);
                            anythingModified = true;
                        }
                    }
                    return anythingModified;
                };
            }
            var coreTable = ctx.table.core;
            var _a = coreTable.schema.primaryKey, outbound = _a.outbound, extractKey = _a.extractKey;
            var limit = 'testmode' in Dexie ? 1 : 2000;
            var cmp = _this.db.core.cmp;
            var totalFailures = [];
            var successCount = 0;
            var failedKeys = [];
            var applyMutateResult = function (expectedCount, res) {
                var failures = res.failures, numFailures = res.numFailures;
                successCount += expectedCount - numFailures;
                for (var _i = 0, _a = keys(failures); _i < _a.length; _i++) {
                    var pos = _a[_i];
                    totalFailures.push(failures[pos]);
                }
            };
            return _this.clone().primaryKeys().then(function (keys$$1) {
                var nextChunk = function (offset) {
                    var count = Math.min(limit, keys$$1.length - offset);
                    return coreTable.getMany({ trans: trans, keys: keys$$1.slice(offset, offset + count) }).then(function (values) {
                        var addValues = [];
                        var putValues = [];
                        var putKeys = outbound ? [] : null;
                        var deleteKeys = [];
                        for (var i = 0; i < count; ++i) {
                            var origValue = values[i];
                            var ctx_1 = {
                                value: deepClone(origValue),
                                primKey: keys$$1[offset + i]
                            };
                            if (modifyer.call(ctx_1, ctx_1.value, ctx_1) !== false) {
                                if (ctx_1.value == null) {
                                    deleteKeys.push(keys$$1[offset + i]);
                                }
                                else if (!outbound && cmp(extractKey(origValue), extractKey(ctx_1.value)) !== 0) {
                                    deleteKeys.push(keys$$1[offset + i]);
                                    addValues.push(ctx_1.value);
                                }
                                else {
                                    putValues.push(ctx_1.value);
                                    if (outbound)
                                        putKeys.push(keys$$1[offset + i]);
                                }
                            }
                        }
                        return Promise.resolve(addValues.length > 0 &&
                            coreTable.mutate({ trans: trans, type: 'add', values: addValues })
                                .then(function (res) {
                                for (var pos in res.failures) {
                                    deleteKeys.splice(parseInt(pos), 1);
                                }
                                applyMutateResult(addValues.length, res);
                            })).then(function (res) { return putValues.length > 0 &&
                            coreTable.mutate({ trans: trans, type: 'put', keys: putKeys, values: putValues })
                                .then(function (res) { return applyMutateResult(putValues.length, res); }); }).then(function () { return deleteKeys.length > 0 &&
                            coreTable.mutate({ trans: trans, type: 'delete', keys: deleteKeys })
                                .then(function (res) { return applyMutateResult(deleteKeys.length, res); }); }).then(function () {
                            return keys$$1.length > offset + count && nextChunk(offset + limit);
                        });
                    });
                };
                return nextChunk(0).then(function () {
                    if (totalFailures.length > 0)
                        throw new ModifyError("Error modifying one or more objects", totalFailures, successCount, failedKeys);
                    return keys$$1.length;
                });
            });
        });
    };
    Collection.prototype.delete = function () {
        var ctx = this._ctx, range = ctx.range;
        if (isPlainKeyRange(ctx) &&
            ((ctx.isPrimKey && !hangsOnDeleteLargeKeyRange) || range.type === 3          ))
         {
            return this._write(function (trans) {
                var primaryKey = ctx.table.core.schema.primaryKey;
                var coreRange = range;
                return ctx.table.core.count({ trans: trans, query: { index: primaryKey, range: coreRange } }).then(function (count) {
                    return ctx.table.core.mutate({ trans: trans, type: 'deleteRange', range: coreRange })
                        .then(function (_a) {
                        var failures = _a.failures, lastResult = _a.lastResult, results = _a.results, numFailures = _a.numFailures;
                        if (numFailures)
                            throw new ModifyError("Could not delete some values", Object.keys(failures).map(function (pos) { return failures[pos]; }), count - numFailures);
                        return count - numFailures;
                    });
                });
            });
        }
        return this.modify(function (value, ctx) { return ctx.value = null; });
    };
    return Collection;
}());

function createCollectionConstructor(db) {
    return makeClassConstructor(Collection.prototype, function Collection$$1(whereClause, keyRangeGenerator) {
        this.db = db;
        var keyRange = AnyRange, error = null;
        if (keyRangeGenerator)
            try {
                keyRange = keyRangeGenerator();
            }
            catch (ex) {
                error = ex;
            }
        var whereCtx = whereClause._ctx;
        var table = whereCtx.table;
        var readingHook = table.hook.reading.fire;
        this._ctx = {
            table: table,
            index: whereCtx.index,
            isPrimKey: (!whereCtx.index || (table.schema.primKey.keyPath && whereCtx.index === table.schema.primKey.name)),
            range: keyRange,
            keysOnly: false,
            dir: "next",
            unique: "",
            algorithm: null,
            filter: null,
            replayFilter: null,
            justLimit: true,
            isMatch: null,
            offset: 0,
            limit: Infinity,
            error: error,
            or: whereCtx.or,
            valueMapper: readingHook !== mirror ? readingHook : null
        };
    });
}

function simpleCompare(a, b) {
    return a < b ? -1 : a === b ? 0 : 1;
}
function simpleCompareReverse(a, b) {
    return a > b ? -1 : a === b ? 0 : 1;
}

function fail(collectionOrWhereClause, err, T) {
    var collection = collectionOrWhereClause instanceof WhereClause ?
        new collectionOrWhereClause.Collection(collectionOrWhereClause) :
        collectionOrWhereClause;
    collection._ctx.error = T ? new T(err) : new TypeError(err);
    return collection;
}
function emptyCollection(whereClause) {
    return new whereClause.Collection(whereClause, function () { return rangeEqual(""); }).limit(0);
}
function upperFactory(dir) {
    return dir === "next" ?
        function (s) { return s.toUpperCase(); } :
        function (s) { return s.toLowerCase(); };
}
function lowerFactory(dir) {
    return dir === "next" ?
        function (s) { return s.toLowerCase(); } :
        function (s) { return s.toUpperCase(); };
}
function nextCasing(key, lowerKey, upperNeedle, lowerNeedle, cmp, dir) {
    var length = Math.min(key.length, lowerNeedle.length);
    var llp = -1;
    for (var i = 0; i < length; ++i) {
        var lwrKeyChar = lowerKey[i];
        if (lwrKeyChar !== lowerNeedle[i]) {
            if (cmp(key[i], upperNeedle[i]) < 0)
                return key.substr(0, i) + upperNeedle[i] + upperNeedle.substr(i + 1);
            if (cmp(key[i], lowerNeedle[i]) < 0)
                return key.substr(0, i) + lowerNeedle[i] + upperNeedle.substr(i + 1);
            if (llp >= 0)
                return key.substr(0, llp) + lowerKey[llp] + upperNeedle.substr(llp + 1);
            return null;
        }
        if (cmp(key[i], lwrKeyChar) < 0)
            llp = i;
    }
    if (length < lowerNeedle.length && dir === "next")
        return key + upperNeedle.substr(key.length);
    if (length < key.length && dir === "prev")
        return key.substr(0, upperNeedle.length);
    return (llp < 0 ? null : key.substr(0, llp) + lowerNeedle[llp] + upperNeedle.substr(llp + 1));
}
function addIgnoreCaseAlgorithm(whereClause, match, needles, suffix) {
    var upper, lower, compare, upperNeedles, lowerNeedles, direction, nextKeySuffix, needlesLen = needles.length;
    if (!needles.every(function (s) { return typeof s === 'string'; })) {
        return fail(whereClause, STRING_EXPECTED);
    }
    function initDirection(dir) {
        upper = upperFactory(dir);
        lower = lowerFactory(dir);
        compare = (dir === "next" ? simpleCompare : simpleCompareReverse);
        var needleBounds = needles.map(function (needle) {
            return { lower: lower(needle), upper: upper(needle) };
        }).sort(function (a, b) {
            return compare(a.lower, b.lower);
        });
        upperNeedles = needleBounds.map(function (nb) { return nb.upper; });
        lowerNeedles = needleBounds.map(function (nb) { return nb.lower; });
        direction = dir;
        nextKeySuffix = (dir === "next" ? "" : suffix);
    }
    initDirection("next");
    var c = new whereClause.Collection(whereClause, function () { return createRange(upperNeedles[0], lowerNeedles[needlesLen - 1] + suffix); });
    c._ondirectionchange = function (direction) {
        initDirection(direction);
    };
    var firstPossibleNeedle = 0;
    c._addAlgorithm(function (cursor, advance, resolve) {
        var key = cursor.key;
        if (typeof key !== 'string')
            return false;
        var lowerKey = lower(key);
        if (match(lowerKey, lowerNeedles, firstPossibleNeedle)) {
            return true;
        }
        else {
            var lowestPossibleCasing = null;
            for (var i = firstPossibleNeedle; i < needlesLen; ++i) {
                var casing = nextCasing(key, lowerKey, upperNeedles[i], lowerNeedles[i], compare, direction);
                if (casing === null && lowestPossibleCasing === null)
                    firstPossibleNeedle = i + 1;
                else if (lowestPossibleCasing === null || compare(lowestPossibleCasing, casing) > 0) {
                    lowestPossibleCasing = casing;
                }
            }
            if (lowestPossibleCasing !== null) {
                advance(function () { cursor.continue(lowestPossibleCasing + nextKeySuffix); });
            }
            else {
                advance(resolve);
            }
            return false;
        }
    });
    return c;
}
function createRange(lower, upper, lowerOpen, upperOpen) {
    return {
        type: 2            ,
        lower: lower,
        upper: upper,
        lowerOpen: lowerOpen,
        upperOpen: upperOpen
    };
}
function rangeEqual(value) {
    return {
        type: 1            ,
        lower: value,
        upper: value
    };
}

var WhereClause =               (function () {
    function WhereClause() {
    }
    Object.defineProperty(WhereClause.prototype, "Collection", {
        get: function () {
            return this._ctx.table.db.Collection;
        },
        enumerable: true,
        configurable: true
    });
    WhereClause.prototype.between = function (lower, upper, includeLower, includeUpper) {
        includeLower = includeLower !== false;
        includeUpper = includeUpper === true;
        try {
            if ((this._cmp(lower, upper) > 0) ||
                (this._cmp(lower, upper) === 0 && (includeLower || includeUpper) && !(includeLower && includeUpper)))
                return emptyCollection(this);
            return new this.Collection(this, function () { return createRange(lower, upper, !includeLower, !includeUpper); });
        }
        catch (e) {
            return fail(this, INVALID_KEY_ARGUMENT);
        }
    };
    WhereClause.prototype.equals = function (value) {
        return new this.Collection(this, function () { return rangeEqual(value); });
    };
    WhereClause.prototype.above = function (value) {
        if (value == null)
            return fail(this, INVALID_KEY_ARGUMENT);
        return new this.Collection(this, function () { return createRange(value, undefined, true); });
    };
    WhereClause.prototype.aboveOrEqual = function (value) {
        if (value == null)
            return fail(this, INVALID_KEY_ARGUMENT);
        return new this.Collection(this, function () { return createRange(value, undefined, false); });
    };
    WhereClause.prototype.below = function (value) {
        if (value == null)
            return fail(this, INVALID_KEY_ARGUMENT);
        return new this.Collection(this, function () { return createRange(undefined, value, false, true); });
    };
    WhereClause.prototype.belowOrEqual = function (value) {
        if (value == null)
            return fail(this, INVALID_KEY_ARGUMENT);
        return new this.Collection(this, function () { return createRange(undefined, value); });
    };
    WhereClause.prototype.startsWith = function (str) {
        if (typeof str !== 'string')
            return fail(this, STRING_EXPECTED);
        return this.between(str, str + maxString, true, true);
    };
    WhereClause.prototype.startsWithIgnoreCase = function (str) {
        if (str === "")
            return this.startsWith(str);
        return addIgnoreCaseAlgorithm(this, function (x, a) { return x.indexOf(a[0]) === 0; }, [str], maxString);
    };
    WhereClause.prototype.equalsIgnoreCase = function (str) {
        return addIgnoreCaseAlgorithm(this, function (x, a) { return x === a[0]; }, [str], "");
    };
    WhereClause.prototype.anyOfIgnoreCase = function () {
        var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
        if (set.length === 0)
            return emptyCollection(this);
        return addIgnoreCaseAlgorithm(this, function (x, a) { return a.indexOf(x) !== -1; }, set, "");
    };
    WhereClause.prototype.startsWithAnyOfIgnoreCase = function () {
        var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
        if (set.length === 0)
            return emptyCollection(this);
        return addIgnoreCaseAlgorithm(this, function (x, a) { return a.some(function (n) { return x.indexOf(n) === 0; }); }, set, maxString);
    };
    WhereClause.prototype.anyOf = function () {
        var _this = this;
        var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
        var compare = this._cmp;
        try {
            set.sort(compare);
        }
        catch (e) {
            return fail(this, INVALID_KEY_ARGUMENT);
        }
        if (set.length === 0)
            return emptyCollection(this);
        var c = new this.Collection(this, function () { return createRange(set[0], set[set.length - 1]); });
        c._ondirectionchange = function (direction) {
            compare = (direction === "next" ?
                _this._ascending :
                _this._descending);
            set.sort(compare);
        };
        var i = 0;
        c._addAlgorithm(function (cursor, advance, resolve) {
            var key = cursor.key;
            while (compare(key, set[i]) > 0) {
                ++i;
                if (i === set.length) {
                    advance(resolve);
                    return false;
                }
            }
            if (compare(key, set[i]) === 0) {
                return true;
            }
            else {
                advance(function () { cursor.continue(set[i]); });
                return false;
            }
        });
        return c;
    };
    WhereClause.prototype.notEqual = function (value) {
        return this.inAnyRange([[minKey, value], [value, this.db._maxKey]], { includeLowers: false, includeUppers: false });
    };
    WhereClause.prototype.noneOf = function () {
        var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
        if (set.length === 0)
            return new this.Collection(this);
        try {
            set.sort(this._ascending);
        }
        catch (e) {
            return fail(this, INVALID_KEY_ARGUMENT);
        }
        var ranges = set.reduce(function (res, val) { return res ?
            res.concat([[res[res.length - 1][1], val]]) :
            [[minKey, val]]; }, null);
        ranges.push([set[set.length - 1], this.db._maxKey]);
        return this.inAnyRange(ranges, { includeLowers: false, includeUppers: false });
    };
    WhereClause.prototype.inAnyRange = function (ranges, options) {
        var _this = this;
        var cmp = this._cmp, ascending = this._ascending, descending = this._descending, min = this._min, max = this._max;
        if (ranges.length === 0)
            return emptyCollection(this);
        if (!ranges.every(function (range) {
            return range[0] !== undefined &&
                range[1] !== undefined &&
                ascending(range[0], range[1]) <= 0;
        })) {
            return fail(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", exceptions.InvalidArgument);
        }
        var includeLowers = !options || options.includeLowers !== false;
        var includeUppers = options && options.includeUppers === true;
        function addRange(ranges, newRange) {
            var i = 0, l = ranges.length;
            for (; i < l; ++i) {
                var range = ranges[i];
                if (cmp(newRange[0], range[1]) < 0 && cmp(newRange[1], range[0]) > 0) {
                    range[0] = min(range[0], newRange[0]);
                    range[1] = max(range[1], newRange[1]);
                    break;
                }
            }
            if (i === l)
                ranges.push(newRange);
            return ranges;
        }
        var sortDirection = ascending;
        function rangeSorter(a, b) { return sortDirection(a[0], b[0]); }
        var set;
        try {
            set = ranges.reduce(addRange, []);
            set.sort(rangeSorter);
        }
        catch (ex) {
            return fail(this, INVALID_KEY_ARGUMENT);
        }
        var rangePos = 0;
        var keyIsBeyondCurrentEntry = includeUppers ?
            function (key) { return ascending(key, set[rangePos][1]) > 0; } :
            function (key) { return ascending(key, set[rangePos][1]) >= 0; };
        var keyIsBeforeCurrentEntry = includeLowers ?
            function (key) { return descending(key, set[rangePos][0]) > 0; } :
            function (key) { return descending(key, set[rangePos][0]) >= 0; };
        function keyWithinCurrentRange(key) {
            return !keyIsBeyondCurrentEntry(key) && !keyIsBeforeCurrentEntry(key);
        }
        var checkKey = keyIsBeyondCurrentEntry;
        var c = new this.Collection(this, function () { return createRange(set[0][0], set[set.length - 1][1], !includeLowers, !includeUppers); });
        c._ondirectionchange = function (direction) {
            if (direction === "next") {
                checkKey = keyIsBeyondCurrentEntry;
                sortDirection = ascending;
            }
            else {
                checkKey = keyIsBeforeCurrentEntry;
                sortDirection = descending;
            }
            set.sort(rangeSorter);
        };
        c._addAlgorithm(function (cursor, advance, resolve) {
            var key = cursor.key;
            while (checkKey(key)) {
                ++rangePos;
                if (rangePos === set.length) {
                    advance(resolve);
                    return false;
                }
            }
            if (keyWithinCurrentRange(key)) {
                return true;
            }
            else if (_this._cmp(key, set[rangePos][1]) === 0 || _this._cmp(key, set[rangePos][0]) === 0) {
                return false;
            }
            else {
                advance(function () {
                    if (sortDirection === ascending)
                        cursor.continue(set[rangePos][0]);
                    else
                        cursor.continue(set[rangePos][1]);
                });
                return false;
            }
        });
        return c;
    };
    WhereClause.prototype.startsWithAnyOf = function () {
        var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
        if (!set.every(function (s) { return typeof s === 'string'; })) {
            return fail(this, "startsWithAnyOf() only works with strings");
        }
        if (set.length === 0)
            return emptyCollection(this);
        return this.inAnyRange(set.map(function (str) { return [str, str + maxString]; }));
    };
    return WhereClause;
}());

function createWhereClauseConstructor(db) {
    return makeClassConstructor(WhereClause.prototype, function WhereClause$$1(table, index, orCollection) {
        this.db = db;
        this._ctx = {
            table: table,
            index: index === ":id" ? null : index,
            or: orCollection
        };
        var indexedDB = db._deps.indexedDB;
        if (!indexedDB)
            throw new exceptions.MissingAPI("indexedDB API missing");
        this._cmp = this._ascending = indexedDB.cmp.bind(indexedDB);
        this._descending = function (a, b) { return indexedDB.cmp(b, a); };
        this._max = function (a, b) { return indexedDB.cmp(a, b) > 0 ? a : b; };
        this._min = function (a, b) { return indexedDB.cmp(a, b) < 0 ? a : b; };
        this._IDBKeyRange = db._deps.IDBKeyRange;
    });
}

function safariMultiStoreFix(storeNames) {
    return storeNames.length === 1 ? storeNames[0] : storeNames;
}

function getMaxKey(IdbKeyRange) {
    try {
        IdbKeyRange.only([[]]);
        return [[]];
    }
    catch (e) {
        return maxString;
    }
}

function eventRejectHandler(reject) {
    return wrap(function (event) {
        preventDefault(event);
        reject(event.target.error);
        return false;
    });
}



function preventDefault(event) {
    if (event.stopPropagation)
        event.stopPropagation();
    if (event.preventDefault)
        event.preventDefault();
}

var Transaction =               (function () {
    function Transaction() {
    }
    Transaction.prototype._lock = function () {
        assert(!PSD.global);
        ++this._reculock;
        if (this._reculock === 1 && !PSD.global)
            PSD.lockOwnerFor = this;
        return this;
    };
    Transaction.prototype._unlock = function () {
        assert(!PSD.global);
        if (--this._reculock === 0) {
            if (!PSD.global)
                PSD.lockOwnerFor = null;
            while (this._blockedFuncs.length > 0 && !this._locked()) {
                var fnAndPSD = this._blockedFuncs.shift();
                try {
                    usePSD(fnAndPSD[1], fnAndPSD[0]);
                }
                catch (e) { }
            }
        }
        return this;
    };
    Transaction.prototype._locked = function () {
        return this._reculock && PSD.lockOwnerFor !== this;
    };
    Transaction.prototype.create = function (idbtrans) {
        var _this = this;
        if (!this.mode)
            return this;
        var idbdb = this.db.idbdb;
        var dbOpenError = this.db._state.dbOpenError;
        assert(!this.idbtrans);
        if (!idbtrans && !idbdb) {
            switch (dbOpenError && dbOpenError.name) {
                case "DatabaseClosedError":
                    throw new exceptions.DatabaseClosed(dbOpenError);
                case "MissingAPIError":
                    throw new exceptions.MissingAPI(dbOpenError.message, dbOpenError);
                default:
                    throw new exceptions.OpenFailed(dbOpenError);
            }
        }
        if (!this.active)
            throw new exceptions.TransactionInactive();
        assert(this._completion._state === null);
        idbtrans = this.idbtrans = idbtrans || idbdb.transaction(safariMultiStoreFix(this.storeNames), this.mode);
        idbtrans.onerror = wrap(function (ev) {
            preventDefault(ev);
            _this._reject(idbtrans.error);
        });
        idbtrans.onabort = wrap(function (ev) {
            preventDefault(ev);
            _this.active && _this._reject(new exceptions.Abort(idbtrans.error));
            _this.active = false;
            _this.on("abort").fire(ev);
        });
        idbtrans.oncomplete = wrap(function () {
            _this.active = false;
            _this._resolve();
        });
        return this;
    };
    Transaction.prototype._promise = function (mode, fn, bWriteLock) {
        var _this = this;
        if (mode === 'readwrite' && this.mode !== 'readwrite')
            return rejection(new exceptions.ReadOnly("Transaction is readonly"));
        if (!this.active)
            return rejection(new exceptions.TransactionInactive());
        if (this._locked()) {
            return new DexiePromise(function (resolve, reject) {
                _this._blockedFuncs.push([function () {
                        _this._promise(mode, fn, bWriteLock).then(resolve, reject);
                    }, PSD]);
            });
        }
        else if (bWriteLock) {
            return newScope(function () {
                var p = new DexiePromise(function (resolve, reject) {
                    _this._lock();
                    var rv = fn(resolve, reject, _this);
                    if (rv && rv.then)
                        rv.then(resolve, reject);
                });
                p.finally(function () { return _this._unlock(); });
                p._lib = true;
                return p;
            });
        }
        else {
            var p = new DexiePromise(function (resolve, reject) {
                var rv = fn(resolve, reject, _this);
                if (rv && rv.then)
                    rv.then(resolve, reject);
            });
            p._lib = true;
            return p;
        }
    };
    Transaction.prototype._root = function () {
        return this.parent ? this.parent._root() : this;
    };
    Transaction.prototype.waitFor = function (promiseLike) {
        var root = this._root();
        var promise = DexiePromise.resolve(promiseLike);
        if (root._waitingFor) {
            root._waitingFor = root._waitingFor.then(function () { return promise; });
        }
        else {
            root._waitingFor = promise;
            root._waitingQueue = [];
            var store = root.idbtrans.objectStore(root.storeNames[0]);
            (function spin() {
                ++root._spinCount;
                while (root._waitingQueue.length)
                    (root._waitingQueue.shift())();
                if (root._waitingFor)
                    store.get(-Infinity).onsuccess = spin;
            }());
        }
        var currentWaitPromise = root._waitingFor;
        return new DexiePromise(function (resolve, reject) {
            promise.then(function (res) { return root._waitingQueue.push(wrap(resolve.bind(null, res))); }, function (err) { return root._waitingQueue.push(wrap(reject.bind(null, err))); }).finally(function () {
                if (root._waitingFor === currentWaitPromise) {
                    root._waitingFor = null;
                }
            });
        });
    };
    Transaction.prototype.abort = function () {
        this.active && this._reject(new exceptions.Abort());
        this.active = false;
    };
    Transaction.prototype.table = function (tableName) {
        var memoizedTables = (this._memoizedTables || (this._memoizedTables = {}));
        if (hasOwn(memoizedTables, tableName))
            return memoizedTables[tableName];
        var tableSchema = this.schema[tableName];
        if (!tableSchema) {
            throw new exceptions.NotFound("Table " + tableName + " not part of transaction");
        }
        var transactionBoundTable = new this.db.Table(tableName, tableSchema, this);
        transactionBoundTable.core = this.db.core.table(tableName);
        memoizedTables[tableName] = transactionBoundTable;
        return transactionBoundTable;
    };
    return Transaction;
}());

function createTransactionConstructor(db) {
    return makeClassConstructor(Transaction.prototype, function Transaction$$1(mode, storeNames, dbschema, parent) {
        var _this = this;
        this.db = db;
        this.mode = mode;
        this.storeNames = storeNames;
        this.schema = dbschema;
        this.idbtrans = null;
        this.on = Events(this, "complete", "error", "abort");
        this.parent = parent || null;
        this.active = true;
        this._reculock = 0;
        this._blockedFuncs = [];
        this._resolve = null;
        this._reject = null;
        this._waitingFor = null;
        this._waitingQueue = null;
        this._spinCount = 0;
        this._completion = new DexiePromise(function (resolve, reject) {
            _this._resolve = resolve;
            _this._reject = reject;
        });
        this._completion.then(function () {
            _this.active = false;
            _this.on.complete.fire();
        }, function (e) {
            var wasActive = _this.active;
            _this.active = false;
            _this.on.error.fire(e);
            _this.parent ?
                _this.parent._reject(e) :
                wasActive && _this.idbtrans && _this.idbtrans.abort();
            return rejection(e);
        });
    });
}

function createIndexSpec(name, keyPath, unique, multi, auto, compound, isPrimKey) {
    return {
        name: name,
        keyPath: keyPath,
        unique: unique,
        multi: multi,
        auto: auto,
        compound: compound,
        src: (unique && !isPrimKey ? '&' : '') + (multi ? '*' : '') + (auto ? "++" : "") + nameFromKeyPath(keyPath)
    };
}
function nameFromKeyPath(keyPath) {
    return typeof keyPath === 'string' ?
        keyPath :
        keyPath ? ('[' + [].join.call(keyPath, '+') + ']') : "";
}

function createTableSchema(name, primKey, indexes) {
    return {
        name: name,
        primKey: primKey,
        indexes: indexes,
        mappedClass: null,
        idxByName: arrayToObject(indexes, function (index) { return [index.name, index]; })
    };
}

function getKeyExtractor(keyPath) {
    if (keyPath == null) {
        return function () { return undefined; };
    }
    else if (typeof keyPath === 'string') {
        return getSinglePathKeyExtractor(keyPath);
    }
    else {
        return function (obj) { return getByKeyPath(obj, keyPath); };
    }
}
function getSinglePathKeyExtractor(keyPath) {
    var split = keyPath.split('.');
    if (split.length === 1) {
        return function (obj) { return obj[keyPath]; };
    }
    else {
        return function (obj) { return getByKeyPath(obj, keyPath); };
    }
}

function getEffectiveKeys(primaryKey, req) {
    if (req.type === 'delete')
        return req.keys;
    return req.keys || req.values.map(primaryKey.extractKey);
}
function getExistingValues(table, req, effectiveKeys) {
    return req.type === 'add' ? Promise.resolve(new Array(req.values.length)) :
        table.getMany({ trans: req.trans, keys: effectiveKeys });
}

function arrayify(arrayLike) {
    return [].slice.call(arrayLike);
}

var _id_counter = 0;
function getKeyPathAlias(keyPath) {
    return keyPath == null ?
        ":id" :
        typeof keyPath === 'string' ?
            keyPath :
            "[" + keyPath.join('+') + "]";
}
function createDBCore(db, indexedDB, IdbKeyRange, tmpTrans) {
    var cmp = indexedDB.cmp.bind(indexedDB);
    function extractSchema(db, trans) {
        var tables = arrayify(db.objectStoreNames);
        return {
            schema: {
                name: db.name,
                tables: tables.map(function (table) { return trans.objectStore(table); }).map(function (store) {
                    var keyPath = store.keyPath, autoIncrement = store.autoIncrement;
                    var compound = isArray(keyPath);
                    var outbound = keyPath == null;
                    var indexByKeyPath = {};
                    var result = {
                        name: store.name,
                        primaryKey: {
                            name: null,
                            isPrimaryKey: true,
                            outbound: outbound,
                            compound: compound,
                            keyPath: keyPath,
                            autoIncrement: autoIncrement,
                            unique: true,
                            extractKey: getKeyExtractor(keyPath)
                        },
                        indexes: arrayify(store.indexNames).map(function (indexName) { return store.index(indexName); })
                            .map(function (index) {
                            var name = index.name, unique = index.unique, multiEntry = index.multiEntry, keyPath = index.keyPath;
                            var compound = isArray(keyPath);
                            var result = {
                                name: name,
                                compound: compound,
                                keyPath: keyPath,
                                unique: unique,
                                multiEntry: multiEntry,
                                extractKey: getKeyExtractor(keyPath)
                            };
                            indexByKeyPath[getKeyPathAlias(keyPath)] = result;
                            return result;
                        }),
                        getIndexByKeyPath: function (keyPath) { return indexByKeyPath[getKeyPathAlias(keyPath)]; }
                    };
                    indexByKeyPath[":id"] = result.primaryKey;
                    if (keyPath != null) {
                        indexByKeyPath[getKeyPathAlias(keyPath)] = result.primaryKey;
                    }
                    return result;
                })
            },
            hasGetAll: tables.length > 0 && ('getAll' in trans.objectStore(tables[0])) &&
                !(typeof navigator !== 'undefined' && /Safari/.test(navigator.userAgent) &&
                    !/(Chrome\/|Edge\/)/.test(navigator.userAgent) &&
                    [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604)
        };
    }
    function makeIDBKeyRange(range) {
        if (range.type === 3          )
            return null;
        if (range.type === 4            )
            throw new Error("Cannot convert never type to IDBKeyRange");
        var lower = range.lower, upper = range.upper, lowerOpen = range.lowerOpen, upperOpen = range.upperOpen;
        var idbRange = lower === undefined ?
            upper === undefined ?
                null :
                IdbKeyRange.upperBound(upper, !!upperOpen) :
            upper === undefined ?
                IdbKeyRange.lowerBound(lower, !!lowerOpen) :
                IdbKeyRange.bound(lower, upper, !!lowerOpen, !!upperOpen);
        return idbRange;
    }
    function createDbCoreTable(tableSchema) {
        var tableName = tableSchema.name;
        function mutate(_a) {
            var trans = _a.trans, type = _a.type, keys$$1 = _a.keys, values = _a.values, range = _a.range, wantResults = _a.wantResults;
            return new Promise(function (resolve, reject) {
                resolve = wrap(resolve);
                var store = trans.objectStore(tableName);
                var outbound = store.keyPath == null;
                var isAddOrPut = type === "put" || type === "add";
                if (!isAddOrPut && type !== 'delete' && type !== 'deleteRange')
                    throw new Error("Invalid operation type: " + type);
                var length = (keys$$1 || values || { length: 1 }).length;
                if (keys$$1 && values && keys$$1.length !== values.length) {
                    throw new Error("Given keys array must have same length as given values array.");
                }
                if (length === 0)
                    return resolve({ numFailures: 0, failures: {}, results: [], lastResult: undefined });
                var results = wantResults && __spreadArrays((keys$$1 ?
                    keys$$1 :
                    getEffectiveKeys(tableSchema.primaryKey, { type: type, keys: keys$$1, values: values })));
                var req;
                var failures = [];
                var numFailures = 0;
                var errorHandler = function (event) {
                    ++numFailures;
                    preventDefault(event);
                    if (results)
                        results[event.target._reqno] = undefined;
                    failures[event.target._reqno] = event.target.error;
                };
                var setResult = function (_a) {
                    var target = _a.target;
                    results[target._reqno] = target.result;
                };
                if (type === 'deleteRange') {
                    if (range.type === 4            )
                        return resolve({ numFailures: numFailures, failures: failures, results: results, lastResult: undefined });
                    if (range.type === 3          )
                        req = store.clear();
                    else
                        req = store.delete(makeIDBKeyRange(range));
                }
                else {
                    var _a = isAddOrPut ?
                        outbound ?
                            [values, keys$$1] :
                            [values, null] :
                        [keys$$1, null], args1 = _a[0], args2 = _a[1];
                    if (isAddOrPut) {
                        for (var i = 0; i < length; ++i) {
                            req = (args2 && args2[i] !== undefined ?
                                store[type](args1[i], args2[i]) :
                                store[type](args1[i]));
                            req._reqno = i;
                            if (results && results[i] === undefined) {
                                req.onsuccess = setResult;
                            }
                            req.onerror = errorHandler;
                        }
                    }
                    else {
                        for (var i = 0; i < length; ++i) {
                            req = store[type](args1[i]);
                            req._reqno = i;
                            req.onerror = errorHandler;
                        }
                    }
                }
                var done = function (event) {
                    var lastResult = event.target.result;
                    if (results)
                        results[length - 1] = lastResult;
                    resolve({
                        numFailures: numFailures,
                        failures: failures,
                        results: results,
                        lastResult: lastResult
                    });
                };
                req.onerror = function (event) {
                    errorHandler(event);
                    done(event);
                };
                req.onsuccess = done;
            });
        }
        function openCursor(_a) {
            var trans = _a.trans, values = _a.values, query = _a.query, reverse = _a.reverse, unique = _a.unique;
            return new Promise(function (resolve, reject) {
                resolve = wrap(resolve);
                var index = query.index, range = query.range;
                var store = trans.objectStore(tableName);
                var source = index.isPrimaryKey ?
                    store :
                    store.index(index.name);
                var direction = reverse ?
                    unique ?
                        "prevunique" :
                        "prev" :
                    unique ?
                        "nextunique" :
                        "next";
                var req = values || !('openKeyCursor' in source) ?
                    source.openCursor(makeIDBKeyRange(range), direction) :
                    source.openKeyCursor(makeIDBKeyRange(range), direction);
                req.onerror = eventRejectHandler(reject);
                req.onsuccess = wrap(function (ev) {
                    var cursor = req.result;
                    if (!cursor) {
                        resolve(null);
                        return;
                    }
                    cursor.___id = ++_id_counter;
                    cursor.done = false;
                    var _cursorContinue = cursor.continue.bind(cursor);
                    var _cursorContinuePrimaryKey = cursor.continuePrimaryKey;
                    if (_cursorContinuePrimaryKey)
                        _cursorContinuePrimaryKey = _cursorContinuePrimaryKey.bind(cursor);
                    var _cursorAdvance = cursor.advance.bind(cursor);
                    var doThrowCursorIsNotStarted = function () { throw new Error("Cursor not started"); };
                    var doThrowCursorIsStopped = function () { throw new Error("Cursor not stopped"); };
                    cursor.trans = trans;
                    cursor.stop = cursor.continue = cursor.continuePrimaryKey = cursor.advance = doThrowCursorIsNotStarted;
                    cursor.fail = wrap(reject);
                    cursor.next = function () {
                        var _this = this;
                        var gotOne = 1;
                        return this.start(function () { return gotOne-- ? _this.continue() : _this.stop(); }).then(function () { return _this; });
                    };
                    cursor.start = function (callback) {
                        var iterationPromise = new Promise(function (resolveIteration, rejectIteration) {
                            resolveIteration = wrap(resolveIteration);
                            req.onerror = eventRejectHandler(rejectIteration);
                            cursor.fail = rejectIteration;
                            cursor.stop = function (value) {
                                cursor.stop = cursor.continue = cursor.continuePrimaryKey = cursor.advance = doThrowCursorIsStopped;
                                resolveIteration(value);
                            };
                        });
                        var guardedCallback = function () {
                            if (req.result) {
                                try {
                                    callback();
                                }
                                catch (err) {
                                    cursor.fail(err);
                                }
                            }
                            else {
                                cursor.done = true;
                                cursor.start = function () { throw new Error("Cursor behind last entry"); };
                                cursor.stop();
                            }
                        };
                        req.onsuccess = wrap(function (ev) {
                            req.onsuccess = guardedCallback;
                            guardedCallback();
                        });
                        cursor.continue = _cursorContinue;
                        cursor.continuePrimaryKey = _cursorContinuePrimaryKey;
                        cursor.advance = _cursorAdvance;
                        guardedCallback();
                        return iterationPromise;
                    };
                    resolve(cursor);
                }, reject);
            });
        }
        function query(hasGetAll) {
            return function (request) {
                return new Promise(function (resolve, reject) {
                    resolve = wrap(resolve);
                    var trans = request.trans, values = request.values, limit = request.limit, query = request.query;
                    var nonInfinitLimit = limit === Infinity ? undefined : limit;
                    var index = query.index, range = query.range;
                    var store = trans.objectStore(tableName);
                    var source = index.isPrimaryKey ? store : store.index(index.name);
                    var idbKeyRange = makeIDBKeyRange(range);
                    if (limit === 0)
                        return resolve({ result: [] });
                    if (hasGetAll) {
                        var req = values ?
                            source.getAll(idbKeyRange, nonInfinitLimit) :
                            source.getAllKeys(idbKeyRange, nonInfinitLimit);
                        req.onsuccess = function (event) { return resolve({ result: event.target.result }); };
                        req.onerror = eventRejectHandler(reject);
                    }
                    else {
                        var count_1 = 0;
                        var req_1 = values || !('openKeyCursor' in source) ?
                            source.openCursor(idbKeyRange) :
                            source.openKeyCursor(idbKeyRange);
                        var result_1 = [];
                        req_1.onsuccess = function (event) {
                            var cursor = req_1.result;
                            if (!cursor)
                                return resolve({ result: result_1 });
                            result_1.push(values ? cursor.value : cursor.primaryKey);
                            if (++count_1 === limit)
                                return resolve({ result: result_1 });
                            cursor.continue();
                        };
                        req_1.onerror = eventRejectHandler(reject);
                    }
                });
            };
        }
        return {
            name: tableName,
            schema: tableSchema,
            mutate: mutate,
            getMany: function (_a) {
                var trans = _a.trans, keys$$1 = _a.keys;
                return new Promise(function (resolve, reject) {
                    resolve = wrap(resolve);
                    var store = trans.objectStore(tableName);
                    var length = keys$$1.length;
                    var result = new Array(length);
                    var keyCount = 0;
                    var callbackCount = 0;
                    var valueCount = 0;
                    var req;
                    var successHandler = function (event) {
                        var req = event.target;
                        if ((result[req._pos] = req.result) != null)
                            ++valueCount;
                        if (++callbackCount === keyCount)
                            resolve(result);
                    };
                    var errorHandler = eventRejectHandler(reject);
                    for (var i = 0; i < length; ++i) {
                        var key = keys$$1[i];
                        if (key != null) {
                            req = store.get(keys$$1[i]);
                            req._pos = i;
                            req.onsuccess = successHandler;
                            req.onerror = errorHandler;
                            ++keyCount;
                        }
                    }
                    if (keyCount === 0)
                        resolve(result);
                });
            },
            get: function (_a) {
                var trans = _a.trans, key = _a.key;
                return new Promise(function (resolve, reject) {
                    resolve = wrap(resolve);
                    var store = trans.objectStore(tableName);
                    var req = store.get(key);
                    req.onsuccess = function (event) { return resolve(event.target.result); };
                    req.onerror = eventRejectHandler(reject);
                });
            },
            query: query(hasGetAll),
            openCursor: openCursor,
            count: function (_a) {
                var query = _a.query, trans = _a.trans;
                var index = query.index, range = query.range;
                return new Promise(function (resolve, reject) {
                    var store = trans.objectStore(tableName);
                    var source = index.isPrimaryKey ? store : store.index(index.name);
                    var idbKeyRange = makeIDBKeyRange(range);
                    var req = idbKeyRange ? source.count(idbKeyRange) : source.count();
                    req.onsuccess = wrap(function (ev) { return resolve(ev.target.result); });
                    req.onerror = eventRejectHandler(reject);
                });
            }
        };
    }
    var _a = extractSchema(db, tmpTrans), schema = _a.schema, hasGetAll = _a.hasGetAll;
    var tables = schema.tables.map(function (tableSchema) { return createDbCoreTable(tableSchema); });
    var tableMap = {};
    tables.forEach(function (table) { return tableMap[table.name] = table; });
    return {
        stack: "dbcore",
        transaction: db.transaction.bind(db),
        table: function (name) {
            var result = tableMap[name];
            if (!result)
                throw new Error("Table '" + name + "' not found");
            return tableMap[name];
        },
        cmp: cmp,
        MIN_KEY: -Infinity,
        MAX_KEY: getMaxKey(IdbKeyRange),
        schema: schema
    };
}

function createMiddlewareStack(stackImpl, middlewares) {
    return middlewares.reduce(function (down, _a) {
        var create = _a.create;
        return (__assign(__assign({}, down), create(down)));
    }, stackImpl);
}
function createMiddlewareStacks(middlewares, idbdb, _a, tmpTrans) {
    var IDBKeyRange = _a.IDBKeyRange, indexedDB = _a.indexedDB;
    var dbcore = createMiddlewareStack(createDBCore(idbdb, indexedDB, IDBKeyRange, tmpTrans), middlewares.dbcore);
    return {
        dbcore: dbcore
    };
}
function generateMiddlewareStacks(db, tmpTrans) {
    var idbdb = tmpTrans.db;
    var stacks = createMiddlewareStacks(db._middlewares, idbdb, db._deps, tmpTrans);
    db.core = stacks.dbcore;
    db.tables.forEach(function (table) {
        var tableName = table.name;
        if (db.core.schema.tables.some(function (tbl) { return tbl.name === tableName; })) {
            table.core = db.core.table(tableName);
            if (db[tableName] instanceof db.Table) {
                db[tableName].core = table.core;
            }
        }
    });
}

function setApiOnPlace(db, objs, tableNames, dbschema) {
    tableNames.forEach(function (tableName) {
        var schema = dbschema[tableName];
        objs.forEach(function (obj) {
            if (!(tableName in obj)) {
                if (obj === db.Transaction.prototype || obj instanceof db.Transaction) {
                    setProp(obj, tableName, {
                        get: function () { return this.table(tableName); },
                        set: function (value) {
                            defineProperty(this, tableName, { value: value, writable: true, configurable: true, enumerable: true });
                        }
                    });
                }
                else {
                    obj[tableName] = new db.Table(tableName, schema);
                }
            }
        });
    });
}
function removeTablesApi(db, objs) {
    objs.forEach(function (obj) {
        for (var key in obj) {
            if (obj[key] instanceof db.Table)
                delete obj[key];
        }
    });
}
function lowerVersionFirst(a, b) {
    return a._cfg.version - b._cfg.version;
}
function runUpgraders(db, oldVersion, idbUpgradeTrans, reject) {
    var globalSchema = db._dbSchema;
    var trans = db._createTransaction('readwrite', db._storeNames, globalSchema);
    trans.create(idbUpgradeTrans);
    trans._completion.catch(reject);
    var rejectTransaction = trans._reject.bind(trans);
    var transless = PSD.transless || PSD;
    newScope(function () {
        PSD.trans = trans;
        PSD.transless = transless;
        if (oldVersion === 0) {
            keys(globalSchema).forEach(function (tableName) {
                createTable(idbUpgradeTrans, tableName, globalSchema[tableName].primKey, globalSchema[tableName].indexes);
            });
            generateMiddlewareStacks(db, idbUpgradeTrans);
            DexiePromise.follow(function () { return db.on.populate.fire(trans); }).catch(rejectTransaction);
        }
        else
            updateTablesAndIndexes(db, oldVersion, trans, idbUpgradeTrans).catch(rejectTransaction);
    });
}
function updateTablesAndIndexes(db, oldVersion, trans, idbUpgradeTrans) {
    var queue = [];
    var versions = db._versions;
    var globalSchema = db._dbSchema = buildGlobalSchema(db, db.idbdb, idbUpgradeTrans);
    var anyContentUpgraderHasRun = false;
    var versToRun = versions.filter(function (v) { return v._cfg.version >= oldVersion; });
    versToRun.forEach(function (version) {
        queue.push(function () {
            var oldSchema = globalSchema;
            var newSchema = version._cfg.dbschema;
            adjustToExistingIndexNames(db, oldSchema, idbUpgradeTrans);
            adjustToExistingIndexNames(db, newSchema, idbUpgradeTrans);
            globalSchema = db._dbSchema = newSchema;
            var diff = getSchemaDiff(oldSchema, newSchema);
            diff.add.forEach(function (tuple) {
                createTable(idbUpgradeTrans, tuple[0], tuple[1].primKey, tuple[1].indexes);
            });
            diff.change.forEach(function (change) {
                if (change.recreate) {
                    throw new exceptions.Upgrade("Not yet support for changing primary key");
                }
                else {
                    var store_1 = idbUpgradeTrans.objectStore(change.name);
                    change.add.forEach(function (idx) { return addIndex(store_1, idx); });
                    change.change.forEach(function (idx) {
                        store_1.deleteIndex(idx.name);
                        addIndex(store_1, idx);
                    });
                    change.del.forEach(function (idxName) { return store_1.deleteIndex(idxName); });
                }
            });
            var contentUpgrade = version._cfg.contentUpgrade;
            if (contentUpgrade && version._cfg.version > oldVersion) {
                generateMiddlewareStacks(db, idbUpgradeTrans);
                anyContentUpgraderHasRun = true;
                var upgradeSchema_1 = shallowClone(newSchema);
                diff.del.forEach(function (table) {
                    upgradeSchema_1[table] = oldSchema[table];
                });
                removeTablesApi(db, [db.Transaction.prototype]);
                setApiOnPlace(db, [db.Transaction.prototype], keys(upgradeSchema_1), upgradeSchema_1);
                trans.schema = upgradeSchema_1;
                var contentUpgradeIsAsync_1 = isAsyncFunction(contentUpgrade);
                if (contentUpgradeIsAsync_1) {
                    incrementExpectedAwaits();
                }
                var returnValue_1;
                var promiseFollowed = DexiePromise.follow(function () {
                    returnValue_1 = contentUpgrade(trans);
                    if (returnValue_1) {
                        if (contentUpgradeIsAsync_1) {
                            var decrementor = decrementExpectedAwaits.bind(null, null);
                            returnValue_1.then(decrementor, decrementor);
                        }
                    }
                });
                return (returnValue_1 && typeof returnValue_1.then === 'function' ?
                    DexiePromise.resolve(returnValue_1) : promiseFollowed.then(function () { return returnValue_1; }));
            }
        });
        queue.push(function (idbtrans) {
            if (!anyContentUpgraderHasRun || !hasIEDeleteObjectStoreBug) {
                var newSchema = version._cfg.dbschema;
                deleteRemovedTables(newSchema, idbtrans);
            }
            removeTablesApi(db, [db.Transaction.prototype]);
            setApiOnPlace(db, [db.Transaction.prototype], db._storeNames, db._dbSchema);
            trans.schema = db._dbSchema;
        });
    });
    function runQueue() {
        return queue.length ? DexiePromise.resolve(queue.shift()(trans.idbtrans)).then(runQueue) :
            DexiePromise.resolve();
    }
    return runQueue().then(function () {
        createMissingTables(globalSchema, idbUpgradeTrans);
    });
}
function getSchemaDiff(oldSchema, newSchema) {
    var diff = {
        del: [],
        add: [],
        change: []
    };
    var table;
    for (table in oldSchema) {
        if (!newSchema[table])
            diff.del.push(table);
    }
    for (table in newSchema) {
        var oldDef = oldSchema[table], newDef = newSchema[table];
        if (!oldDef) {
            diff.add.push([table, newDef]);
        }
        else {
            var change = {
                name: table,
                def: newDef,
                recreate: false,
                del: [],
                add: [],
                change: []
            };
            if (oldDef.primKey.src !== newDef.primKey.src &&
                !isIEOrEdge
            ) {
                change.recreate = true;
                diff.change.push(change);
            }
            else {
                var oldIndexes = oldDef.idxByName;
                var newIndexes = newDef.idxByName;
                var idxName = void 0;
                for (idxName in oldIndexes) {
                    if (!newIndexes[idxName])
                        change.del.push(idxName);
                }
                for (idxName in newIndexes) {
                    var oldIdx = oldIndexes[idxName], newIdx = newIndexes[idxName];
                    if (!oldIdx)
                        change.add.push(newIdx);
                    else if (oldIdx.src !== newIdx.src)
                        change.change.push(newIdx);
                }
                if (change.del.length > 0 || change.add.length > 0 || change.change.length > 0) {
                    diff.change.push(change);
                }
            }
        }
    }
    return diff;
}
function createTable(idbtrans, tableName, primKey, indexes) {
    var store = idbtrans.db.createObjectStore(tableName, primKey.keyPath ?
        { keyPath: primKey.keyPath, autoIncrement: primKey.auto } :
        { autoIncrement: primKey.auto });
    indexes.forEach(function (idx) { return addIndex(store, idx); });
    return store;
}
function createMissingTables(newSchema, idbtrans) {
    keys(newSchema).forEach(function (tableName) {
        if (!idbtrans.db.objectStoreNames.contains(tableName)) {
            createTable(idbtrans, tableName, newSchema[tableName].primKey, newSchema[tableName].indexes);
        }
    });
}
function deleteRemovedTables(newSchema, idbtrans) {
    for (var i = 0; i < idbtrans.db.objectStoreNames.length; ++i) {
        var storeName = idbtrans.db.objectStoreNames[i];
        if (newSchema[storeName] == null) {
            idbtrans.db.deleteObjectStore(storeName);
        }
    }
}
function addIndex(store, idx) {
    store.createIndex(idx.name, idx.keyPath, { unique: idx.unique, multiEntry: idx.multi });
}
function buildGlobalSchema(db, idbdb, tmpTrans) {
    var globalSchema = {};
    var dbStoreNames = slice(idbdb.objectStoreNames, 0);
    dbStoreNames.forEach(function (storeName) {
        var store = tmpTrans.objectStore(storeName);
        var keyPath = store.keyPath;
        var primKey = createIndexSpec(nameFromKeyPath(keyPath), keyPath || "", false, false, !!store.autoIncrement, keyPath && typeof keyPath !== "string", true);
        var indexes = [];
        for (var j = 0; j < store.indexNames.length; ++j) {
            var idbindex = store.index(store.indexNames[j]);
            keyPath = idbindex.keyPath;
            var index = createIndexSpec(idbindex.name, keyPath, !!idbindex.unique, !!idbindex.multiEntry, false, keyPath && typeof keyPath !== "string", false);
            indexes.push(index);
        }
        globalSchema[storeName] = createTableSchema(storeName, primKey, indexes);
    });
    return globalSchema;
}
function readGlobalSchema(db, idbdb, tmpTrans) {
    db.verno = idbdb.version / 10;
    var globalSchema = db._dbSchema = buildGlobalSchema(db, idbdb, tmpTrans);
    db._storeNames = slice(idbdb.objectStoreNames, 0);
    setApiOnPlace(db, [db._allTables], keys(globalSchema), globalSchema);
}
function adjustToExistingIndexNames(db, schema, idbtrans) {
    var storeNames = idbtrans.db.objectStoreNames;
    for (var i = 0; i < storeNames.length; ++i) {
        var storeName = storeNames[i];
        var store = idbtrans.objectStore(storeName);
        db._hasGetAll = 'getAll' in store;
        for (var j = 0; j < store.indexNames.length; ++j) {
            var indexName = store.indexNames[j];
            var keyPath = store.index(indexName).keyPath;
            var dexieName = typeof keyPath === 'string' ? keyPath : "[" + slice(keyPath).join('+') + "]";
            if (schema[storeName]) {
                var indexSpec = schema[storeName].idxByName[dexieName];
                if (indexSpec) {
                    indexSpec.name = indexName;
                    delete schema[storeName].idxByName[dexieName];
                    schema[storeName].idxByName[indexName] = indexSpec;
                }
            }
        }
    }
    if (typeof navigator !== 'undefined' && /Safari/.test(navigator.userAgent) &&
        !/(Chrome\/|Edge\/)/.test(navigator.userAgent) &&
        _global.WorkerGlobalScope && _global instanceof _global.WorkerGlobalScope &&
        [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604) {
        db._hasGetAll = false;
    }
}
function parseIndexSyntax(primKeyAndIndexes) {
    return primKeyAndIndexes.split(',').map(function (index, indexNum) {
        index = index.trim();
        var name = index.replace(/([&*]|\+\+)/g, "");
        var keyPath = /^\[/.test(name) ? name.match(/^\[(.*)\]$/)[1].split('+') : name;
        return createIndexSpec(name, keyPath || null, /\&/.test(index), /\*/.test(index), /\+\+/.test(index), isArray(keyPath), indexNum === 0);
    });
}

var Version =               (function () {
    function Version() {
    }
    Version.prototype._parseStoresSpec = function (stores, outSchema) {
        keys(stores).forEach(function (tableName) {
            if (stores[tableName] !== null) {
                var indexes = parseIndexSyntax(stores[tableName]);
                var primKey = indexes.shift();
                if (primKey.multi)
                    throw new exceptions.Schema("Primary key cannot be multi-valued");
                indexes.forEach(function (idx) {
                    if (idx.auto)
                        throw new exceptions.Schema("Only primary key can be marked as autoIncrement (++)");
                    if (!idx.keyPath)
                        throw new exceptions.Schema("Index must have a name and cannot be an empty string");
                });
                outSchema[tableName] = createTableSchema(tableName, primKey, indexes);
            }
        });
    };
    Version.prototype.stores = function (stores) {
        var db = this.db;
        this._cfg.storesSource = this._cfg.storesSource ?
            extend(this._cfg.storesSource, stores) :
            stores;
        var versions = db._versions;
        var storesSpec = {};
        var dbschema = {};
        versions.forEach(function (version) {
            extend(storesSpec, version._cfg.storesSource);
            dbschema = (version._cfg.dbschema = {});
            version._parseStoresSpec(storesSpec, dbschema);
        });
        db._dbSchema = dbschema;
        removeTablesApi(db, [db._allTables, db, db.Transaction.prototype]);
        setApiOnPlace(db, [db._allTables, db, db.Transaction.prototype, this._cfg.tables], keys(dbschema), dbschema);
        db._storeNames = keys(dbschema);
        return this;
    };
    Version.prototype.upgrade = function (upgradeFunction) {
        this._cfg.contentUpgrade = upgradeFunction;
        return this;
    };
    return Version;
}());

function createVersionConstructor(db) {
    return makeClassConstructor(Version.prototype, function Version$$1(versionNumber) {
        this.db = db;
        this._cfg = {
            version: versionNumber,
            storesSource: null,
            dbschema: {},
            tables: {},
            contentUpgrade: null
        };
    });
}

var databaseEnumerator;
function DatabaseEnumerator(indexedDB) {
    var hasDatabasesNative = indexedDB && typeof indexedDB.databases === 'function';
    var dbNamesTable;
    if (!hasDatabasesNative) {
        var db = new Dexie(DBNAMES_DB, { addons: [] });
        db.version(1).stores({ dbnames: 'name' });
        dbNamesTable = db.table('dbnames');
    }
    return {
        getDatabaseNames: function () {
            return hasDatabasesNative
                ?
                    DexiePromise.resolve(indexedDB.databases()).then(function (infos) { return infos
                        .map(function (info) { return info.name; })
                        .filter(function (name) { return name !== DBNAMES_DB; }); })
                :
                    dbNamesTable.toCollection().primaryKeys();
        },
        add: function (name) {
            return !hasDatabasesNative && name !== DBNAMES_DB && dbNamesTable.put({ name: name }).catch(nop);
        },
        remove: function (name) {
            return !hasDatabasesNative && name !== DBNAMES_DB && dbNamesTable.delete(name).catch(nop);
        }
    };
}
function initDatabaseEnumerator(indexedDB) {
    try {
        databaseEnumerator = DatabaseEnumerator(indexedDB);
    }
    catch (e) { }
}

function vip(fn) {
    return newScope(function () {
        PSD.letThrough = true;
        return fn();
    });
}

function dexieOpen(db) {
    var state = db._state;
    var indexedDB = db._deps.indexedDB;
    if (state.isBeingOpened || db.idbdb)
        return state.dbReadyPromise.then(function () { return state.dbOpenError ?
            rejection(state.dbOpenError) :
            db; });
    debug && (state.openCanceller._stackHolder = getErrorWithStack());
    state.isBeingOpened = true;
    state.dbOpenError = null;
    state.openComplete = false;
    var resolveDbReady = state.dbReadyResolve,
    upgradeTransaction = null;
    return DexiePromise.race([state.openCanceller, new DexiePromise(function (resolve, reject) {
            if (!indexedDB)
                throw new exceptions.MissingAPI("indexedDB API not found. If using IE10+, make sure to run your code on a server URL " +
                    "(not locally). If using old Safari versions, make sure to include indexedDB polyfill.");
            var dbName = db.name;
            var req = state.autoSchema ?
                indexedDB.open(dbName) :
                indexedDB.open(dbName, Math.round(db.verno * 10));
            if (!req)
                throw new exceptions.MissingAPI("IndexedDB API not available");
            req.onerror = eventRejectHandler(reject);
            req.onblocked = wrap(db._fireOnBlocked);
            req.onupgradeneeded = wrap(function (e) {
                upgradeTransaction = req.transaction;
                if (state.autoSchema && !db._options.allowEmptyDB) {
                    req.onerror = preventDefault;
                    upgradeTransaction.abort();
                    req.result.close();
                    var delreq = indexedDB.deleteDatabase(dbName);
                    delreq.onsuccess = delreq.onerror = wrap(function () {
                        reject(new exceptions.NoSuchDatabase("Database " + dbName + " doesnt exist"));
                    });
                }
                else {
                    upgradeTransaction.onerror = eventRejectHandler(reject);
                    var oldVer = e.oldVersion > Math.pow(2, 62) ? 0 : e.oldVersion;
                    db.idbdb = req.result;
                    runUpgraders(db, oldVer / 10, upgradeTransaction, reject);
                }
            }, reject);
            req.onsuccess = wrap(function () {
                upgradeTransaction = null;
                var idbdb = db.idbdb = req.result;
                var objectStoreNames = slice(idbdb.objectStoreNames);
                if (objectStoreNames.length > 0)
                    try {
                        var tmpTrans = idbdb.transaction(safariMultiStoreFix(objectStoreNames), 'readonly');
                        if (state.autoSchema)
                            readGlobalSchema(db, idbdb, tmpTrans);
                        else
                            adjustToExistingIndexNames(db, db._dbSchema, tmpTrans);
                        generateMiddlewareStacks(db, tmpTrans);
                    }
                    catch (e) {
                    }
                connections.push(db);
                idbdb.onversionchange = wrap(function (ev) {
                    state.vcFired = true;
                    db.on("versionchange").fire(ev);
                });
                databaseEnumerator.add(dbName);
                resolve();
            }, reject);
        })]).then(function () {
        state.onReadyBeingFired = [];
        return DexiePromise.resolve(vip(db.on.ready.fire)).then(function fireRemainders() {
            if (state.onReadyBeingFired.length > 0) {
                var remainders = state.onReadyBeingFired.reduce(promisableChain, nop);
                state.onReadyBeingFired = [];
                return DexiePromise.resolve(vip(remainders)).then(fireRemainders);
            }
        });
    }).finally(function () {
        state.onReadyBeingFired = null;
    }).then(function () {
        state.isBeingOpened = false;
        return db;
    }).catch(function (err) {
        try {
            upgradeTransaction && upgradeTransaction.abort();
        }
        catch (e) { }
        state.isBeingOpened = false;
        db.close();
        state.dbOpenError = err;
        return rejection(state.dbOpenError);
    }).finally(function () {
        state.openComplete = true;
        resolveDbReady();
    });
}

function awaitIterator(iterator) {
    var callNext = function (result) { return iterator.next(result); }, doThrow = function (error) { return iterator.throw(error); }, onSuccess = step(callNext), onError = step(doThrow);
    function step(getNext) {
        return function (val) {
            var next = getNext(val), value = next.value;
            return next.done ? value :
                (!value || typeof value.then !== 'function' ?
                    isArray(value) ? Promise.all(value).then(onSuccess, onError) : onSuccess(value) :
                    value.then(onSuccess, onError));
        };
    }
    return step(callNext)();
}

function extractTransactionArgs(mode, _tableArgs_, scopeFunc) {
    var i = arguments.length;
    if (i < 2)
        throw new exceptions.InvalidArgument("Too few arguments");
    var args = new Array(i - 1);
    while (--i)
        args[i - 1] = arguments[i];
    scopeFunc = args.pop();
    var tables = flatten(args);
    return [mode, tables, scopeFunc];
}
function enterTransactionScope(db, mode, storeNames, parentTransaction, scopeFunc) {
    return DexiePromise.resolve().then(function () {
        var transless = PSD.transless || PSD;
        var trans = db._createTransaction(mode, storeNames, db._dbSchema, parentTransaction);
        var zoneProps = {
            trans: trans,
            transless: transless
        };
        if (parentTransaction) {
            trans.idbtrans = parentTransaction.idbtrans;
        }
        else {
            trans.create();
        }
        var scopeFuncIsAsync = isAsyncFunction(scopeFunc);
        if (scopeFuncIsAsync) {
            incrementExpectedAwaits();
        }
        var returnValue;
        var promiseFollowed = DexiePromise.follow(function () {
            returnValue = scopeFunc.call(trans, trans);
            if (returnValue) {
                if (scopeFuncIsAsync) {
                    var decrementor = decrementExpectedAwaits.bind(null, null);
                    returnValue.then(decrementor, decrementor);
                }
                else if (typeof returnValue.next === 'function' && typeof returnValue.throw === 'function') {
                    returnValue = awaitIterator(returnValue);
                }
            }
        }, zoneProps);
        return (returnValue && typeof returnValue.then === 'function' ?
            DexiePromise.resolve(returnValue).then(function (x) { return trans.active ?
                x
                : rejection(new exceptions.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn")); })
            : promiseFollowed.then(function () { return returnValue; })).then(function (x) {
            if (parentTransaction)
                trans._resolve();
            return trans._completion.then(function () { return x; });
        }).catch(function (e) {
            trans._reject(e);
            return rejection(e);
        });
    });
}

function pad(a, value, count) {
    var result = isArray(a) ? a.slice() : [a];
    for (var i = 0; i < count; ++i)
        result.push(value);
    return result;
}
function createVirtualIndexMiddleware(down) {
    return __assign(__assign({}, down), { table: function (tableName) {
            var table = down.table(tableName);
            var schema = table.schema;
            var indexLookup = {};
            var allVirtualIndexes = [];
            function addVirtualIndexes(keyPath, keyTail, lowLevelIndex) {
                var keyPathAlias = getKeyPathAlias(keyPath);
                var indexList = (indexLookup[keyPathAlias] = indexLookup[keyPathAlias] || []);
                var keyLength = keyPath == null ? 0 : typeof keyPath === 'string' ? 1 : keyPath.length;
                var isVirtual = keyTail > 0;
                var virtualIndex = __assign(__assign({}, lowLevelIndex), { isVirtual: isVirtual, isPrimaryKey: !isVirtual && lowLevelIndex.isPrimaryKey, keyTail: keyTail,
                    keyLength: keyLength, extractKey: getKeyExtractor(keyPath), unique: !isVirtual && lowLevelIndex.unique });
                indexList.push(virtualIndex);
                if (!virtualIndex.isPrimaryKey) {
                    allVirtualIndexes.push(virtualIndex);
                }
                if (keyLength > 1) {
                    var virtualKeyPath = keyLength === 2 ?
                        keyPath[0] :
                        keyPath.slice(0, keyLength - 1);
                    addVirtualIndexes(virtualKeyPath, keyTail + 1, lowLevelIndex);
                }
                indexList.sort(function (a, b) { return a.keyTail - b.keyTail; });
                return virtualIndex;
            }
            var primaryKey = addVirtualIndexes(schema.primaryKey.keyPath, 0, schema.primaryKey);
            indexLookup[":id"] = [primaryKey];
            for (var _i = 0, _a = schema.indexes; _i < _a.length; _i++) {
                var index = _a[_i];
                addVirtualIndexes(index.keyPath, 0, index);
            }
            function findBestIndex(keyPath) {
                var result = indexLookup[getKeyPathAlias(keyPath)];
                return result && result[0];
            }
            function translateRange(range, keyTail) {
                return {
                    type: range.type === 1             ?
                        2             :
                        range.type,
                    lower: pad(range.lower, range.lowerOpen ? down.MAX_KEY : down.MIN_KEY, keyTail),
                    lowerOpen: true,
                    upper: pad(range.upper, range.upperOpen ? down.MIN_KEY : down.MAX_KEY, keyTail),
                    upperOpen: true
                };
            }
            function translateRequest(req) {
                var index = req.query.index;
                return index.isVirtual ? __assign(__assign({}, req), { query: {
                        index: index,
                        range: translateRange(req.query.range, index.keyTail)
                    } }) : req;
            }
            var result = __assign(__assign({}, table), { schema: __assign(__assign({}, schema), { primaryKey: primaryKey, indexes: allVirtualIndexes, getIndexByKeyPath: findBestIndex }), count: function (req) {
                    return table.count(translateRequest(req));
                },
                query: function (req) {
                    return table.query(translateRequest(req));
                },
                openCursor: function (req) {
                    var _a = req.query.index, keyTail = _a.keyTail, isVirtual = _a.isVirtual, keyLength = _a.keyLength;
                    if (!isVirtual)
                        return table.openCursor(req);
                    function createVirtualCursor(cursor) {
                        function _continue(key) {
                            key != null ?
                                cursor.continue(pad(key, req.reverse ? down.MAX_KEY : down.MIN_KEY, keyTail)) :
                                req.unique ?
                                    cursor.continue(pad(cursor.key, req.reverse ? down.MIN_KEY : down.MAX_KEY, keyTail)) :
                                    cursor.continue();
                        }
                        var virtualCursor = Object.create(cursor, {
                            continue: { value: _continue },
                            continuePrimaryKey: {
                                value: function (key, primaryKey) {
                                    cursor.continuePrimaryKey(pad(key, down.MAX_KEY, keyTail), primaryKey);
                                }
                            },
                            key: {
                                get: function () {
                                    var key = cursor.key;
                                    return keyLength === 1 ?
                                        key[0] :
                                        key.slice(0, keyLength);
                                }
                            },
                            value: {
                                get: function () {
                                    return cursor.value;
                                }
                            }
                        });
                        return virtualCursor;
                    }
                    return table.openCursor(translateRequest(req))
                        .then(function (cursor) { return cursor && createVirtualCursor(cursor); });
                } });
            return result;
        } });
}
var virtualIndexMiddleware = {
    stack: "dbcore",
    name: "VirtualIndexMiddleware",
    level: 1,
    create: createVirtualIndexMiddleware
};

var hooksMiddleware = {
    stack: "dbcore",
    name: "HooksMiddleware",
    level: 2,
    create: function (downCore) { return (__assign(__assign({}, downCore), { table: function (tableName) {
            var downTable = downCore.table(tableName);
            var primaryKey = downTable.schema.primaryKey;
            var tableMiddleware = __assign(__assign({}, downTable), { mutate: function (req) {
                    var dxTrans = PSD.trans;
                    var _a = dxTrans.table(tableName).hook, deleting = _a.deleting, creating = _a.creating, updating = _a.updating;
                    switch (req.type) {
                        case 'add':
                            if (creating.fire === nop)
                                break;
                            return dxTrans._promise('readwrite', function () { return addPutOrDelete(req); }, true);
                        case 'put':
                            if (creating.fire === nop && updating.fire === nop)
                                break;
                            return dxTrans._promise('readwrite', function () { return addPutOrDelete(req); }, true);
                        case 'delete':
                            if (deleting.fire === nop)
                                break;
                            return dxTrans._promise('readwrite', function () { return addPutOrDelete(req); }, true);
                        case 'deleteRange':
                            if (deleting.fire === nop)
                                break;
                            return dxTrans._promise('readwrite', function () { return deleteRange(req); }, true);
                    }
                    return downTable.mutate(req);
                    function addPutOrDelete(req) {
                        var dxTrans = PSD.trans;
                        var keys$$1 = req.keys || getEffectiveKeys(primaryKey, req);
                        if (!keys$$1)
                            throw new Error("Keys missing");
                        req = req.type === 'add' || req.type === 'put' ? __assign(__assign({}, req), { keys: keys$$1, wantResults: true }) :
                         __assign({}, req);
                        if (req.type !== 'delete')
                            req.values = __spreadArrays(req.values);
                        if (req.keys)
                            req.keys = __spreadArrays(req.keys);
                        return getExistingValues(downTable, req, keys$$1).then(function (existingValues) {
                            var contexts = keys$$1.map(function (key, i) {
                                var existingValue = existingValues[i];
                                var ctx = { onerror: null, onsuccess: null };
                                if (req.type === 'delete') {
                                    deleting.fire.call(ctx, key, existingValue, dxTrans);
                                }
                                else if (req.type === 'add' || existingValue === undefined) {
                                    var generatedPrimaryKey = creating.fire.call(ctx, key, req.values[i], dxTrans);
                                    if (key == null && generatedPrimaryKey != null) {
                                        key = generatedPrimaryKey;
                                        req.keys[i] = key;
                                        if (!primaryKey.outbound) {
                                            setByKeyPath(req.values[i], primaryKey.keyPath, key);
                                        }
                                    }
                                }
                                else {
                                    var objectDiff = getObjectDiff(existingValue, req.values[i]);
                                    var additionalChanges_1 = updating.fire.call(ctx, objectDiff, key, existingValue, dxTrans);
                                    if (additionalChanges_1) {
                                        var requestedValue_1 = req.values[i];
                                        Object.keys(additionalChanges_1).forEach(function (keyPath) {
                                            setByKeyPath(requestedValue_1, keyPath, additionalChanges_1[keyPath]);
                                        });
                                    }
                                }
                                return ctx;
                            });
                            return downTable.mutate(req).then(function (_a) {
                                var failures = _a.failures, results = _a.results, numFailures = _a.numFailures, lastResult = _a.lastResult;
                                for (var i = 0; i < keys$$1.length; ++i) {
                                    var primKey = results ? results[i] : keys$$1[i];
                                    var ctx = contexts[i];
                                    if (primKey == null) {
                                        ctx.onerror && ctx.onerror(failures[i]);
                                    }
                                    else {
                                        ctx.onsuccess && ctx.onsuccess(req.type === 'put' && existingValues[i] ?
                                            req.values[i] :
                                            primKey
                                        );
                                    }
                                }
                                return { failures: failures, results: results, numFailures: numFailures, lastResult: lastResult };
                            }).catch(function (error) {
                                contexts.forEach(function (ctx) { return ctx.onerror && ctx.onerror(error); });
                                return Promise.reject(error);
                            });
                        });
                    }
                    function deleteRange(req) {
                        return deleteNextChunk(req.trans, req.range, 10000);
                    }
                    function deleteNextChunk(trans, range, limit) {
                        return downTable.query({ trans: trans, values: false, query: { index: primaryKey, range: range }, limit: limit })
                            .then(function (_a) {
                            var result = _a.result;
                            return addPutOrDelete({ type: 'delete', keys: result, trans: trans }).then(function (res) {
                                if (res.numFailures > 0)
                                    return Promise.reject(res.failures[0]);
                                if (result.length < limit) {
                                    return { failures: [], numFailures: 0, lastResult: undefined };
                                }
                                else {
                                    return deleteNextChunk(trans, __assign(__assign({}, range), { lower: result[result.length - 1], lowerOpen: true }), limit);
                                }
                            });
                        });
                    }
                } });
            return tableMiddleware;
        } })); }
};

var Dexie =               (function () {
    function Dexie(name, options) {
        var _this = this;
        this._middlewares = {};
        this.verno = 0;
        var deps = Dexie.dependencies;
        this._options = options = __assign({
            addons: Dexie.addons, autoOpen: true,
            indexedDB: deps.indexedDB, IDBKeyRange: deps.IDBKeyRange }, options);
        this._deps = {
            indexedDB: options.indexedDB,
            IDBKeyRange: options.IDBKeyRange
        };
        var addons = options.addons;
        this._dbSchema = {};
        this._versions = [];
        this._storeNames = [];
        this._allTables = {};
        this.idbdb = null;
        var state = {
            dbOpenError: null,
            isBeingOpened: false,
            onReadyBeingFired: null,
            openComplete: false,
            dbReadyResolve: nop,
            dbReadyPromise: null,
            cancelOpen: nop,
            openCanceller: null,
            autoSchema: true
        };
        state.dbReadyPromise = new DexiePromise(function (resolve) {
            state.dbReadyResolve = resolve;
        });
        state.openCanceller = new DexiePromise(function (_, reject) {
            state.cancelOpen = reject;
        });
        this._state = state;
        this.name = name;
        this.on = Events(this, "populate", "blocked", "versionchange", { ready: [promisableChain, nop] });
        this.on.ready.subscribe = override(this.on.ready.subscribe, function (subscribe) {
            return function (subscriber, bSticky) {
                Dexie.vip(function () {
                    var state = _this._state;
                    if (state.openComplete) {
                        if (!state.dbOpenError)
                            DexiePromise.resolve().then(subscriber);
                        if (bSticky)
                            subscribe(subscriber);
                    }
                    else if (state.onReadyBeingFired) {
                        state.onReadyBeingFired.push(subscriber);
                        if (bSticky)
                            subscribe(subscriber);
                    }
                    else {
                        subscribe(subscriber);
                        var db_1 = _this;
                        if (!bSticky)
                            subscribe(function unsubscribe() {
                                db_1.on.ready.unsubscribe(subscriber);
                                db_1.on.ready.unsubscribe(unsubscribe);
                            });
                    }
                });
            };
        });
        this.Collection = createCollectionConstructor(this);
        this.Table = createTableConstructor(this);
        this.Transaction = createTransactionConstructor(this);
        this.Version = createVersionConstructor(this);
        this.WhereClause = createWhereClauseConstructor(this);
        this.on("versionchange", function (ev) {
            if (ev.newVersion > 0)
                console.warn("Another connection wants to upgrade database '" + _this.name + "'. Closing db now to resume the upgrade.");
            else
                console.warn("Another connection wants to delete database '" + _this.name + "'. Closing db now to resume the delete request.");
            _this.close();
        });
        this.on("blocked", function (ev) {
            if (!ev.newVersion || ev.newVersion < ev.oldVersion)
                console.warn("Dexie.delete('" + _this.name + "') was blocked");
            else
                console.warn("Upgrade '" + _this.name + "' blocked by other connection holding version " + ev.oldVersion / 10);
        });
        this._maxKey = getMaxKey(options.IDBKeyRange);
        this._createTransaction = function (mode, storeNames, dbschema, parentTransaction) { return new _this.Transaction(mode, storeNames, dbschema, parentTransaction); };
        this._fireOnBlocked = function (ev) {
            _this.on("blocked").fire(ev);
            connections
                .filter(function (c) { return c.name === _this.name && c !== _this && !c._state.vcFired; })
                .map(function (c) { return c.on("versionchange").fire(ev); });
        };
        this.use(virtualIndexMiddleware);
        this.use(hooksMiddleware);
        addons.forEach(function (addon) { return addon(_this); });
    }
    Dexie.prototype.version = function (versionNumber) {
        if (isNaN(versionNumber) || versionNumber < 0.1)
            throw new exceptions.Type("Given version is not a positive number");
        versionNumber = Math.round(versionNumber * 10) / 10;
        if (this.idbdb || this._state.isBeingOpened)
            throw new exceptions.Schema("Cannot add version when database is open");
        this.verno = Math.max(this.verno, versionNumber);
        var versions = this._versions;
        var versionInstance = versions.filter(function (v) { return v._cfg.version === versionNumber; })[0];
        if (versionInstance)
            return versionInstance;
        versionInstance = new this.Version(versionNumber);
        versions.push(versionInstance);
        versions.sort(lowerVersionFirst);
        versionInstance.stores({});
        this._state.autoSchema = false;
        return versionInstance;
    };
    Dexie.prototype._whenReady = function (fn) {
        var _this = this;
        return this._state.openComplete || PSD.letThrough ? fn() : new DexiePromise(function (resolve, reject) {
            if (!_this._state.isBeingOpened) {
                if (!_this._options.autoOpen) {
                    reject(new exceptions.DatabaseClosed());
                    return;
                }
                _this.open().catch(nop);
            }
            _this._state.dbReadyPromise.then(resolve, reject);
        }).then(fn);
    };
    Dexie.prototype.use = function (_a) {
        var stack = _a.stack, create = _a.create, level = _a.level, name = _a.name;
        if (name)
            this.unuse({ stack: stack, name: name });
        var middlewares = this._middlewares[stack] || (this._middlewares[stack] = []);
        middlewares.push({ stack: stack, create: create, level: level == null ? 10 : level, name: name });
        middlewares.sort(function (a, b) { return a.level - b.level; });
        return this;
    };
    Dexie.prototype.unuse = function (_a) {
        var stack = _a.stack, name = _a.name, create = _a.create;
        if (stack && this._middlewares[stack]) {
            this._middlewares[stack] = this._middlewares[stack].filter(function (mw) {
                return create ? mw.create !== create :
                    name ? mw.name !== name :
                        false;
            });
        }
        return this;
    };
    Dexie.prototype.open = function () {
        return dexieOpen(this);
    };
    Dexie.prototype.close = function () {
        var idx = connections.indexOf(this), state = this._state;
        if (idx >= 0)
            connections.splice(idx, 1);
        if (this.idbdb) {
            try {
                this.idbdb.close();
            }
            catch (e) { }
            this.idbdb = null;
        }
        this._options.autoOpen = false;
        state.dbOpenError = new exceptions.DatabaseClosed();
        if (state.isBeingOpened)
            state.cancelOpen(state.dbOpenError);
        state.dbReadyPromise = new DexiePromise(function (resolve) {
            state.dbReadyResolve = resolve;
        });
        state.openCanceller = new DexiePromise(function (_, reject) {
            state.cancelOpen = reject;
        });
    };
    Dexie.prototype.delete = function () {
        var _this = this;
        var hasArguments = arguments.length > 0;
        var state = this._state;
        return new DexiePromise(function (resolve, reject) {
            var doDelete = function () {
                _this.close();
                var req = _this._deps.indexedDB.deleteDatabase(_this.name);
                req.onsuccess = wrap(function () {
                    databaseEnumerator.remove(_this.name);
                    resolve();
                });
                req.onerror = eventRejectHandler(reject);
                req.onblocked = _this._fireOnBlocked;
            };
            if (hasArguments)
                throw new exceptions.InvalidArgument("Arguments not allowed in db.delete()");
            if (state.isBeingOpened) {
                state.dbReadyPromise.then(doDelete);
            }
            else {
                doDelete();
            }
        });
    };
    Dexie.prototype.backendDB = function () {
        return this.idbdb;
    };
    Dexie.prototype.isOpen = function () {
        return this.idbdb !== null;
    };
    Dexie.prototype.hasBeenClosed = function () {
        var dbOpenError = this._state.dbOpenError;
        return dbOpenError && (dbOpenError.name === 'DatabaseClosed');
    };
    Dexie.prototype.hasFailed = function () {
        return this._state.dbOpenError !== null;
    };
    Dexie.prototype.dynamicallyOpened = function () {
        return this._state.autoSchema;
    };
    Object.defineProperty(Dexie.prototype, "tables", {
        get: function () {
            var _this = this;
            return keys(this._allTables).map(function (name) { return _this._allTables[name]; });
        },
        enumerable: true,
        configurable: true
    });
    Dexie.prototype.transaction = function () {
        var args = extractTransactionArgs.apply(this, arguments);
        return this._transaction.apply(this, args);
    };
    Dexie.prototype._transaction = function (mode, tables, scopeFunc) {
        var _this = this;
        var parentTransaction = PSD.trans;
        if (!parentTransaction || parentTransaction.db !== this || mode.indexOf('!') !== -1)
            parentTransaction = null;
        var onlyIfCompatible = mode.indexOf('?') !== -1;
        mode = mode.replace('!', '').replace('?', '');
        var idbMode, storeNames;
        try {
            storeNames = tables.map(function (table) {
                var storeName = table instanceof _this.Table ? table.name : table;
                if (typeof storeName !== 'string')
                    throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
                return storeName;
            });
            if (mode == "r" || mode === READONLY)
                idbMode = READONLY;
            else if (mode == "rw" || mode == READWRITE)
                idbMode = READWRITE;
            else
                throw new exceptions.InvalidArgument("Invalid transaction mode: " + mode);
            if (parentTransaction) {
                if (parentTransaction.mode === READONLY && idbMode === READWRITE) {
                    if (onlyIfCompatible) {
                        parentTransaction = null;
                    }
                    else
                        throw new exceptions.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");
                }
                if (parentTransaction) {
                    storeNames.forEach(function (storeName) {
                        if (parentTransaction && parentTransaction.storeNames.indexOf(storeName) === -1) {
                            if (onlyIfCompatible) {
                                parentTransaction = null;
                            }
                            else
                                throw new exceptions.SubTransaction("Table " + storeName +
                                    " not included in parent transaction.");
                        }
                    });
                }
                if (onlyIfCompatible && parentTransaction && !parentTransaction.active) {
                    parentTransaction = null;
                }
            }
        }
        catch (e) {
            return parentTransaction ?
                parentTransaction._promise(null, function (_, reject) { reject(e); }) :
                rejection(e);
        }
        var enterTransaction = enterTransactionScope.bind(null, this, idbMode, storeNames, parentTransaction, scopeFunc);
        return (parentTransaction ?
            parentTransaction._promise(idbMode, enterTransaction, "lock") :
            PSD.trans ?
                usePSD(PSD.transless, function () { return _this._whenReady(enterTransaction); }) :
                this._whenReady(enterTransaction));
    };
    Dexie.prototype.table = function (tableName) {
        if (!hasOwn(this._allTables, tableName)) {
            throw new exceptions.InvalidTable("Table " + tableName + " does not exist");
        }
        return this._allTables[tableName];
    };
    return Dexie;
}());

var Dexie$1 = Dexie;
props(Dexie$1, __assign(__assign({}, fullNameExceptions), {
    delete: function (databaseName) {
        var db = new Dexie$1(databaseName);
        return db.delete();
    },
    exists: function (name) {
        return new Dexie$1(name, { addons: [] }).open().then(function (db) {
            db.close();
            return true;
        }).catch('NoSuchDatabaseError', function () { return false; });
    },
    getDatabaseNames: function (cb) {
        return databaseEnumerator ?
            databaseEnumerator.getDatabaseNames().then(cb) :
            DexiePromise.resolve([]);
    },
    defineClass: function () {
        function Class(content) {
            extend(this, content);
        }
        return Class;
    },
    ignoreTransaction: function (scopeFunc) {
        return PSD.trans ?
            usePSD(PSD.transless, scopeFunc) :
            scopeFunc();
    },
    vip: vip, async: function (generatorFn) {
        return function () {
            try {
                var rv = awaitIterator(generatorFn.apply(this, arguments));
                if (!rv || typeof rv.then !== 'function')
                    return DexiePromise.resolve(rv);
                return rv;
            }
            catch (e) {
                return rejection(e);
            }
        };
    }, spawn: function (generatorFn, args, thiz) {
        try {
            var rv = awaitIterator(generatorFn.apply(thiz, args || []));
            if (!rv || typeof rv.then !== 'function')
                return DexiePromise.resolve(rv);
            return rv;
        }
        catch (e) {
            return rejection(e);
        }
    },
    currentTransaction: {
        get: function () { return PSD.trans || null; }
    }, waitFor: function (promiseOrFunction, optionalTimeout) {
        var promise = DexiePromise.resolve(typeof promiseOrFunction === 'function' ?
            Dexie$1.ignoreTransaction(promiseOrFunction) :
            promiseOrFunction)
            .timeout(optionalTimeout || 60000);
        return PSD.trans ?
            PSD.trans.waitFor(promise) :
            promise;
    },
    Promise: DexiePromise,
    debug: {
        get: function () { return debug; },
        set: function (value) {
            setDebug(value, value === 'dexie' ? function () { return true; } : dexieStackFrameFilter);
        }
    },
    derive: derive, extend: extend, props: props, override: override,
    Events: Events,
    getByKeyPath: getByKeyPath, setByKeyPath: setByKeyPath, delByKeyPath: delByKeyPath, shallowClone: shallowClone, deepClone: deepClone, getObjectDiff: getObjectDiff, asap: asap,
    minKey: minKey,
    addons: [],
    connections: connections,
    errnames: errnames,
    dependencies: (function () {
        try {
            return {
                indexedDB: _global.indexedDB || _global.mozIndexedDB || _global.webkitIndexedDB || _global.msIndexedDB,
                IDBKeyRange: _global.IDBKeyRange || _global.webkitIDBKeyRange
            };
        }
        catch (e) {
            return { indexedDB: null, IDBKeyRange: null };
        }
    })(),
    semVer: DEXIE_VERSION, version: DEXIE_VERSION.split('.')
        .map(function (n) { return parseInt(n); })
        .reduce(function (p, c, i) { return p + (c / Math.pow(10, i * 2)); }),
    default: Dexie$1,
    Dexie: Dexie$1 }));
Dexie$1.maxKey = getMaxKey(Dexie$1.dependencies.IDBKeyRange);

initDatabaseEnumerator(Dexie.dependencies.indexedDB);
DexiePromise.rejectionMapper = mapError;
setDebug(debug, dexieStackFrameFilter);

return Dexie;

})));


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("timers").setImmediate)
},{"timers":5}],25:[function(require,module,exports){
//! moment.js
//! version : 2.27.0
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, (function () { 'use strict';

    var hookCallback;

    function hooks() {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback(callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return (
            input instanceof Array ||
            Object.prototype.toString.call(input) === '[object Array]'
        );
    }

    function isObject(input) {
        // IE8 will treat undefined and null as object if it wasn't for
        // input != null
        return (
            input != null &&
            Object.prototype.toString.call(input) === '[object Object]'
        );
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function isObjectEmpty(obj) {
        if (Object.getOwnPropertyNames) {
            return Object.getOwnPropertyNames(obj).length === 0;
        } else {
            var k;
            for (k in obj) {
                if (hasOwnProp(obj, k)) {
                    return false;
                }
            }
            return true;
        }
    }

    function isUndefined(input) {
        return input === void 0;
    }

    function isNumber(input) {
        return (
            typeof input === 'number' ||
            Object.prototype.toString.call(input) === '[object Number]'
        );
    }

    function isDate(input) {
        return (
            input instanceof Date ||
            Object.prototype.toString.call(input) === '[object Date]'
        );
    }

    function map(arr, fn) {
        var res = [],
            i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function createUTC(input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty: false,
            unusedTokens: [],
            unusedInput: [],
            overflow: -2,
            charsLeftOver: 0,
            nullInput: false,
            invalidEra: null,
            invalidMonth: null,
            invalidFormat: false,
            userInvalidated: false,
            iso: false,
            parsedDateParts: [],
            era: null,
            meridiem: null,
            rfc2822: false,
            weekdayMismatch: false,
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    var some;
    if (Array.prototype.some) {
        some = Array.prototype.some;
    } else {
        some = function (fun) {
            var t = Object(this),
                len = t.length >>> 0,
                i;

            for (i = 0; i < len; i++) {
                if (i in t && fun.call(this, t[i], i, t)) {
                    return true;
                }
            }

            return false;
        };
    }

    function isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m),
                parsedParts = some.call(flags.parsedDateParts, function (i) {
                    return i != null;
                }),
                isNowValid =
                    !isNaN(m._d.getTime()) &&
                    flags.overflow < 0 &&
                    !flags.empty &&
                    !flags.invalidEra &&
                    !flags.invalidMonth &&
                    !flags.invalidWeekday &&
                    !flags.weekdayMismatch &&
                    !flags.nullInput &&
                    !flags.invalidFormat &&
                    !flags.userInvalidated &&
                    (!flags.meridiem || (flags.meridiem && parsedParts));

            if (m._strict) {
                isNowValid =
                    isNowValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }

            if (Object.isFrozen == null || !Object.isFrozen(m)) {
                m._isValid = isNowValid;
            } else {
                return isNowValid;
            }
        }
        return m._isValid;
    }

    function createInvalid(flags) {
        var m = createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        } else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    var momentProperties = (hooks.momentProperties = []),
        updateInProgress = false;

    function copyConfig(to, from) {
        var i, prop, val;

        if (!isUndefined(from._isAMomentObject)) {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (!isUndefined(from._i)) {
            to._i = from._i;
        }
        if (!isUndefined(from._f)) {
            to._f = from._f;
        }
        if (!isUndefined(from._l)) {
            to._l = from._l;
        }
        if (!isUndefined(from._strict)) {
            to._strict = from._strict;
        }
        if (!isUndefined(from._tzm)) {
            to._tzm = from._tzm;
        }
        if (!isUndefined(from._isUTC)) {
            to._isUTC = from._isUTC;
        }
        if (!isUndefined(from._offset)) {
            to._offset = from._offset;
        }
        if (!isUndefined(from._pf)) {
            to._pf = getParsingFlags(from);
        }
        if (!isUndefined(from._locale)) {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i = 0; i < momentProperties.length; i++) {
                prop = momentProperties[i];
                val = from[prop];
                if (!isUndefined(val)) {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        if (!this.isValid()) {
            this._d = new Date(NaN);
        }
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment(obj) {
        return (
            obj instanceof Moment || (obj != null && obj._isAMomentObject != null)
        );
    }

    function warn(msg) {
        if (
            hooks.suppressDeprecationWarnings === false &&
            typeof console !== 'undefined' &&
            console.warn
        ) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function () {
            if (hooks.deprecationHandler != null) {
                hooks.deprecationHandler(null, msg);
            }
            if (firstTime) {
                var args = [],
                    arg,
                    i,
                    key;
                for (i = 0; i < arguments.length; i++) {
                    arg = '';
                    if (typeof arguments[i] === 'object') {
                        arg += '\n[' + i + '] ';
                        for (key in arguments[0]) {
                            if (hasOwnProp(arguments[0], key)) {
                                arg += key + ': ' + arguments[0][key] + ', ';
                            }
                        }
                        arg = arg.slice(0, -2); // Remove trailing comma and space
                    } else {
                        arg = arguments[i];
                    }
                    args.push(arg);
                }
                warn(
                    msg +
                        '\nArguments: ' +
                        Array.prototype.slice.call(args).join('') +
                        '\n' +
                        new Error().stack
                );
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (hooks.deprecationHandler != null) {
            hooks.deprecationHandler(name, msg);
        }
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    hooks.suppressDeprecationWarnings = false;
    hooks.deprecationHandler = null;

    function isFunction(input) {
        return (
            (typeof Function !== 'undefined' && input instanceof Function) ||
            Object.prototype.toString.call(input) === '[object Function]'
        );
    }

    function set(config) {
        var prop, i;
        for (i in config) {
            if (hasOwnProp(config, i)) {
                prop = config[i];
                if (isFunction(prop)) {
                    this[i] = prop;
                } else {
                    this['_' + i] = prop;
                }
            }
        }
        this._config = config;
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
        // TODO: Remove "ordinalParse" fallback in next major release.
        this._dayOfMonthOrdinalParseLenient = new RegExp(
            (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
                '|' +
                /\d{1,2}/.source
        );
    }

    function mergeConfigs(parentConfig, childConfig) {
        var res = extend({}, parentConfig),
            prop;
        for (prop in childConfig) {
            if (hasOwnProp(childConfig, prop)) {
                if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                    res[prop] = {};
                    extend(res[prop], parentConfig[prop]);
                    extend(res[prop], childConfig[prop]);
                } else if (childConfig[prop] != null) {
                    res[prop] = childConfig[prop];
                } else {
                    delete res[prop];
                }
            }
        }
        for (prop in parentConfig) {
            if (
                hasOwnProp(parentConfig, prop) &&
                !hasOwnProp(childConfig, prop) &&
                isObject(parentConfig[prop])
            ) {
                // make sure changes to properties don't modify parent config
                res[prop] = extend({}, res[prop]);
            }
        }
        return res;
    }

    function Locale(config) {
        if (config != null) {
            this.set(config);
        }
    }

    var keys;

    if (Object.keys) {
        keys = Object.keys;
    } else {
        keys = function (obj) {
            var i,
                res = [];
            for (i in obj) {
                if (hasOwnProp(obj, i)) {
                    res.push(i);
                }
            }
            return res;
        };
    }

    var defaultCalendar = {
        sameDay: '[Today at] LT',
        nextDay: '[Tomorrow at] LT',
        nextWeek: 'dddd [at] LT',
        lastDay: '[Yesterday at] LT',
        lastWeek: '[Last] dddd [at] LT',
        sameElse: 'L',
    };

    function calendar(key, mom, now) {
        var output = this._calendar[key] || this._calendar['sameElse'];
        return isFunction(output) ? output.call(mom, now) : output;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (
            (sign ? (forceSign ? '+' : '') : '-') +
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) +
            absNumber
        );
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,
        localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,
        formatFunctions = {},
        formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken(token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(
                    func.apply(this, arguments),
                    token
                );
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens),
            i,
            length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '',
                i;
            for (i = 0; i < length; i++) {
                output += isFunction(array[i])
                    ? array[i].call(mom, format)
                    : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] =
            formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(
                localFormattingTokens,
                replaceLongDateFormatTokens
            );
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var defaultLongDateFormat = {
        LTS: 'h:mm:ss A',
        LT: 'h:mm A',
        L: 'MM/DD/YYYY',
        LL: 'MMMM D, YYYY',
        LLL: 'MMMM D, YYYY h:mm A',
        LLLL: 'dddd, MMMM D, YYYY h:mm A',
    };

    function longDateFormat(key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper
            .match(formattingTokens)
            .map(function (tok) {
                if (
                    tok === 'MMMM' ||
                    tok === 'MM' ||
                    tok === 'DD' ||
                    tok === 'dddd'
                ) {
                    return tok.slice(1);
                }
                return tok;
            })
            .join('');

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate() {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d',
        defaultDayOfMonthOrdinalParse = /\d{1,2}/;

    function ordinal(number) {
        return this._ordinal.replace('%d', number);
    }

    var defaultRelativeTime = {
        future: 'in %s',
        past: '%s ago',
        s: 'a few seconds',
        ss: '%d seconds',
        m: 'a minute',
        mm: '%d minutes',
        h: 'an hour',
        hh: '%d hours',
        d: 'a day',
        dd: '%d days',
        w: 'a week',
        ww: '%d weeks',
        M: 'a month',
        MM: '%d months',
        y: 'a year',
        yy: '%d years',
    };

    function relativeTime(number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return isFunction(output)
            ? output(number, withoutSuffix, string, isFuture)
            : output.replace(/%d/i, number);
    }

    function pastFuture(diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return isFunction(format) ? format(output) : format.replace(/%s/i, output);
    }

    var aliases = {};

    function addUnitAlias(unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string'
            ? aliases[units] || aliases[units.toLowerCase()]
            : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    var priorities = {};

    function addUnitPriority(unit, priority) {
        priorities[unit] = priority;
    }

    function getPrioritizedUnits(unitsObj) {
        var units = [],
            u;
        for (u in unitsObj) {
            if (hasOwnProp(unitsObj, u)) {
                units.push({ unit: u, priority: priorities[u] });
            }
        }
        units.sort(function (a, b) {
            return a.priority - b.priority;
        });
        return units;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    function absFloor(number) {
        if (number < 0) {
            // -0 -> 0
            return Math.ceil(number) || 0;
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

    function makeGetSet(unit, keepTime) {
        return function (value) {
            if (value != null) {
                set$1(this, unit, value);
                hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get(this, unit);
            }
        };
    }

    function get(mom, unit) {
        return mom.isValid()
            ? mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]()
            : NaN;
    }

    function set$1(mom, unit, value) {
        if (mom.isValid() && !isNaN(value)) {
            if (
                unit === 'FullYear' &&
                isLeapYear(mom.year()) &&
                mom.month() === 1 &&
                mom.date() === 29
            ) {
                value = toInt(value);
                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](
                    value,
                    mom.month(),
                    daysInMonth(value, mom.month())
                );
            } else {
                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
            }
        }
    }

    // MOMENTS

    function stringGet(units) {
        units = normalizeUnits(units);
        if (isFunction(this[units])) {
            return this[units]();
        }
        return this;
    }

    function stringSet(units, value) {
        if (typeof units === 'object') {
            units = normalizeObjectUnits(units);
            var prioritized = getPrioritizedUnits(units),
                i;
            for (i = 0; i < prioritized.length; i++) {
                this[prioritized[i].unit](units[prioritized[i].unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (isFunction(this[units])) {
                return this[units](value);
            }
        }
        return this;
    }

    var match1 = /\d/, //       0 - 9
        match2 = /\d\d/, //      00 - 99
        match3 = /\d{3}/, //     000 - 999
        match4 = /\d{4}/, //    0000 - 9999
        match6 = /[+-]?\d{6}/, // -999999 - 999999
        match1to2 = /\d\d?/, //       0 - 99
        match3to4 = /\d\d\d\d?/, //     999 - 9999
        match5to6 = /\d\d\d\d\d\d?/, //   99999 - 999999
        match1to3 = /\d{1,3}/, //       0 - 999
        match1to4 = /\d{1,4}/, //       0 - 9999
        match1to6 = /[+-]?\d{1,6}/, // -999999 - 999999
        matchUnsigned = /\d+/, //       0 - inf
        matchSigned = /[+-]?\d+/, //    -inf - inf
        matchOffset = /Z|[+-]\d\d:?\d\d/gi, // +00:00 -00:00 +0000 -0000 or Z
        matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi, // +00 -00 +00:00 -00:00 +0000 -0000 or Z
        matchTimestamp = /[+-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123
        // any word (or two) characters or numbers including two/three word month in arabic.
        // includes scottish gaelic two word and hyphenated months
        matchWord = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i,
        regexes;

    regexes = {};

    function addRegexToken(token, regex, strictRegex) {
        regexes[token] = isFunction(regex)
            ? regex
            : function (isStrict, localeData) {
                  return isStrict && strictRegex ? strictRegex : regex;
              };
    }

    function getParseRegexForToken(token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return regexEscape(
            s
                .replace('\\', '')
                .replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (
                    matched,
                    p1,
                    p2,
                    p3,
                    p4
                ) {
                    return p1 || p2 || p3 || p4;
                })
        );
    }

    function regexEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken(token, callback) {
        var i,
            func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (isNumber(callback)) {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken(token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0,
        MONTH = 1,
        DATE = 2,
        HOUR = 3,
        MINUTE = 4,
        SECOND = 5,
        MILLISECOND = 6,
        WEEK = 7,
        WEEKDAY = 8;

    function mod(n, x) {
        return ((n % x) + x) % x;
    }

    var indexOf;

    if (Array.prototype.indexOf) {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function (o) {
            // I know
            var i;
            for (i = 0; i < this.length; ++i) {
                if (this[i] === o) {
                    return i;
                }
            }
            return -1;
        };
    }

    function daysInMonth(year, month) {
        if (isNaN(year) || isNaN(month)) {
            return NaN;
        }
        var modMonth = mod(month, 12);
        year += (month - modMonth) / 12;
        return modMonth === 1
            ? isLeapYear(year)
                ? 29
                : 28
            : 31 - ((modMonth % 7) % 2);
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PRIORITY

    addUnitPriority('month', 8);

    // PARSING

    addRegexToken('M', match1to2);
    addRegexToken('MM', match1to2, match2);
    addRegexToken('MMM', function (isStrict, locale) {
        return locale.monthsShortRegex(isStrict);
    });
    addRegexToken('MMMM', function (isStrict, locale) {
        return locale.monthsRegex(isStrict);
    });

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split(
            '_'
        ),
        defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split(
            '_'
        ),
        MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,
        defaultMonthsShortRegex = matchWord,
        defaultMonthsRegex = matchWord;

    function localeMonths(m, format) {
        if (!m) {
            return isArray(this._months)
                ? this._months
                : this._months['standalone'];
        }
        return isArray(this._months)
            ? this._months[m.month()]
            : this._months[
                  (this._months.isFormat || MONTHS_IN_FORMAT).test(format)
                      ? 'format'
                      : 'standalone'
              ][m.month()];
    }

    function localeMonthsShort(m, format) {
        if (!m) {
            return isArray(this._monthsShort)
                ? this._monthsShort
                : this._monthsShort['standalone'];
        }
        return isArray(this._monthsShort)
            ? this._monthsShort[m.month()]
            : this._monthsShort[
                  MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'
              ][m.month()];
    }

    function handleStrictParse(monthName, format, strict) {
        var i,
            ii,
            mom,
            llc = monthName.toLocaleLowerCase();
        if (!this._monthsParse) {
            // this is not used
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
            for (i = 0; i < 12; ++i) {
                mom = createUTC([2000, i]);
                this._shortMonthsParse[i] = this.monthsShort(
                    mom,
                    ''
                ).toLocaleLowerCase();
                this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeMonthsParse(monthName, format, strict) {
        var i, mom, regex;

        if (this._monthsParseExact) {
            return handleStrictParse.call(this, monthName, format, strict);
        }

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        // TODO: add sorting
        // Sorting makes sure if one month (or abbr) is a prefix of another
        // see sorting in computeMonthsParse
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp(
                    '^' + this.months(mom, '').replace('.', '') + '$',
                    'i'
                );
                this._shortMonthsParse[i] = new RegExp(
                    '^' + this.monthsShort(mom, '').replace('.', '') + '$',
                    'i'
                );
            }
            if (!strict && !this._monthsParse[i]) {
                regex =
                    '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (
                strict &&
                format === 'MMMM' &&
                this._longMonthsParse[i].test(monthName)
            ) {
                return i;
            } else if (
                strict &&
                format === 'MMM' &&
                this._shortMonthsParse[i].test(monthName)
            ) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth(mom, value) {
        var dayOfMonth;

        if (!mom.isValid()) {
            // No op
            return mom;
        }

        if (typeof value === 'string') {
            if (/^\d+$/.test(value)) {
                value = toInt(value);
            } else {
                value = mom.localeData().monthsParse(value);
                // TODO: Another silent failure?
                if (!isNumber(value)) {
                    return mom;
                }
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth(value) {
        if (value != null) {
            setMonth(this, value);
            hooks.updateOffset(this, true);
            return this;
        } else {
            return get(this, 'Month');
        }
    }

    function getDaysInMonth() {
        return daysInMonth(this.year(), this.month());
    }

    function monthsShortRegex(isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsShortStrictRegex;
            } else {
                return this._monthsShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsShortRegex')) {
                this._monthsShortRegex = defaultMonthsShortRegex;
            }
            return this._monthsShortStrictRegex && isStrict
                ? this._monthsShortStrictRegex
                : this._monthsShortRegex;
        }
    }

    function monthsRegex(isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsStrictRegex;
            } else {
                return this._monthsRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsRegex')) {
                this._monthsRegex = defaultMonthsRegex;
            }
            return this._monthsStrictRegex && isStrict
                ? this._monthsStrictRegex
                : this._monthsRegex;
        }
    }

    function computeMonthsParse() {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var shortPieces = [],
            longPieces = [],
            mixedPieces = [],
            i,
            mom;
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            shortPieces.push(this.monthsShort(mom, ''));
            longPieces.push(this.months(mom, ''));
            mixedPieces.push(this.months(mom, ''));
            mixedPieces.push(this.monthsShort(mom, ''));
        }
        // Sorting makes sure if one month (or abbr) is a prefix of another it
        // will match the longer piece.
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 12; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
        }
        for (i = 0; i < 24; i++) {
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._monthsShortRegex = this._monthsRegex;
        this._monthsStrictRegex = new RegExp(
            '^(' + longPieces.join('|') + ')',
            'i'
        );
        this._monthsShortStrictRegex = new RegExp(
            '^(' + shortPieces.join('|') + ')',
            'i'
        );
    }

    // FORMATTING

    addFormatToken('Y', 0, 0, function () {
        var y = this.year();
        return y <= 9999 ? zeroFill(y, 4) : '+' + y;
    });

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY', 4], 0, 'year');
    addFormatToken(0, ['YYYYY', 5], 0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PRIORITIES

    addUnitPriority('year', 1);

    // PARSING

    addRegexToken('Y', matchSigned);
    addRegexToken('YY', match1to2, match2);
    addRegexToken('YYYY', match1to4, match4);
    addRegexToken('YYYYY', match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function (input, array) {
        array[YEAR] =
            input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function (input, array) {
        array[YEAR] = hooks.parseTwoDigitYear(input);
    });
    addParseToken('Y', function (input, array) {
        array[YEAR] = parseInt(input, 10);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    // HOOKS

    hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', true);

    function getIsLeapYear() {
        return isLeapYear(this.year());
    }

    function createDate(y, m, d, h, M, s, ms) {
        // can't just apply() to create a date:
        // https://stackoverflow.com/q/181348
        var date;
        // the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            date = new Date(y + 400, m, d, h, M, s, ms);
            if (isFinite(date.getFullYear())) {
                date.setFullYear(y);
            }
        } else {
            date = new Date(y, m, d, h, M, s, ms);
        }

        return date;
    }

    function createUTCDate(y) {
        var date, args;
        // the Date.UTC function remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            args = Array.prototype.slice.call(arguments);
            // preserve leap years using a full 400 year cycle, then reset
            args[0] = y + 400;
            date = new Date(Date.UTC.apply(null, args));
            if (isFinite(date.getUTCFullYear())) {
                date.setUTCFullYear(y);
            }
        } else {
            date = new Date(Date.UTC.apply(null, arguments));
        }

        return date;
    }

    // start-of-first-week - start-of-year
    function firstWeekOffset(year, dow, doy) {
        var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
            fwd = 7 + dow - doy,
            // first-week day local weekday -- which local weekday is fwd
            fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

        return -fwdlw + fwd - 1;
    }

    // https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
        var localWeekday = (7 + weekday - dow) % 7,
            weekOffset = firstWeekOffset(year, dow, doy),
            dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
            resYear,
            resDayOfYear;

        if (dayOfYear <= 0) {
            resYear = year - 1;
            resDayOfYear = daysInYear(resYear) + dayOfYear;
        } else if (dayOfYear > daysInYear(year)) {
            resYear = year + 1;
            resDayOfYear = dayOfYear - daysInYear(year);
        } else {
            resYear = year;
            resDayOfYear = dayOfYear;
        }

        return {
            year: resYear,
            dayOfYear: resDayOfYear,
        };
    }

    function weekOfYear(mom, dow, doy) {
        var weekOffset = firstWeekOffset(mom.year(), dow, doy),
            week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
            resWeek,
            resYear;

        if (week < 1) {
            resYear = mom.year() - 1;
            resWeek = week + weeksInYear(resYear, dow, doy);
        } else if (week > weeksInYear(mom.year(), dow, doy)) {
            resWeek = week - weeksInYear(mom.year(), dow, doy);
            resYear = mom.year() + 1;
        } else {
            resYear = mom.year();
            resWeek = week;
        }

        return {
            week: resWeek,
            year: resYear,
        };
    }

    function weeksInYear(year, dow, doy) {
        var weekOffset = firstWeekOffset(year, dow, doy),
            weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
    }

    // FORMATTING

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PRIORITIES

    addUnitPriority('week', 5);
    addUnitPriority('isoWeek', 5);

    // PARSING

    addRegexToken('w', match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W', match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (
        input,
        week,
        config,
        token
    ) {
        week[token.substr(0, 1)] = toInt(input);
    });

    // HELPERS

    // LOCALES

    function localeWeek(mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow: 0, // Sunday is the first day of the week.
        doy: 6, // The week that contains Jan 6th is the first week of the year.
    };

    function localeFirstDayOfWeek() {
        return this._week.dow;
    }

    function localeFirstDayOfYear() {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek(input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek(input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    // FORMATTING

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PRIORITY
    addUnitPriority('day', 11);
    addUnitPriority('weekday', 11);
    addUnitPriority('isoWeekday', 11);

    // PARSING

    addRegexToken('d', match1to2);
    addRegexToken('e', match1to2);
    addRegexToken('E', match1to2);
    addRegexToken('dd', function (isStrict, locale) {
        return locale.weekdaysMinRegex(isStrict);
    });
    addRegexToken('ddd', function (isStrict, locale) {
        return locale.weekdaysShortRegex(isStrict);
    });
    addRegexToken('dddd', function (isStrict, locale) {
        return locale.weekdaysRegex(isStrict);
    });

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
        var weekday = config._locale.weekdaysParse(input, token, config._strict);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    function parseIsoWeekday(input, locale) {
        if (typeof input === 'string') {
            return locale.weekdaysParse(input) % 7 || 7;
        }
        return isNaN(input) ? null : input;
    }

    // LOCALES
    function shiftWeekdays(ws, n) {
        return ws.slice(n, 7).concat(ws.slice(0, n));
    }

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split(
            '_'
        ),
        defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
        defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
        defaultWeekdaysRegex = matchWord,
        defaultWeekdaysShortRegex = matchWord,
        defaultWeekdaysMinRegex = matchWord;

    function localeWeekdays(m, format) {
        var weekdays = isArray(this._weekdays)
            ? this._weekdays
            : this._weekdays[
                  m && m !== true && this._weekdays.isFormat.test(format)
                      ? 'format'
                      : 'standalone'
              ];
        return m === true
            ? shiftWeekdays(weekdays, this._week.dow)
            : m
            ? weekdays[m.day()]
            : weekdays;
    }

    function localeWeekdaysShort(m) {
        return m === true
            ? shiftWeekdays(this._weekdaysShort, this._week.dow)
            : m
            ? this._weekdaysShort[m.day()]
            : this._weekdaysShort;
    }

    function localeWeekdaysMin(m) {
        return m === true
            ? shiftWeekdays(this._weekdaysMin, this._week.dow)
            : m
            ? this._weekdaysMin[m.day()]
            : this._weekdaysMin;
    }

    function handleStrictParse$1(weekdayName, format, strict) {
        var i,
            ii,
            mom,
            llc = weekdayName.toLocaleLowerCase();
        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._minWeekdaysParse = [];

            for (i = 0; i < 7; ++i) {
                mom = createUTC([2000, 1]).day(i);
                this._minWeekdaysParse[i] = this.weekdaysMin(
                    mom,
                    ''
                ).toLocaleLowerCase();
                this._shortWeekdaysParse[i] = this.weekdaysShort(
                    mom,
                    ''
                ).toLocaleLowerCase();
                this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeWeekdaysParse(weekdayName, format, strict) {
        var i, mom, regex;

        if (this._weekdaysParseExact) {
            return handleStrictParse$1.call(this, weekdayName, format, strict);
        }

        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._minWeekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._fullWeekdaysParse = [];
        }

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already

            mom = createUTC([2000, 1]).day(i);
            if (strict && !this._fullWeekdaysParse[i]) {
                this._fullWeekdaysParse[i] = new RegExp(
                    '^' + this.weekdays(mom, '').replace('.', '\\.?') + '$',
                    'i'
                );
                this._shortWeekdaysParse[i] = new RegExp(
                    '^' + this.weekdaysShort(mom, '').replace('.', '\\.?') + '$',
                    'i'
                );
                this._minWeekdaysParse[i] = new RegExp(
                    '^' + this.weekdaysMin(mom, '').replace('.', '\\.?') + '$',
                    'i'
                );
            }
            if (!this._weekdaysParse[i]) {
                regex =
                    '^' +
                    this.weekdays(mom, '') +
                    '|^' +
                    this.weekdaysShort(mom, '') +
                    '|^' +
                    this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (
                strict &&
                format === 'dddd' &&
                this._fullWeekdaysParse[i].test(weekdayName)
            ) {
                return i;
            } else if (
                strict &&
                format === 'ddd' &&
                this._shortWeekdaysParse[i].test(weekdayName)
            ) {
                return i;
            } else if (
                strict &&
                format === 'dd' &&
                this._minWeekdaysParse[i].test(weekdayName)
            ) {
                return i;
            } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek(input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek(input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek(input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }

        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.

        if (input != null) {
            var weekday = parseIsoWeekday(input, this.localeData());
            return this.day(this.day() % 7 ? weekday : weekday - 7);
        } else {
            return this.day() || 7;
        }
    }

    function weekdaysRegex(isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysStrictRegex;
            } else {
                return this._weekdaysRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                this._weekdaysRegex = defaultWeekdaysRegex;
            }
            return this._weekdaysStrictRegex && isStrict
                ? this._weekdaysStrictRegex
                : this._weekdaysRegex;
        }
    }

    function weekdaysShortRegex(isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysShortStrictRegex;
            } else {
                return this._weekdaysShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysShortRegex')) {
                this._weekdaysShortRegex = defaultWeekdaysShortRegex;
            }
            return this._weekdaysShortStrictRegex && isStrict
                ? this._weekdaysShortStrictRegex
                : this._weekdaysShortRegex;
        }
    }

    function weekdaysMinRegex(isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysMinStrictRegex;
            } else {
                return this._weekdaysMinRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysMinRegex')) {
                this._weekdaysMinRegex = defaultWeekdaysMinRegex;
            }
            return this._weekdaysMinStrictRegex && isStrict
                ? this._weekdaysMinStrictRegex
                : this._weekdaysMinRegex;
        }
    }

    function computeWeekdaysParse() {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var minPieces = [],
            shortPieces = [],
            longPieces = [],
            mixedPieces = [],
            i,
            mom,
            minp,
            shortp,
            longp;
        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, 1]).day(i);
            minp = regexEscape(this.weekdaysMin(mom, ''));
            shortp = regexEscape(this.weekdaysShort(mom, ''));
            longp = regexEscape(this.weekdays(mom, ''));
            minPieces.push(minp);
            shortPieces.push(shortp);
            longPieces.push(longp);
            mixedPieces.push(minp);
            mixedPieces.push(shortp);
            mixedPieces.push(longp);
        }
        // Sorting makes sure if one weekday (or abbr) is a prefix of another it
        // will match the longer piece.
        minPieces.sort(cmpLenRev);
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);

        this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._weekdaysShortRegex = this._weekdaysRegex;
        this._weekdaysMinRegex = this._weekdaysRegex;

        this._weekdaysStrictRegex = new RegExp(
            '^(' + longPieces.join('|') + ')',
            'i'
        );
        this._weekdaysShortStrictRegex = new RegExp(
            '^(' + shortPieces.join('|') + ')',
            'i'
        );
        this._weekdaysMinStrictRegex = new RegExp(
            '^(' + minPieces.join('|') + ')',
            'i'
        );
    }

    // FORMATTING

    function hFormat() {
        return this.hours() % 12 || 12;
    }

    function kFormat() {
        return this.hours() || 24;
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, hFormat);
    addFormatToken('k', ['kk', 2], 0, kFormat);

    addFormatToken('hmm', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
    });

    addFormatToken('hmmss', 0, 0, function () {
        return (
            '' +
            hFormat.apply(this) +
            zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2)
        );
    });

    addFormatToken('Hmm', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2);
    });

    addFormatToken('Hmmss', 0, 0, function () {
        return (
            '' +
            this.hours() +
            zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2)
        );
    });

    function meridiem(token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(
                this.hours(),
                this.minutes(),
                lowercase
            );
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PRIORITY
    addUnitPriority('hour', 13);

    // PARSING

    function matchMeridiem(isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a', matchMeridiem);
    addRegexToken('A', matchMeridiem);
    addRegexToken('H', match1to2);
    addRegexToken('h', match1to2);
    addRegexToken('k', match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);
    addRegexToken('kk', match1to2, match2);

    addRegexToken('hmm', match3to4);
    addRegexToken('hmmss', match5to6);
    addRegexToken('Hmm', match3to4);
    addRegexToken('Hmmss', match5to6);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['k', 'kk'], function (input, array, config) {
        var kInput = toInt(input);
        array[HOUR] = kInput === 24 ? 0 : kInput;
    });
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmmss', function (input, array, config) {
        var pos1 = input.length - 4,
            pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('Hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
    });
    addParseToken('Hmmss', function (input, array, config) {
        var pos1 = input.length - 4,
            pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
    });

    // LOCALES

    function localeIsPM(input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return (input + '').toLowerCase().charAt(0) === 'p';
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i,
        // Setting the hour should keep the time, because the user explicitly
        // specified which hour they want. So trying to maintain the same hour (in
        // a new timezone) makes sense. Adding/subtracting hours does not follow
        // this rule.
        getSetHour = makeGetSet('Hours', true);

    function localeMeridiem(hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }

    var baseConfig = {
        calendar: defaultCalendar,
        longDateFormat: defaultLongDateFormat,
        invalidDate: defaultInvalidDate,
        ordinal: defaultOrdinal,
        dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
        relativeTime: defaultRelativeTime,

        months: defaultLocaleMonths,
        monthsShort: defaultLocaleMonthsShort,

        week: defaultLocaleWeek,

        weekdays: defaultLocaleWeekdays,
        weekdaysMin: defaultLocaleWeekdaysMin,
        weekdaysShort: defaultLocaleWeekdaysShort,

        meridiemParse: defaultLocaleMeridiemParse,
    };

    // internal storage for locale config files
    var locales = {},
        localeFamilies = {},
        globalLocale;

    function commonPrefix(arr1, arr2) {
        var i,
            minl = Math.min(arr1.length, arr2.length);
        for (i = 0; i < minl; i += 1) {
            if (arr1[i] !== arr2[i]) {
                return i;
            }
        }
        return minl;
    }

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0,
            j,
            next,
            locale,
            split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (
                    next &&
                    next.length >= j &&
                    commonPrefix(split, next) >= j - 1
                ) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return globalLocale;
    }

    function loadLocale(name) {
        var oldLocale = null,
            aliasedRequire;
        // TODO: Find a better way to register and load all the locales in Node
        if (
            locales[name] === undefined &&
            typeof module !== 'undefined' &&
            module &&
            module.exports
        ) {
            try {
                oldLocale = globalLocale._abbr;
                aliasedRequire = require;
                aliasedRequire('./locale/' + name);
                getSetGlobalLocale(oldLocale);
            } catch (e) {
                // mark as not found to avoid repeating expensive file require call causing high CPU
                // when trying to find en-US, en_US, en-us for every format call
                locales[name] = null; // null means not found
            }
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function getSetGlobalLocale(key, values) {
        var data;
        if (key) {
            if (isUndefined(values)) {
                data = getLocale(key);
            } else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            } else {
                if (typeof console !== 'undefined' && console.warn) {
                    //warn user if arguments are passed but the locale could not be set
                    console.warn(
                        'Locale ' + key + ' not found. Did you forget to load it?'
                    );
                }
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale(name, config) {
        if (config !== null) {
            var locale,
                parentConfig = baseConfig;
            config.abbr = name;
            if (locales[name] != null) {
                deprecateSimple(
                    'defineLocaleOverride',
                    'use moment.updateLocale(localeName, config) to change ' +
                        'an existing locale. moment.defineLocale(localeName, ' +
                        'config) should only be used for creating a new locale ' +
                        'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.'
                );
                parentConfig = locales[name]._config;
            } else if (config.parentLocale != null) {
                if (locales[config.parentLocale] != null) {
                    parentConfig = locales[config.parentLocale]._config;
                } else {
                    locale = loadLocale(config.parentLocale);
                    if (locale != null) {
                        parentConfig = locale._config;
                    } else {
                        if (!localeFamilies[config.parentLocale]) {
                            localeFamilies[config.parentLocale] = [];
                        }
                        localeFamilies[config.parentLocale].push({
                            name: name,
                            config: config,
                        });
                        return null;
                    }
                }
            }
            locales[name] = new Locale(mergeConfigs(parentConfig, config));

            if (localeFamilies[name]) {
                localeFamilies[name].forEach(function (x) {
                    defineLocale(x.name, x.config);
                });
            }

            // backwards compat for now: also set the locale
            // make sure we set the locale AFTER all child locales have been
            // created, so we won't end up with the child locale set.
            getSetGlobalLocale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    function updateLocale(name, config) {
        if (config != null) {
            var locale,
                tmpLocale,
                parentConfig = baseConfig;

            if (locales[name] != null && locales[name].parentLocale != null) {
                // Update existing child locale in-place to avoid memory-leaks
                locales[name].set(mergeConfigs(locales[name]._config, config));
            } else {
                // MERGE
                tmpLocale = loadLocale(name);
                if (tmpLocale != null) {
                    parentConfig = tmpLocale._config;
                }
                config = mergeConfigs(parentConfig, config);
                if (tmpLocale == null) {
                    // updateLocale is called for creating a new locale
                    // Set abbr so it will have a name (getters return
                    // undefined otherwise).
                    config.abbr = name;
                }
                locale = new Locale(config);
                locale.parentLocale = locales[name];
                locales[name] = locale;
            }

            // backwards compat for now: also set the locale
            getSetGlobalLocale(name);
        } else {
            // pass null for config to unupdate, useful for tests
            if (locales[name] != null) {
                if (locales[name].parentLocale != null) {
                    locales[name] = locales[name].parentLocale;
                    if (name === getSetGlobalLocale()) {
                        getSetGlobalLocale(name);
                    }
                } else if (locales[name] != null) {
                    delete locales[name];
                }
            }
        }
        return locales[name];
    }

    // returns locale data
    function getLocale(key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    function listLocales() {
        return keys(locales);
    }

    function checkOverflow(m) {
        var overflow,
            a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH] < 0 || a[MONTH] > 11
                    ? MONTH
                    : a[DATE] < 1 || a[DATE] > daysInMonth(a[YEAR], a[MONTH])
                    ? DATE
                    : a[HOUR] < 0 ||
                      a[HOUR] > 24 ||
                      (a[HOUR] === 24 &&
                          (a[MINUTE] !== 0 ||
                              a[SECOND] !== 0 ||
                              a[MILLISECOND] !== 0))
                    ? HOUR
                    : a[MINUTE] < 0 || a[MINUTE] > 59
                    ? MINUTE
                    : a[SECOND] < 0 || a[SECOND] > 59
                    ? SECOND
                    : a[MILLISECOND] < 0 || a[MILLISECOND] > 999
                    ? MILLISECOND
                    : -1;

            if (
                getParsingFlags(m)._overflowDayOfYear &&
                (overflow < YEAR || overflow > DATE)
            ) {
                overflow = DATE;
            }
            if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
                overflow = WEEK;
            }
            if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
                overflow = WEEKDAY;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    // iso 8601 regex
    // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
    var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
        basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
        tzRegex = /Z|[+-]\d\d(?::?\d\d)?/,
        isoDates = [
            ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
            ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
            ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
            ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
            ['YYYY-DDD', /\d{4}-\d{3}/],
            ['YYYY-MM', /\d{4}-\d\d/, false],
            ['YYYYYYMMDD', /[+-]\d{10}/],
            ['YYYYMMDD', /\d{8}/],
            ['GGGG[W]WWE', /\d{4}W\d{3}/],
            ['GGGG[W]WW', /\d{4}W\d{2}/, false],
            ['YYYYDDD', /\d{7}/],
            ['YYYYMM', /\d{6}/, false],
            ['YYYY', /\d{4}/, false],
        ],
        // iso time formats and regexes
        isoTimes = [
            ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
            ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
            ['HH:mm:ss', /\d\d:\d\d:\d\d/],
            ['HH:mm', /\d\d:\d\d/],
            ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
            ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
            ['HHmmss', /\d\d\d\d\d\d/],
            ['HHmm', /\d\d\d\d/],
            ['HH', /\d\d/],
        ],
        aspNetJsonRegex = /^\/?Date\((-?\d+)/i,
        // RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
        rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/,
        obsOffsets = {
            UT: 0,
            GMT: 0,
            EDT: -4 * 60,
            EST: -5 * 60,
            CDT: -5 * 60,
            CST: -6 * 60,
            MDT: -6 * 60,
            MST: -7 * 60,
            PDT: -7 * 60,
            PST: -8 * 60,
        };

    // date from iso format
    function configFromISO(config) {
        var i,
            l,
            string = config._i,
            match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
            allowTime,
            dateFormat,
            timeFormat,
            tzFormat;

        if (match) {
            getParsingFlags(config).iso = true;

            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(match[1])) {
                    dateFormat = isoDates[i][0];
                    allowTime = isoDates[i][2] !== false;
                    break;
                }
            }
            if (dateFormat == null) {
                config._isValid = false;
                return;
            }
            if (match[3]) {
                for (i = 0, l = isoTimes.length; i < l; i++) {
                    if (isoTimes[i][1].exec(match[3])) {
                        // match[2] should be 'T' or space
                        timeFormat = (match[2] || ' ') + isoTimes[i][0];
                        break;
                    }
                }
                if (timeFormat == null) {
                    config._isValid = false;
                    return;
                }
            }
            if (!allowTime && timeFormat != null) {
                config._isValid = false;
                return;
            }
            if (match[4]) {
                if (tzRegex.exec(match[4])) {
                    tzFormat = 'Z';
                } else {
                    config._isValid = false;
                    return;
                }
            }
            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    function extractFromRFC2822Strings(
        yearStr,
        monthStr,
        dayStr,
        hourStr,
        minuteStr,
        secondStr
    ) {
        var result = [
            untruncateYear(yearStr),
            defaultLocaleMonthsShort.indexOf(monthStr),
            parseInt(dayStr, 10),
            parseInt(hourStr, 10),
            parseInt(minuteStr, 10),
        ];

        if (secondStr) {
            result.push(parseInt(secondStr, 10));
        }

        return result;
    }

    function untruncateYear(yearStr) {
        var year = parseInt(yearStr, 10);
        if (year <= 49) {
            return 2000 + year;
        } else if (year <= 999) {
            return 1900 + year;
        }
        return year;
    }

    function preprocessRFC2822(s) {
        // Remove comments and folding whitespace and replace multiple-spaces with a single space
        return s
            .replace(/\([^)]*\)|[\n\t]/g, ' ')
            .replace(/(\s\s+)/g, ' ')
            .replace(/^\s\s*/, '')
            .replace(/\s\s*$/, '');
    }

    function checkWeekday(weekdayStr, parsedInput, config) {
        if (weekdayStr) {
            // TODO: Replace the vanilla JS Date object with an independent day-of-week check.
            var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr),
                weekdayActual = new Date(
                    parsedInput[0],
                    parsedInput[1],
                    parsedInput[2]
                ).getDay();
            if (weekdayProvided !== weekdayActual) {
                getParsingFlags(config).weekdayMismatch = true;
                config._isValid = false;
                return false;
            }
        }
        return true;
    }

    function calculateOffset(obsOffset, militaryOffset, numOffset) {
        if (obsOffset) {
            return obsOffsets[obsOffset];
        } else if (militaryOffset) {
            // the only allowed military tz is Z
            return 0;
        } else {
            var hm = parseInt(numOffset, 10),
                m = hm % 100,
                h = (hm - m) / 100;
            return h * 60 + m;
        }
    }

    // date and time from ref 2822 format
    function configFromRFC2822(config) {
        var match = rfc2822.exec(preprocessRFC2822(config._i)),
            parsedArray;
        if (match) {
            parsedArray = extractFromRFC2822Strings(
                match[4],
                match[3],
                match[2],
                match[5],
                match[6],
                match[7]
            );
            if (!checkWeekday(match[1], parsedArray, config)) {
                return;
            }

            config._a = parsedArray;
            config._tzm = calculateOffset(match[8], match[9], match[10]);

            config._d = createUTCDate.apply(null, config._a);
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);

            getParsingFlags(config).rfc2822 = true;
        } else {
            config._isValid = false;
        }
    }

    // date from 1) ASP.NET, 2) ISO, 3) RFC 2822 formats, or 4) optional fallback if parsing isn't strict
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);
        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        configFromRFC2822(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        if (config._strict) {
            config._isValid = false;
        } else {
            // Final attempt, use Input Fallback
            hooks.createFromInputFallback(config);
        }
    }

    hooks.createFromInputFallback = deprecate(
        'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +
            'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +
            'discouraged and will be removed in an upcoming major release. Please refer to ' +
            'http://momentjs.com/guides/#/warnings/js-date/ for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        // hooks is actually the exported moment object
        var nowValue = new Date(hooks.now());
        if (config._useUTC) {
            return [
                nowValue.getUTCFullYear(),
                nowValue.getUTCMonth(),
                nowValue.getUTCDate(),
            ];
        }
        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray(config) {
        var i,
            date,
            input = [],
            currentDate,
            expectedWeekday,
            yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear != null) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (
                config._dayOfYear > daysInYear(yearToUse) ||
                config._dayOfYear === 0
            ) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] =
                config._a[i] == null ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (
            config._a[HOUR] === 24 &&
            config._a[MINUTE] === 0 &&
            config._a[SECOND] === 0 &&
            config._a[MILLISECOND] === 0
        ) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(
            null,
            input
        );
        expectedWeekday = config._useUTC
            ? config._d.getUTCDay()
            : config._d.getDay();

        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }

        // check for mismatching day of week
        if (
            config._w &&
            typeof config._w.d !== 'undefined' &&
            config._w.d !== expectedWeekday
        ) {
            getParsingFlags(config).weekdayMismatch = true;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow, curWeek;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(
                w.GG,
                config._a[YEAR],
                weekOfYear(createLocal(), 1, 4).year
            );
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
            if (weekday < 1 || weekday > 7) {
                weekdayOverflow = true;
            }
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            curWeek = weekOfYear(createLocal(), dow, doy);

            weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

            // Default to current week.
            week = defaults(w.w, curWeek.week);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < 0 || weekday > 6) {
                    weekdayOverflow = true;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from beginning of week
                weekday = w.e + dow;
                if (w.e < 0 || w.e > 6) {
                    weekdayOverflow = true;
                }
            } else {
                // default to beginning of week
                weekday = dow;
            }
        }
        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
            getParsingFlags(config)._overflowWeeks = true;
        } else if (weekdayOverflow != null) {
            getParsingFlags(config)._overflowWeekday = true;
        } else {
            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
            config._a[YEAR] = temp.year;
            config._dayOfYear = temp.dayOfYear;
        }
    }

    // constant that refers to the ISO standard
    hooks.ISO_8601 = function () {};

    // constant that refers to the RFC 2822 form
    hooks.RFC_2822 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === hooks.ISO_8601) {
            configFromISO(config);
            return;
        }
        if (config._f === hooks.RFC_2822) {
            configFromRFC2822(config);
            return;
        }
        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i,
            parsedInput,
            tokens,
            token,
            skipped,
            stringLength = string.length,
            totalParsedInputLength = 0,
            era;

        tokens =
            expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) ||
                [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(
                    string.indexOf(parsedInput) + parsedInput.length
                );
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                } else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            } else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver =
            stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (
            config._a[HOUR] <= 12 &&
            getParsingFlags(config).bigHour === true &&
            config._a[HOUR] > 0
        ) {
            getParsingFlags(config).bigHour = undefined;
        }

        getParsingFlags(config).parsedDateParts = config._a.slice(0);
        getParsingFlags(config).meridiem = config._meridiem;
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(
            config._locale,
            config._a[HOUR],
            config._meridiem
        );

        // handle era
        era = getParsingFlags(config).era;
        if (era !== null) {
            config._a[YEAR] = config._locale.erasConvertYear(era, config._a[YEAR]);
        }

        configFromArray(config);
        checkOverflow(config);
    }

    function meridiemFixWrap(locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    // date from string and array of format strings
    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,
            scoreToBeat,
            i,
            currentScore,
            validFormatFound,
            bestFormatIsValid = false;

        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            validFormatFound = false;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (isValid(tempConfig)) {
                validFormatFound = true;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (!bestFormatIsValid) {
                if (
                    scoreToBeat == null ||
                    currentScore < scoreToBeat ||
                    validFormatFound
                ) {
                    scoreToBeat = currentScore;
                    bestMoment = tempConfig;
                    if (validFormatFound) {
                        bestFormatIsValid = true;
                    }
                }
            } else {
                if (currentScore < scoreToBeat) {
                    scoreToBeat = currentScore;
                    bestMoment = tempConfig;
                }
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i),
            dayOrDate = i.day === undefined ? i.date : i.day;
        config._a = map(
            [i.year, i.month, dayOrDate, i.hour, i.minute, i.second, i.millisecond],
            function (obj) {
                return obj && parseInt(obj, 10);
            }
        );

        configFromArray(config);
    }

    function createFromConfig(config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig(config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return createInvalid({ nullInput: true });
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isDate(input)) {
            config._d = input;
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        } else {
            configFromInput(config);
        }

        if (!isValid(config)) {
            config._d = null;
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (isUndefined(input)) {
            config._d = new Date(hooks.now());
        } else if (isDate(input)) {
            config._d = new Date(input.valueOf());
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (isObject(input)) {
            configFromObject(config);
        } else if (isNumber(input)) {
            // from milliseconds
            config._d = new Date(input);
        } else {
            hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC(input, format, locale, strict, isUTC) {
        var c = {};

        if (format === true || format === false) {
            strict = format;
            format = undefined;
        }

        if (locale === true || locale === false) {
            strict = locale;
            locale = undefined;
        }

        if (
            (isObject(input) && isObjectEmpty(input)) ||
            (isArray(input) && input.length === 0)
        ) {
            input = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function createLocal(input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
            'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
            function () {
                var other = createLocal.apply(null, arguments);
                if (this.isValid() && other.isValid()) {
                    return other < this ? this : other;
                } else {
                    return createInvalid();
                }
            }
        ),
        prototypeMax = deprecate(
            'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
            function () {
                var other = createLocal.apply(null, arguments);
                if (this.isValid() && other.isValid()) {
                    return other > this ? this : other;
                } else {
                    return createInvalid();
                }
            }
        );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min() {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max() {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    var now = function () {
        return Date.now ? Date.now() : +new Date();
    };

    var ordering = [
        'year',
        'quarter',
        'month',
        'week',
        'day',
        'hour',
        'minute',
        'second',
        'millisecond',
    ];

    function isDurationValid(m) {
        var key,
            unitHasDecimal = false,
            i;
        for (key in m) {
            if (
                hasOwnProp(m, key) &&
                !(
                    indexOf.call(ordering, key) !== -1 &&
                    (m[key] == null || !isNaN(m[key]))
                )
            ) {
                return false;
            }
        }

        for (i = 0; i < ordering.length; ++i) {
            if (m[ordering[i]]) {
                if (unitHasDecimal) {
                    return false; // only allow non-integers for smallest unit
                }
                if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
                    unitHasDecimal = true;
                }
            }
        }

        return true;
    }

    function isValid$1() {
        return this._isValid;
    }

    function createInvalid$1() {
        return createDuration(NaN);
    }

    function Duration(duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || normalizedInput.isoWeek || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        this._isValid = isDurationValid(normalizedInput);

        // representation for dateAddRemove
        this._milliseconds =
            +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days + weeks * 7;
        // It is impossible to translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months + quarters * 3 + years * 12;

        this._data = {};

        this._locale = getLocale();

        this._bubble();
    }

    function isDuration(obj) {
        return obj instanceof Duration;
    }

    function absRound(number) {
        if (number < 0) {
            return Math.round(-1 * number) * -1;
        } else {
            return Math.round(number);
        }
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if (
                (dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))
            ) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    // FORMATTING

    function offset(token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset(),
                sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return (
                sign +
                zeroFill(~~(offset / 60), 2) +
                separator +
                zeroFill(~~offset % 60, 2)
            );
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z', matchShortOffset);
    addRegexToken('ZZ', matchShortOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(matchShortOffset, input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(matcher, string) {
        var matches = (string || '').match(matcher),
            chunk,
            parts,
            minutes;

        if (matches === null) {
            return null;
        }

        chunk = matches[matches.length - 1] || [];
        parts = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        minutes = +(parts[1] * 60) + toInt(parts[2]);

        return minutes === 0 ? 0 : parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff =
                (isMoment(input) || isDate(input)
                    ? input.valueOf()
                    : createLocal(input).valueOf()) - res.valueOf();
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(res._d.valueOf() + diff);
            hooks.updateOffset(res, false);
            return res;
        } else {
            return createLocal(input).local();
        }
    }

    function getDateOffset(m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset());
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset(input, keepLocalTime, keepMinutes) {
        var offset = this._offset || 0,
            localAdjust;
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(matchShortOffset, input);
                if (input === null) {
                    return this;
                }
            } else if (Math.abs(input) < 16 && !keepMinutes) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    addSubtract(
                        this,
                        createDuration(input - offset, 'm'),
                        1,
                        false
                    );
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone(input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC(keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal(keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset() {
        if (this._tzm != null) {
            this.utcOffset(this._tzm, false, true);
        } else if (typeof this._i === 'string') {
            var tZone = offsetFromString(matchOffset, this._i);
            if (tZone != null) {
                this.utcOffset(tZone);
            } else {
                this.utcOffset(0, true);
            }
        }
        return this;
    }

    function hasAlignedHourOffset(input) {
        if (!this.isValid()) {
            return false;
        }
        input = input ? createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime() {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted() {
        if (!isUndefined(this._isDSTShifted)) {
            return this._isDSTShifted;
        }

        var c = {},
            other;

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
            this._isDSTShifted =
                this.isValid() && compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal() {
        return this.isValid() ? !this._isUTC : false;
    }

    function isUtcOffset() {
        return this.isValid() ? this._isUTC : false;
    }

    function isUtc() {
        return this.isValid() ? this._isUTC && this._offset === 0 : false;
    }

    // ASP.NET json date format regex
    var aspNetRegex = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/,
        // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
        // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
        // and further modified to allow for strings containing both week and day
        isoRegex = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

    function createDuration(input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms: input._milliseconds,
                d: input._days,
                M: input._months,
            };
        } else if (isNumber(input) || !isNaN(+input)) {
            duration = {};
            if (key) {
                duration[key] = +input;
            } else {
                duration.milliseconds = +input;
            }
        } else if ((match = aspNetRegex.exec(input))) {
            sign = match[1] === '-' ? -1 : 1;
            duration = {
                y: 0,
                d: toInt(match[DATE]) * sign,
                h: toInt(match[HOUR]) * sign,
                m: toInt(match[MINUTE]) * sign,
                s: toInt(match[SECOND]) * sign,
                ms: toInt(absRound(match[MILLISECOND] * 1000)) * sign, // the millisecond decimal point is included in the match
            };
        } else if ((match = isoRegex.exec(input))) {
            sign = match[1] === '-' ? -1 : 1;
            duration = {
                y: parseIso(match[2], sign),
                M: parseIso(match[3], sign),
                w: parseIso(match[4], sign),
                d: parseIso(match[5], sign),
                h: parseIso(match[6], sign),
                m: parseIso(match[7], sign),
                s: parseIso(match[8], sign),
            };
        } else if (duration == null) {
            // checks for null or undefined
            duration = {};
        } else if (
            typeof duration === 'object' &&
            ('from' in duration || 'to' in duration)
        ) {
            diffRes = momentsDifference(
                createLocal(duration.from),
                createLocal(duration.to)
            );

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        if (isDuration(input) && hasOwnProp(input, '_isValid')) {
            ret._isValid = input._isValid;
        }

        return ret;
    }

    createDuration.fn = Duration.prototype;
    createDuration.invalid = createInvalid$1;

    function parseIso(inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {};

        res.months =
            other.month() - base.month() + (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +base.clone().add(res.months, 'M');

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        if (!(base.isValid() && other.isValid())) {
            return { milliseconds: 0, months: 0 };
        }

        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    // TODO: remove 'name' arg after deprecation is removed
    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(
                    name,
                    'moment().' +
                        name +
                        '(period, number) is deprecated. Please use moment().' +
                        name +
                        '(number, period). ' +
                        'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.'
                );
                tmp = val;
                val = period;
                period = tmp;
            }

            dur = createDuration(val, period);
            addSubtract(this, dur, direction);
            return this;
        };
    }

    function addSubtract(mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = absRound(duration._days),
            months = absRound(duration._months);

        if (!mom.isValid()) {
            // No op
            return;
        }

        updateOffset = updateOffset == null ? true : updateOffset;

        if (months) {
            setMonth(mom, get(mom, 'Month') + months * isAdding);
        }
        if (days) {
            set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
        }
        if (milliseconds) {
            mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
        }
        if (updateOffset) {
            hooks.updateOffset(mom, days || months);
        }
    }

    var add = createAdder(1, 'add'),
        subtract = createAdder(-1, 'subtract');

    function isString(input) {
        return typeof input === 'string' || input instanceof String;
    }

    // type MomentInput = Moment | Date | string | number | (number | string)[] | MomentInputObject | void; // null | undefined
    function isMomentInput(input) {
        return (
            isMoment(input) ||
            isDate(input) ||
            isString(input) ||
            isNumber(input) ||
            isNumberOrStringArray(input) ||
            isMomentInputObject(input) ||
            input === null ||
            input === undefined
        );
    }

    function isMomentInputObject(input) {
        var objectTest = isObject(input) && !isObjectEmpty(input),
            propertyTest = false,
            properties = [
                'years',
                'year',
                'y',
                'months',
                'month',
                'M',
                'days',
                'day',
                'd',
                'dates',
                'date',
                'D',
                'hours',
                'hour',
                'h',
                'minutes',
                'minute',
                'm',
                'seconds',
                'second',
                's',
                'milliseconds',
                'millisecond',
                'ms',
            ],
            i,
            property;

        for (i = 0; i < properties.length; i += 1) {
            property = properties[i];
            propertyTest = propertyTest || hasOwnProp(input, property);
        }

        return objectTest && propertyTest;
    }

    function isNumberOrStringArray(input) {
        var arrayTest = isArray(input),
            dataTypeTest = false;
        if (arrayTest) {
            dataTypeTest =
                input.filter(function (item) {
                    return !isNumber(item) && isString(input);
                }).length === 0;
        }
        return arrayTest && dataTypeTest;
    }

    function isCalendarSpec(input) {
        var objectTest = isObject(input) && !isObjectEmpty(input),
            propertyTest = false,
            properties = [
                'sameDay',
                'nextDay',
                'lastDay',
                'nextWeek',
                'lastWeek',
                'sameElse',
            ],
            i,
            property;

        for (i = 0; i < properties.length; i += 1) {
            property = properties[i];
            propertyTest = propertyTest || hasOwnProp(input, property);
        }

        return objectTest && propertyTest;
    }

    function getCalendarFormat(myMoment, now) {
        var diff = myMoment.diff(now, 'days', true);
        return diff < -6
            ? 'sameElse'
            : diff < -1
            ? 'lastWeek'
            : diff < 0
            ? 'lastDay'
            : diff < 1
            ? 'sameDay'
            : diff < 2
            ? 'nextDay'
            : diff < 7
            ? 'nextWeek'
            : 'sameElse';
    }

    function calendar$1(time, formats) {
        // Support for single parameter, formats only overload to the calendar function
        if (arguments.length === 1) {
            if (isMomentInput(arguments[0])) {
                time = arguments[0];
                formats = undefined;
            } else if (isCalendarSpec(arguments[0])) {
                formats = arguments[0];
                time = undefined;
            }
        }
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            format = hooks.calendarFormat(this, sod) || 'sameElse',
            output =
                formats &&
                (isFunction(formats[format])
                    ? formats[format].call(this, now)
                    : formats[format]);

        return this.format(
            output || this.localeData().calendar(format, this, createLocal(now))
        );
    }

    function clone() {
        return new Moment(this);
    }

    function isAfter(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() > localInput.valueOf();
        } else {
            return localInput.valueOf() < this.clone().startOf(units).valueOf();
        }
    }

    function isBefore(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() < localInput.valueOf();
        } else {
            return this.clone().endOf(units).valueOf() < localInput.valueOf();
        }
    }

    function isBetween(from, to, units, inclusivity) {
        var localFrom = isMoment(from) ? from : createLocal(from),
            localTo = isMoment(to) ? to : createLocal(to);
        if (!(this.isValid() && localFrom.isValid() && localTo.isValid())) {
            return false;
        }
        inclusivity = inclusivity || '()';
        return (
            (inclusivity[0] === '('
                ? this.isAfter(localFrom, units)
                : !this.isBefore(localFrom, units)) &&
            (inclusivity[1] === ')'
                ? this.isBefore(localTo, units)
                : !this.isAfter(localTo, units))
        );
    }

    function isSame(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input),
            inputMs;
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() === localInput.valueOf();
        } else {
            inputMs = localInput.valueOf();
            return (
                this.clone().startOf(units).valueOf() <= inputMs &&
                inputMs <= this.clone().endOf(units).valueOf()
            );
        }
    }

    function isSameOrAfter(input, units) {
        return this.isSame(input, units) || this.isAfter(input, units);
    }

    function isSameOrBefore(input, units) {
        return this.isSame(input, units) || this.isBefore(input, units);
    }

    function diff(input, units, asFloat) {
        var that, zoneDelta, output;

        if (!this.isValid()) {
            return NaN;
        }

        that = cloneWithOffset(input, this);

        if (!that.isValid()) {
            return NaN;
        }

        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

        units = normalizeUnits(units);

        switch (units) {
            case 'year':
                output = monthDiff(this, that) / 12;
                break;
            case 'month':
                output = monthDiff(this, that);
                break;
            case 'quarter':
                output = monthDiff(this, that) / 3;
                break;
            case 'second':
                output = (this - that) / 1e3;
                break; // 1000
            case 'minute':
                output = (this - that) / 6e4;
                break; // 1000 * 60
            case 'hour':
                output = (this - that) / 36e5;
                break; // 1000 * 60 * 60
            case 'day':
                output = (this - that - zoneDelta) / 864e5;
                break; // 1000 * 60 * 60 * 24, negate dst
            case 'week':
                output = (this - that - zoneDelta) / 6048e5;
                break; // 1000 * 60 * 60 * 24 * 7, negate dst
            default:
                output = this - that;
        }

        return asFloat ? output : absFloor(output);
    }

    function monthDiff(a, b) {
        if (a.date() < b.date()) {
            // end-of-month calculations work correct when the start month has more
            // days than the end month.
            return -monthDiff(b, a);
        }
        // difference in months
        var wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2,
            adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        //check for negative zero, return zero if negative zero
        return -(wholeMonthDiff + adjust) || 0;
    }

    hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
    hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

    function toString() {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function toISOString(keepOffset) {
        if (!this.isValid()) {
            return null;
        }
        var utc = keepOffset !== true,
            m = utc ? this.clone().utc() : this;
        if (m.year() < 0 || m.year() > 9999) {
            return formatMoment(
                m,
                utc
                    ? 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]'
                    : 'YYYYYY-MM-DD[T]HH:mm:ss.SSSZ'
            );
        }
        if (isFunction(Date.prototype.toISOString)) {
            // native implementation is ~50x faster, use it when we can
            if (utc) {
                return this.toDate().toISOString();
            } else {
                return new Date(this.valueOf() + this.utcOffset() * 60 * 1000)
                    .toISOString()
                    .replace('Z', formatMoment(m, 'Z'));
            }
        }
        return formatMoment(
            m,
            utc ? 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYY-MM-DD[T]HH:mm:ss.SSSZ'
        );
    }

    /**
     * Return a human readable representation of a moment that can
     * also be evaluated to get a new moment which is the same
     *
     * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
     */
    function inspect() {
        if (!this.isValid()) {
            return 'moment.invalid(/* ' + this._i + ' */)';
        }
        var func = 'moment',
            zone = '',
            prefix,
            year,
            datetime,
            suffix;
        if (!this.isLocal()) {
            func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
            zone = 'Z';
        }
        prefix = '[' + func + '("]';
        year = 0 <= this.year() && this.year() <= 9999 ? 'YYYY' : 'YYYYYY';
        datetime = '-MM-DD[T]HH:mm:ss.SSS';
        suffix = zone + '[")]';

        return this.format(prefix + year + datetime + suffix);
    }

    function format(inputString) {
        if (!inputString) {
            inputString = this.isUtc()
                ? hooks.defaultFormatUtc
                : hooks.defaultFormat;
        }
        var output = formatMoment(this, inputString);
        return this.localeData().postformat(output);
    }

    function from(time, withoutSuffix) {
        if (
            this.isValid() &&
            ((isMoment(time) && time.isValid()) || createLocal(time).isValid())
        ) {
            return createDuration({ to: this, from: time })
                .locale(this.locale())
                .humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function fromNow(withoutSuffix) {
        return this.from(createLocal(), withoutSuffix);
    }

    function to(time, withoutSuffix) {
        if (
            this.isValid() &&
            ((isMoment(time) && time.isValid()) || createLocal(time).isValid())
        ) {
            return createDuration({ from: this, to: time })
                .locale(this.locale())
                .humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function toNow(withoutSuffix) {
        return this.to(createLocal(), withoutSuffix);
    }

    // If passed a locale key, it will set the locale for this
    // instance.  Otherwise, it will return the locale configuration
    // variables for this instance.
    function locale(key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData() {
        return this._locale;
    }

    var MS_PER_SECOND = 1000,
        MS_PER_MINUTE = 60 * MS_PER_SECOND,
        MS_PER_HOUR = 60 * MS_PER_MINUTE,
        MS_PER_400_YEARS = (365 * 400 + 97) * 24 * MS_PER_HOUR;

    // actual modulo - handles negative numbers (for dates before 1970):
    function mod$1(dividend, divisor) {
        return ((dividend % divisor) + divisor) % divisor;
    }

    function localStartOfDate(y, m, d) {
        // the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            return new Date(y + 400, m, d) - MS_PER_400_YEARS;
        } else {
            return new Date(y, m, d).valueOf();
        }
    }

    function utcStartOfDate(y, m, d) {
        // Date.UTC remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            return Date.UTC(y + 400, m, d) - MS_PER_400_YEARS;
        } else {
            return Date.UTC(y, m, d);
        }
    }

    function startOf(units) {
        var time, startOfDate;
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond' || !this.isValid()) {
            return this;
        }

        startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

        switch (units) {
            case 'year':
                time = startOfDate(this.year(), 0, 1);
                break;
            case 'quarter':
                time = startOfDate(
                    this.year(),
                    this.month() - (this.month() % 3),
                    1
                );
                break;
            case 'month':
                time = startOfDate(this.year(), this.month(), 1);
                break;
            case 'week':
                time = startOfDate(
                    this.year(),
                    this.month(),
                    this.date() - this.weekday()
                );
                break;
            case 'isoWeek':
                time = startOfDate(
                    this.year(),
                    this.month(),
                    this.date() - (this.isoWeekday() - 1)
                );
                break;
            case 'day':
            case 'date':
                time = startOfDate(this.year(), this.month(), this.date());
                break;
            case 'hour':
                time = this._d.valueOf();
                time -= mod$1(
                    time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
                    MS_PER_HOUR
                );
                break;
            case 'minute':
                time = this._d.valueOf();
                time -= mod$1(time, MS_PER_MINUTE);
                break;
            case 'second':
                time = this._d.valueOf();
                time -= mod$1(time, MS_PER_SECOND);
                break;
        }

        this._d.setTime(time);
        hooks.updateOffset(this, true);
        return this;
    }

    function endOf(units) {
        var time, startOfDate;
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond' || !this.isValid()) {
            return this;
        }

        startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

        switch (units) {
            case 'year':
                time = startOfDate(this.year() + 1, 0, 1) - 1;
                break;
            case 'quarter':
                time =
                    startOfDate(
                        this.year(),
                        this.month() - (this.month() % 3) + 3,
                        1
                    ) - 1;
                break;
            case 'month':
                time = startOfDate(this.year(), this.month() + 1, 1) - 1;
                break;
            case 'week':
                time =
                    startOfDate(
                        this.year(),
                        this.month(),
                        this.date() - this.weekday() + 7
                    ) - 1;
                break;
            case 'isoWeek':
                time =
                    startOfDate(
                        this.year(),
                        this.month(),
                        this.date() - (this.isoWeekday() - 1) + 7
                    ) - 1;
                break;
            case 'day':
            case 'date':
                time = startOfDate(this.year(), this.month(), this.date() + 1) - 1;
                break;
            case 'hour':
                time = this._d.valueOf();
                time +=
                    MS_PER_HOUR -
                    mod$1(
                        time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
                        MS_PER_HOUR
                    ) -
                    1;
                break;
            case 'minute':
                time = this._d.valueOf();
                time += MS_PER_MINUTE - mod$1(time, MS_PER_MINUTE) - 1;
                break;
            case 'second':
                time = this._d.valueOf();
                time += MS_PER_SECOND - mod$1(time, MS_PER_SECOND) - 1;
                break;
        }

        this._d.setTime(time);
        hooks.updateOffset(this, true);
        return this;
    }

    function valueOf() {
        return this._d.valueOf() - (this._offset || 0) * 60000;
    }

    function unix() {
        return Math.floor(this.valueOf() / 1000);
    }

    function toDate() {
        return new Date(this.valueOf());
    }

    function toArray() {
        var m = this;
        return [
            m.year(),
            m.month(),
            m.date(),
            m.hour(),
            m.minute(),
            m.second(),
            m.millisecond(),
        ];
    }

    function toObject() {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds(),
        };
    }

    function toJSON() {
        // new Date(NaN).toJSON() === null
        return this.isValid() ? this.toISOString() : null;
    }

    function isValid$2() {
        return isValid(this);
    }

    function parsingFlags() {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt() {
        return getParsingFlags(this).overflow;
    }

    function creationData() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict,
        };
    }

    addFormatToken('N', 0, 0, 'eraAbbr');
    addFormatToken('NN', 0, 0, 'eraAbbr');
    addFormatToken('NNN', 0, 0, 'eraAbbr');
    addFormatToken('NNNN', 0, 0, 'eraName');
    addFormatToken('NNNNN', 0, 0, 'eraNarrow');

    addFormatToken('y', ['y', 1], 'yo', 'eraYear');
    addFormatToken('y', ['yy', 2], 0, 'eraYear');
    addFormatToken('y', ['yyy', 3], 0, 'eraYear');
    addFormatToken('y', ['yyyy', 4], 0, 'eraYear');

    addRegexToken('N', matchEraAbbr);
    addRegexToken('NN', matchEraAbbr);
    addRegexToken('NNN', matchEraAbbr);
    addRegexToken('NNNN', matchEraName);
    addRegexToken('NNNNN', matchEraNarrow);

    addParseToken(['N', 'NN', 'NNN', 'NNNN', 'NNNNN'], function (
        input,
        array,
        config,
        token
    ) {
        var era = config._locale.erasParse(input, token, config._strict);
        if (era) {
            getParsingFlags(config).era = era;
        } else {
            getParsingFlags(config).invalidEra = input;
        }
    });

    addRegexToken('y', matchUnsigned);
    addRegexToken('yy', matchUnsigned);
    addRegexToken('yyy', matchUnsigned);
    addRegexToken('yyyy', matchUnsigned);
    addRegexToken('yo', matchEraYearOrdinal);

    addParseToken(['y', 'yy', 'yyy', 'yyyy'], YEAR);
    addParseToken(['yo'], function (input, array, config, token) {
        var match;
        if (config._locale._eraYearOrdinalRegex) {
            match = input.match(config._locale._eraYearOrdinalRegex);
        }

        if (config._locale.eraYearOrdinalParse) {
            array[YEAR] = config._locale.eraYearOrdinalParse(input, match);
        } else {
            array[YEAR] = parseInt(input, 10);
        }
    });

    function localeEras(m, format) {
        var i,
            l,
            date,
            eras = this._eras || getLocale('en')._eras;
        for (i = 0, l = eras.length; i < l; ++i) {
            switch (typeof eras[i].since) {
                case 'string':
                    // truncate time
                    date = hooks(eras[i].since).startOf('day');
                    eras[i].since = date.valueOf();
                    break;
            }

            switch (typeof eras[i].until) {
                case 'undefined':
                    eras[i].until = +Infinity;
                    break;
                case 'string':
                    // truncate time
                    date = hooks(eras[i].until).startOf('day').valueOf();
                    eras[i].until = date.valueOf();
                    break;
            }
        }
        return eras;
    }

    function localeErasParse(eraName, format, strict) {
        var i,
            l,
            eras = this.eras(),
            name,
            abbr,
            narrow;
        eraName = eraName.toUpperCase();

        for (i = 0, l = eras.length; i < l; ++i) {
            name = eras[i].name.toUpperCase();
            abbr = eras[i].abbr.toUpperCase();
            narrow = eras[i].narrow.toUpperCase();

            if (strict) {
                switch (format) {
                    case 'N':
                    case 'NN':
                    case 'NNN':
                        if (abbr === eraName) {
                            return eras[i];
                        }
                        break;

                    case 'NNNN':
                        if (name === eraName) {
                            return eras[i];
                        }
                        break;

                    case 'NNNNN':
                        if (narrow === eraName) {
                            return eras[i];
                        }
                        break;
                }
            } else if ([name, abbr, narrow].indexOf(eraName) >= 0) {
                return eras[i];
            }
        }
    }

    function localeErasConvertYear(era, year) {
        var dir = era.since <= era.until ? +1 : -1;
        if (year === undefined) {
            return hooks(era.since).year();
        } else {
            return hooks(era.since).year() + (year - era.offset) * dir;
        }
    }

    function getEraName() {
        var i,
            l,
            val,
            eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            // truncate time
            val = this.startOf('day').valueOf();

            if (eras[i].since <= val && val <= eras[i].until) {
                return eras[i].name;
            }
            if (eras[i].until <= val && val <= eras[i].since) {
                return eras[i].name;
            }
        }

        return '';
    }

    function getEraNarrow() {
        var i,
            l,
            val,
            eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            // truncate time
            val = this.startOf('day').valueOf();

            if (eras[i].since <= val && val <= eras[i].until) {
                return eras[i].narrow;
            }
            if (eras[i].until <= val && val <= eras[i].since) {
                return eras[i].narrow;
            }
        }

        return '';
    }

    function getEraAbbr() {
        var i,
            l,
            val,
            eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            // truncate time
            val = this.startOf('day').valueOf();

            if (eras[i].since <= val && val <= eras[i].until) {
                return eras[i].abbr;
            }
            if (eras[i].until <= val && val <= eras[i].since) {
                return eras[i].abbr;
            }
        }

        return '';
    }

    function getEraYear() {
        var i,
            l,
            dir,
            val,
            eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            dir = eras[i].since <= eras[i].until ? +1 : -1;

            // truncate time
            val = this.startOf('day').valueOf();

            if (
                (eras[i].since <= val && val <= eras[i].until) ||
                (eras[i].until <= val && val <= eras[i].since)
            ) {
                return (
                    (this.year() - hooks(eras[i].since).year()) * dir +
                    eras[i].offset
                );
            }
        }

        return this.year();
    }

    function erasNameRegex(isStrict) {
        if (!hasOwnProp(this, '_erasNameRegex')) {
            computeErasParse.call(this);
        }
        return isStrict ? this._erasNameRegex : this._erasRegex;
    }

    function erasAbbrRegex(isStrict) {
        if (!hasOwnProp(this, '_erasAbbrRegex')) {
            computeErasParse.call(this);
        }
        return isStrict ? this._erasAbbrRegex : this._erasRegex;
    }

    function erasNarrowRegex(isStrict) {
        if (!hasOwnProp(this, '_erasNarrowRegex')) {
            computeErasParse.call(this);
        }
        return isStrict ? this._erasNarrowRegex : this._erasRegex;
    }

    function matchEraAbbr(isStrict, locale) {
        return locale.erasAbbrRegex(isStrict);
    }

    function matchEraName(isStrict, locale) {
        return locale.erasNameRegex(isStrict);
    }

    function matchEraNarrow(isStrict, locale) {
        return locale.erasNarrowRegex(isStrict);
    }

    function matchEraYearOrdinal(isStrict, locale) {
        return locale._eraYearOrdinalRegex || matchUnsigned;
    }

    function computeErasParse() {
        var abbrPieces = [],
            namePieces = [],
            narrowPieces = [],
            mixedPieces = [],
            i,
            l,
            eras = this.eras();

        for (i = 0, l = eras.length; i < l; ++i) {
            namePieces.push(regexEscape(eras[i].name));
            abbrPieces.push(regexEscape(eras[i].abbr));
            narrowPieces.push(regexEscape(eras[i].narrow));

            mixedPieces.push(regexEscape(eras[i].name));
            mixedPieces.push(regexEscape(eras[i].abbr));
            mixedPieces.push(regexEscape(eras[i].narrow));
        }

        this._erasRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._erasNameRegex = new RegExp('^(' + namePieces.join('|') + ')', 'i');
        this._erasAbbrRegex = new RegExp('^(' + abbrPieces.join('|') + ')', 'i');
        this._erasNarrowRegex = new RegExp(
            '^(' + narrowPieces.join('|') + ')',
            'i'
        );
    }

    // FORMATTING

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken(token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg', 'weekYear');
    addWeekYearFormatToken('ggggg', 'weekYear');
    addWeekYearFormatToken('GGGG', 'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PRIORITY

    addUnitPriority('weekYear', 1);
    addUnitPriority('isoWeekYear', 1);

    // PARSING

    addRegexToken('G', matchSigned);
    addRegexToken('g', matchSigned);
    addRegexToken('GG', match1to2, match2);
    addRegexToken('gg', match1to2, match2);
    addRegexToken('GGGG', match1to4, match4);
    addRegexToken('gggg', match1to4, match4);
    addRegexToken('GGGGG', match1to6, match6);
    addRegexToken('ggggg', match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (
        input,
        week,
        config,
        token
    ) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = hooks.parseTwoDigitYear(input);
    });

    // MOMENTS

    function getSetWeekYear(input) {
        return getSetWeekYearHelper.call(
            this,
            input,
            this.week(),
            this.weekday(),
            this.localeData()._week.dow,
            this.localeData()._week.doy
        );
    }

    function getSetISOWeekYear(input) {
        return getSetWeekYearHelper.call(
            this,
            input,
            this.isoWeek(),
            this.isoWeekday(),
            1,
            4
        );
    }

    function getISOWeeksInYear() {
        return weeksInYear(this.year(), 1, 4);
    }

    function getISOWeeksInISOWeekYear() {
        return weeksInYear(this.isoWeekYear(), 1, 4);
    }

    function getWeeksInYear() {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    function getWeeksInWeekYear() {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.weekYear(), weekInfo.dow, weekInfo.doy);
    }

    function getSetWeekYearHelper(input, week, weekday, dow, doy) {
        var weeksTarget;
        if (input == null) {
            return weekOfYear(this, dow, doy).year;
        } else {
            weeksTarget = weeksInYear(input, dow, doy);
            if (week > weeksTarget) {
                week = weeksTarget;
            }
            return setWeekAll.call(this, input, week, weekday, dow, doy);
        }
    }

    function setWeekAll(weekYear, week, weekday, dow, doy) {
        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
            date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

        this.year(date.getUTCFullYear());
        this.month(date.getUTCMonth());
        this.date(date.getUTCDate());
        return this;
    }

    // FORMATTING

    addFormatToken('Q', 0, 'Qo', 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PRIORITY

    addUnitPriority('quarter', 7);

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter(input) {
        return input == null
            ? Math.ceil((this.month() + 1) / 3)
            : this.month((input - 1) * 3 + (this.month() % 3));
    }

    // FORMATTING

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PRIORITY
    addUnitPriority('date', 9);

    // PARSING

    addRegexToken('D', match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        // TODO: Remove "ordinalParse" fallback in next major release.
        return isStrict
            ? locale._dayOfMonthOrdinalParse || locale._ordinalParse
            : locale._dayOfMonthOrdinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0]);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    // FORMATTING

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PRIORITY
    addUnitPriority('dayOfYear', 4);

    // PARSING

    addRegexToken('DDD', match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    // MOMENTS

    function getSetDayOfYear(input) {
        var dayOfYear =
            Math.round(
                (this.clone().startOf('day') - this.clone().startOf('year')) / 864e5
            ) + 1;
        return input == null ? dayOfYear : this.add(input - dayOfYear, 'd');
    }

    // FORMATTING

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PRIORITY

    addUnitPriority('minute', 14);

    // PARSING

    addRegexToken('m', match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    // FORMATTING

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PRIORITY

    addUnitPriority('second', 15);

    // PARSING

    addRegexToken('s', match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    // FORMATTING

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
        return this.millisecond() * 1000000;
    });

    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PRIORITY

    addUnitPriority('millisecond', 16);

    // PARSING

    addRegexToken('S', match1to3, match1);
    addRegexToken('SS', match1to3, match2);
    addRegexToken('SSS', match1to3, match3);

    var token, getSetMillisecond;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }

    getSetMillisecond = makeGetSet('Milliseconds', false);

    // FORMATTING

    addFormatToken('z', 0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr() {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName() {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var proto = Moment.prototype;

    proto.add = add;
    proto.calendar = calendar$1;
    proto.clone = clone;
    proto.diff = diff;
    proto.endOf = endOf;
    proto.format = format;
    proto.from = from;
    proto.fromNow = fromNow;
    proto.to = to;
    proto.toNow = toNow;
    proto.get = stringGet;
    proto.invalidAt = invalidAt;
    proto.isAfter = isAfter;
    proto.isBefore = isBefore;
    proto.isBetween = isBetween;
    proto.isSame = isSame;
    proto.isSameOrAfter = isSameOrAfter;
    proto.isSameOrBefore = isSameOrBefore;
    proto.isValid = isValid$2;
    proto.lang = lang;
    proto.locale = locale;
    proto.localeData = localeData;
    proto.max = prototypeMax;
    proto.min = prototypeMin;
    proto.parsingFlags = parsingFlags;
    proto.set = stringSet;
    proto.startOf = startOf;
    proto.subtract = subtract;
    proto.toArray = toArray;
    proto.toObject = toObject;
    proto.toDate = toDate;
    proto.toISOString = toISOString;
    proto.inspect = inspect;
    if (typeof Symbol !== 'undefined' && Symbol.for != null) {
        proto[Symbol.for('nodejs.util.inspect.custom')] = function () {
            return 'Moment<' + this.format() + '>';
        };
    }
    proto.toJSON = toJSON;
    proto.toString = toString;
    proto.unix = unix;
    proto.valueOf = valueOf;
    proto.creationData = creationData;
    proto.eraName = getEraName;
    proto.eraNarrow = getEraNarrow;
    proto.eraAbbr = getEraAbbr;
    proto.eraYear = getEraYear;
    proto.year = getSetYear;
    proto.isLeapYear = getIsLeapYear;
    proto.weekYear = getSetWeekYear;
    proto.isoWeekYear = getSetISOWeekYear;
    proto.quarter = proto.quarters = getSetQuarter;
    proto.month = getSetMonth;
    proto.daysInMonth = getDaysInMonth;
    proto.week = proto.weeks = getSetWeek;
    proto.isoWeek = proto.isoWeeks = getSetISOWeek;
    proto.weeksInYear = getWeeksInYear;
    proto.weeksInWeekYear = getWeeksInWeekYear;
    proto.isoWeeksInYear = getISOWeeksInYear;
    proto.isoWeeksInISOWeekYear = getISOWeeksInISOWeekYear;
    proto.date = getSetDayOfMonth;
    proto.day = proto.days = getSetDayOfWeek;
    proto.weekday = getSetLocaleDayOfWeek;
    proto.isoWeekday = getSetISODayOfWeek;
    proto.dayOfYear = getSetDayOfYear;
    proto.hour = proto.hours = getSetHour;
    proto.minute = proto.minutes = getSetMinute;
    proto.second = proto.seconds = getSetSecond;
    proto.millisecond = proto.milliseconds = getSetMillisecond;
    proto.utcOffset = getSetOffset;
    proto.utc = setOffsetToUTC;
    proto.local = setOffsetToLocal;
    proto.parseZone = setOffsetToParsedOffset;
    proto.hasAlignedHourOffset = hasAlignedHourOffset;
    proto.isDST = isDaylightSavingTime;
    proto.isLocal = isLocal;
    proto.isUtcOffset = isUtcOffset;
    proto.isUtc = isUtc;
    proto.isUTC = isUtc;
    proto.zoneAbbr = getZoneAbbr;
    proto.zoneName = getZoneName;
    proto.dates = deprecate(
        'dates accessor is deprecated. Use date instead.',
        getSetDayOfMonth
    );
    proto.months = deprecate(
        'months accessor is deprecated. Use month instead',
        getSetMonth
    );
    proto.years = deprecate(
        'years accessor is deprecated. Use year instead',
        getSetYear
    );
    proto.zone = deprecate(
        'moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/',
        getSetZone
    );
    proto.isDSTShifted = deprecate(
        'isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information',
        isDaylightSavingTimeShifted
    );

    function createUnix(input) {
        return createLocal(input * 1000);
    }

    function createInZone() {
        return createLocal.apply(null, arguments).parseZone();
    }

    function preParsePostFormat(string) {
        return string;
    }

    var proto$1 = Locale.prototype;

    proto$1.calendar = calendar;
    proto$1.longDateFormat = longDateFormat;
    proto$1.invalidDate = invalidDate;
    proto$1.ordinal = ordinal;
    proto$1.preparse = preParsePostFormat;
    proto$1.postformat = preParsePostFormat;
    proto$1.relativeTime = relativeTime;
    proto$1.pastFuture = pastFuture;
    proto$1.set = set;
    proto$1.eras = localeEras;
    proto$1.erasParse = localeErasParse;
    proto$1.erasConvertYear = localeErasConvertYear;
    proto$1.erasAbbrRegex = erasAbbrRegex;
    proto$1.erasNameRegex = erasNameRegex;
    proto$1.erasNarrowRegex = erasNarrowRegex;

    proto$1.months = localeMonths;
    proto$1.monthsShort = localeMonthsShort;
    proto$1.monthsParse = localeMonthsParse;
    proto$1.monthsRegex = monthsRegex;
    proto$1.monthsShortRegex = monthsShortRegex;
    proto$1.week = localeWeek;
    proto$1.firstDayOfYear = localeFirstDayOfYear;
    proto$1.firstDayOfWeek = localeFirstDayOfWeek;

    proto$1.weekdays = localeWeekdays;
    proto$1.weekdaysMin = localeWeekdaysMin;
    proto$1.weekdaysShort = localeWeekdaysShort;
    proto$1.weekdaysParse = localeWeekdaysParse;

    proto$1.weekdaysRegex = weekdaysRegex;
    proto$1.weekdaysShortRegex = weekdaysShortRegex;
    proto$1.weekdaysMinRegex = weekdaysMinRegex;

    proto$1.isPM = localeIsPM;
    proto$1.meridiem = localeMeridiem;

    function get$1(format, index, field, setter) {
        var locale = getLocale(),
            utc = createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function listMonthsImpl(format, index, field) {
        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return get$1(format, index, field, 'month');
        }

        var i,
            out = [];
        for (i = 0; i < 12; i++) {
            out[i] = get$1(format, i, field, 'month');
        }
        return out;
    }

    // ()
    // (5)
    // (fmt, 5)
    // (fmt)
    // (true)
    // (true, 5)
    // (true, fmt, 5)
    // (true, fmt)
    function listWeekdaysImpl(localeSorted, format, index, field) {
        if (typeof localeSorted === 'boolean') {
            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        } else {
            format = localeSorted;
            index = format;
            localeSorted = false;

            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        }

        var locale = getLocale(),
            shift = localeSorted ? locale._week.dow : 0,
            i,
            out = [];

        if (index != null) {
            return get$1(format, (index + shift) % 7, field, 'day');
        }

        for (i = 0; i < 7; i++) {
            out[i] = get$1(format, (i + shift) % 7, field, 'day');
        }
        return out;
    }

    function listMonths(format, index) {
        return listMonthsImpl(format, index, 'months');
    }

    function listMonthsShort(format, index) {
        return listMonthsImpl(format, index, 'monthsShort');
    }

    function listWeekdays(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
    }

    function listWeekdaysShort(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
    }

    function listWeekdaysMin(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
    }

    getSetGlobalLocale('en', {
        eras: [
            {
                since: '0001-01-01',
                until: +Infinity,
                offset: 1,
                name: 'Anno Domini',
                narrow: 'AD',
                abbr: 'AD',
            },
            {
                since: '0000-12-31',
                until: -Infinity,
                offset: 1,
                name: 'Before Christ',
                narrow: 'BC',
                abbr: 'BC',
            },
        ],
        dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal: function (number) {
            var b = number % 10,
                output =
                    toInt((number % 100) / 10) === 1
                        ? 'th'
                        : b === 1
                        ? 'st'
                        : b === 2
                        ? 'nd'
                        : b === 3
                        ? 'rd'
                        : 'th';
            return number + output;
        },
    });

    // Side effect imports

    hooks.lang = deprecate(
        'moment.lang is deprecated. Use moment.locale instead.',
        getSetGlobalLocale
    );
    hooks.langData = deprecate(
        'moment.langData is deprecated. Use moment.localeData instead.',
        getLocale
    );

    var mathAbs = Math.abs;

    function abs() {
        var data = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days = mathAbs(this._days);
        this._months = mathAbs(this._months);

        data.milliseconds = mathAbs(data.milliseconds);
        data.seconds = mathAbs(data.seconds);
        data.minutes = mathAbs(data.minutes);
        data.hours = mathAbs(data.hours);
        data.months = mathAbs(data.months);
        data.years = mathAbs(data.years);

        return this;
    }

    function addSubtract$1(duration, input, value, direction) {
        var other = createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days += direction * other._days;
        duration._months += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function add$1(input, value) {
        return addSubtract$1(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function subtract$1(input, value) {
        return addSubtract$1(this, input, value, -1);
    }

    function absCeil(number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble() {
        var milliseconds = this._milliseconds,
            days = this._days,
            months = this._months,
            data = this._data,
            seconds,
            minutes,
            hours,
            years,
            monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (
            !(
                (milliseconds >= 0 && days >= 0 && months >= 0) ||
                (milliseconds <= 0 && days <= 0 && months <= 0)
            )
        ) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds = absFloor(milliseconds / 1000);
        data.seconds = seconds % 60;

        minutes = absFloor(seconds / 60);
        data.minutes = minutes % 60;

        hours = absFloor(minutes / 60);
        data.hours = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days = days;
        data.months = months;
        data.years = years;

        return this;
    }

    function daysToMonths(days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return (days * 4800) / 146097;
    }

    function monthsToDays(months) {
        // the reverse of daysToMonths
        return (months * 146097) / 4800;
    }

    function as(units) {
        if (!this.isValid()) {
            return NaN;
        }
        var days,
            months,
            milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'quarter' || units === 'year') {
            days = this._days + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            switch (units) {
                case 'month':
                    return months;
                case 'quarter':
                    return months / 3;
                case 'year':
                    return months / 12;
            }
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week':
                    return days / 7 + milliseconds / 6048e5;
                case 'day':
                    return days + milliseconds / 864e5;
                case 'hour':
                    return days * 24 + milliseconds / 36e5;
                case 'minute':
                    return days * 1440 + milliseconds / 6e4;
                case 'second':
                    return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond':
                    return Math.floor(days * 864e5) + milliseconds;
                default:
                    throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function valueOf$1() {
        if (!this.isValid()) {
            return NaN;
        }
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs(alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms'),
        asSeconds = makeAs('s'),
        asMinutes = makeAs('m'),
        asHours = makeAs('h'),
        asDays = makeAs('d'),
        asWeeks = makeAs('w'),
        asMonths = makeAs('M'),
        asQuarters = makeAs('Q'),
        asYears = makeAs('y');

    function clone$1() {
        return createDuration(this);
    }

    function get$2(units) {
        units = normalizeUnits(units);
        return this.isValid() ? this[units + 's']() : NaN;
    }

    function makeGetter(name) {
        return function () {
            return this.isValid() ? this._data[name] : NaN;
        };
    }

    var milliseconds = makeGetter('milliseconds'),
        seconds = makeGetter('seconds'),
        minutes = makeGetter('minutes'),
        hours = makeGetter('hours'),
        days = makeGetter('days'),
        months = makeGetter('months'),
        years = makeGetter('years');

    function weeks() {
        return absFloor(this.days() / 7);
    }

    var round = Math.round,
        thresholds = {
            ss: 44, // a few seconds to seconds
            s: 45, // seconds to minute
            m: 45, // minutes to hour
            h: 22, // hours to day
            d: 26, // days to month/week
            w: null, // weeks to month
            M: 11, // months to year
        };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime$1(posNegDuration, withoutSuffix, thresholds, locale) {
        var duration = createDuration(posNegDuration).abs(),
            seconds = round(duration.as('s')),
            minutes = round(duration.as('m')),
            hours = round(duration.as('h')),
            days = round(duration.as('d')),
            months = round(duration.as('M')),
            weeks = round(duration.as('w')),
            years = round(duration.as('y')),
            a =
                (seconds <= thresholds.ss && ['s', seconds]) ||
                (seconds < thresholds.s && ['ss', seconds]) ||
                (minutes <= 1 && ['m']) ||
                (minutes < thresholds.m && ['mm', minutes]) ||
                (hours <= 1 && ['h']) ||
                (hours < thresholds.h && ['hh', hours]) ||
                (days <= 1 && ['d']) ||
                (days < thresholds.d && ['dd', days]);

        if (thresholds.w != null) {
            a =
                a ||
                (weeks <= 1 && ['w']) ||
                (weeks < thresholds.w && ['ww', weeks]);
        }
        a = a ||
            (months <= 1 && ['M']) ||
            (months < thresholds.M && ['MM', months]) ||
            (years <= 1 && ['y']) || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set the rounding function for relative time strings
    function getSetRelativeTimeRounding(roundingFunction) {
        if (roundingFunction === undefined) {
            return round;
        }
        if (typeof roundingFunction === 'function') {
            round = roundingFunction;
            return true;
        }
        return false;
    }

    // This function allows you to set a threshold for relative time strings
    function getSetRelativeTimeThreshold(threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        if (threshold === 's') {
            thresholds.ss = limit - 1;
        }
        return true;
    }

    function humanize(argWithSuffix, argThresholds) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var withSuffix = false,
            th = thresholds,
            locale,
            output;

        if (typeof argWithSuffix === 'object') {
            argThresholds = argWithSuffix;
            argWithSuffix = false;
        }
        if (typeof argWithSuffix === 'boolean') {
            withSuffix = argWithSuffix;
        }
        if (typeof argThresholds === 'object') {
            th = Object.assign({}, thresholds, argThresholds);
            if (argThresholds.s != null && argThresholds.ss == null) {
                th.ss = argThresholds.s - 1;
            }
        }

        locale = this.localeData();
        output = relativeTime$1(this, !withSuffix, th, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var abs$1 = Math.abs;

    function sign(x) {
        return (x > 0) - (x < 0) || +x;
    }

    function toISOString$1() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var seconds = abs$1(this._milliseconds) / 1000,
            days = abs$1(this._days),
            months = abs$1(this._months),
            minutes,
            hours,
            years,
            s,
            total = this.asSeconds(),
            totalSign,
            ymSign,
            daysSign,
            hmsSign;

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes = absFloor(seconds / 60);
        hours = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        s = seconds ? seconds.toFixed(3).replace(/\.?0+$/, '') : '';

        totalSign = total < 0 ? '-' : '';
        ymSign = sign(this._months) !== sign(total) ? '-' : '';
        daysSign = sign(this._days) !== sign(total) ? '-' : '';
        hmsSign = sign(this._milliseconds) !== sign(total) ? '-' : '';

        return (
            totalSign +
            'P' +
            (years ? ymSign + years + 'Y' : '') +
            (months ? ymSign + months + 'M' : '') +
            (days ? daysSign + days + 'D' : '') +
            (hours || minutes || seconds ? 'T' : '') +
            (hours ? hmsSign + hours + 'H' : '') +
            (minutes ? hmsSign + minutes + 'M' : '') +
            (seconds ? hmsSign + s + 'S' : '')
        );
    }

    var proto$2 = Duration.prototype;

    proto$2.isValid = isValid$1;
    proto$2.abs = abs;
    proto$2.add = add$1;
    proto$2.subtract = subtract$1;
    proto$2.as = as;
    proto$2.asMilliseconds = asMilliseconds;
    proto$2.asSeconds = asSeconds;
    proto$2.asMinutes = asMinutes;
    proto$2.asHours = asHours;
    proto$2.asDays = asDays;
    proto$2.asWeeks = asWeeks;
    proto$2.asMonths = asMonths;
    proto$2.asQuarters = asQuarters;
    proto$2.asYears = asYears;
    proto$2.valueOf = valueOf$1;
    proto$2._bubble = bubble;
    proto$2.clone = clone$1;
    proto$2.get = get$2;
    proto$2.milliseconds = milliseconds;
    proto$2.seconds = seconds;
    proto$2.minutes = minutes;
    proto$2.hours = hours;
    proto$2.days = days;
    proto$2.weeks = weeks;
    proto$2.months = months;
    proto$2.years = years;
    proto$2.humanize = humanize;
    proto$2.toISOString = toISOString$1;
    proto$2.toString = toISOString$1;
    proto$2.toJSON = toISOString$1;
    proto$2.locale = locale;
    proto$2.localeData = localeData;

    proto$2.toIsoString = deprecate(
        'toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)',
        toISOString$1
    );
    proto$2.lang = lang;

    // FORMATTING

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    //! moment.js

    hooks.version = '2.27.0';

    setHookCallback(createLocal);

    hooks.fn = proto;
    hooks.min = min;
    hooks.max = max;
    hooks.now = now;
    hooks.utc = createUTC;
    hooks.unix = createUnix;
    hooks.months = listMonths;
    hooks.isDate = isDate;
    hooks.locale = getSetGlobalLocale;
    hooks.invalid = createInvalid;
    hooks.duration = createDuration;
    hooks.isMoment = isMoment;
    hooks.weekdays = listWeekdays;
    hooks.parseZone = createInZone;
    hooks.localeData = getLocale;
    hooks.isDuration = isDuration;
    hooks.monthsShort = listMonthsShort;
    hooks.weekdaysMin = listWeekdaysMin;
    hooks.defineLocale = defineLocale;
    hooks.updateLocale = updateLocale;
    hooks.locales = listLocales;
    hooks.weekdaysShort = listWeekdaysShort;
    hooks.normalizeUnits = normalizeUnits;
    hooks.relativeTimeRounding = getSetRelativeTimeRounding;
    hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
    hooks.calendarFormat = getCalendarFormat;
    hooks.prototype = proto;

    // currently HTML5 input type only supports 24-hour formats
    hooks.HTML5_FMT = {
        DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm', // <input type="datetime-local" />
        DATETIME_LOCAL_SECONDS: 'YYYY-MM-DDTHH:mm:ss', // <input type="datetime-local" step="1" />
        DATETIME_LOCAL_MS: 'YYYY-MM-DDTHH:mm:ss.SSS', // <input type="datetime-local" step="0.001" />
        DATE: 'YYYY-MM-DD', // <input type="date" />
        TIME: 'HH:mm', // <input type="time" />
        TIME_SECONDS: 'HH:mm:ss', // <input type="time" step="1" />
        TIME_MS: 'HH:mm:ss.SSS', // <input type="time" step="0.001" />
        WEEK: 'GGGG-[W]WW', // <input type="week" />
        MONTH: 'YYYY-MM', // <input type="month" />
    };

    return hooks;

})));

},{}],26:[function(require,module,exports){
'use strict';

var atoa = require('atoa');
var serialization = require('./serialization');
var emitter = require('contra/emitter');

module.exports = createChannel;

function createChannel () {
  var channel = at(navigator.serviceWorker.controller);
  return channel;

  function at (worker) {
    var internalEmitter = emitter();
    var api = {
      on: selfed('on'),
      once: selfed('once'),
      off: selfed('off'),
      emit: postToWorker,
      at: at
    };
    var postFromWorker = serialization.emission(internalEmitter, { broadcast: false });
    navigator.serviceWorker.addEventListener('message', broadcastHandler);
    return api;

    function selfed (method) {
      return function selfish () {
        internalEmitter[method].apply(null, arguments);
        return api;
      };
    }

    function postToWorker () {
      if (!worker) {
        return Promise.reject(new Error('ServiceWorker not found.'));
      }
      var payload = serialization.parsePayload(atoa(arguments));
      var messageChannel = new MessageChannel();
      messageChannel.port1.addEventListener('message', postFromWorker);
      messageChannel.port1.start();
      return worker.postMessage(payload, [messageChannel.port2]);
    }

    function broadcastHandler (e) {
      if (e.source !== worker) {
        return; // ignore broadcast messages from other workers than the one we're talking to.
      }
      var data = e.data;
      if (data && data.__broadcast) {
        serialization.emission(internalEmitter, { broadcast: true })(e);
      }
    }
  }
}

},{"./serialization":27,"atoa":18,"contra/emitter":20}],27:[function(require,module,exports){
'use strict';

function serializeError (err) {
  return err ? err.toString() : null;
}

function deserializeError (err) {
  return err ? new Error(err) : null;
}

function parsePayload (payload) {
  var type = payload.shift();
  if (type === 'error') {
    return { error: serializeError(payload[0]), type: type, payload: [] };
  }
  return { error: null, type: type, payload: payload };
}

function emission (emitter, context) {
  return emit;
  function emit (e) {
    var data = e.data;
    if (data.type === 'error') {
      emitter.emit.call(null, 'error', context, deserializeError(data.error));
    } else {
      emitter.emit.apply(null, [data.type, context].concat(data.payload));
    }
  }
}

module.exports = {
  parsePayload: parsePayload,
  emission: emission
};

},{}],28:[function(require,module,exports){
'use strict';

var page = require('./page');
var worker = require('./worker');
var api;

if ('serviceWorker' in navigator) {
  api = page();
} else if ('clients' in self) {
  api = worker();
} else {
  api = {
    on: complain,
    once: complain,
    off: complain,
    emit: complain,
    broadcast: complain
  };
}

function complain () {
  throw new Error('Swivel couldn\'t detect ServiceWorker support. Please feature detect before using Swivel in your web pages!');
}

module.exports = api;

},{"./page":26,"./worker":29}],29:[function(require,module,exports){
'use strict';

var atoa = require('atoa');
var serialization = require('./serialization');
var emitter = require('contra/emitter');

module.exports = createChannel;

function createChannel () {
  var internalEmitter = emitter();
  var api = {
    on: selfed('on'),
    once: selfed('once'),
    off: selfed('off'),
    broadcast: broadcastToPages,
    emit: replyToClient
  };

  self.addEventListener('message', postFromPage);

  return api;

  function selfed (method) {
    return function selfish () {
      internalEmitter[method].apply(null, arguments);
      return api;
    };
  }

  function postFromPage (e) {
    var context = {
      reply: replyToPage(e)
    };
    serialization.emission(internalEmitter, context)(e);
  }

  function broadcastToPages (type) {
    var payload = atoa(arguments, 1);
    return self.clients.matchAll().then(gotClients);
    function gotClients (clients) {
      return clients.map(emitToClient);
    }
    function emitToClient (client) {
      return client.postMessage({ type: type, payload: payload, __broadcast: true });
    }
  }

  function replyTo (client) {
    var payload = serialization.parsePayload(atoa(arguments, 1));
    return client.postMessage(payload);
  }

  function replyToPage (e) {
    return replyTo.bind(null, e.ports[0]);
  }

  function replyToClient (clientId) {
    const args = atoa(arguments)
    return self.clients.matchAll().then(findClientById(clientId)).then(reply);
    function reply (client) {
      args[0] = client;
      replyTo.apply(this, args);
    }
  }

  function findClientById (clientId) {
    return function findClientByIdFromList (clients) {
      for (var i = 0; i < clients.length; i++) {
        if (clients[i].id === clientId) {
          return clients[i];
        }
      }
      return null;
    };
  }
}

},{"./serialization":27,"atoa":18,"contra/emitter":20}],30:[function(require,module,exports){
(function (setImmediate){
var si = typeof setImmediate === 'function', tick;
if (si) {
  tick = function (fn) { setImmediate(fn); };
} else {
  tick = function (fn) { setTimeout(fn, 0); };
}

module.exports = tick;
}).call(this,require("timers").setImmediate)
},{"timers":5}],31:[function(require,module,exports){
(function (global){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('underscore', factory) :
  (function() {
  	var current = global._;
  	var exports = factory();
  	global._ = exports;
  	exports.noConflict = function() { global._ = current; return exports; };
  })();
}(this, (function () {

  //     Underscore.js 1.10.2
  //     https://underscorejs.org
  //     (c) 2009-2020 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
  //     Underscore may be freely distributed under the MIT license.

  // Baseline setup
  // --------------

  // Establish the root object, `window` (`self`) in the browser, `global`
  // on the server, or `this` in some virtual machines. We use `self`
  // instead of `window` for `WebWorker` support.
  var root = typeof self == 'object' && self.self === self && self ||
            typeof global == 'object' && global.global === global && global ||
            Function('return this')() ||
            {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype;
  var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

  // Create quick reference variables for speed access to core prototypes.
  var push = ArrayProto.push,
      slice = ArrayProto.slice,
      toString = ObjProto.toString,
      hasOwnProperty = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var nativeIsArray = Array.isArray,
      nativeKeys = Object.keys,
      nativeCreate = Object.create;

  // Create references to these builtin functions because we override them.
  var _isNaN = root.isNaN,
      _isFinite = root.isFinite;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // The Underscore object. All exported functions below are added to it in the
  // modules/index-all.js using the mixin function.
  function _(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  }

  // Current version.
  var VERSION = _.VERSION = '1.10.2';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  function optimizeCb(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      // The 2-argument case is omitted because we’re not using it.
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  }

  // An internal function to generate callbacks that can be applied to each
  // element in a collection, returning the desired result — either `identity`,
  // an arbitrary callback, a property matcher, or a property accessor.
  function baseIteratee(value, context, argCount) {
    if (value == null) return identity;
    if (isFunction(value)) return optimizeCb(value, context, argCount);
    if (isObject(value) && !isArray(value)) return matcher(value);
    return property(value);
  }

  // External wrapper for our callback generator. Users may customize
  // `_.iteratee` if they want additional predicate/iteratee shorthand styles.
  // This abstraction hides the internal-only argCount argument.
  _.iteratee = iteratee;
  function iteratee(value, context) {
    return baseIteratee(value, context, Infinity);
  }

  // The function we actually call internally. It invokes _.iteratee if
  // overridden, otherwise baseIteratee.
  function cb(value, context, argCount) {
    if (_.iteratee !== iteratee) return _.iteratee(value, context);
    return baseIteratee(value, context, argCount);
  }

  // Some functions take a variable number of arguments, or a few expected
  // arguments at the beginning and then a variable number of values to operate
  // on. This helper accumulates all remaining arguments past the function’s
  // argument length (or an explicit `startIndex`), into an array that becomes
  // the last argument. Similar to ES6’s "rest parameter".
  function restArguments(func, startIndex) {
    startIndex = startIndex == null ? func.length - 1 : +startIndex;
    return function() {
      var length = Math.max(arguments.length - startIndex, 0),
          rest = Array(length),
          index = 0;
      for (; index < length; index++) {
        rest[index] = arguments[index + startIndex];
      }
      switch (startIndex) {
        case 0: return func.call(this, rest);
        case 1: return func.call(this, arguments[0], rest);
        case 2: return func.call(this, arguments[0], arguments[1], rest);
      }
      var args = Array(startIndex + 1);
      for (index = 0; index < startIndex; index++) {
        args[index] = arguments[index];
      }
      args[startIndex] = rest;
      return func.apply(this, args);
    };
  }

  // An internal function for creating a new object that inherits from another.
  function baseCreate(prototype) {
    if (!isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  }

  function shallowProperty(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  }

  function _has(obj, path) {
    return obj != null && hasOwnProperty.call(obj, path);
  }

  function deepGet(obj, path) {
    var length = path.length;
    for (var i = 0; i < length; i++) {
      if (obj == null) return void 0;
      obj = obj[path[i]];
    }
    return length ? obj : void 0;
  }

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object.
  // Related: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = shallowProperty('length');
  function isArrayLike(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  }

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  function each(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var _keys = keys(obj);
      for (i = 0, length = _keys.length; i < length; i++) {
        iteratee(obj[_keys[i]], _keys[i], obj);
      }
    }
    return obj;
  }

  // Return the results of applying the iteratee to each element.
  function map(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var _keys = !isArrayLike(obj) && keys(obj),
        length = (_keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = _keys ? _keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  }

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Wrap code that reassigns argument variables in a separate function than
    // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
    var reducer = function(obj, iteratee, memo, initial) {
      var _keys = !isArrayLike(obj) && keys(obj),
          length = (_keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      if (!initial) {
        memo = obj[_keys ? _keys[index] : index];
        index += dir;
      }
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = _keys ? _keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    };

    return function(obj, iteratee, memo, context) {
      var initial = arguments.length >= 3;
      return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  var reduce = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  var reduceRight = createReduce(-1);

  // Return the first value which passes a truth test.
  function find(obj, predicate, context) {
    var keyFinder = isArrayLike(obj) ? findIndex : findKey;
    var key = keyFinder(obj, predicate, context);
    if (key !== void 0 && key !== -1) return obj[key];
  }

  // Return all the elements that pass a truth test.
  function filter(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  }

  // Return all the elements for which a truth test fails.
  function reject(obj, predicate, context) {
    return filter(obj, negate(cb(predicate)), context);
  }

  // Determine whether all of the elements match a truth test.
  function every(obj, predicate, context) {
    predicate = cb(predicate, context);
    var _keys = !isArrayLike(obj) && keys(obj),
        length = (_keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = _keys ? _keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  }

  // Determine if at least one element in the object matches a truth test.
  function some(obj, predicate, context) {
    predicate = cb(predicate, context);
    var _keys = !isArrayLike(obj) && keys(obj),
        length = (_keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = _keys ? _keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  }

  // Determine if the array or object contains a given item (using `===`).
  function contains(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return indexOf(obj, item, fromIndex) >= 0;
  }

  // Invoke a method (with arguments) on every item in a collection.
  var invoke = restArguments(function(obj, path, args) {
    var contextPath, func;
    if (isFunction(path)) {
      func = path;
    } else if (isArray(path)) {
      contextPath = path.slice(0, -1);
      path = path[path.length - 1];
    }
    return map(obj, function(context) {
      var method = func;
      if (!method) {
        if (contextPath && contextPath.length) {
          context = deepGet(context, contextPath);
        }
        if (context == null) return void 0;
        method = context[path];
      }
      return method == null ? method : method.apply(context, args);
    });
  });

  // Convenience version of a common use case of `map`: fetching a property.
  function pluck(obj, key) {
    return map(obj, property(key));
  }

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  function where(obj, attrs) {
    return filter(obj, matcher(attrs));
  }

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  function findWhere(obj, attrs) {
    return find(obj, matcher(attrs));
  }

  // Return the maximum element (or element-based computation).
  function max(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
      obj = isArrayLike(obj) ? obj : values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  }

  // Return the minimum element (or element-based computation).
  function min(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
      obj = isArrayLike(obj) ? obj : values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  }

  // Shuffle a collection.
  function shuffle(obj) {
    return sample(obj, Infinity);
  }

  // Sample **n** random values from a collection using the modern version of the
  // [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  function sample(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = values(obj);
      return obj[random(obj.length - 1)];
    }
    var sample = isArrayLike(obj) ? clone(obj) : values(obj);
    var length = getLength(sample);
    n = Math.max(Math.min(n, length), 0);
    var last = length - 1;
    for (var index = 0; index < n; index++) {
      var rand = random(index, last);
      var temp = sample[index];
      sample[index] = sample[rand];
      sample[rand] = temp;
    }
    return sample.slice(0, n);
  }

  // Sort the object's values by a criterion produced by an iteratee.
  function sortBy(obj, iteratee, context) {
    var index = 0;
    iteratee = cb(iteratee, context);
    return pluck(map(obj, function(value, key, list) {
      return {
        value: value,
        index: index++,
        criteria: iteratee(value, key, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  }

  // An internal function used for aggregate "group by" operations.
  function group(behavior, partition) {
    return function(obj, iteratee, context) {
      var result = partition ? [[], []] : {};
      iteratee = cb(iteratee, context);
      each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  }

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  var groupBy = group(function(result, value, key) {
    if (_has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  var indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  var countBy = group(function(result, value, key) {
    if (_has(result, key)) result[key]++; else result[key] = 1;
  });

  var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
  // Safely create a real, live array from anything iterable.
  function toArray(obj) {
    if (!obj) return [];
    if (isArray(obj)) return slice.call(obj);
    if (isString(obj)) {
      // Keep surrogate pair characters together
      return obj.match(reStrSymbol);
    }
    if (isArrayLike(obj)) return map(obj, identity);
    return values(obj);
  }

  // Return the number of elements in an object.
  function size(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : keys(obj).length;
  }

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  var partition = group(function(result, value, pass) {
    result[pass ? 0 : 1].push(value);
  }, true);

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. The **guard** check allows it to work with `map`.
  function first(array, n, guard) {
    if (array == null || array.length < 1) return n == null ? void 0 : [];
    if (n == null || guard) return array[0];
    return initial(array, array.length - n);
  }

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  function initial(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  }

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  function last(array, n, guard) {
    if (array == null || array.length < 1) return n == null ? void 0 : [];
    if (n == null || guard) return array[array.length - 1];
    return rest(array, Math.max(0, array.length - n));
  }

  // Returns everything but the first entry of the array. Especially useful on
  // the arguments object. Passing an **n** will return the rest N values in the
  // array.
  function rest(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  }

  // Trim out all falsy values from an array.
  function compact(array) {
    return filter(array, Boolean);
  }

  // Internal implementation of a recursive `flatten` function.
  function _flatten(input, shallow, strict, output) {
    output = output || [];
    var idx = output.length;
    for (var i = 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (isArray(value) || isArguments(value))) {
        // Flatten current level of array or arguments object.
        if (shallow) {
          var j = 0, len = value.length;
          while (j < len) output[idx++] = value[j++];
        } else {
          _flatten(value, shallow, strict, output);
          idx = output.length;
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  }

  // Flatten out an array, either recursively (by default), or just one level.
  function flatten(array, shallow) {
    return _flatten(array, shallow, false);
  }

  // Return a version of the array that does not contain the specified value(s).
  var without = restArguments(function(array, otherArrays) {
    return difference(array, otherArrays);
  });

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // The faster algorithm will not work with an iteratee if the iteratee
  // is not a one-to-one function, so providing an iteratee will disable
  // the faster algorithm.
  function uniq(array, isSorted, iteratee, context) {
    if (!isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted && !iteratee) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  }

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  var union = restArguments(function(arrays) {
    return uniq(_flatten(arrays, true, true));
  });

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  function intersection(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (contains(result, item)) continue;
      var j;
      for (j = 1; j < argsLength; j++) {
        if (!contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  }

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  var difference = restArguments(function(array, rest) {
    rest = _flatten(rest, true, true);
    return filter(array, function(value){
      return !contains(rest, value);
    });
  });

  // Complement of zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices.
  function unzip(array) {
    var length = array && max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = pluck(array, index);
    }
    return result;
  }

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  var zip = restArguments(unzip);

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values. Passing by pairs is the reverse of pairs.
  function object(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  }

  // Generator function to create the findIndex and findLastIndex functions.
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test.
  var findIndex = createPredicateIndexFinder(1);
  var findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  function sortedIndex(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  }

  // Generator function to create the indexOf and lastIndexOf functions.
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
          i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
          length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  var indexOf = createIndexFinder(1, findIndex, sortedIndex);
  var lastIndexOf = createIndexFinder(-1, findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](https://docs.python.org/library/functions.html#range).
  function range(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    if (!step) {
      step = stop < start ? -1 : 1;
    }

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  }

  // Chunk a single array into multiple arrays, each containing `count` or fewer
  // items.
  function chunk(array, count) {
    if (count == null || count < 1) return [];
    var result = [];
    var i = 0, length = array.length;
    while (i < length) {
      result.push(slice.call(array, i, i += count));
    }
    return result;
  }

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments.
  function executeBound(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (isObject(result)) return result;
    return self;
  }

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  var bind = restArguments(function(func, context, args) {
    if (!isFunction(func)) throw new TypeError('Bind must be called on a function');
    var bound = restArguments(function(callArgs) {
      return executeBound(func, bound, context, this, args.concat(callArgs));
    });
    return bound;
  });

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder by default, allowing any combination of arguments to be
  // pre-filled. Set `partial.placeholder` for a custom placeholder argument.
  var partial = restArguments(function(func, boundArgs) {
    var placeholder = partial.placeholder;
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  });

  partial.placeholder = _;

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  var bindAll = restArguments(function(obj, _keys) {
    _keys = _flatten(_keys, false, false);
    var index = _keys.length;
    if (index < 1) throw new Error('bindAll must be passed function names');
    while (index--) {
      var key = _keys[index];
      obj[key] = bind(obj[key], obj);
    }
  });

  // Memoize an expensive function by storing its results.
  function memoize(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  }

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  var delay = restArguments(function(func, wait, args) {
    return setTimeout(function() {
      return func.apply(null, args);
    }, wait);
  });

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  var defer = partial(delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  function throttle(func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};

    var later = function() {
      previous = options.leading === false ? 0 : now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };

    var throttled = function() {
      var _now = now();
      if (!previous && options.leading === false) previous = _now;
      var remaining = wait - (_now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = _now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };

    throttled.cancel = function() {
      clearTimeout(timeout);
      previous = 0;
      timeout = context = args = null;
    };

    return throttled;
  }

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  function debounce(func, wait, immediate) {
    var timeout, result;

    var later = function(context, args) {
      timeout = null;
      if (args) result = func.apply(context, args);
    };

    var debounced = restArguments(function(args) {
      if (timeout) clearTimeout(timeout);
      if (immediate) {
        var callNow = !timeout;
        timeout = setTimeout(later, wait);
        if (callNow) result = func.apply(this, args);
      } else {
        timeout = delay(later, wait, this, args);
      }

      return result;
    });

    debounced.cancel = function() {
      clearTimeout(timeout);
      timeout = null;
    };

    return debounced;
  }

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  function wrap(func, wrapper) {
    return partial(wrapper, func);
  }

  // Returns a negated version of the passed-in predicate.
  function negate(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  }

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  function compose() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  }

  // Returns a function that will only be executed on and after the Nth call.
  function after(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  }

  // Returns a function that will only be executed up to (but not including) the Nth call.
  function before(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  }

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  var once = partial(before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
    'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, _keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = isFunction(constructor) && constructor.prototype || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_has(obj, prop) && !contains(_keys, prop)) _keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !contains(_keys, prop)) {
        _keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`.
  function keys(obj) {
    if (!isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var _keys = [];
    for (var key in obj) if (_has(obj, key)) _keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, _keys);
    return _keys;
  }

  // Retrieve all the property names of an object.
  function allKeys(obj) {
    if (!isObject(obj)) return [];
    var _keys = [];
    for (var key in obj) _keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, _keys);
    return _keys;
  }

  // Retrieve the values of an object's properties.
  function values(obj) {
    var _keys = keys(obj);
    var length = _keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[_keys[i]];
    }
    return values;
  }

  // Returns the results of applying the iteratee to each element of the object.
  // In contrast to map it returns an object.
  function mapObject(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var _keys = keys(obj),
        length = _keys.length,
        results = {};
    for (var index = 0; index < length; index++) {
      var currentKey = _keys[index];
      results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  }

  // Convert an object into a list of `[key, value]` pairs.
  // The opposite of object.
  function pairs(obj) {
    var _keys = keys(obj);
    var length = _keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [_keys[i], obj[_keys[i]]];
    }
    return pairs;
  }

  // Invert the keys and values of an object. The values must be serializable.
  function invert(obj) {
    var result = {};
    var _keys = keys(obj);
    for (var i = 0, length = _keys.length; i < length; i++) {
      result[obj[_keys[i]]] = _keys[i];
    }
    return result;
  }

  // Return a sorted list of the function names available on the object.
  function functions(obj) {
    var names = [];
    for (var key in obj) {
      if (isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  }

  // An internal function for creating assigner functions.
  function createAssigner(keysFunc, defaults) {
    return function(obj) {
      var length = arguments.length;
      if (defaults) obj = Object(obj);
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            _keys = keysFunc(source),
            l = _keys.length;
        for (var i = 0; i < l; i++) {
          var key = _keys[i];
          if (!defaults || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  }

  // Extend a given object with all the properties in passed-in object(s).
  var extend = createAssigner(allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s).
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  var extendOwn = createAssigner(keys);

  // Returns the first key on an object that passes a predicate test.
  function findKey(obj, predicate, context) {
    predicate = cb(predicate, context);
    var _keys = keys(obj), key;
    for (var i = 0, length = _keys.length; i < length; i++) {
      key = _keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  }

  // Internal pick helper function to determine if `obj` has key `key`.
  function keyInObj(value, key, obj) {
    return key in obj;
  }

  // Return a copy of the object only containing the whitelisted properties.
  var pick = restArguments(function(obj, _keys) {
    var result = {}, iteratee = _keys[0];
    if (obj == null) return result;
    if (isFunction(iteratee)) {
      if (_keys.length > 1) iteratee = optimizeCb(iteratee, _keys[1]);
      _keys = allKeys(obj);
    } else {
      iteratee = keyInObj;
      _keys = _flatten(_keys, false, false);
      obj = Object(obj);
    }
    for (var i = 0, length = _keys.length; i < length; i++) {
      var key = _keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  });

  // Return a copy of the object without the blacklisted properties.
  var omit = restArguments(function(obj, _keys) {
    var iteratee = _keys[0], context;
    if (isFunction(iteratee)) {
      iteratee = negate(iteratee);
      if (_keys.length > 1) context = _keys[1];
    } else {
      _keys = map(_flatten(_keys, false, false), String);
      iteratee = function(value, key) {
        return !contains(_keys, key);
      };
    }
    return pick(obj, iteratee, context);
  });

  // Fill in a given object with default properties.
  var defaults = createAssigner(allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  function create(prototype, props) {
    var result = baseCreate(prototype);
    if (props) extendOwn(result, props);
    return result;
  }

  // Create a (shallow-cloned) duplicate of an object.
  function clone(obj) {
    if (!isObject(obj)) return obj;
    return isArray(obj) ? obj.slice() : extend({}, obj);
  }

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  function tap(obj, interceptor) {
    interceptor(obj);
    return obj;
  }

  // Returns whether an object has a given set of `key:value` pairs.
  function isMatch(object, attrs) {
    var _keys = keys(attrs), length = _keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = _keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  }


  // Internal recursive comparison function for `isEqual`.
  function eq(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](https://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // `null` or `undefined` only equal to itself (strict comparison).
    if (a == null || b == null) return false;
    // `NaN`s are equivalent, but non-reflexive.
    if (a !== a) return b !== b;
    // Exhaust primitive checks
    var type = typeof a;
    if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
    return deepEq(a, b, aStack, bStack);
  }

  // Internal recursive comparison function for `isEqual`.
  function deepEq(a, b, aStack, bStack) {
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN.
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
      case '[object Symbol]':
        return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(isFunction(aCtor) && aCtor instanceof aCtor &&
                               isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var _keys = keys(a), key;
      length = _keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = _keys[length];
        if (!(_has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  }

  // Perform a deep comparison to check if two objects are equal.
  function isEqual(a, b) {
    return eq(a, b);
  }

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  function isEmpty(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (isArray(obj) || isString(obj) || isArguments(obj))) return obj.length === 0;
    return keys(obj).length === 0;
  }

  // Is a given value a DOM element?
  function isElement(obj) {
    return !!(obj && obj.nodeType === 1);
  }

  // Internal function for creating a toString-based type tester.
  function tagTester(name) {
    return function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  }

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  var isArray = nativeIsArray || tagTester('Array');

  // Is a given variable an object?
  function isObject(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  }

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError, isMap, isWeakMap, isSet, isWeakSet.
  var isArguments = tagTester('Arguments');
  var isFunction = tagTester('Function');
  var isString = tagTester('String');
  var isNumber = tagTester('Number');
  var isDate = tagTester('Date');
  var isRegExp = tagTester('RegExp');
  var isError = tagTester('Error');
  var isSymbol = tagTester('Symbol');
  var isMap = tagTester('Map');
  var isWeakMap = tagTester('WeakMap');
  var isSet = tagTester('Set');
  var isWeakSet = tagTester('WeakSet');

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  (function() {
    if (!isArguments(arguments)) {
      isArguments = function(obj) {
        return _has(obj, 'callee');
      };
    }
  }());

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
  var nodelist = root.document && root.document.childNodes;
  if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof nodelist != 'function') {
    isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  function isFinite(obj) {
    return !isSymbol(obj) && _isFinite(obj) && !_isNaN(parseFloat(obj));
  }

  // Is the given value `NaN`?
  function isNaN(obj) {
    return isNumber(obj) && _isNaN(obj);
  }

  // Is a given value a boolean?
  function isBoolean(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  }

  // Is a given value equal to null?
  function isNull(obj) {
    return obj === null;
  }

  // Is a given variable undefined?
  function isUndefined(obj) {
    return obj === void 0;
  }

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  function has(obj, path) {
    if (!isArray(path)) {
      return _has(obj, path);
    }
    var length = path.length;
    for (var i = 0; i < length; i++) {
      var key = path[i];
      if (obj == null || !hasOwnProperty.call(obj, key)) {
        return false;
      }
      obj = obj[key];
    }
    return !!length;
  }

  // Utility Functions
  // -----------------

  // Keep the identity function around for default iteratees.
  function identity(value) {
    return value;
  }

  // Predicate-generating functions. Often useful outside of Underscore.
  function constant(value) {
    return function() {
      return value;
    };
  }

  function noop(){}

  // Creates a function that, when passed an object, will traverse that object’s
  // properties down the given `path`, specified as an array of keys or indexes.
  function property(path) {
    if (!isArray(path)) {
      return shallowProperty(path);
    }
    return function(obj) {
      return deepGet(obj, path);
    };
  }

  // Generates a function for a given object that returns a given property.
  function propertyOf(obj) {
    if (obj == null) {
      return function(){};
    }
    return function(path) {
      return !isArray(path) ? obj[path] : deepGet(obj, path);
    };
  }

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  function matcher(attrs) {
    attrs = extendOwn({}, attrs);
    return function(obj) {
      return isMatch(obj, attrs);
    };
  }

  // Run a function **n** times.
  function times(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  }

  // Return a random integer between min and max (inclusive).
  function random(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  // A (possibly faster) way to get the current timestamp as an integer.
  var now = Date.now || function() {
    return new Date().getTime();
  };

  // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  function createEscaper(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped.
    var source = '(?:' + keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  }
  var escape = createEscaper(escapeMap);
  var unescape = createEscaper(unescapeMap);

  // Traverses the children of `obj` along `path`. If a child is a function, it
  // is invoked with its parent as context. Returns the value of the final
  // child, or `fallback` if any child is undefined.
  function result(obj, path, fallback) {
    if (!isArray(path)) path = [path];
    var length = path.length;
    if (!length) {
      return isFunction(fallback) ? fallback.call(obj) : fallback;
    }
    for (var i = 0; i < length; i++) {
      var prop = obj == null ? void 0 : obj[path[i]];
      if (prop === void 0) {
        prop = fallback;
        i = length; // Ensure we don't continue iterating.
      }
      obj = isFunction(prop) ? prop.call(obj) : prop;
    }
    return obj;
  }

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  function uniqueId(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  }

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  var templateSettings = _.templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  function template(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offset.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    var render;
    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  }

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  function chain(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  }

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  function chainResult(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  }

  // Add your own custom functions to the Underscore object.
  function mixin(obj) {
    each(functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return chainResult(this, func.apply(_, args));
      };
    });
    return _;
  }

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return chainResult(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return chainResult(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return String(this._wrapped);
  };

  var allExports = ({
    'default': _,
    VERSION: VERSION,
    iteratee: iteratee,
    restArguments: restArguments,
    each: each,
    forEach: each,
    map: map,
    collect: map,
    reduce: reduce,
    foldl: reduce,
    inject: reduce,
    reduceRight: reduceRight,
    foldr: reduceRight,
    find: find,
    detect: find,
    filter: filter,
    select: filter,
    reject: reject,
    every: every,
    all: every,
    some: some,
    any: some,
    contains: contains,
    includes: contains,
    include: contains,
    invoke: invoke,
    pluck: pluck,
    where: where,
    findWhere: findWhere,
    max: max,
    min: min,
    shuffle: shuffle,
    sample: sample,
    sortBy: sortBy,
    groupBy: groupBy,
    indexBy: indexBy,
    countBy: countBy,
    toArray: toArray,
    size: size,
    partition: partition,
    first: first,
    head: first,
    take: first,
    initial: initial,
    last: last,
    rest: rest,
    tail: rest,
    drop: rest,
    compact: compact,
    flatten: flatten,
    without: without,
    uniq: uniq,
    unique: uniq,
    union: union,
    intersection: intersection,
    difference: difference,
    unzip: unzip,
    zip: zip,
    object: object,
    findIndex: findIndex,
    findLastIndex: findLastIndex,
    sortedIndex: sortedIndex,
    indexOf: indexOf,
    lastIndexOf: lastIndexOf,
    range: range,
    chunk: chunk,
    bind: bind,
    partial: partial,
    bindAll: bindAll,
    memoize: memoize,
    delay: delay,
    defer: defer,
    throttle: throttle,
    debounce: debounce,
    wrap: wrap,
    negate: negate,
    compose: compose,
    after: after,
    before: before,
    once: once,
    keys: keys,
    allKeys: allKeys,
    values: values,
    mapObject: mapObject,
    pairs: pairs,
    invert: invert,
    functions: functions,
    methods: functions,
    extend: extend,
    extendOwn: extendOwn,
    assign: extendOwn,
    findKey: findKey,
    pick: pick,
    omit: omit,
    defaults: defaults,
    create: create,
    clone: clone,
    tap: tap,
    isMatch: isMatch,
    isEqual: isEqual,
    isEmpty: isEmpty,
    isElement: isElement,
    isArray: isArray,
    isObject: isObject,
    isArguments: isArguments,
    isFunction: isFunction,
    isString: isString,
    isNumber: isNumber,
    isDate: isDate,
    isRegExp: isRegExp,
    isError: isError,
    isSymbol: isSymbol,
    isMap: isMap,
    isWeakMap: isWeakMap,
    isSet: isSet,
    isWeakSet: isWeakSet,
    isFinite: isFinite,
    isNaN: isNaN,
    isBoolean: isBoolean,
    isNull: isNull,
    isUndefined: isUndefined,
    has: has,
    identity: identity,
    constant: constant,
    noop: noop,
    property: property,
    propertyOf: propertyOf,
    matcher: matcher,
    matches: matcher,
    times: times,
    random: random,
    now: now,
    escape: escape,
    unescape: unescape,
    result: result,
    uniqueId: uniqueId,
    templateSettings: templateSettings,
    template: template,
    chain: chain,
    mixin: mixin
  });

  // Add all of the Underscore functions to the wrapper object.
  var _$1 = mixin(allExports);
  // Legacy Node.js API
  _$1._ = _$1;

  return _$1;

})));


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[10]);
