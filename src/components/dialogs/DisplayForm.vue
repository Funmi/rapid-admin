<template>
  <el-dialog :fullscreen="fullscreen" :visible.sync="visible" :width="formWidth"
  :show-close="false" :modal="false" :close-on-click-modal="false">
  <i class="el-icon-close close-icon"  @click="cancel"
  :class="{'hidden': !fullscreen}"></i>
  <!-- <div>返回顶部</div> -->
    <template v-slot:title>
      <div style="text-align: center">
        <!-- {{title}} -->
      </div>
    </template>
    <el-row>
      <!-- 第一栏 -->
      <el-col :span="breakPortion[0]" class="padding-medium-px-horizontal">
        <el-form :size="formSize" :label-position="labelPosition"  :label-width="labelWidth">
          <el-form-item v-for="(item, i) in form" :key="i" :label="item.label + '：'" :prop="item.prop" :class="{'hidden': asideItems.includes(item.prop)}">
            <!-- 图像 -->
            <div v-if="item.type=='image'">
              <div v-for="(item, index) in (form[i]||{}).value" :key="index">
                <el-image v-if="item.url" :src="baseUrl(item.url)" fit="cover" srcset=""/>
              </div>
            </div>
            <!-- 文本（包括数组） -->
            <div v-else>{{textTransformer((form[i]||{}).value)}} {{item.suffix}}</div>
          </el-form-item>
        </el-form>
      </el-col>

      <!-- 第二栏 -->
      <el-col :span="breakPortion[1]" class="padding-medium-px-horizontal"
      style="border-left: 1px solid rgb(230, 230, 230)">
        <el-form :size="formSize" :label-position="labelPosition"  :label-width="labelWidth">
          <el-form-item v-for="(item, i) in form" :key="i" :label="item.label + '：'" :prop="item.prop" :class="{'hidden': !asideItems.includes(item.prop)}">
            <!-- 富文本编辑器 -->
            <div v-if="item.type=='editor'" v-html="(form[i]||{}).value"></div>
            <div v-else-if="item.type=='image'">
              <div v-for="(item, index) in (form[i]||{}).value" :key="index">
                <el-image v-if="item.url" :src="baseUrl(item.url)" fit="cover" srcset=""/>
              </div>
            </div>
            <!-- TODO list -->
            <div v-else-if="item.type=='list'">
              <div v-for="item in (form[i]||{}).value" :key="item.id">
                {{ item }}
              </div>
            </div>
            <!-- 文本（包括数组） -->
            <div v-else>{{textTransformer((form[i]||{}).value)}}</div>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <div v-if="fullscreen==false" slot="footer" class="dialog-footer">
      <el-button @click="cancel" type="primary">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: 'edit_form',
    props: {
      breakPortion: {
        type: Array,
        default: function() {
          return [24, 0]
        }
      },
      // 位于右侧的项
      asideItems: {
        type: Array,
        default: function() {
          return []
        }
      },
      // 标签、表格属性
      labelPosition: {
        type: String,
        default: 'left'
      },
      labelWidth: {
        type: String,
        default: '100px' //四个字左右
      },
      formWidth: {
        type: String,
        default: '500px'
      },
      formSize: {
        type: String,
        default: 'mini'
      },
      fullscreen: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: '信息查看'
      },
      dialogVisible: Boolean,
      //传入的数据，及其控制类型
      form:  Array, 
      payload: {
        type: Object,
        default: function() {
          return {}
        }
      } //其他的数据，如多选框的选项
    },
    data() {
      return {
      }
    },
    computed: {
      visible() {
        return this.dialogVisible
      },
    },
    methods: {
      cancel() {
        this.$emit('display_cancel')
      },
      baseUrl(path) {
        return process.env.VUE_APP_BASE_RESOURCE + path
      },
      textTransformer(prop) {
        if(prop instanceof Array) {
          return prop.map(item => {
            if(item.label!=undefined)
            return item.label
            return item
          }).join('，')
        }
        else {
          return prop
        }
      }
    }
  }
</script>

<style scoped>
  .hidden{
    display: none;
  }
  .close-icon {
    position: fixed;
    right: 30px; top: 30px;
    padding: 15px;
    background: #27C379;
    opacity: 0.8;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
    color: white;
    border-radius: 30px;
    cursor: pointer;
    z-index: 9999;
  }
  .el-dialog{
    margin-top: 90px;
  }
</style>