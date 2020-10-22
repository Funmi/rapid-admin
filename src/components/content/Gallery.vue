<template>
  <div class="module">
    <!-- {{status}} -->
    <!-- 工具栏 -->
    <c-tool class="box-tool" v-if="!hideTools" :status="status" :searchOptions="searchOptions"  :payload="payload"
    :searchPlaceholder="searchPlaceholder" :columns="columns"
    @tool_btn_click="toolBtnClick">
      <template v-slot:right>
        <div>
          <slot name="extraOpts"></slot>
          <slot name="default">
            <el-button class="tool" type="primary" icon="el-icon-plus" @click="toolBtnClick('新增')">新增</el-button>
          </slot>
        </div>
      </template>
    </c-tool>
  
    <div class="box-table">
      <!-- 卡片部分 -->
      <!-- {{tableData}} -->
      <slot name="content">
        <div class="box-gallery">
          <div v-for="(item, index) in tableData" :key="index" class="card color-gray fontsize-small"
          :style="`flex: 0 0 calc(${flexPortion}% - 30px);`">
            <video controls autoplay muted v-if="mode=='video'" :src="item.mediaUrl"
            style="width: 100%; height: auto;"></video>
            <div v-else-if="mode=='iframe'" style="width: 100%; height: 200px;" v-html="item.mediaUrl"></div>
            <el-image v-else-if="mode=='link'" :src="imageProcessor(item.mediaUrl)" fit="cover"
            @click="open(item.link)" lazy></el-image>
            <el-image v-else :src="imageProcessor(item.mediaUrl)" fit="cover"
            :preview-src-list="srcList"></el-image>
            <div class="flexbox padding-medium-px align-stretch">
              <div>{{item.title}}</div>
            </div>
          </div>
          <div class="tip">暂无数据</div>
        </div>
        <d-pagination class="margin-medium-px" 
        background :hideOnSinglePage="hideOnSinglePage" :status="status" :pageSizes="pageSizes"
        @page_change="pageChange" @size_change="sizeChange">
        </d-pagination>
      </slot>

    </div>
  </div>
</template>

<script>
// 引用Gallery.vue的文件需要同时引用入MxTable.js
import Tool from "./Filter";
import Pagination from './Pagination'
export default {
  name: "gallery",
  components: {
    "c-tool": Tool,
    "d-pagination": Pagination
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
    searchPlaceholder: String,
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
  computed: {
    srcList() {
      return this.tableData.map(item => {
        return this.imageProcessor(item.mediaUrl)
      })
    },
  },
  methods: {
    open: link => window.open(link, '_blank'),
    clickResource(index, url) {
      this.$emit('click_resource', {index, url})
      // console.log('index, url', index, url)
      // window.open(url, '_blank')
    },
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
.box-tool {
  margin-bottom: 20px;
  margin-left: 30px;
}
.box-table {
  /* position: absolute;
  top: 55px; left: 0; right: 0; bottom: 0;
  overflow: hidden; */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.box-gallery {
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  /* justify-content: start; */
  /* align-items: flex-start; */
  /* align-content: stretch; */
}
.box-gallery>div{
  box-sizing: border-box;
  /* flex: flex-grow flex-shrink flex-basis(项目占据的空间) */
  /* 放到了:style 中动态修改 flex: 0 0 calc(25% - 30px); */
  margin-left: 30px;
  /* margin-right: 20px; */
  margin-bottom: 20px;
}
.card {
  overflow: hidden;
  border: 1px solid rgb(226, 226, 226);
  box-shadow: 1px 1px 20px -17px gray;
}
.el-image {
  min-width: 100%;
  height: 200px;
  cursor: pointer;
}
.d-pagination {
  padding: 10px 0px 0px 0px;
}
.tip {
  display: none;
}
.tip:first-child {
  display: block;
}
</style>