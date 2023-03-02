import { createApp } from 'vue'
import App from './pages/App'
import './index.less'
import '@/common/load'
import './render'
import router from './routers'

const app = createApp(App);
app.use(router);
app.mount('#app');
