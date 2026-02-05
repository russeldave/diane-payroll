import './assets/main.css'
import 'sweetalert2/src/sweetalert2.scss';
import "animate.css";

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8995/';
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

const app = createApp(App)

app.use(createPinia())
app.use(router)
// app.use(VueReCaptcha, { siteKey: KINILAW })
app.mount('#app')
