# ms-auth
Vuejs Authentication &amp; Authorization

# example

```javascript

import Auth from 'ms-auth'
Vue.use(Auth)
const auth = new Auth({
  ssKey: 'ms-manager-v', // storage key.
  token: 'auth_token', // access token key name as it's stored in storage.
  authorizationStr: 'Token token={{auth_token}};email={{email}}' // Authorization header string, key are as they are stored in storage.
})

// override the function to get current user info
auth.getCurrentUser = () => {
  axios.defaults.headers.common['Authorization'] = auth.accessToken
  return axios.get(process.env.API_URL + '/profiles/1')
    .then(res => {
      // set current user info for auth class.
      auth.setCurrentUser(res.data.data)
    })
}

// get your acls from the DB and set them into auth class.
axios.defaults.headers.common['Authorization'] = auth.accessToken
axios.get(process.env.API_URL + '/acls')
  .then(res => {
    auth.rule('manage', 'all') // to manage all models and have access to everything.
    auth.rule('Post', 'read') // give him access to read posts.
  })

```
