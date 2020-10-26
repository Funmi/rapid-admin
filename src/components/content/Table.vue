<template>
  <div class="module">
    <!-- 工具栏 -->
    <fm-tool class="margin-medium-px"
    :status="status" :searchOptions="searchOptions" :payload="payload"
    :columns="columns"
    @tool_btn_click="toolBtnClick">
      <template v-slot:right>
        <div>
          <slot name="extraOpts"></slot>
          <slot name="default">
            <el-button class="tool" type="primary" icon="el-icon-plus"
            @click="toolBtnClick('新增')">新增</el-button>
          </slot>
        </div>
      </template>
    </fm-tool>

    <div ref="boxTable" class="box-table margin-medium-px">
      <el-table :data="tableData" :stripe="true"
      :highlight-current-row="true" v-loading="status.loading"
      element-loading-background="rgba(255, 255, 255, 0.3)" :cell-style="{padding: '2px 0'}">
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column
        v-for="(item, index) in filteredColumns" :key="index" 
        :prop="item.prop" :label="item.label" :width="item.width">
          <template slot-scope="scope">
            <div :style="(scope.row[item.prop]||{}).style">
              <div v-if="item.slot=='image'">
                <el-popover trigger="hover">
                  <!-- 表格中的小图 -->
                  <el-image
                    v-for="(img, imgIndex) in scope.row[item.prop]" :key="imgIndex"
                    :src="imageProcessor(img.url)" fit="contain"></el-image>
                  <div slot="reference">
                    <!-- 气泡中的大图 -->
                    <el-image
                    v-for="(img, imgIndex) in scope.row[item.prop]" :key="imgIndex"
                    :src="imageProcessor(img.url)" fit="contain"></el-image>
                  </div>
                </el-popover>
              </div>
              <div v-else-if="item.slot=='tag'">
                <el-tag v-if="scope.row[item.prop]">
                  {{textProcessor(scope.row[item.prop])}} {{item.suffix}}
                </el-tag>
              </div>
              <span v-else>{{textProcessor(scope.row[item.prop])}} {{item.suffix}}</span>
            </div>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column
        v-if="options && options.length>0" id="options" label="操作"
        :width="panelWidth" :fixed="optionsFixed">
          <template slot-scope="scope">
            <el-button v-for="(option, index) in options" :key="index"
              :type="option.type" size="small" style="margin: 3px;"
              @click.native="opt(option, scope)"
            >{{option.text}}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 暂时采取只有一页时也显示分页 hideOnSinglePage=false -->
      <fm-pagination
        background :hideOnSinglePage="hideOnSinglePage" :status="status"
        @page_change="pageChange" @size_change="sizeChange"
      ></fm-pagination>
    </div>
  </div>
</template>

<script>
// 引用Table.vue的文件需要同时引用入MxTable.js
import Tool from "./Filter";
import Pagination from "./Pagination";
export default {
  name: "table_",
  components: {
    "fm-tool": Tool,
    "fm-pagination": Pagination,
  },
  props: {
    columns: {
      type: Array,
      default: function () {
        return [{ label: "未传入表头", prop: "warning" }];
      },
    },
    tableData: Array,
    // 表格列操作
    options: {
      type: Array,
      default: function () {
        return [];
      },
    },
    optionsFixed: {
      default: false,
    },
    status: Object, // page, amount, pageSize, search
    searchOptions: Object, //用作搜索选项的列
    // 筛选选项用
    payload: {
      type: Object,
      default: function () {
        return {};
      },
    },
    loading: {
      type: Boolean,
      default: false,
    },
    hideOnSinglePage: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      panelWidth: 0
    };
  },
  created() {
    this.panelWidthComputing();
  },
  methods: {
    // 表格数据处理 ////////
    // 图片地址处理
    imageProcessor(raw) {
      let path = raw.name || raw
      if(typeof path != 'string') {
        console.log('文件地址类型非string', typeof path)
      }
      if (path.startsWith("http")) return path;
      return process.env.VUE_APP_BASE_RESOURCE + path;
    },
    // 文字处理
    textProcessor(raw) {
      let cooked = raw;
      if (raw instanceof Array) {
        cooked = raw
          .map((raw) => {
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
    opt(option, scope) {
      this.$emit("table_btn_click", option, scope);
    },
    toolBtnClick(option, payload) {
      this.$emit("tool_btn_click", option, payload);
    },
    // 搜索需要传入筛选数据
    pageChange(page) {
      this.$emit("page_change", page);
    },
    sizeChange(size) {
      this.$emit("size_change", size);
    },
    // 辅助逻辑 /////////
    // 初始化
    panelWidthComputing() {
      let { length } = this.options;
      let extraOffset = 0
      for (const option of this.options) {
        // 一个字大概12个像素
        extraOffset += (option.text.length - 2) *12
      }
      // 两个字的按钮56像素
      let buttonWidth = 56;
      let buttonMargin = 3 * 2;
      let boxPadding = 20;
      // 四个选项的倍数，并且列数不大于六个时，时一行四个
      if (length % 4 == 0 && this.filteredColumns.length <= 6) {
        this.panelWidth = buttonWidth * 4 + boxPadding + 4 * buttonMargin + 1;
      }
      // 三个选项的倍数时一行三个
      else if (length % 3 == 0) {
        this.panelWidth = buttonWidth * 3 + boxPadding + 3 * buttonMargin + 1;
      }
      // 一个就一个的宽度，其余一行两个的宽度
      else if (length <= 2) {
        this.panelWidth =
          buttonWidth * length + boxPadding + length * buttonMargin + 1;
      } else {
        this.panelWidth = buttonWidth * 2 + boxPadding + 2 * buttonMargin + 1;
      }
      this.panelWidth += extraOffset
    },
  },
  computed: {
    filteredColumns() {
      return this.columns.filter((item) => {
        if (item.hidden != true) return item;
      });
    },
  },
};
</script>

<style scoped>
.el-table::before {
  height: 0px;
}
.tool.el-button + .tool.el-button {
  margin: 0;
}
.tool + .tool {
  margin-left: 5px;
}
.box-table {
  border-top: 1px solid rgb(240, 240, 240);
  overflow: hidden;
  flex-direction: column;
  justify-content: space-between;
}
.el-table {
  overflow-y: auto;
  flex: 1 1 0;
}
.el-pagination {
  padding: 10px 0px 0px 0px;
  width: 100%;
  text-align: center;
  background: white;
}
</style>