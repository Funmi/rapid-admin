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
  * EditForm.vue：编辑`Table.vue`、`Media.vue` 中数据元素详情的弹窗
  * DisplayForm.vue：查看 `Table.vue`、`Media.vue` 中数据元素详情的弹窗
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

**请求路径配置**

模板采用了在根路径 .env 文件中配置请求地址的方式
```
VUE_APP_BASEPORT = 'your base url'
VUE_APP_BASEPORT_COMMON = 'your base url'
VUE_APP_BASE_RESOURCE = 'your base url'
```

**涉及到的一些特性** 

了解这些语法有助于理解本模板代码中的一些工作机制
* [slot (vue)](https://cn.vuejs.org/v2/guide/components-slots.html)
* [mixin (vue)](https://cn.vuejs.org/v2/guide/mixins.html)

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
设置表格字段及数据元素操作
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
<br>特殊类型指通过选择产生的数据字段，即各类单选多选

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
// 生成的payload格式：
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


### 6. 监听表格操作

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

### 1. 编辑窗及详情窗配置
当数据字段较多时，可通过编辑框的属性进行调整
* formWidth：窗口的宽度
* labelWidth：字段名的宽度

也提供了对窗口的分栏操作
* asideItems：放到第二栏的字段名
* breakPortion：左右两栏的比例，加和为24

```html
<template>
  <div>
    <fm-edit :dialogVisible="editForm.visible"
    :title="(activeIndex==-1?'信息新增':'信息编辑')" 
    :form="formDataEdit" :payload="payload" labelWidth="150px" formWidth="1000px"
    :asideItems="[key_list, key_textarea]" :breakPortion="[12, 12]"
    @edit_cancel="editCancel" @edit_confirm="editConfirm"></fm-edit>
  </div>
</template>
```

### 2. 字段属性配置

**基础字段可见性**
* hidden：在表格中隐藏，但在编辑窗和详情窗可见
* hidden_edit：在编辑窗中隐藏
* hidden_display：在详情窗中隐藏

``` html
···
<script>
···
export default {
  ···
  methods: {
    initTable() {
      this.setTable('columns', [
        // key_input字段将在编辑框中不可见
        {label: '输入框', prop: 'key_input', hidden_edit: true},
        // key_textarea字段将在表格中不可见
        {label: '文本域', prop: 'key_textarea', type: 'textarea', hidden: true},
        ···
      ])
      ···
    }
  }
}
</script>
```

**基础字段其他属性**
* width：字段在表格中的宽度
* validators：输入验证类型，可选 `notNull`, `number`, `phoneNumber`, `idCode`

``` html
···
<script>
···
export default {
  ···
  methods: {
    initTable() {
      this.setTable('columns', [
        {label: '输入框', prop: 'key_input', validators: ['notNull', 'number']},
        {label: '单选下拉框', prop: 'key_selectOne', type: 'selectOne', validators: ['notNull']},
        ···
      ])
      ···
    }
  }
}
</script>
```

**文件类型字段配置**

* 可选类型：`file`, `files`, `image`
* 必要配置
  * actionUrl：文件上传接口地址
* 可选配置
  * limit：上传文件的约束
    * max：文件数量上限，未设定时为1
    * size：文件大小，单位为MB
    * suffix：文件类型数组，可选的文件后缀名

```js
{
  label: '封面',
  prop: 'cover',
  hidden: true,
  type: 'image',
  actionUrl: process.env.VUE_APP_BASEPORT_COMMON + '/upload/file',
  limit: {
    max: 2,
    size: 5, 
    suffix: ['png', 'jpg', 'bmp', 'jpeg', 'gif']
  }
}
```


### 3. 设置表格操作按钮

**基于数据元素**

基于数据元素即针对某一行数据的操作，模板中已经提供了：
* 查看：查看数据详情
* 编辑：对数据进行编辑
* 删除：删除此行数据
* 预览：在新标签页中打开所有 `type` 为 `file` 的文件对应地址

在各页面 `initTable` 方法中调用 `setTable` 方法即可
```js
···
initTable() {
  ···
  this.setTable('options', [
    // type 仅用于选择el-button样式用
    {text: "预览", type: "warning"},
    {text: "查看", type: "primary"},
    {text: "编辑", type: "success"},
    {text: '删除', type: 'danger'}
  ])
}
```
若有自定义操作，也可配置相应操作按钮数据
```js
this.setTable('options', [
  ···
  {text: '自定义按钮', type: 'info'}
])
```
然后在页面 `methods` 中定义一个 `extraTableOptDistributer` 方法 <br>
当自定义按钮被点击时，方法将会被调用，你可以在此方法中编写自己的事件分发逻辑
```js
···
methods: {
  extraTableOptDistributer(text) {
    if(text == '自定义按钮')
    ···
  }
}
```

**不基于数据元素**

即不针对已有特定行数据的一些方法，模板中已经提供了：
* 新增：增加一行新数据

添加一些自定义操作
```html
<fm-table>
  <template v-slot:extraOpts>
    <el-button @click="opt1">操作1</el-button>
    <el-button @click="opt2">操作2</el-button>
  </template>
</fm-table>
```
>采用 `vue` 中的插槽语法特性对自定义处理进行实现<br>
>插槽中的作用域在当前界面，所以你可以直接在页面中编写相应逻辑

移除默认的新增按钮，传入一个空结点进行覆盖即可
```html
<fm-table>
  <template v-slot:default>
    <div/>
  </template>
</fm-table>
```
*添加自定义按钮与覆盖默认按钮并不冲突*

### 4. 数据流程介入
数据处理流程即一次次的数据请求、界面渲染过程。<br>
若前后端数据兼容需要一定的转换流程，或是还需要其他附带操作，则可在数据请求前后介入进行相应操作。

**介入点：**
* getData_re：获取本页列表数据
* getDetail_re：获取特定行详情数据
* editData_re：编辑特定行数据
* removeData_re：删除特定行数据
* addData_re：新增数据

*五个方法对应的原方法均为 `promise`*

**介入方式：**
在页面中定义对应介入点的方法

请求发送前：
```js
methods: {
  addData_re(row) {
    // 发送前对数据的一些操作
    // ··· 介入过程
    this.addData(row) // 再调用原方法进行处理
  }
}
```

请求发送后：
```js
methods: {
  getData_re() {
    return this.getData()
    .then(res => {
      // 对获取到的数据的一些操作
      // ··· 介入过程
      return res // 需要将处理后的数据返回 
    })
  }
}
```

## 后台接口要求



