const cookieparser = process.server ? require('cookieparser') : undefined

export const state = () => {
    return {
        // 当前用户信息
        user: null
    }
}

export const mutations = {
    setUser (state, user) {
        state.user = user
    }
}

export const actions = {
    // 这是一个特殊的方法 这个action 会在服务端渲染期间自动调用，初始化容器的数据，传递数据给客户端调用
    nuxtServerInit ({ commit }, { req }) {
        let user = null
        if (req.headers.cookie) {
          const parsed = cookieparser.parse(req.headers.cookie)
          try {
              user = JSON.parse(parsed.user)
          } catch (e) {

          }
        }
        commit('setUser', user)
    } 
}