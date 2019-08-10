export default function (Vue) {
  /**
   * https://stackoverflow.com/a/43543814
   */
  Vue.directive('can', (el, binding, vnode) => {
    const permission = binding.arg
    const model = binding.value
    const vm = vnode.context

    if (vm.$auth.can(model, permission)) {
      el.removeAttribute('style')
    } else {
      el.style.display = 'none'
    }
  })
}
