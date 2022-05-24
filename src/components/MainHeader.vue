<template>
  <div class="main-header">
    <div class="main-logo">
      <img src="@/assets/logo.png" alt="Ledvance logo"/>
      Ledvance NFC Reader
    </div>
    <div class="main-operation">
      <i class="el-icon-minus" title="最小化" @click="setWinSize('window-min')"/>
      <i class="el-icon-full-screen" title="最大化" @click="setWinSize('window-max')"/>
      <i class="el-icon-close" title="关闭" @click="setWinSize('window-close')"/>
    </div>
  </div>
</template>

<script>
const {ipcRenderer} = window.require("electron");
export default {
  methods:{
    setWinSize(type){
      console.log(type,'type')
      ipcRenderer.send(type);
    }
  }
}
</script>

<style lang="scss" scoped>
.main-header{
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding:12px 10px 12px 20px;
  align-items: center;
  -webkit-app-region: drag;
  .main-logo{
    font-size: 18px;
    color: #FF6600;
    display: flex;
    align-items: center;
    img{
      margin-right: 15px;
    }
  }
  .main-operation{
    -webkit-app-region: no-drag;
    i{
      margin-left: 36px;
      cursor: pointer;
    }
  }
}
</style>