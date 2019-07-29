const cookieparser = process.server ? require('cookieparser') : undefined

export const state = () => ({
  password_hash: '',
  isLogin: false,
  userName: ''
})

export const mutations = {
  login(state, data) {
    state.password_hash = data.PasswordHash
    state.isLogin = data.isLogin
    state.userName = data.Email
  },
  logout(state) {
    state.password_hash = ''
    state.isLogin = false
    state.userName = ''
  },
}

export const actions = {
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