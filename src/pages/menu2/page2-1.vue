<template>
  <div>
    <!-- 工具栏+表格+分页导航 -->
    <fm-table
      :status="status" :options="table.options"
      :columns="table.columns" :tableData="trimmedTableData"
      :searchOptions="searchOptions" :payload="payload"
      @tool_btn_click="toolOptDistributer" @table_btn_click="tableOptDistributer"
    ></fm-table>

    <!-- 编辑框 -->
    <fm-edit :dialogVisible="editForm.visible" :title="(activeIndex==-1?'信息新增':'信息编辑')" 
    :form="formDataEdit" :payload="payload"
    @edit_cancel="editCancel" @edit_confirm="editConfirm"></fm-edit>
    <!-- 详情框 -->
    <fm-display :dialogVisible="displayForm.visible" :form="formDataDisplay" 
    @display_cancel="hideDisplayForm" :payload="payload" ></fm-display>
  </div>
</template>

<script>
import Table from "@/components/content/Table";
import MxTable from "@/mixins/MxTable";
import MxProcess from '@/mixins/MxProcess'
import EditForm from '@/components/dialogs/EditForm'
import MxEditForm from '@/mixins/MxEditForm'
import DisplayForm from '@/components/dialogs/DisplayForm'
import MxDisplayForm from '@/mixins/MxDisplayForm'
import MxNotify from "@/mixins/MxNotify";
export default {
  name: "page2-1",
  mixins: [
    MxTable, MxProcess, MxEditForm, MxDisplayForm, MxNotify
  ],
  components: {
    "fm-table": Table,
    'fm-edit': EditForm,
    'fm-display': DisplayForm
  },
  data() {
    return {
      reqAddress: "/test",
      listName: 'test', //返回数据中列表对应的字段名
      rawPayload: {
        // 若需要指定字段所对应的值：
        key_radio: [
          {label: '是', value: true},
          {label: '否', value: false},
        ],
        // 直接用一个字符串数组配置选项时，选项所对应的值依次从1开始递增
        key_checkbox: ['选项1', '选项2'] // 选项1对应1，选项2对应2..
      },
      searchOptions: {
        // 搜索框
        input: [
          {key: 'keyword', placeholder: '搜索关键字', width: 300, append: '搜索'},
          // {key: 'prop2', placeholder: '请输入', width: 240, append: '搜索字段prop2'}
        ],
        // 下拉筛选  可对应各种单选、多选类型，在数组中输入相应字段即可生成
        select: ['key_checkbox'],
        // 时间筛选
        datePick: ['key_date']
      }
      // asideItems: ['pic', 'year', 'address', 'info'],
      // breakPortion: [12, 12]
    };
  },
  created() {
    this.initTable();
    // this.setTableData()
  },
  methods: {
    initTable() {
      this.setTable("columns", [
        { label: "输入框", prop: "key_input" }, //不设置类型时为输入框
        { label: "文本域", prop: "key_textarea", type: "textarea" },
        { label: "多选框", prop: "key_checkbox", type: "checkbox" },
        { label: "单选radio", prop: "key_radio", type: "radio" },
        { label: "单选下拉框", prop: "key_selectOne", type: "selectOne" },
        { label: "多选下拉框", prop: "key_select", type: "select" },
        { label: "日期", prop: "key_date", type: "date" },
        { label: "时间", prop: "key_datetime", type: "datetime" },
        { label: "TODO list", prop: "key_list", type: "list" },

        { label: "图片", prop: "key_image", type: "image", slot: "image" },
        { label: "单个文件", prop: "key_file", type: "file" },
        { label: "多个文件", prop: "key_file", type: "files" } //数量上限3
      ])
      this.setTable('options', [
        {text: "查看", type: "primary"},
        {text: "编辑", type: "success"},
        {text: '删除', type: 'danger'}
      ])
      this.setTable('data', [
        {key_input: '输入内容1', key_date: '2020-10-23'}
      ])
    }
  }
};
</script>

<style lang="" scoped>
</style>