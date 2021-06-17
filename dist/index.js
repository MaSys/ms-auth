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
    var auth = new _auth["default"](options, app);

    if (app.config.globalProperties) {
      app.config.globalProperties.$auth = auth;
    } else if (typeof app === 'function') {
      Object.defineProperty(app.prototype, '$auth', {
        get: function get() {
          return app.observable(auth);
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
                    _context.next = 20;
                    break;
                  }

                  if (!to.meta.auth) {
                    _context.next = 18;
                    break;
                  }

                  _context.prev = 2;
                  _context.next = 5;
                  return auth.isAuthorized(to.meta.auth.model, to.meta.auth.permission);

                case 5:
                  next();
                  _context.next = 18;
                  break;

                case 8:
                  _context.prev = 8;
                  _context.t0 = _context["catch"](2);

                  if (!(to.name === options.homeRoute)) {
                    _context.next = 17;
                    break;
                  }

                  if (!options.onUnauthorized) {
                    _context.next = 14;
                    break;
                  }

                  _context.next = 14;
                  return options.onUnauthorized(auth);

                case 14:
                  next({
                    name: options.loginRoute
                  });
                  _context.next = 18;
                  break;

                case 17:
                  next({
                    name: options.homeRoute
                  });

                case 18:
                  _context.next = 21;
                  break;

                case 20:
                  next();

                case 21:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, null, [[2, 8]]);
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
      var arr = model.split('.');

      if (auth.can(permission, arr[0], arr[1])) {
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