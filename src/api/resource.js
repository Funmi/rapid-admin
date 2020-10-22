import axios from 'axios'
import router from "@/router/index.js"
import store from "@/store/index.js"

//////////// 实例配置 ////////////
// 基础配置
let conf = {
  timeout: 10000,
  baseURL: process.env.VUE_APP_BASEPORT,
  headers: {
    'Content-Type': 'application/json', //表明请求数据的类型
  },
  // 返回类型，默认json，可选：'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
  responseType: 'json' //表明相应数据的类型，由浏览器获取数据后进行处理
}

let instance = axios.create(conf)

// 请求拦截加token
// 不能在基础配置中加token，登录前无token，axios实例化后并不会动态更新token
instance.interceptors.request.use(
  config => {
    let userInfo = store.getters.userInfo
    if(userInfo && userInfo.token) {
      let token = userInfo.token
      config.headers.Authorization = 'Bearer ' + token
    }
    return config;
  },
  // error => {
  //     tip('登陆失效,请重新登录！');
  //     return Promise.reject(error)
  // }
);

instance.interceptors.response.use(
  response => {
    let {data, status, headers} = response
    if(status == 200) {
      let {code, message} = data
      if(!isNaN(code) && code != 200) {
        console.log('data.code != 200', response)
        return {type: 'warning', message}
      }
      // 返回数据有时候在data里面，有时候在data.data里面???
      return {type: 'success', data: data.data||data, headers}
    }
    else {
      let { message } = data
      return {type: 'warning', message}
    }
  },
  error => {
    // 200-299之外的情况
    if(error.response) {
      let {data, status, statusText} = error.response
      let message = `错误代码:${status}`
      let title = statusText
      if(status == 401) {
        store.commit('logout')
        router.replace('/login')
        message = '登录已过期，需要重新登录'
      }
      else if(status>=500 && status<600) {
        message += '，服务器内部错误'
      }
      console.log('interceptors.response', error.response)
      return Promise.reject({type: 'skip'})
      // return Promise.reject({type: 'error', message, title})
    }
    console.log('interceptors.response', error.message)
    return Promise.reject({
      type: 'error', 
      message: error.message,
      title: '请求失败'
    })
  }
)

export default instance