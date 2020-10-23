# rapid-admin
>后台开发模板，对后台系统中最为常见的列表页面的整个处理过程进行了封装
>
>基于 [vue](https://www.npmjs.com/package/vue), [vue-router](https://www.npmjs.com/package/vue-router), [vuex](https://www.npmjs.com/package/vuex), [axios](https://www.npmjs.com/package/axios), [element-ui](https://www.npmjs.com/package/element-ui)


## 模板能力

### 核心能力
通过基本的参数设置即可快速完成一个列表页面的开发，无需再对数据请求、列表渲染、列表操作进行繁杂的处理。
* 支持各种输入类型的内容页面驱动
* 数据筛选与搜索
* 数据详情查看与编辑

### 非核心能力
* 登入登出
* 路由拦截

## 模板构成

### 核心构成

* 两个内容组件
  * Table.vue：渲染常规的表格数据
  * Media.vue：渲染图片、视频，和 `Table.vue` 保持了相同的交互方式
* 两个内容组件的子组件
  * Filter.vue：数据筛选、查找的工具栏
  * Pagination.vue：分页组件
* 两个弹窗组件
  * EditForm.vue：编辑`Table.vue`、`Media.vue` 中数据项详情的弹窗
  * DisplayForm.vue：查看 `Table.vue`、`Media.vue` 中数据项详情的弹窗
* 两个辅助代码
  * resource.js：对 `axios` 的封装。在请求头中加入了token，并将响应信息处理为了便于 `MxNotify.js` 使用的格式
  * validators.js：element-ui表单验证所需的输入验证函数
* 五个mixin
  * MxTable.js: 操作和支持 `Table.vue`、`Media.vue` 的数据处理、状态记录以及事件传递
  * MxProcess.js：负责前后台系统数据交互、数据标准化转换、选项数据的生成与拆解
  * MxEditForm.js：负责 `MxProcess.js` 生成的标准化数据格式与适用于EditForm.vue组件的数据格式间的转换
  * MxDisplayForm.js：负责 `MxProcess.js` 生成的标准化数据格式与适用于DisplayForm.vue组件的数据格式间的转换
  * MxNotify.js：对 `element-ui` 中Notify的封装，在 `MxProcess.js` 中的数据请求处理过程中进行了使用

*MxProcess.js, MxEditForm.js, MxDisplayForm.js 对 MxTable.js 有数据依赖*
### 非核心构成
* 页面
  * Login.vue：登录页
* 组件
  * Frame.vue：顶部标题、左侧导航、右侧内容的布局
  * Menu.vue：二级目录组件
* css
  * box.css：背景色、阴影、内外边距
  * font.css：字号、颜色等
  * layout.css：定位及flex布局

## 开始使用

### 1. 创建一个最基础的表格页面
*示例见 page1.vue*

将组件及mixin进行引入：
``` html
<script>
import Table from '@/components/content/Table'
import MxTable from '@/mixins/MxTable'
</script>
```
注册组件，混入mixin：
``` html
<script>
···
export default {
  mixins: [MxTable],
  components: {
    'fm-table': Table
  },
}
</script>
```
置入组件，传入Mixin中处理的数据及状态
``` html
<template>
  <div>
    <fm-table :status="status" :options="table.options"
    :columns="table.columns" :tableData="trimmedTableData">
    </fm-table>
  </div>
</template>
···
```
设置表格字段及数据项操作
``` html
···
<script>
···
export default {
  created() {
    this.initTable()
  }
  methods: {
    initTable() {
      // setTable为MxTable中的方法
      this.setTable('columns', [
        // label为字段对应中文，prop为数据项对应的字段
        {label: '字段标题1', prop: 'key1'},
        {label: '字段标题2', prop: 'key2'},
      ])
      // 查看、编辑、删除为系统中监听的关键字，提供了自动的处理过程
      this.setTable('options', [
        {text: "查看", type: "primary"},
        {text: "编辑", type: "success"},
        {text: '删除', type: 'danger'}
      ])
      // 模拟接收到的数据
      this.setTable('data', [
        {key1: 'data1 value1', key2: 'data1 value2'},
        {key1: 'data2 value1', key2: 'data2 value2'},
      ])
    }
  }
}
</script>
```
至此你可以看到页面上渲染了一个基本的表格页面结构

### 2. 设置表格字段类型及荷载
**通过type设置字段类型**
``` html
···
<script>
···
export default {
  ···
  methods: {
    initTable() {
      this.setTable('columns', [
        {label: '输入框', prop: 'key_input'}, //不设置类型时为输入框
        {label: '文本域', prop: 'key_textarea', type: 'textarea'},
        {label: '多选框', prop: 'key_checkbox', type: 'checkbox'},
        {label: '单选radio', prop: 'key_radio', type: 'radio'},
        {label: '单选下拉框', prop: 'key_selectOne', type: 'selectOne'},
        {label: '多选下拉框', prop: 'key_select', type: 'select'},
        {label: '日期', prop: 'key_date', type: 'date'},
        {label: '时间', prop: 'key_datetime', type: 'datetime'},
        {label: 'TODO list', prop: 'key_list', type: 'list'},

        {label: '图片', prop: 'key_image', type: 'image', slot:'image'},
        {label: '单个文件', prop: 'key_file', type: 'file'},
        {label: '多个文件', prop: 'key_file', type: 'files'}, //数量上限3
      ])
      ···
    }
  }
}
</script>
```
备注： 文件类型、多值类型（如多选框、多选下拉框、TODO list）对应字段应为数组类型

**设置选项荷载**
>本模板中将 `{label, value}` 这种格式作为各模块中处理、渲染特殊类型数据的标准化格式
<br>TODO: 特殊类型指通过选择产生，存在 `1:n` 关系的字段类型，即各类单选多选

``` html
<script>
···
import MxProcess from '@/mixins/MxProcess'
export default {
  ···
  mixins: [MxTable, MxProcess],
  data: function() {
    return {
      rawPayload: {
        // 若需要指定字段所对应的值：
        key_radio: [
          {label: '是', value: true},
          {label: '否', value: false},
        ],
        // 直接用一个字符串数组配置选项时，选项所对应的值依次从1开始递增
        key_checkbox: ['选项1', '选项2'] // 选项1对应1，选项2对应2..
      }
    }
  }
}
</script>
```
`rawPayload` 将会在 `MxProcess.js` 中被处理为 `payload`
```javascript
payload: {
  key_radio: [
    {label: '是', value: true},
    {label: '否', value: false},
  ],
  key_checkbox: [
    {label: '选项1', value: 1},
    {label: '选项2', value: 2},
  ]
}
```
向内容组件传入选项荷载 `payload`
``` html
<template>
  <div>
    <fm-table :status="status" :options="table.options"
    :columns="table.columns" :tableData="trimmedTableData"
    :payload="payload">
    </fm-table>
  </div>
</template>
```


### 3. 接入数据请求接口
设置请求方法名及列表字段，调用数据请求
```html
···
<script>
export default {
  ···
  data() {
    reqAddress: '/methodName',
    //返回数据中列表对应的字段名，若data本身即为列表数据，不设置此字段即可
    listName: 'listName',
    ···
  },
  created() {
    this.initTable()
    this.setTableData() // MxProcess.js中请求列表数据的方法
  }
  ···
}
</script>
```

### 4. 设置数据筛选工具栏

在data中设置并传入 `searchOptions`

监听工具栏事件 `tool_btn_click`
``` html
<template>
  <div>
    <fm-table :status="status" :options="table.options"
    :columns="table.columns" :tableData="trimmedTableData"
    :payload="payload" :searchOptions="searchOptions"
    @tool_btn_click="toolOptDistributer">
    </fm-table>
  </div>
</template>

<script>
export default {
  ···
  data() {
    return {
      ···
      searchOptions: {
        // 搜索框
        input: [
          {key: 'keyword', placeholder: '搜索关键字', width: 240, append: '搜索关键字'},
        ],
        // 下拉筛选  可对应各种单选、多选类型，在数组中输入相应字段即可生成
        select: ['key_checkbox'],
        // 时间筛选
        datePick: ['key_date']
      }
    }
  }
}
</script>
```
* 组件提供了三种筛选方式输入框类型：输入框、下拉框及时间筛选
* 筛选工具栏状态改变或点击搜索后，将触发一个附带查询条件的数据获取请求

### 5. 置入编辑窗、详情窗组件

引入文件、注册组件及混入
```html
<template>
  <div>
    <!-- 工具栏+表格+分页导航 -->
    <fm-table
      :status="status" :options="table.options"
      :columns="table.columns" :tableData="trimmedTableData"
      :searchOptions="searchOptions" :payload="payload"
      @tool_btn_click="toolOptDistributer"
    ></fm-table>

    <!-- 编辑框 -->
    <fm-edit :dialogVisible="editForm.visible" :title="(activeIndex==-1?'信息新增':'信息编辑')" 
    :form="formDataEdit" :payload="payload"
    @edit_cancel="editCancel" @edit_confirm="editConfirm"></fm-edit>
    <!-- 详情框 -->
    <fm-display :dialogVisible="displayForm.visible"
    :form="formDataDisplay" :payload="payload"
    @display_cancel="hideDisplayForm" ></fm-display>
  </div>
</template>

<script>
···
import MxProcess from '@/mixins/MxProcess'
import EditForm from '@/components/dialogs/EditForm'
import MxEditForm from '@/mixins/MxEditForm'
import DisplayForm from '@/components/dialogs/DisplayForm'
import MxDisplayForm from '@/mixins/MxDisplayForm'
import MxNotify from "@/mixins/MxNotify"

export default {
  mixins: [MxTable, MxProcess, MxEditForm, MxDisplayForm, MxNotify],
  components: {
    "fm-table": Table,
    'fm-edit': EditForm,
    'fm-display': DisplayForm
  },
  ···
}

</script>
```


### 6. 监听表单操作

**监听表格操作事件** `table_btn_click` 

模板页面右上方中默认附带了新增按钮，当表格中有数据时，还可以看到第一步中设置的查看、编辑、删除按钮，组成了基本的增删改查选项


```html
<template>
  <div>
    <!-- 工具栏+表格+分页导航 -->
    <fm-table
      :status="status" :options="table.options"
      :columns="table.columns" :tableData="trimmedTableData"
      :searchOptions="searchOptions" :payload="payload"
      @tool_btn_click="toolOptDistributer" @table_btn_click="tableOptDistributer"
    ></fm-table>
    ···
  </div>
</template>
```
## 更多配置
### 2. 编辑窗及详情窗配置
