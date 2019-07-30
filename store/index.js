const cookieparser = process.server ? require('cookieparser') : undefined

export const state = () => ({
  password_hash: '',
  isLogin: false,
  userName: '',
  role: 0,
})

export const mutations = {
  login(state, data) {
    state.password_hash = data.PasswordHash
    state.isLogin = data.isLogin
    state.userName = data.Email
    state.role = data.Role
  },
  logout(state) {
    state.password_hash = ''
    state.isLogin = false
    state.userName = ''
    state.role = 0
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
        data.Role = parsed.Role
      } catch (err) {
        // 找不到有效的Cookie
      }
    }
    commit('login', data)
  }
}