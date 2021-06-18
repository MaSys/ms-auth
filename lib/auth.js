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

  addRule (model, permission, attrs = []) {
    if (!this.acls[model]) { this.acls[model] = {} }

    this.acls[model][permission] = attrs
  }

  removeRule (model, permission) {
    if (!this.acls[model]) { return }
    if (!this.acls[model][permission]) { return }

    delete this.acls[model][permission]
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

    if (!this.can(permission, model)) { throw Error('Unauthorized!') }

    return true
  }

  can (permission, model, attr) {
    if (this.acls.manage) {
      if (!!this.acls.manage.all) { return true }
      if (!!this.acls.manage[model]) { return true }
    }
    if (!this.acls[model]) { return false }

    if (attr) {
      const attrs = this.acls[model][permission]
      return attrs.indexOf(attr) !== -1
    } else {
      return !!this.acls[model] && !!this.acls[model][permission]
    }
  }
}

Auth.default = Auth
module.exports = Auth
