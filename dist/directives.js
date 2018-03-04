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
    if (!vm.$auth.can(model, permission)) {
      // replace HTMLElement with comment node
      var comment = document.createComment(' ');
      Object.defineProperty(comment, 'setAttribute', { value: function value() {
          return undefined;
        } });
      vnode.elm = comment;
      vnode.text = ' ';
      vnode.isComment = true;
      vnode.context = undefined;
      vnode.tag = undefined;
      vnode.data.directives = undefined;

      if (vnode.componentInstance) {
        vnode.componentInstance.$el = comment;
      }

      if (el.parentNode) {
        el.parentNode.replaceChild(comment, el);
      }
    }
  });
};