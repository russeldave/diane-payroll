import './assets/main.css'
import 'sweetalert2/src/sweetalert2.scss';
import "animate.css";

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
const app = createApp(App)

app.use(createPinia())
app.use(router)
// app.use(VueReCaptcha, { siteKey: KINILAW })
app.mount('#app')
