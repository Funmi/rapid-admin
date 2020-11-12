<template>
  <div class="module">
    <!-- {{status}} -->
    <!-- 工具栏 -->
    <fm-tool class="margin-medium-px"
    :status="status" :searchOptions="searchOptions"  :payload="payload"
    :columns="columns"
    @tool_btn_click="toolBtnClick">
      <template v-slot:right>
        <div>
          <slot name="extraOpts"></slot>
          <slot name="default">
            <el-button class="tool" type="primary" icon="el-icon-plus" @click="toolBtnClick('新增')">新增</el-button>
          </slot>
        </div>
      </template>
    </fm-tool>
  
    <div class="box-table">
      <!-- 卡片部分 -->
      <!-- {{tableData}} -->
      <slot name="content">
        <div class="box-gallery">
          <div v-for="(item, index) in tableData" :key="index" class="card"
          :style="`flex: 0 0 calc(${flexPortion}% - 15px);`">
            <video v-if="mode=='video'"
              class="video-js vjs-big-play-centered"
              style="width: 100%; height: auto"
              ref="videoPlayer"
              controls
              preload="auto"
              width="640"
              height="264"
              data-setup="{}"
            >
              <source
                :src="item.mediaUrl"
                type="application/x-mpegURL"
              />
              <p class="vjs-no-js">
                To view this video please enable JavaScript, and consider
                upgrading to a web browser that
                <a
                  href="https://videojs.com/html5-video-support/"
                  target="_blank"
                  >supports HTML5 video</a
                >
              </p>
            </video>
            <!-- <video controls autoplay muted v-if="mode=='video'" :src="item.mediaUrl"
            style="width: 100%; height: auto;"></video> -->
            <div v-else-if="mode=='iframe'" style="width: 100%; height: 260px;" v-html="item.mediaUrl"></div>
            <el-image v-else-if="mode=='link'" :src="imageProcessor(item.mediaUrl)" fit="cover"
            @click="open(item.link)" lazy style="height: 180px;"></el-image>
            <el-image v-else :src="imageProcessor(item.mediaUrl)" fit="cover"
            @click.native="opt({text: '查看'}, {$index: index})"></el-image>
            <div class="flexbox justify-between padding-medium-px">
              <div>{{item.title}}</div>
              <el-dropdown trigger="click">
                <el-button @click.stop size="mini" circle icon="el-icon-more"></el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(item, index_opt) in options" :key="index_opt"
                  @click.native="opt(item, {$index: index})">
                    <i :class="item.icon"></i> {{item.text}}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div class="tip">暂无数据</div>
        </div>
        <!-- 暂时采取只有一页时也显示分页 hideOnSinglePage=false -->
        <fm-pagination class="margin-medium-px" 
        background :hideOnSinglePage="hideOnSinglePage" :status="status"
        :pageSizes="pageSizes"
        @page_change="pageChange" @size_change="sizeChange">
        </fm-pagination>
      </slot>

    </div>
  </div>
</template>

<script>
// 引用Gallery.vue的文件需要同时引用入MxTable.js
import Tool from "./Filter";
import Pagination from './Pagination'
export default {
  name: "media",
  components: {
    "fm-tool": Tool,
    "fm-pagination": Pagination
  },
  props: {
    flexPortion: {
      type: Number,
      default: 25
    },
    hideTools: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: 'image'
    },
    columns: {
      type: Array,
      default: function() {
        return [{ label: "未传入表头", prop: "warning" }];
      }
    },
    payload: {
      type: Object,
      default: function() {
        return {}
      }
    },
    tableData: Array,
    // 表格列操作
    options: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // 向下传
    status: Object, // page, amount, pageSize, search
    searchOptions: Object, //用作搜索选项的列
    loading: {
      type: Boolean,
      default: false
    },
    hideOnSinglePage: {
      type: Boolean,
      default: false
    },
    pageSizes: Array
  },
  data() {
    return {
      // lastClick: '', //上一个点击的按钮的文字
      // maxHeight: 750,
      // selectedIndex: undefined, //select选中的itemIndex
    };
  },
  methods: {
    open: link => window.open(link, '_blank'),
    // 表格数据处理 ////////
    // 图片地址处理
    imageProcessor(raw) {
      if(raw.startsWith('http')) return raw
      return process.env.VUE_APP_BASE_RESOURCE + raw;
    },
    // 文字处理
    textProcessor(raw) {
      let cooked = raw;
      if (raw instanceof Array) {
        cooked = raw
          .map(raw => {
            if (raw.label != undefined) return raw.label;
            else if (raw.name != undefined) return raw.name;
            else return raw;
          })
          .join(", ");
      }
      // 有label的显示为label
      else if (raw && raw.hasOwnProperty("label")) {
        cooked = raw.label;
      }
      // 有name的显示为name
      else if (raw && raw.hasOwnProperty("name")) {
        cooked = raw.name;
      }
      return cooked;
    },
    // 事件处理 //////////
    // sortChange(payload) {
    //   this.$emit("sort_change", payload);
    // },
    toolBtnClick(option, payload) {
      this.$emit("tool_btn_click", option, payload);
    },
    opt(option, scope) {
      this.$emit("table_btn_click", option, scope);
      // console.log('this.$refs.refSwitchBtn', this.$refs.refSwitchBtn)
    },
    pageChange(page) {
      // console.log('page in gallery', page)
      this.$emit("page_change", page);
    },
    sizeChange(size) {
      this.$emit("size_change", size);
    },
    // 辅助逻辑 /////////
  }
};
</script>

<style scoped>
.box-table {
  position: absolute;
  top: 55px; left: 0; right: 0; bottom: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.box-gallery {
  margin: 7.5px;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  /* justify-content: start; */
  align-items: flex-start;
  align-content: stretch;
}
.box-gallery>div{
  box-sizing: border-box;
  /* flex: flex-grow flex-shrink flex-basis(项目占据的空间) */
  margin: 7.5px;
  /* box-sizing: border-box; */
}
.card {
  /* border: 1px solid rgb(230, 230, 230); */
  border-radius: 5px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0px 0px 10px -6px rgb(167, 146, 146);
}
.card:hover {
  box-shadow: 3px 3px 10px -5px rgb(167, 146, 146);
}
.el-image {
  min-width: 100%;
  height: 200px;
  cursor: pointer;
}
/* .el-image {
  cursor: pointer;
} */
.fm-pagination {
  padding: 10px 0px 0px 0px;
}
.tip {
  display: none;
}
.tip:first-child {
  display: block;
}
</style>