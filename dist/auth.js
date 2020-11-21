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
    key: "logout",
    value: function logout() {
      this.currentUser = this.app.observable(null);
    }
  }, {
    key: "isAuthorized",
    value: function () {
      var _isAuthorized = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(model, permission) {
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
                if (!this.options.prepareAcls) {
                  _context.next = 8;
                  break;
                }

                _context.next = 8;
                return this.options.prepareAcls(this);

              case 8:
                if (this.can(model, permission)) {
                  _context.next = 10;
                  break;
                }

                throw Error('Unauthorized!');

              case 10:
                return _context.abrupt("return", true);

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function isAuthorized(_x, _x2) {
        return _isAuthorized.apply(this, arguments);
      }

      return isAuthorized;
    }()
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
  }]);
  return Auth;
}();

Auth["default"] = Auth;
module.exports = Auth;