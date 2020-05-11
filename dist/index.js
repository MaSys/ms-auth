"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _axios = _interopRequireDefault(require("axios"));

var _applyMixin = _interopRequireDefault(require("./apply-mixin"));

var _directives = _interopRequireDefault(require("./directives"));

var Vue;
var defaultOptions = {
  ssKey: 'user',
  storage: 'localStorage',
  token: 'token',
  authorizationStr: ''
};

function _install(_Vue) {
  if (Vue) {
    console.error('[Auth] already installed. Vue.use(Auth) should be called only once.');
    return;
  }

  Vue = _Vue;
  (0, _applyMixin["default"])(Vue);
  (0, _directives["default"])(Vue);
}

var Auth = /*#__PURE__*/function () {
  (0, _createClass2["default"])(Auth, null, [{
    key: "install",
    value: function install(_Vue) {
      _install(_Vue);
    }
  }]);

  function Auth() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2["default"])(this, Auth);
    this._vm;
    Vue.util.defineReactive(this, 'options', Object.assign(defaultOptions, options));
    Vue.util.defineReactive(this, 'currentUser', {
      id: '',
      email: ''
    });
    Vue.util.defineReactive(this, 'acls', {});
  }

  (0, _createClass2["default"])(Auth, [{
    key: "setStorage",
    value: function setStorage() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.email = data.email;
      window[this.options.storage].setItem(this.options.ssKey, JSON.stringify(data));
    }
  }, {
    key: "removeStorage",
    value: function removeStorage() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.setCurrentUser();
      Vue["delete"](this, 'email');
      Vue["delete"](this, 'currentUser');
      Vue["delete"](this, 'acls');
      Vue.util.defineReactive(this, 'email', null);
      Vue.util.defineReactive(this, 'currentUser', {
        id: '',
        email: ''
      });
      Vue.util.defineReactive(this, 'acls', {});
      window[this.options.storage].removeItem(this.options.ssKey);
    }
  }, {
    key: "getCurrentUser",
    value: function () {
      var _getCurrentUser = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(cb) {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                console.error('[getCurrentUser] function should be overwritten.');
                return _context.abrupt("return");

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function getCurrentUser(_x) {
        return _getCurrentUser.apply(this, arguments);
      }

      return getCurrentUser;
    }()
  }, {
    key: "getAcls",
    value: function () {
      var _getAcls = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(cb) {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                console.error('[getAcls] function should be overwritten.');
                return _context2.abrupt("return");

              case 2:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function getAcls(_x2) {
        return _getAcls.apply(this, arguments);
      }

      return getAcls;
    }()
  }, {
    key: "setCurrentUser",
    value: function setCurrentUser() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.email = data.email;

      this._vm.$set(this._vm.$auth, 'currentUser', data);
    }
  }, {
    key: "addRule",
    value: function addRule(model, permission) {
      if (!this.acls[model]) {
        this.acls[model] = [];
      }

      if (this.acls[model].indexOf(permission) !== -1) {
        return;
      }

      this.acls[model].push(permission);
    }
  }, {
    key: "removeRule",
    value: function removeRule(model, permission) {
      if (!this.acls[model]) {
        return;
      }

      if (this.acls[model].indexOf(permission) === -1) {
        return;
      }

      var index = this.acls[model].indexOf(permission);
      this.acls[model].splice(index, 1);
    }
  }, {
    key: "rule",
    value: function rule(model, permission) {
      console.warn('Deprecated!!! Use addRule instead!');
      this.addRule(model, permission);
    }
  }, {
    key: "isAuthorized",
    value: function () {
      var _isAuthorized = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(model, permission) {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;

                if (this.isLoggedIn) {
                  _context3.next = 3;
                  break;
                }

                throw Error('User not Logged in!');

              case 3:
                if (!(this.currentUser.email === this.email)) {
                  _context3.next = 5;
                  break;
                }

                return _context3.abrupt("return", this.checkPermission(model, permission));

              case 5:
                _context3.next = 7;
                return this.getCurrentUser();

              case 7:
                _context3.next = 9;
                return this.getAcls();

              case 9:
                this.checkPermission(model, permission);
                _context3.next = 16;
                break;

              case 12:
                _context3.prev = 12;
                _context3.t0 = _context3["catch"](0);
                console.log(_context3.t0);
                throw _context3.t0;

              case 16:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 12]]);
      }));

      function isAuthorized(_x3, _x4) {
        return _isAuthorized.apply(this, arguments);
      }

      return isAuthorized;
    }()
  }, {
    key: "checkPermission",
    value: function checkPermission(model, permission) {
      if (!this.can(model, permission)) {
        throw Error('Unauthorized!');
      }
    }
  }, {
    key: "can",
    value: function can(model, permission) {
      if (this.acls.manage) {
        if (this.acls.manage.indexOf('all') !== -1) {
          return true;
        }

        if (this.acls.manage.indexOf(model) !== -1) {
          return true;
        }
      }

      if (!this.acls[model]) {
        return false;
      }

      var index = this.acls[model].indexOf(permission);

      if (index === -1) {
        return false;
      }

      return true;
    }
  }, {
    key: "isLoggedIn",
    get: function get() {
      var storageItem = window[this.options.storage].getItem(this.options.ssKey);

      if (!storageItem) {
        return false;
      }

      var data = JSON.parse(storageItem);
      return !!data && !!data[this.options.token];
    }
  }, {
    key: "accessToken",
    get: function get() {
      var str = this.options.authorizationStr;
      var storageItem = window[this.options.storage].getItem(this.options.ssKey);

      if (!storageItem) {
        return '';
      }

      var data = JSON.parse(storageItem);

      for (var key in data) {
        str = str.replace('{{' + key + '}}', data[key]);
      }

      str = str.replace('{{' + this.options.token + '}}', data[this.options.token]);
      return str;
    }
  }]);
  return Auth;
}(); // auto install in dist mode


if (typeof window !== 'undefined' && window.Vue) {
  _install(window.Vue);
}

var _default = Auth;
exports["default"] = _default;