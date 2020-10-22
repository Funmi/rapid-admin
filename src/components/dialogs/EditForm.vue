<template>
  <el-dialog :fullscreen="fullscreen" :visible.sync="visible" :width="formWidth"
  :show-close="false" :modal="false" :close-on-click-modal="false"
  :destroy-on-close="true"
  @open="formInit">
  <!-- {{formLocal}} -->
    <template v-slot:title>
      <div style="text-align: center">
        {{title}}
      </div>
    </template>
    <el-row>
    <!-- 列表分为两栏，每栏都会对表单进行完整遍历，只是没有放到该栏中的进行了隐藏 -->
    <!-- 目的是为了拿到对应的index，来对动态绑定的同一个formLocal进行更改 -->
    <!-- 基础类型两栏都有，不占空间的在第一栏，比较占空间的在第二栏 -->
    
    <!-- 第一栏，文件上传、多选框、下拉列表、日期时间选择器、input、textarea -->
      <el-col :span="breakPortion[0]" class="padding-medium-px-horizontal">
        <el-form :rules="rules" :status-icon="true" :model="formLocalObject"
         ref="form" :validate-on-rule-change="false" 
         :size="formSize" :label-position="labelPosition"  :label-width="labelWidth">
          <el-form-item v-for="(item, i) in form" :key="i" :label="item.label" :prop="item.prop"
          v-show="!asideItems.includes(item.prop)">
            <!-- 文件 file限制1个文件，files3个 -->
            <el-upload v-if="['file', 'files', 'image'].includes(item.type)"
              style="transition: none;"
              :auto-upload="true" :action="item.actionUrl" :limit="(item.type=='files'? 3: 1)"
              :headers="headers"
              :on-success="uploadSuccess(i, item)" :on-error="uploadError(i, item)"
              :on-remove="onRemove(i)" :before-upload="beforeUpload(item.limit)"
              :on-preview="previewFile"
              :file-list="(formLocal[i]||{}).value">
              <el-button size="small" type="primary"
              :disabled="((formLocal[i]||[]).value||{}).length>0">点击上传</el-button>
              <span @click.stop class="tip" v-if="((formLocal[i]||[]).value||{}).length>0">点击下方文件可进行预览</span>
              <div slot="tip" class="el-upload__tip" v-if="item.limit">{{item.limit.suffix.join('、')}} &nbsp;|&nbsp; {{item.limit.size}}MB</div>
            </el-upload>

            <!-- 多选框 -->
            <el-checkbox-group v-else-if="item.type=='checkbox'"
            v-model="(formLocal[i]||{}).value">
              <el-checkbox
              v-for="(option, index) in payload[item.key]" :key="index" 
              :label="option.value">
                {{option.label}}
              </el-checkbox>
            </el-checkbox-group>

            <!-- 分组多选框 -->
            <div v-else-if="item.type=='checkboxes'"
            style="max-height: 500px; overflow: auto;">
              <div v-for="(group, index) in payload[item.key]" :key="index">
                <div>{{group.label}}</div>
                <el-checkbox-group v-model="(formLocal[i]||{}).value">
                  <el-checkbox
                  v-for="(option, index) in group.children" :key="index" 
                  :label="option.value">
                    {{option.label}}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </div>

            <!-- 多选、单选下拉列表 -->
            <el-select v-else-if="['select', 'selectOne'].includes(item.type)"
              v-model="(formLocal[i]||{}).value" filterable style="width: 100%;"
              :multiple="item.type=='select'" placeholder="请选择">
              <span  v-for="(option, index) in payload[item.key]" :key="index">
                <el-option v-show="item.correlate==undefined||option.flag==form[item.correlate]" 
                  :label="option.label"
                  :value="option.value">
                <!-- <el-option
                  :label="option.label"
                  :value="option.value"> -->
                </el-option>
              </span>
              <el-option v-if="item.selectable"
                :key="null" label="无" :value="null">
              </el-option>
            </el-select>

            <!-- 单选 -->
            <el-radio-group v-else-if="item.type=='radio'"
              v-model="(formLocal[i]||{}).value">
              <el-radio v-for="(option, index) in payload[item.key]" :key="index"
              :label="option.value">
                {{option.label}}
              </el-radio>
            </el-radio-group>

            <!-- 日期 -->
            <el-date-picker v-else-if="item.type=='date'" type="date"
            value-format="yyyy-MM-dd" v-model="(formLocal[i]||{}).value"
            style="width: 100%">
            </el-date-picker>

            <!-- 时间 -->
            <el-date-picker v-else-if="item.type=='datetime'" type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss" v-model="(formLocal[i]||{}).value"
            style="width: 100%">
            </el-date-picker>

            <el-input v-else-if="item.type=='textarea'" v-model="(formLocal[i]||{}).value"
            type="textarea" :rows="3"></el-input>

            <el-input v-else-if="item.type==undefined" v-model="(formLocal[i]||{}).value">
              <template slot="append" v-if="item.suffix!=undefined">{{item.suffix}}</template>
            </el-input>

            <div v-else>
              <p>
                <div>未在第一列对 {{item.prop}} 的 type: {{item.type}}进行支持</div>
                <div>请传入 :asideItems="['{{item.prop}}']"进行尝试</div>
              </p>
            </div>
          </el-form-item>
        </el-form>
      </el-col>
      
    <!-- 第二栏，图片、富文本编辑器、多选框、下拉列表、TODO list、input、textarea -->
      <el-col :span="breakPortion[1]" class="padding-medium-px-horizontal">
        <el-form :rules="rules" :status-icon="true" :model="formLocalObject"
        ref="form" :validate-on-rule-change="false" 
        :size="formSize" :label-position="labelPosition" :label-width="labelWidth">
          <el-form-item v-for="(item, i) in form" :key="i" :label="item.label" :prop="item.prop"
          v-show="asideItems.includes(item.prop)">
            <!-- 文件 file限制1个文件，files3个 -->
            <el-upload v-if="['file', 'files', 'image'].includes(item.type)"
              style="transition: none;"
              :auto-upload="true" :action="item.actionUrl" :limit="(item.type=='files'? 3: 1)"
              :headers="headers"
              :on-success="uploadSuccess(i, item)" :on-error="uploadError(i, item)"
              :on-remove="onRemove(i)" :before-upload="beforeUpload(item.limit)"
              :on-preview="previewFile"
              :file-list="(formLocal[i]||{}).value">
              <el-button size="small" type="primary"
              :disabled="((formLocal[i]||[]).value||{}).length>0">点击上传</el-button>
              <span @click.stop class="tip" v-if="((formLocal[i]||[]).value||{}).length>0">点击下方文件可进行预览</span>
              <div slot="tip" class="el-upload__tip" v-if="item.limit">{{item.limit.suffix.join('、')}} &nbsp;|&nbsp; {{item.limit.size}}MB</div>
            </el-upload>

            <!-- 富文本编辑器 -->
            <div v-else-if="item.type=='editor'">
              <!-- <ueditor v-model="(formLocal[i]||{}).value" :config="ueditorConfig"/> -->
            </div>

            <!-- 多选框 -->
            <el-checkbox-group v-else-if="item.type=='checkbox'"
            v-model="(formLocal[i]||{}).value">
              <el-checkbox
              v-for="(option, index) in payload[item.key]" :key="index" 
              :label="option.value">
                {{option.label}}
              </el-checkbox>
            </el-checkbox-group>

            <!-- 分组多选框 -->
            <div v-else-if="item.type=='checkboxes'">
              <div v-for="(group, index) in payload[item.key]" :key="index">
                <div>{{group.label}}</div>
                <el-checkbox-group v-model="(formLocal[i]||{}).value">
                  <el-checkbox
                  v-for="(option, index) in group.children" :key="index" 
                  :label="option.value">
                    {{option.label}}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </div>

            <!-- 多选、单选下拉列表 -->
            <el-select v-else-if="['select', 'selectOne'].includes(item.type)"
              v-model="(formLocal[i]||{}).value" filterable style="width: 100%;"
              :multiple="item.type=='select'" placeholder="请选择">
              <span  v-for="(option, index) in payload[item.key]" :key="index">
                <el-option v-show="item.correlate==undefined||option.flag==form[item.correlate]" 
                  :label="option.label"
                  :value="option.value">
                </el-option>
              </span>
              <el-option v-if="item.selectable"
                :key="null" label="无" :value="null">
              </el-option>
            </el-select>
            
            <!-- 单选 -->
            <el-radio-group v-else-if="item.type=='radio'"
              v-model="(formLocal[i]||{}).value">
              <el-radio v-for="(option, index) in payload[item.key]" :key="index"
              :label="option.value">
                {{option.label}}
              </el-radio>
            </el-radio-group>

            <!-- 文字列表 -->
            <el-form v-else-if="item.type=='list'">
              <el-form-item v-for="(item, index) in (formLocal[i]||{}).value" :key="index">
                <el-input v-model="item.label" placeholder="请输入">
                  <template slot="append">
                    <el-button icon="el-icon-close"
                    @click="removeListItem(i, index)"></el-button>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button style="width: 100%" type="" icon="el-icon-plus"
                @click="appendListItem(i)">新增一项</el-button>
              </el-form-item>
            </el-form>

            <el-input v-else-if="item.type=='textarea'" v-model="(formLocal[i]||{}).value"
            type="textarea" :rows="3"></el-input>

            <el-input v-else-if="item.type==undefined" v-model="(formLocal[i]||{}).value">
              <template slot="append" v-if="item.suffix!=undefined">{{item.suffix}}</template>
            </el-input>

            <div v-else>
              <p>
                <div>未在第二列对 {{item.prop}} 的 type: {{item.type}}进行支持</div>
                <div>请勿传入 :asideItems="['{{item.prop}}']"</div>
              </p>
            </div>
          </el-form-item>
        </el-form>
      </el-col>
      
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  // import VueUeditorWrap from 'vue-ueditor-wrap'
  import Validators from '@/api/validators'
  import MxNotify from '@/mixins/MxNotify'

  export default {
    name: 'edit_form',
    components: {
      // 'ueditor': VueUeditorWrap
    },
    mixins: [MxNotify],
    props: {
      // 左右分栏比例
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
      labelPosition: {
        type: String,
        default: 'left'
      },
      labelWidth: {
        type: String,
        default: '80px' //四个字左右
      },
      formWidth: {
        type: String,
        default: '500px'
      },
      formSize: {
        type: String,
        default: 'medium'
      },
      fullscreen: {
        type: Boolean,
        default: false
      },
      title: {
        type: String
      },
      dialogVisible: Boolean,
      form:  Array, //传入的数据，及其控制类型
      payload: {
        type: Object,
        default: function() {
          return {}
        }
      } //其他的数据，如多选框的选项
    },
    data() {
      // console.log('process.env.NODE_ENV', process.env.NODE_ENV)
      return {
        // 表单数据
        formLocal: [],
        // ueditorConfig: {
        // }
        ueHeight: window.screen.height-470
      }
    },
    updated() {
      this.ueHeight = window.screen.height-470
    },
    computed: {
      ueditorConfig() {
        let ue_home = process.env.NODE_ENV=='development' ? 
          '/server/public/UEditor/': process.env.VUE_APP_BASE_RESOURCE + 'UEditor/'
          window.UEDITOR_HOME_URL = ue_home
        return {
          initialFrameHeight: this.ueHeight,
          UEDITOR_HOME_URL: ue_home,
          serverUrl: ue_home+'php/controller.php',
          autoHeightEnabled: false,
          // scaleEnabled: true
        }
      },
      // 表单验证规则生成
      rules() {
        let rules = {}
        let lib = Validators.lib()
        for (const item of this.form) {
          if(!item.validators) continue
          rules[item.key] = []
          for (const validator of item.validators) {
            if(!lib.includes(validator)) {
              console.error('没有vaildator: ', item.validator)
              continue
            }
            rules[item.key].push({
              validator: Validators[validator],
              trigger: 'blur',
              required: validator=='notNull'
            })
          }
        }
        return rules
      },
      visible() {
        return this.dialogVisible
      },
      // 自动文件上传设置token
      headers() {
        let token = 'Bearer ' + this.$store.getters.userInfo.token
        return {
          Authorization: token,
        }
      },
      // 将表单数据（数组）转为对象
      // 1：用于el-form的表单验证, 2：作为表单数据向上层递交
      formLocalObject() {
        let column = {}
        for (const item of this.formLocal) {
          column[item.key] = item.value
        }
        return column
      }
    },
    methods: {
      formInit() {
        this.formLocal = JSON.parse(JSON.stringify(this.form))
      },

    // 文件 //////////////
      previewFile(file) {
        console.log(file)
        window.open(process.env.VUE_APP_BASE_RESOURCE+file.url, '_blank')
      },
      
    // 文件事件
      beforeUpload(limit) {
        return file => {
          if(limit==undefined) return
          // 大小判断
          if(file.size>limit.size*1024*1024) {
            this.warning('文件大小超出限制：' + limit.size + 'MB')
            return false
          }
          // 后缀判断
          let fileSfx
          {
            let arr = file.name.split('.')
            fileSfx = arr[arr.length-1]
          }
          if(!limit.suffix.includes(fileSfx)) {
            this.error('文件格式不支持')
            return false
          }
        }
      },
      onRemove(index) {
        return file  => {
          console.log('rmfile', file)
          let value = this.formLocal[index].value
          if(value instanceof Array)
          value.splice(value.indexOf(file), 1)
        }
      },
      uploadSuccess(index) {
        return (res, file, fileList) => {
          if(res.code == 200) {
            file.annex = res.data
            // 设置用来预览的url
            file.url = file.annex
            console.log('this.formLocal[index]', index)
            this.$set(this.formLocal[index], 'value', fileList)
          }
        }
      },
      uploadError(index) {
        return (err, file, fileList) => {
          console.log('err', res)
        }
      },
    // list操作 ////////////
      appendListItem(i) {
        let list = this.formLocal[i].value||[]
        let length = list.length
        if(length>0&&list[length-1].label==''){
          this.error('请输入后继续添加')
          return
        }
        this.formLocal[i].value.push({label: ''})
      },
      removeListItem(i, index) {
        this.formLocal[i].value.splice(index, 1)
      },
    // footer 选项 ////////////
      cancel() {
        this.$emit('edit_cancel')
      },
      confirm() {
        let column = this.formLocalObject
        this.$refs.form.validate(valid => {
          if(valid) {
            this.$emit('edit_confirm', column) //传递编辑好的数据
          }
          else {
            this.error('请满足所有必选项')
          }
        })
      }
    }
  }
</script>

<style>
  .el-dialog__header {
    /* background: #35EC95; */
  }
  .el-dialog{
    margin-top: 50px !important;
  }
  .el-dialog.is-fullscreen{
    margin-top: 0px !important;
  }
  .el-dialog__wrapper{
    z-index: 2 !important;
  }
  .edui-dialog-body{
    z-index: 3000;
  }
  .el-dialog__body{
    padding: 10px;
  }
  .el-form {
    flex: 1;
    position: relative;
    transition: all .1s;
  }
  .el-form-item{
    width: 100%;
  }
  .el-checkbox-group{
    margin: 0 5px;
    border-bottom: 1px solid #E4E7ED;
    /* border-radius: 4px; */
  }
  .el-checkbox{
    margin: 0 5px;
  }
  .el-col{
    box-sizing: border-box;
  }
  .tip{
    cursor: default;
  }
</style>