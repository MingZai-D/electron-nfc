<template>
  <el-container>
    <el-header>
      <MainHeader />
    </el-header>
    <el-container>
      <el-aside>
        <SiderBarItem :itemArr="routes" />
        <RegionFunc :nfcInfo="nfcInfo" @changeInfo="changeInfo" :crcStatus="crcStatus" />
      </el-aside>
      <el-main>
        <keep-alive>
          <router-view :nfcInfo="nfcInfo" @updateInfo="updateInfo" ref="ConstantLumenRef" :isLink="isLink"
            :enable="enable"></router-view>
        </keep-alive>

      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import SiderBarItem from "./components/SiderBarItem.vue";
import RegionFunc from "@/components/RegionFunc.vue";
import MainHeader from "./components/MainHeader.vue"
import { routes } from "./router/index";
import { EventBus } from "@/utils/eventBus.js"
export default {
  name: "App",
  components: {
    // HelloWorld
    SiderBarItem,
    RegionFunc,
    MainHeader
  },
  data() {
    return {
      routes,
      nfcInfo: {},
      isLink: false,
      crcStatus: false,
      enable: {
        endoflife: true,
        softstart: true,
        dimtooff: true,
        thermalprotection: true,
        diming: true,
        constantlumen: true,
        opcurrent: true
      }
    };
  },
  watch: {

  },
  methods: {
    changeInfo(value) {
      console.log(value, 'infovlaue')
      this.nfcInfo = value.data
      this.isLink = value.status == 0 ? true : false
      this.crcStatus = value.crcStatus
      this.enable = value.enable
      EventBus.$emit('constantLumenInit', this.nfcInfo)
    },
    updateInfo(value) {
      console.log(value, 'appvalue')
      this.nfcInfo = value
    }
  }
};
</script>

<style lang="scss">
.is-vertical {
  height: 100% !important;
  overflow: hidden;
}

.el-container {
  height: calc(100% - 60px);
  font-size: 16px;
  font-family: Arial;
  color: #000000;

  .el-aside {
    height: 100%;
    width: 280px !important;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .el-main {
    padding: 10px;
    background: #dddddd;
  }
}
</style>
