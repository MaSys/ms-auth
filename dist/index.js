"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _auth = _interopRequireDefault(require("./auth"));

var _default = {
  install: function install(app, options) {
    var auth = new _auth["default"](options);

    if (app.config.globalProperties) {
      app.config.globalProperties.$auth = auth;
    } else if (typeof app === 'function') {
      Object.defineProperty(app.prototype, '$auth', {
        get: function get() {
          return auth;
        }
      });
    }

    if (options.router) {
      options.router.beforeEach( /*#__PURE__*/function () {
        var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(to, from, next) {
          return _regenerator["default"].wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!to.matched.some(function (record) {
                    return record.meta.requiresAuth;
                  })) {
                    _context.next = 12;
                    break;
                  }

                  _context.prev = 1;
                  _context.next = 4;
                  return auth.isAuthorized(to.meta.model, to.meta.permission);

                case 4:
                  next();
                  _context.next = 10;
                  break;

                case 7:
                  _context.prev = 7;
                  _context.t0 = _context["catch"](1);

                  if (to.name === options.redirectRouteName) {
                    next();
                  } else {
                    next({
                      name: options.redirectRouteName
                    });
                  }

                case 10:
                  _context.next = 13;
                  break;

                case 12:
                  next();

                case 13:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, null, [[1, 7]]);
        }));

        return function (_x, _x2, _x3) {
          return _ref.apply(this, arguments);
        };
      }());
    }

    if (app.provide) {
      app.provide('$can', auth.can);
    }
    /**
     * https://stackoverflow.com/a/43543814
     */


    var update = function update(el, binding, vnode) {
      var permission = binding.arg;
      var model = binding.value;

      if (auth.can(model, permission)) {
        return;
      } // replace HTMLElement with comment node


      var comment = document.createComment(' ');
      Object.defineProperty(comment, 'setAttribute', {
        value: function value() {
          return undefined;
        }
      });
      vnode.elm = comment;
      vnode.text = ' ';
      vnode.isComment = true;
      vnode.context = undefined;
      vnode.tag = undefined;

      if (vnode.data) {
        vnode.data.directives = undefined;
      }

      if (vnode.componentInstance) {
        vnode.componentInstance.$el = comment;
      }

      if (el.parentNode) {
        el.parentNode.replaceChild(comment, el);
      }
    };

    app.directive('can', {
      // Run on initialisation (first render) of the directive on the element
      bind: update,
      // Run on subsequent updates to the value supplied to the directive
      update: update,
      // Vuejs3
      mounted: update
    });
  }
};
exports["default"] = _default;