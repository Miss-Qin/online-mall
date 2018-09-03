import Vue from 'vue'
import Index from "../components/01.index.vue"
import Detail from "../components/02.productDetail.vue"
import Cart from "../components/03.shoppingCart.vue"
import Login from "../components/04.login.vue"
import OrderFile from "../components/05.orderFile.vue"
import SubmitOrder from "../components/06.submitOrder.vue"
import PaySuccess from "../components/07.paySuccess.vue"
import VipCenter from "../components/08.vipCenter.vue"
import OrderList from "../components/09.orderList.vue"
import OrderDetail from "../components/10.orderDetail.vue"

// 引入仓库
import store from './myVuex'

// 导入axios
import axios from "axios";
// 设置根路径
axios.defaults.baseURL = 'http://47.106.148.205:8899';
// 设置请求带cookie
axios.defaults.withCredentials = true;
// 挂载到vue内部
Vue.prototype.$axios = axios;


// 导入路由
import VueRouter from 'vue-router'
Vue.use(VueRouter)
// 定义路由规则
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
// 实例化路由对象
const router = new VueRouter({
    routes // (缩写) 相当于 routes: routes
})

router.beforeEach((to, from, next) => {
  // 保存上一次的页面路径
//   store.commit('saveFromPath', from.path);

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
// 向外暴露路由
export default router;
   