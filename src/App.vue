<template>
  <el-container>
    <el-header>
      <MainHeader />
    </el-header>
    <el-container v-if="!showTermsLicenses">
      <el-aside>
        <SiderBarItem :itemArr="routes" />
        <RegionFunc 
          :nfcInfo="nfcInfo" 
          @changeInfo="changeInfo" 
          :crcStatus="crcStatus" 
          @changeLoading="changeLoading"
          @increaseTag="increaseTag"
        />
      </el-aside>
      <el-main 
        v-loading="loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        element-loading-text="loading..."
        element-loading-spinner="el-icon-loading"
      >
        <keep-alive>
          <router-view 
            :nfcInfo="nfcInfo" 
            @updateInfo="updateInfo" 
            ref="ConstantLumenRef" 
            :isLink="isLink"
            :enable="enable" 
            :readTag="readTag"
          ></router-view>
        </keep-alive>
      </el-main>
    </el-container>
    <!-- <el-container v-else>
      <TermsLicenses @changeTermsLicenses = "changeTermsLicenses" :linkText = "linkText"/>
    </el-container> -->
    <el-footer> 
      <MainFooter />
    </el-footer>
  </el-container>
</template>

<script>
import SiderBarItem from "./components/SiderBarItem.vue";
import RegionFunc from "@/components/RegionFunc.vue";
import MainHeader from "./components/MainHeader.vue"
import MainFooter from "./components/MainFooter.vue"
// import TermsLicenses from "./components/TermsLicenses.vue";
import { routes } from "./router/index";
import { EventBus } from "@/utils/eventBus.js"
export default {
  name: "App",
  components: {
    // HelloWorld
    SiderBarItem,
    RegionFunc,
    MainHeader,
    MainFooter,
},
  data() {
    return {
      routes,
      nfcInfo: {},
      isLink: false,
      crcStatus: false,
      showTermsLicenses: false,
      loading:false,
      readTag:0,
      linkText: {
        level1:'',
        level2:''
      },
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
  methods: {
    changeInfo(value) {
      this.isLink = value.status == 0 ? true : false
      if (value.status === 0) {
        this.nfcInfo = value.data
        this.crcStatus = value.crcStatus
        this.enable = value.enable
        const nowPath = this.$route.path
        console.log(value,'val')
        console.log(nowPath,'newPath')
        this.routes.map(ele=>{
          ele.hidden = false
          
          if(ele.name === "Dimming"){ 
            ele.hidden = !value.enable.diming
            if(nowPath == '/dimming' && !value.enable.diming){
              this.$router.push({path:'/device-information'})
            }
          }
          if(ele.name === "Thermal Protection"){
            ele.hidden = !value.enable.thermalprotection  
            if(nowPath =='/thermal-protection' && !value.enable.thermalprotection){
              this.$router.push({path:'/device-information'})
            }
          }
          if(ele.name === "Constant Lumen"){
            ele.hidden = !value.enable.constantlumen
            if(nowPath == '/constant-lumen' && !value.enable.constantlumen){
              this.$router.push({path:'/device-information'})
            }
          }
          if(!ele.name) ele.hidden = true
        })
      }
      EventBus.$emit('constantLumenInit', this.nfcInfo)
    },
    updateInfo(value) {
      this.nfcInfo = value
    },
    changeLoading(bol){
      this.loading = bol
    },
    increaseTag(){
      this.readTag += 1
    }
    /* changeTermsLicenses(linkResult){
      this.showTermsLicenses = linkResult.show
      if(!linkResult.show) return
      this.linkText.level1 = this.$router.history.current.name
      this.linkText.level2 = linkResult.linkValue
    } */
  }
};
</script>

<style lang="scss">
.is-vertical {
  height: 100% !important;
  overflow: hidden;
}

.el-container {
  height: calc(100% - 128px);
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
    .el-loading-spinner{
      .el-icon-loading,.el-loading-text{
        color:#ff6600
      }
    }
  }
  .el-footer{
    background: #F2F2F2;
  }
}
</style>
