'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (Vue) {
  /**
   * https://stackoverflow.com/a/43543814
   */
  Vue.directive('can', function (el, binding, vnode) {
    var permission = binding.arg;
    var model = binding.value;
    var vm = vnode.context;

    if (vm.$auth.can(model, permission)) {
      el.removeAttribute('style');
    } else {
      el.style.display = 'none';
    }
  });
};