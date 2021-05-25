const assert = require('assert')
const Auth = require('../dist/auth')
const app = {
  observable (val) {
    return val
  }
}

const options = {
  getCurrentUser () {
    return Promise.resolve({ id: 1, email: 'john@doe.com' })
  },
  prepareAcls (auth) {
    auth.addRule('Post', 'create')
    auth.addRule('Comment', 'create')
  }
}

describe('Auth', () => {
  describe('#addRule', () => {
    it('adds rule to Auth', () => {
      const auth = new Auth(undefined, app)
      auth.addRule('Post', 'create')
      assert.equal(auth.acls.Post[0], 'create')
    })
  })

  describe('#removeRule', () => {
    it('removes rule from Auth', () => {
      const auth = new Auth(undefined, app)
      auth.addRule('Post', 'create')
      auth.removeRule('Post', 'create')
      assert.equal(auth.acls.Post.length, 0)
    })
  })

  describe('#removeAllRules', () => {
    it('removes all rules', () => {
      const auth = new Auth(undefined, app)
      auth.addRule('Post', 'create')
      auth.addRule('Comment', 'create')
      auth.removeAllRules()
      assert.equal(Object.keys(auth.acls).length, 0)
    })
  })

  describe('#can', () => {
    it('returns true if has rule', () => {
      const auth = new Auth(undefined, app)
      auth.addRule('Post', 'create')
      assert.equal(auth.can('Post', 'create'), true)
    })

    it('returns true if manage all', () => {
      const auth = new Auth(undefined, app)
      auth.addRule('manage', 'all')
      assert.equal(auth.can('Post', 'create'), true)
    })

    it('returns true if manage model', () => {
      const auth = new Auth(undefined, app)
      auth.addRule('manage', 'Post')
      assert.equal(auth.can('Post', 'create'), true)
    })

    it('returns false if has no rule', () => {
      const auth = new Auth(undefined, app)
      auth.addRule('Post', 'create')
      assert.equal(auth.can('Post', 'read'), false)
    })
  })

  describe('#isAuthorized', () => {
    it('returns true if has rule', async () => {
      try {
        const auth = new Auth(options, app)
        auth.addRule('Post', 'create')
        const can = await auth.isAuthorized('Post', 'create')
        assert.equal(can, true)
      } catch (err) {
        assert.equal(err.message, true)
      }
    })

    it('throws error if has no rule', async () => {
      try {
        const auth = new Auth(options, app)
        auth.addRule('Post', 'create')
        const can = await auth.isAuthorized('Tag', 'create')
        assert.equal(can, false)
      } catch (err) {
        assert.equal(err.message, 'Unauthorized!')
      }
    })
  })
})
