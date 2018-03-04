import axios from 'axios'
import applyMixin from './apply-mixin'
import directives from './directives'

let Vue
const defaultOptions = {
  ssKey: 'user',
  storage: 'localStorage',
  token: 'token',
  authorizationStr: ''
}

function install (_Vue) {
  if (Vue) {
    console.error('[Auth] already installed. Vue.use(Auth) should be called only once.')
    return
  }

  Vue = _Vue
  applyMixin(Vue)
  directives(Vue)
}

class Auth {
  static install (_Vue) {
    install(_Vue)
  }

  constructor (options = {}) {
    this._vm
    Vue.util.defineReactive(this, 'options', Object.assign(defaultOptions, options))
    Vue.util.defineReactive(this, 'currentUser', { id: '', email: ''})
    Vue.util.defineReactive(this, 'acls', {})
  }

  get isLoggedIn () {
    const storageItem = window[this.options.storage].getItem(this.options.ssKey)
    if (!storageItem) { return false }
    const data = JSON.parse(storageItem)
    return !!data && !!data[this.options.token]
  }

  get accessToken () {
    let str = this.options.authorizationStr
    const storageItem = window[this.options.storage].getItem(this.options.ssKey)
    if (!storageItem) { return '' }
    const data = JSON.parse(storageItem)
    for (let key in data) {
      str = str.replace('{{' + key + '}}', data[key])
    }
    str = str.replace('{{' + this.options.token + '}}', data[this.options.token])
    return str
  }

  setStorage (data = {}) {
    window[this.options.storage].setItem(
      this.options.ssKey,
      JSON.stringify(data)
    )
  }

  removeStorage (data = {}) {
    Vue.util.defineReactive(this, 'currentUser', {})
    window[this.options.storage].removeItem(this.options.ssKey)
  }

  async getCurrentUser (cb) {
    console.error('[getCurrentUser] function should be overwritten.')
    return
  }

  async getAcls (cb) {
    console.error('[getAcls] function should be overwritten.')
    return
  }

  setCurrentUser (data = {}) {
    this.email = data.email
    this._vm.$set(this._vm.$auth, 'currentUser', data)
  }

  rule (model, permission) {
    if (!this.acls[model]) { this.acls[model] = [] }
    if (this.acls[model].indexOf(permission) !== -1) { return }
    this.acls[model].push(permission)
  }

  async isAuthorized (model, permission) {
    try {
      if (!this.isLoggedIn) { throw Error('User not Logged in!') }

      if (this.currentUser.email === this.email) {
        return this.checkPermission(model, permission)
      }

      await this.getCurrentUser()
      await this.getAcls()
      this.checkPermission(model, permission)
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  checkPermission (model, permission) {
    if (!this.can(model, permission)) { throw Error('Unauthorized!') }
  }

  can (model, permission) {
    if (this.acls.manage) {
      if (this.acls.manage.indexOf('all') !== -1) {
        return true
      }
    }
    if (!this.acls[model]) { return false }
    const index = this.acls[model].indexOf(permission)
    if (index === -1) { return false }
    return true
  }
}

// auto install in dist mode
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default Auth
