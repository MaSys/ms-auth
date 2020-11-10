class Auth {
  constructor (options = {}) {
    this.options = options
    this.currentUser = null
    this.acls = {}
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

  async isAuthorized (model, permission) {
    const user = await this.options.getCurrentUser()
    this.currentUser = user
    await this.options.prepareAcls(this)

    return this.checkPermission(model, permission)
  }

  checkPermission (model, permission) {
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
