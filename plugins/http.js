import iView from 'iview'
import axios from 'axios'
const Cookie = process.client ? require('js-cookie') : undefined


export default function({ app }) {
  // axios 配置
  axios.defaults.timeout = 5000
  axios.defaults.baseURL = 'http://127.0.0.1:8088/'
  // http request 拦截器
  axios.interceptors.request.use(
    response => {
      return response
    },
    err => {
      return Promise.reject(err)
    }
  )

  axios.interceptors.response.use(
    function(response) {
      if (response.data.Sta == 0) {
        iView.Message.error({ content: response.data.Msg, duration: 10 })
      }

      if (response.data.Sta == 0 && response.data.Code == 400) {
        Cookie.remove('PasswordHash')
        Cookie.remove('isLogin')
        Cookie.remove('Email')
        response.data.Data = []
        location.href = '/'
        return response
      }
      
      return response
    },
    function(error) {
      // 对响应错误做点什么
      return Promise.reject(error)
    }
  )
}
