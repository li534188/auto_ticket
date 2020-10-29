import  { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import 'ant-design-vue/dist/antd.less';
import Antd from 'ant-design-vue';
const app = createApp(App);

app.use(store).use(router).use(Antd).mount('#app');
