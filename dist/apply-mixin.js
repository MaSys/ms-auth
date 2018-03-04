'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = applyMixin;
function applyMixin(Vue) {
  var usesInit = Vue.config._lifecycleHooks.indexOf('init') > -1;
  Vue.mixin(usesInit ? { init: authInit } : { beforeCreate: authInit });

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function authInit() {
    var options = this.$options;
    // store injection
    if (options.auth) {
      this.$options.auth._vm = this;
      this.$auth = options.auth;
    } else if (options.parent && options.parent.$auth) {
      this.$options.parent.$auth._vm = this;
      this.$auth = options.parent.$auth;
    }
  }
}