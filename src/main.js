import Vue from 'vue'
import App from './App.vue'
import store from './tools/myVuex'
import router from './tools/myRouter'
import './tools/lib';
import moment from "moment";


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
    this.$axios.get(`/site/account/islogin`)
      .then(response => {
        if (response.data.code == "logined") {
          store.state.loginStatus = true;
        }
      })
  }
}).$mount('#app') 
 