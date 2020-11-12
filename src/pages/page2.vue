<template>
  <div>
    <!-- 工具栏+表格+分页导航 -->
    <fm-table type="image" :flexPortion="20"
      :status="status"
      :searchOptions="searchOptions"
      :columns="table.columns"
      :tableData="trimmedTableData"
      :options="table.options"
      @table_btn_click="tableOptDistributer"
      @tool_btn_click="toolOptDistributer"
      @page_change="pageChange"
      @size_change="sizeChange"
      :payload="payload"
      :hideOnSinglePage="false"
    ></fm-table>

    <!-- 数据编辑框 -->
    <fm-edit
      :dialogVisible="editForm.visible"
      :title="(activeIndex==-1?'信息新增':'信息编辑')"
      :form="formDataEdit"
      :payload="payload"
      labelWidth="150px"
      formWidth="1000px"
      :asideItems="asideItems"
      :breakPortion="breakPortion"
      @edit_cancel="editCancel"
      @edit_confirm="editConfirm"
    ></fm-edit>

    <fm-display
      :dialogVisible="displayForm.visible"
      :form="formDataDisplay"
      @display_cancel="hideDisplayForm"
      :payload="payload"
      labelWidth="160px"
      formWidth="1000px"
      :asideItems="asideItems"
      :breakPortion="breakPortion"
    ></fm-display>
  </div>
</template>

<script>
// import Table from "@/components/content/Table";
import Table from "@/components/content/Media";
import MxTable from "@/mixins/MxTable";
import EditForm from "@/components/dialogs/EditForm";
import MxEditForm from "@/mixins/MxEditForm";
import DisplayForm from "@/components/dialogs/DisplayForm";
import MxDisplayForm from "@/mixins/MxDisplayForm";
import MxProcess from "@/mixins/MxProcess";

import MxNotify from "@/mixins/MxNotify";
export default {
  name: "infrastructure",
  mixins: [MxTable, MxEditForm, MxDisplayForm, MxProcess, MxNotify],
  components: {
    "fm-table": Table,
    "fm-edit": EditForm,
    "fm-display": DisplayForm
  },
  data() {
    return {
      reqAddress: "/communityInfrastructure",
      listName: "communityInfrastructures", //返回数据中列表对应的字段名
      rawPayload: {
        type: ["公路", "水渠", "其他"],
        status: ["正常", "异常"]
      },
      searchOptions: {
        // input: [
        //   {key: 'keyword', placeholder: '搜索信息', width: 240, append: ''},
        // ],
        select: ["type", "status"]
      },
      asideItems: ["pic", "year", "address", "info"],
      breakPortion: [12, 12]
    };
  },
  created() {
    this.initTable();
    this.setTableData();
  },
  methods: {
    getData_re() {
      return this.getData()
      .then(res => {
        console.log('res', res)
        res.columns = res.columns.map(e => {
          e.mediaUrl = e.pic[0] || ""
          e.title = e.name
          return e
        })
        return res
      })
    },
    initTable() {
      // 输入框来进行编辑的不用写类型type
      this.setTable("columns", [
        { label: "设施编号", prop: "code", hidden: true },
        { label: "设施名称", prop: "name" },
        { label: "所在乡镇", prop: "villages" },
        { label: "所在社区", prop: "community" },
        {
          label: "设施图片",
          prop: "pic",
          type: "image",
          slot: "image",
          actionUrl: process.env.VUE_APP_BASEPORT + "/uploadFile",
          limit: {
            max: 2,
            size: 5,
            suffix: ["png", "jpg", "bmp", "jpeg", "gif"]
          }
        },
        {
          label: "设施类型",
          prop: "type",
          type: "selectOne",
          validators: ["notNull"]
        },
        // {label: '产品供应商', prop: 'supplier', validators: ['notNull']},
        { label: "设施状态", prop: "status", type: "selectOne" },
        { label: "设施所剩年限", prop: "year", suffix: "年", hidden: true },
        {
          label: "设施地理位置",
          prop: "address",
          type: "textarea",
          hidden: true
        },
        { label: "设施介绍", prop: "info", type: "textarea", hidden: true }
      ]);
      // tableData仅驱动当页数据
      this.setTable("options", [
        { text: "查看", type: "primary" },
        { text: "编辑", type: "success" },
        { text: "删除", type: "danger" }
      ]);
      // 伪数据
      // this.setTable('data', [
      //   {number: '001', name: '公共水渠',  img: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=788513319,3622725754&fm=26&gp=0.jpg', lifespan: 8},
      // ])
    }
  }
};
</script>

<style lang="" scoped>
</style>