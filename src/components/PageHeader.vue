<template>
  <div class="header-page">{{headerText}}</div>
</template>

<script>
export default {
  props:['headerText']
}
</script>

<style lang="scss" scoped>
.header-page{
  width: 100%;
  padding: 16px 0 16px 20px;
  border-bottom: 1px solid #DDDDDD;
}
</style>
