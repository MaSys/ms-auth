export default function (Vue) {
  /**
   * https://stackoverflow.com/a/43543814
   */
  Vue.directive('can', (el, binding, vnode) => {
    const permission = binding.arg
    const model = binding.value
    const vm = vnode.context
    if (!vm.$auth.can(model, permission)) {
      // replace HTMLElement with comment node
      const comment = document.createComment(' ')
      Object.defineProperty(comment, 'setAttribute', { value: () => undefined })
      vnode.elm = comment
      vnode.text = ' '
      vnode.isComment = true
      vnode.context = undefined
      vnode.tag = undefined
      vnode.data.directives = undefined

      if (vnode.componentInstance) {
        vnode.componentInstance.$el = comment
      }

      if (el.parentNode) {
        el.parentNode.replaceChild(comment, el)
      }
    }
  })
}
