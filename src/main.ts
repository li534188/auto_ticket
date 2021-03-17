import  { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import 'ant-design-vue/dist/antd.less';
import './index.scss';
import Antd from 'ant-design-vue';
import CKEditor from '@ckeditor/ckeditor5-vue';
const app = createApp(App);
router.beforeEach((to, from, next) => {
  const userName = localStorage.getItem('userName');
  if (to.name === 'CreateKey') {
    next();
  }
  if (to.name !== 'Login' && from.name !== 'Login') {
    if (!userName) {
      return next({ path: '/Login' });
    }
  }

  if (from.name === 'Login') {
    if (userName === null) {
      return next({ path: '/' });
    }
  }
  next();
});
app.use(store).use(router).use(Antd).use(CKEditor).mount('#app');
