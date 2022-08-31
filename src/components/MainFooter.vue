<!-- footer -->
<template>
<div class='main-footer'>
  <div class="link-wrap">
    <a href="#" @click="windowLinkClick('https://apps.ledvanceus.com/firmware/nfc/tapTronic_termsofuse.html')">Terms of Use</a>
    <a href="#" @click="windowLinkClick('https://apps.ledvanceus.com/firmware/nfc/tapTronic_privacypolicy.html')">Privacy Policy</a>
    <a href="#" @click="windowLinkClick('https://apps.ledvanceus.com/firmware/nfc/tapTronic_OpenSourceLicenses.html')" :style={marginRight:0} >Open Source Licenses </a>
  </div>
  <div class="explain-wrap">
    © 2021, LEDVANCE GmbH. All rights reserved. &nbsp; versions:1.0.4
  </div>
</div>
</template>
 
<script>
const {shell} = window.require("electron")   
export default {
components: {},
data() {
return {

};
},
computed: {},
methods: {
  windowLinkClick(url){
    shell.openExternal(url)
  }
},
}
</script>
<style lang='scss' scoped>
  .main-footer{
    width: 100%;
    height: 68px;
    font-size: 14px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    display: flex;
    .link-wrap{
      padding-bottom: 8px;
      a{
        display: inline-block;
        margin-right: 82px;
        color: #333333;
      }
    }
    .explain-wrap{
      font-size: 12px;
      color: #9C9D9F;
    }
  }
</style>