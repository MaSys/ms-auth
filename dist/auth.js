"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var Auth = /*#__PURE__*/function () {
  function Auth() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var app = arguments.length > 1 ? arguments[1] : undefined;
    (0, _classCallCheck2["default"])(this, Auth);
    this.app = app;
    this.currentUser = this.app.observable(null);
    Object.defineProperty(this, 'options', {
      enumerable: false,
      writable: true,
      value: options
    });
    Object.defineProperty(this, 'acls', {
      enumerable: false,
      writable: true,
      value: {}
    });
  }

  (0, _createClass2["default"])(Auth, [{
    key: "removeAllRules",
    value: function removeAllRules() {
      this.acls = {};
    }
  }, {
    key: "addRule",
    value: function addRule(model, permission) {
      var attrs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

      if (!this.acls[model]) {
        this.acls[model] = {};
      }

      this.acls[model][permission] = attrs;
    }
  }, {
    key: "removeRule",
    value: function removeRule(model, permission) {
      if (!this.acls[model]) {
        return;
      }

      if (!this.acls[model][permission]) {
        return;
      }

      delete this.acls[model][permission];
    }
  }, {
    key: "logout",
    value: function logout() {
      this.currentUser = this.app.observable(null);
    }
  }, {
    key: "updateCurrentUser",
    value: function () {
      var _updateCurrentUser = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var user;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!this.options.getCurrentUser) {
                  _context.next = 5;
                  break;
                }

                _context.next = 3;
                return this.options.getCurrentUser(this);

              case 3:
                user = _context.sent;
                this.currentUser = this.app.observable(user);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function updateCurrentUser() {
        return _updateCurrentUser.apply(this, arguments);
      }

      return updateCurrentUser;
    }()
  }, {
    key: "isAuthorized",
    value: function () {
      var _isAuthorized = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(model, permission) {
        var user;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!this.options.getCurrentUser) {
                  _context2.next = 5;
                  break;
                }

                _context2.next = 3;
                return this.options.getCurrentUser(this);

              case 3:
                user = _context2.sent;
                this.currentUser = this.app.observable(user);

              case 5:
                if (!this.options.prepareAcls) {
                  _context2.next = 8;
                  break;
                }

                _context2.next = 8;
                return this.options.prepareAcls(this);

              case 8:
                if (this.can(permission, model)) {
                  _context2.next = 10;
                  break;
                }

                throw Error('Unauthorized!');

              case 10:
                return _context2.abrupt("return", true);

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function isAuthorized(_x, _x2) {
        return _isAuthorized.apply(this, arguments);
      }

      return isAuthorized;
    }()
  }, {
    key: "can",
    value: function can(permission, model, attr) {
      if (this.acls.manage) {
        if (!!this.acls.manage.all) {
          return true;
        }

        if (!!this.acls.manage[model]) {
          return true;
        }
      }

      if (!this.acls[model]) {
        return false;
      }

      if (attr) {
        var attrs = this.acls[model][permission];
        return attrs.indexOf(attr) !== -1;
      } else {
        return !!this.acls[model] && !!this.acls[model][permission];
      }
    }
  }]);
  return Auth;
}();

Auth["default"] = Auth;
module.exports = Auth;