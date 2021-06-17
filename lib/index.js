import Auth from './auth'

export default {
  install: (app, options) => {
    const auth = new Auth(options, app)

    if (app.config.globalProperties) {
      app.config.globalProperties.$auth = auth
    } else if (typeof app === 'function') {
      Object.defineProperty(app.prototype, '$auth', {
        get () {
          return app.observable(auth)
        }
      })
    }

    if (options.router) {
      options.router.beforeEach(async (to, from, next) => {
        if (to.matched.some(record => record.meta.requiresAuth)) {
          if (to.meta.auth) {
            try {
              await auth.isAuthorized(to.meta.auth.model, to.meta.auth.permission)
              next()
            } catch (e) {
              if (to.name === options.homeRoute) {
                if (options.onUnauthorized) {
                  await options.onUnauthorized(auth)
                }
                next({ name: options.loginRoute })
              } else {
                next({ name: options.homeRoute })
              }
            }
          }
        } else {
          next()
        }
      })
    }

    if (app.provide) {
      app.provide('$can', auth.can)
    }

    /**
     * https://stackoverflow.com/a/43543814
     */
    const update = (el, binding, vnode) => {
      const permission = binding.arg
      const model = binding.value

      const arr = model.split('.')
      if (auth.can(permission, arr[0], arr[1])) { return }

      // replace HTMLElement with comment node
      const comment = document.createComment(' ')
      Object.defineProperty(comment, 'setAttribute', {
        value: () => undefined
      })
      vnode.elm = comment
      vnode.text = ' '
      vnode.isComment = true
      vnode.context = undefined
      vnode.tag = undefined
      if (vnode.data) {
        vnode.data.directives = undefined
      }

      if (vnode.componentInstance) {
        vnode.componentInstance.$el = comment
      }

      if (el.parentNode) {
        el.parentNode.replaceChild(comment, el)
      }
    }

    app.directive('can', {
      // Run on initialisation (first render) of the directive on the element
      bind: update,
      // Run on subsequent updates to the value supplied to the directive
      update: update,
      // Vuejs3
      mounted: update
    })
  }
}
