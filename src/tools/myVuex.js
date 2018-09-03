import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    cartDate: JSON.parse(window.localStorage.getItem('goodKey')) || {},
    loginStatus: false,
    // fromPath: '',
    interId: undefined
  },
  mutations: {
    addGoods(state, goodInfo) {
      // 先判断购物车内是否有该商品
      if (state.cartDate[goodInfo.goodId] == undefined) {
        Vue.set(state.cartDate, goodInfo.goodId, goodInfo.goodNum);
      } else {
        state.cartDate[goodInfo.goodId] += goodInfo.goodNum;
      }
    },
    updateGoods(state, goodInfo) {
      state.cartDate[goodInfo.goodId] = goodInfo.goodNum;
    },
    deleteGoods(state, goodId) {
      Vue.delete(state.cartDate, goodId);
    },
    changeLoginStatus(state, newStatus) {
      state.loginStatus = newStatus;
    },
    saveFromPath(state, fromPath) {
      state.fromPath = fromPath;
    },
    saveInterId(state, interId) {
      state.interId = interId;
    },
    clearInterId(state) {
      clearInterval(state.interId);
      state.interId = undefined;
    }
  },
  getters: {
    goodsCount: state => {
      let acount = 0;
      for (var key in state.cartDate) {
        acount += state.cartDate[key];
      }
      return acount;
    }
  }
})

window.onbeforeunload = function () {
  window.localStorage.setItem('goodKey', JSON.stringify(store.state.cartDate));
}

export default store;