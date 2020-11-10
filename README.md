
# ms-auth
Vuejs Authorization

# example

```javascript

import auth from 'ms-auth'

const options = {
  redirectRouteName: 'Home', // route to be redirected when unauthorized
  router, // VueRouter instance
  async getCurrentUser () {
    // Fetch user in session information
    return Promise.resolve({ id: 1, email: 'john@doe.com', token: 'aaasdasd' })
  },
  async prepareAcls (auth) {
    // Do your magic here and give the user the rules to access resources.
    auth.addRule('User', 'read')
    auth.addRule('User', 'create')
  }
}

// Vue 2.x
Vue.use(auth, options)

// Vue 3.x
createApp(App)
  ...
  .use(auth, options)
  ...

```

# Directive

```html

<router-link v-can:update="'Post'">
  ...
</router-link>

```
