<template>
  <div class="sider-bar-page">
    <el-menu router :default-active="$route.path">
      <el-menu-item
        v-for="(menuItem) in itemArr"
        :key="menuItem.path"
        :index="menuItem.path"
        :class="[menuItem.hidden ? 'hidden' : '']"
      >
        {{ menuItem.name }}
        <i class="el-icon-d-arrow-right" v-show="menuItem.path == $route.path"></i>
      </el-menu-item>
    </el-menu>
  </div>
</template>
 
<script> 
export default {
  props: ["itemArr"],
  data() {
    return {
      activeIdx: 0,
    };
  }
};
</script>

<style lang="scss" scoped>
.sider-bar-page {
  .el-menu {
    border-right: none;
    .el-menu-item {
      text-align: center;
      .el-icon-d-arrow-right {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .is-active {
      background: #ff6600;
      color: #ffffff;
    }
  }
  .hidden{
    display: none;
  }
}
</style>