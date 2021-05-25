class Auth {
  constructor (options = {}, app) {
    this.app = app
    this.currentUser = this.app.observable(null)

    Object.defineProperty(this, 'options', {
      enumerable: false,
      writable: true,
      value: options
    })
    Object.defineProperty(this, 'acls', {
      enumerable: false,
      writable: true,
      value: {}
    })
  }

  removeAllRules () {
    this.acls = {}
  }

  addRule (model, permission) {
    if (!this.acls[model]) { this.acls[model] = [] }
    if (this.acls[model].indexOf(permission) !== -1) { return }

    this.acls[model].push(permission)
  }

  removeRule (model, permission) {
    if (!this.acls[model]) { return }
    if (this.acls[model].indexOf(permission) === -1) { return }

    const index = this.acls[model].indexOf(permission)
    this.acls[model].splice(index, 1)
  }

  logout () {
    this.currentUser = this.app.observable(null)
  }

  async updateCurrentUser () {
    if (this.options.getCurrentUser) {
      const user = await this.options.getCurrentUser(this)
      this.currentUser = this.app.observable(user)
    }
  }

  async isAuthorized (model, permission) {
    if (this.options.getCurrentUser) {
      const user = await this.options.getCurrentUser(this)
      this.currentUser = this.app.observable(user)
    }
    if (this.options.prepareAcls) {
      await this.options.prepareAcls(this)
    }

    if (!this.can(model, permission)) { throw Error('Unauthorized!') }

    return true
  }

  can (model, permission) {
    if (this.acls.manage) {
      if (this.acls.manage.indexOf('all') !== -1) { return true }
      if (this.acls.manage.indexOf(model) !== -1) { return true }
    }
    if (!this.acls[model]) { return false }
    const index = this.acls[model].indexOf(permission)
    if (index === -1) { return false }
    return true
  }
}

Auth.default = Auth
module.exports = Auth
