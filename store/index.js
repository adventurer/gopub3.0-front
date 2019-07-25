import Vuex from 'vuex'

const cookieparser = process.server ? require('cookieparser') : undefined

const index = () => {
  return new Vuex.Store({
    state: () => ({
      password_hash: '',
      isLogin: false,
      userName: '',
    }),
    mutations: {
      login(state, data) {
        // console.log(data)
        state.password_hash = data.PasswordHash
        state.isLogin = data.isLogin
        state.userName = data.Email
      },
      logout(state) {
        state.password_hash = ''
        state.isLogin = false
        state.userName = ''
      }
    },
    actions: {
      nuxtServerInit({ commit }, { req }) {
        let data = {}
        if (req.headers.cookie) {
          const parsed = cookieparser.parse(req.headers.cookie)
          try {
            data.PasswordHash = parsed.PasswordHash
            data.isLogin = parsed.isLogin
            data.Email = parsed.Email
          } catch (err) {
            // 找不到有效的Cookie
          }
        }
        commit('login', data)
      }
    }
  })
}

export default index