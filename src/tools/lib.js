import Vue from 'vue'
// 导入element-ui库
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// 导入iview-ui库
import iView from 'iview';
import 'iview/dist/styles/iview.css';
Vue.use(iView);

// 导入懒加载包
import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload, {
  preLoad: 1.3,
  loading: require('../assets/statics/site/img/nazha.png'),
  attempt: 1
})

// 导入放大镜包
import ProductZoomer from 'vue-product-zoomer'
Vue.use(ProductZoomer) 
