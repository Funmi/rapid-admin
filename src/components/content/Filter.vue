<template>
<!-- 用作搜索的过滤器 -->
  <div class="box-tool">
    <div class="left">
      <!-- 筛选下拉框 -->
      <!-- {{pickerDatas}} -->
      <slot name="tool">

        <div class="tool" v-for="(select, index) in toMatch.select" :key="'select'+index">
          <span class="fontsize-small color-gray" style="padding-right: 5px;">{{select.label}}</span>
          <el-select
          v-model="selectDatas[index]" :placeholder="'选择' + select.label"
          @change="serachBtnClick">
            <el-option label="全部" :value="undefined"></el-option>
            <el-option
              v-for="(item, innerIndex) in select.options" :key="innerIndex"
              :label="item.label" :value="item.value">
            </el-option>
            <!-- 作为取消选择和placeholder使用 -->
          </el-select>
        </div>
        
        <div class="tool" v-for="(picker, index) in toMatch.datePick" :key="'picker'+index">
          <span class="fontsize-small color-gray" style="padding-right: 5px;">{{picker.label}}</span>
          <el-date-picker style="width: 240px;" :type="picker.type"
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="pickerDatas[index]" start-placeholder="开始时间" end-placeholder="结束时间"
          @change="serachBtnClick">
          </el-date-picker>
        </div>

        <div class="tool box-input" v-for="(item, index) in toMatch.input" :key="'input'+index"
        :style="item.width?`width: ${item.width}px;`:''">
          <el-input style="border-radius: 0;" :placeholder="item.placeholder||'搜索关键字'" v-model="inputDatas[index]">
            <template slot="append">
              <el-button icon="el-icon-search" :disabled="(inputDatas[index]||'').length==0" @click="serachBtnClick">
                <span v-if="item.append">{{item.append}}</span>
              </el-button>
            </template>
          </el-input>
        </div>

        <el-button class="tool" icon="el-icon-arrow-left" v-if="status.search"
        @click="clearSearchData">返回</el-button>
      </slot>
    </div>
    
    <slot class="right" name="right"></slot>
    <!-- 额外操作的插槽 -->
  </div>
</template>

<script>
export default {
  name: "filter_",
  props: {
    columns: {
      type: Array,
      default: function() {
        return []
      }
    },
    payload: {
      type: Object,
      default: function() {
        return {}
      }
    },
    status: Object, // page, amount, pageSize, search
    searchOptions: {
      type: Object,
      default: function() {
        return {}
      }
    }, //用作搜索选项的列
    searchPlaceholder: {
      type: String,
      default: "请输入"
    },
  },
  data() {
    return {
      selectDatas: [],
      pickerDatas: [],
      inputDatas: [],
    };
  },
  methods: {
    // 搜索需要传入筛选数据
    serachBtnClick() {
      let searchData = {};
      let selectOptions = this.searchOptions.select || []
      let dateOptions = this.searchOptions.datePick || []
      let inputOptions = this.searchOptions.input || []
      // 选项
      for (let i = 0; i < selectOptions.length; i++) {
        searchData[selectOptions[i]] = this.selectDatas[i]
      }
      // 时间
      for (let i = 0; i < dateOptions.length; i++) {
        searchData[dateOptions[i]] = this.pickerDatas[i]
      }
      // 关键字搜索
      for (let i = 0; i < inputOptions.length; i++) {
        searchData[inputOptions[i].key] = this.inputDatas[i]
      }
      this.$emit("tool_btn_click", "搜索", searchData)
    },
    // 辅助逻辑 /////////
    // 初始化
    clearSearchData() {
      this.selectDatas = []
      this.toolBtnClick('返回')
    },
    toolBtnClick(option) {
      this.$emit("tool_btn_click", option);
    },
  },
  computed: {
    // 用来过滤搜索项
    toMatch() {
      let select = this.columns
      .filter(option => {
        return (this.searchOptions.select || []).includes(option.prop)
      })
      .map(item => {
        // 匹配上对应的数据
        return {
          label: item.label,
          options: this.payload[item.prop]
        }
      })
      let datePick = this.columns
      .filter(option => {
        return (this.searchOptions.datePick || []).includes(option.prop)
      })
      .map(item => {
        return {
          label: item.label,
          type: item.type + 'range'
        }
      })

      return {
        select, datePick,
        // input: this.searchOptions.keywordInput
        input: this.searchOptions.input
      };
    },
  }
};
</script>

<style scoped>
.el-table::before {
  /* position: fixed; */
  height: 0px;
}
.box-tool {
  display: flex;
  /* flex-grow: 1; */
  justify-content: space-between;
  /* margin: 0 0 20px 30px; */
}
.box-tool .left {
  display: flex;
}
.box-tool .box-input {
  width: 240px;
}
.el-select {
  width: 150px;
}
.tool.el-button+ .tool.el-button{
  margin: 0;
}
.tool+.tool {
  margin-left: 5px;
}
</style>