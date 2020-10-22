<template>
  <el-menu :default-active="activeIndex" :collapse="collapse" :collapse-transition="false"
  :default-openeds="openeds">
  <!-- {{activeIndex}} -->
    <div v-for="(item, index) in menu" :key="index">
      <el-menu-item v-if="item.subs==undefined" :index="item.route"
      @click="navTo(item)">
        <i :class="item.icon"></i>
        <span slot='title'>{{item.label}}</span>
      </el-menu-item>

      <el-submenu v-else :index="item.route">
        <template slot='title'>
          <i :class="item.icon"></i>
          <span v-if="!collapse">{{item.label}}</span>
        </template>
        <el-menu-item v-for="(sItem, inner) in item.subs" :key="sItem.route" :index="sItem.route"
        @click="navTo(sItem)">
          <i :class="sItem.icon"></i>
          <span slot='title'>{{sItem.label}}</span>
        </el-menu-item>
      </el-submenu>
    </div>
  </el-menu>
</template>

<script>
export default {
  name: 'menu_',
  props: {
    collapse: {
      type: Boolean,
      default: false
    },
    menu: {
      type: Array,
      default: function() {
        return [
          {label: '暂无目录'}
        ]
      }
    }
  },
  methods: {
    navTo(item) {
      this.$router.push(item.route)
    }
  },
  computed: {
    activeIndex() {
      return this.$route.path
    },
    openeds() {
      let values = this.menu.map(item => {
        return item.route
      })
      return values
      // return [this.menu[0].route]
    }
  }
}
</script>

<style scoped>
.el-menu{
  border-right: 0px;
}
</style>