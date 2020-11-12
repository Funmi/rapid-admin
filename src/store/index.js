import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {
      nickname: sessionStorage.nickname||'未登录',
      token: sessionStorage.token||null
    },
    menu: [
      {label: '页面1', route: '/page1', icon: 'el-icon-document'},
      {label: '页面2', route: '/page2', icon: 'el-icon-picture-outline'},
      {label: '菜单2', route: '/menu2', icon: 'el-icon-receiving',
        subs: [
          {label: '页面2-1', route: '/menu2/page2-1'}
        ]
      },
    ]
  },
  getters: {
    userInfo: ({userInfo}) => {
      return userInfo
    },
    menu({menu}) {
      return menu
    }
  },
  mutations: {
    userInfo({userInfo}, {nickname, token}) {
      if(nickname) {
        // console.log('修改nickname', nickname)
        userInfo.nickname = nickname
        sessionStorage.nickname = nickname
      }
      if(token) {
        userInfo.token = token
        sessionStorage.token = token
      }
    },
    menu(state, menu) {
      state.menu = menu
    },
    logout(state) {
      state.userInfo.nickname = '未登录',
      state.userInfo.token = null
      // state.menus = []
      sessionStorage.clear()
    }
  }
})
