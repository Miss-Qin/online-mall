import Vue from 'vue'
import App from './App.vue'
import Index from "./components/01.index.vue"
import Detail from "./components/02.productDetail.vue"
import Cart from "./components/03.shoppingCart.vue"
import Login from "./components/04.login.vue"
import OrderFile from "./components/05.orderFile.vue"
import SubmitOrder from "./components/06.submitOrder.vue"
import PaySuccess from "./components/07.paySuccess.vue"
import VipCenter from "./components/08.vipCenter.vue"
import OrderList from "./components/09.orderList.vue"
import OrderDetail from "./components/10.orderDetail.vue"
import moment from "moment";
import axios from "axios";

axios.defaults.baseURL = 'http://47.106.148.205:8899';
axios.defaults.withCredentials = true;
Vue.prototype.$axios = axios;
// Vue.config.productionTip = false
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    cartDate: JSON.parse(window.localStorage.getItem('goodKey')) || {},
    loginStatus: false,
    fromPath: '',
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

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// 导入iview包
import iView from 'iview';
import 'iview/dist/styles/iview.css';
Vue.use(iView);

// 导入懒加载包
import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload, {
  preLoad: 1.3,
  // error: 'dist/error.png',
  loading: require('./assets/statics/site/img/nazha.png'),
  attempt: 1
})

// 导入放大镜包
import ProductZoomer from 'vue-product-zoomer'
Vue.use(ProductZoomer)

// 导入vueX


const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    component: Index
  },
  {
    path: '/detail/:id',
    component: Detail
  },
  {
    path: '/cart',
    component: Cart
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/order/:ids',
    component: OrderFile,
    meta: { checkLogined: true }
  },
  {
    path: '/submit/:orderid',
    component: SubmitOrder,
    meta: {
      checkLogined: true,
      openInterval: true
    },
  },
  {
    path: '/paySuccess/:orderid',
    component: PaySuccess,
    meta: {
      checkLogined: true,
      openInterval: true
    }
  },
  {
    path: '/vipCenter',
    component: VipCenter,
    meta: { checkLogined: true }
  },
  {
    path: '/orderList',
    component: OrderList,
    meta: { checkLogined: true }
  },
  {
    path: '/orderDetail/:orderid',
    component: OrderDetail,
    meta: { checkLogined: true }
  }
]


const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})

router.beforeEach((to, from, next) => {
  // 保存上一次的页面路径
  store.commit('saveFromPath', from.path);

  //判断定时器是否清除
  if (to.meta.openInterval != true && store.state.interId != undefined) {
    store.commit('clearInterId')
  }
  // 登录监测
  if (to.meta.checkLogined == true) {
    axios.get(`/site/account/islogin`)
      .then(response => {
        if (response.data.code == "logined") {
          next();
        } else {
          next('/login');
        }
      })
  } else {
    next();
  }
})

Vue.filter('capitalize', function (value, myformat) {
  if (myformat != undefined) {
    return moment(value).format(myformat);
  } else {
    return moment(value).format("YYYY年MM月DD日");
  }
})

new Vue({
  render: h => h(App),
  router,
  store,
  // 启动程序时,获取当前账号的登录状态
  beforeCreate() {
    axios.get(`/site/account/islogin`)
      .then(response => {
        if (response.data.code == "logined") {
          store.state.loginStatus = true;
        }
      })
  }
}).$mount('#app')
