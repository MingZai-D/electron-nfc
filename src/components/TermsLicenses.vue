<!-- TermsLicenses -->
<template>
<div class='terms-licenses'>
  <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item><a href="#" @click="backHome">{{linkText.level1}}</a></el-breadcrumb-item>
  <el-breadcrumb-item>{{linkText.level2}}</el-breadcrumb-item>
</el-breadcrumb>
</div>
</template>

<script>

export default {
  props: ['linkText'],
components: {},
data() {
return {

};
},
computed: {},
methods: {
  backHome(){
    console.log(111)
    this.$emit('changeTermsLicenses',{show:false})
  }
},
}
</script>
<style lang='scss' scoped>
  .terms-licenses{
    width: 100%;
    padding: 20px;
  }
</style>