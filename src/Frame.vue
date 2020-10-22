<template>
  <el-container>
    <el-header class="header flexbox space-between align-center
    shadow-normal background-black color-white-sub padding-zero">
      <div class="fontsize-medium">{{title}}</div>
    </el-header>

    <el-container class="body absolute">
      <el-aside class="shadow-light relative">
        <fm-menu :menu="menu" :collapse="false"/>
      </el-aside>
      
      <el-main class="relative">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Menu from '@/components/Menu'
export default {
  name: 'layout',
  components: {
    'fm-menu': Menu
  },
  // mixins: [MxIndex],
  data() {
    return {
      title: 'title'
    }
  },
  methods: {
  },
  computed: {
    menu() {
      return this.$store.getters.menu
    }
  }
}
</script>

<style lang="less">
.el-header{
  z-index: 2;
}
.el-container{
  top: 60px; left: 0; bottom: 0;
  width: 100%; overflow-y: auto;
}
.el-main {
  padding: 0px;
}
.el-aside {
  z-index: 1;
  width: 200px !important;
}
</style>