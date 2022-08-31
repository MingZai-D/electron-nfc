import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
export const routes = [{ 
  path:'/device-information',
  name:'Device Information',
  component:()=> import('../page/DeviceInformation/DeviceInformation.vue')
},
{ 
  path:'/current-setting',
  name:'Current Setting',
  hidden:true,
  component:()=> import('../page/CurrentSetting/CurrentSetting.vue')
},
{ 
  path:'/dimming',
  name:'Dimming',
  hidden:true,
  component:()=> import('../page/Dimming/Dimming.vue')
}, 
{ 
  path:'/thermal-protection',
  name:'Thermal Protection',
  hidden:true,
  component:()=> import('../page/ThermalProtection/ThermalProtection.vue')
},
{ 
  path:'/constant-lumen',
  name:'Constant Lumen',
  hidden:true,
  component:()=> import('../page/ConstantLumen/ConstantLumen.vue')
},
{path: '/',hidden:true, redirect: {name:'Device Information'}},
]

export const router = new Router({
  routes: routes
})