import './assets/main.css'
import { createPinia } from 'pinia'

import VueApexCharts from "vue3-apexcharts";

import { createApp } from 'vue'
import App from './App.vue'


const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(VueApexCharts)
app.mount('#app')
