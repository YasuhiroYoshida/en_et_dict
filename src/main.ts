import Vue from 'vue';
import VueLoading from 'vuejs-loading-plugin';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import 'materialize-css/dist/css/materialize.min.css';
import 'material-design-icons/iconfont/material-icons.css';

Vue.use(VueLoading, {
  // dark: true, // default false
  text: 'Loading...', // default 'Loading'
  loading: false, // default false
  // customLoader: myVueComponent, // replaces the spinner and text with your own
  // background: 'rgb(255,255,255)', // set custom background
  // classes: ['someClass'], // array, object or string
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
