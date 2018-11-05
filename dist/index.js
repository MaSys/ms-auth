'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _applyMixin = require('./apply-mixin');

var _applyMixin2 = _interopRequireDefault(_applyMixin);

var _directives = require('./directives');

var _directives2 = _interopRequireDefault(_directives);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Vue = void 0;
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
  (0, _applyMixin2.default)(Vue);
  (0, _directives2.default)(Vue);
}

var Auth = function () {
  (0, _createClass3.default)(Auth, null, [{
    key: 'install',
    value: function install(_Vue) {
      _install(_Vue);
    }
  }]);

  function Auth() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, Auth);

    this._vm;
    Vue.util.defineReactive(this, 'options', (0, _assign2.default)(defaultOptions, options));
    Vue.util.defineReactive(this, 'currentUser', { id: '', email: '' });
    Vue.util.defineReactive(this, 'acls', {});
  }

  (0, _createClass3.default)(Auth, [{
    key: 'setStorage',
    value: function setStorage() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.email = data.email;
      window[this.options.storage].setItem(this.options.ssKey, (0, _stringify2.default)(data));
    }
  }, {
    key: 'removeStorage',
    value: function removeStorage() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      Vue.delete(this, 'email');
      Vue.delete(this, 'currentUser');
      Vue.delete(this, 'acls');

      Vue.util.defineReactive(this, 'email', null);
      Vue.util.defineReactive(this, 'currentUser', { id: '', email: '' });
      Vue.util.defineReactive(this, 'acls', {});

      window[this.options.storage].removeItem(this.options.ssKey);
    }
  }, {
    key: 'getCurrentUser',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(cb) {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                console.error('[getCurrentUser] function should be overwritten.');
                return _context.abrupt('return');

              case 2:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getCurrentUser(_x4) {
        return _ref.apply(this, arguments);
      }

      return getCurrentUser;
    }()
  }, {
    key: 'getAcls',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(cb) {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                console.error('[getAcls] function should be overwritten.');
                return _context2.abrupt('return');

              case 2:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getAcls(_x5) {
        return _ref2.apply(this, arguments);
      }

      return getAcls;
    }()
  }, {
    key: 'setCurrentUser',
    value: function setCurrentUser() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.email = data.email;
      this._vm.$set(this._vm.$auth, 'currentUser', data);
    }
  }, {
    key: 'addRule',
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
    key: 'rule',
    value: function rule(model, permission) {
      console.warn('Deprecated!!! Use addRule instead!');
      this.addRule(model, permission);
    }
  }, {
    key: 'isAuthorized',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(model, permission) {
        return _regenerator2.default.wrap(function _callee3$(_context3) {
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
                console.log('logged');

                if (!(this.currentUser.email === this.email)) {
                  _context3.next = 7;
                  break;
                }

                console.log('same email');
                return _context3.abrupt('return', this.checkPermission(model, permission));

              case 7:
                console.log('new email');

                _context3.next = 10;
                return this.getCurrentUser();

              case 10:
                _context3.next = 12;
                return this.getAcls();

              case 12:
                this.checkPermission(model, permission);
                _context3.next = 19;
                break;

              case 15:
                _context3.prev = 15;
                _context3.t0 = _context3['catch'](0);

                console.log(_context3.t0);
                throw _context3.t0;

              case 19:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 15]]);
      }));

      function isAuthorized(_x7, _x8) {
        return _ref3.apply(this, arguments);
      }

      return isAuthorized;
    }()
  }, {
    key: 'checkPermission',
    value: function checkPermission(model, permission) {
      if (!this.can(model, permission)) {
        throw Error('Unauthorized!');
      }
    }
  }, {
    key: 'can',
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
    key: 'isLoggedIn',
    get: function get() {
      var storageItem = window[this.options.storage].getItem(this.options.ssKey);
      if (!storageItem) {
        return false;
      }
      var data = JSON.parse(storageItem);
      return !!data && !!data[this.options.token];
    }
  }, {
    key: 'accessToken',
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
}();

// auto install in dist mode


if (typeof window !== 'undefined' && window.Vue) {
  _install(window.Vue);
}

exports.default = Auth;