let MxTable = {
  data: function() {
    return {
      activeIndex: -1, //选中的行索引

      table: {
        // 表头
        columns: [/*{label: '日期 ', prop: 'date'},*/],
        // 当前数据
        data: [/*{date: '2020-10-7', mood: 'nice'},*/],
        // 操作
        options: [/*{text: '删除', type: 'danger '}*/]
      },
      // 数据筛选条件，通过工具栏点击搜索后改变
      searchParams: {},
      // 页面状态标记
      status: {
        page: 1, //当前的页号
        total: 0, //数据总条数
        pageSize: 15, //一页15条
        search: false, //是否在搜索状态
        loading: false, //数据请求中
      }
    }
  },
  computed: {
    // 处理一些数据格式后用于table渲染
    trimmedTableData() {
      let data = JSON.parse(JSON.stringify(this.table.data))
      // 拿到需要处理的字段
      let keysToResolve = this.table.columns.filter(column => {
        if(['image', 'file', 'files'].includes(column.type))
        return column
      }).map(column => {
        return column.prop
      })
      // console.log('keysToResolve', keysToResolve)
      for (let row of data) {
        // 将文件地址 => [{name: 文件地址, url: 文件地址, uid}]
        for (const key of keysToResolve) {
          if(typeof row[key] == 'string')
          row[key] = [{name: row[key], url: row[key], uid: parseInt(Math.random()*1000)}]
          else if(row[key] instanceof Array) {
            row[key] = row[key].map(ele => {
              return {name: ele, url: ele, uid: parseInt(Math.random()*1000)}
            })
          }
        }
      }
      return data
    },
    // TODO: 下个项目把Column换成Row
    activeColumn() {
      return this.table.data[this.activeIndex]
    }
  },
  methods: {
  // 数据设置
    // 表格数据初始化
    setTable(key, value) {
      this.table[key] = value
    },
    setStatus(status, pageSize) {
      this.status.pageSize = pageSize || this.status.pageSize
      if(!status) return
      let {totalEntities, currentPage} = status
      this.status.total = totalEntities
      this.status.page = currentPage||this.status.page
    },
    // 列数据编辑
    setColumnData(column) {
      for (const key in column) {
        this.$set(this.table.data[this.activeIndex],key,column[key])
      }
    },
    removeColumnData() {
      this.table.data.splice(this.activeIndex, 1)
    },

  // 事件处理 /////////
    pageChange(page) {
      console.log('page in mx', page)
      this.setTableData(page)
    },
    sizeChange(size) {
      // console.log('this.$route.path', this.$route.path)
      // localStorage.pageSize[this.$route.path] = 
      this.status.pageSize = size
      this.setTableData()
    },
    
    // 表单操作自定义事件
    tableOptDistributer({text}, {$index}) {
      // 传入option, scope
      this.activeIndex = $index
      if(tableOptHandler[text]) {
        tableOptHandler[text].bind(this)()
      }
      else if(this.extraTableOptDistributer){
        this.extraTableOptDistributer(text)
      }
      else {
        console.error('未绑定自定义事件处理器：', text)
      }
    },

    // 工具栏操作自定义事件
    toolOptDistributer(text, payload) {
      tableOptHandler[text].bind(this)(payload)
    },
    
    // 表格默认操作
    editRow() {
      this.showEditForm()
    },
    removeRow() {
      this.$confirm('此记录将被永久删除，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let func = this.removeColumnData_pre || this.removeColumnData
        func()
      })
    },
    preview() {
      window.open(process.env.VUE_APP_BASE_RESOURCE+this.table.data[this.activeIndex].file[0].url, '_blank')
    },
    displayDetails() {
      this.showDisplayForm()
    },

    // 工具栏操作
    addRow() {
      this.activeIndex = -1
      this.showEditForm()
    },
    searchRecords(payload) {
      this.status.search = true
      // 设置数据获取的筛选项
      // this.searchParams = payload
      // console.log('payload', payload)
      for (const key in payload) {
        this.searchParams[key] = payload[key]
      }
      console.log('searchParams', this.searchParams)
      // 获取第一页数据
      this.setTableData(1)
    },
    retreatSearch() {
      this.searchParams = {}
      this.status.search = false
      this.setTableData(1)
      // this.$refs.table.clearSearchData() // 不清除似乎更好
    },
  }
}

// 定义了预处理则优先调用预处理函数进行一些额外的操作，并需要在其中调用定义好的默认方法
const tableOptHandler = {
  // 表格数据列操作 //////////////////
  '编辑': function() {
    console.log('编辑')
    let func = this.editRow_pre || this.editRow
    func()
  },
  '删除': function() {
    let func = this.removeRow_pre || this.removeRow
    func()
  },
  // 新增在本文件中实现
  '新增': function() {
    let func = this.addRow_pre || this.addRow
    func()
  },
  // 查看为查看详细情况
  "查看": function() {
    let func = this.displayDetails_pre || this.displayDetails
    func()
  },
  // 预览为预览文件
  '预览': function() {
    let func = this.preview_pre || this.preview
    func()
  },
  // 表格工具栏操作 ////////////////
  '搜索': function(payload) {
    // console.log('payload in distributer', payload)
    let func = this.searchRecords_pre || this.searchRecords
    func(payload)
  },
  '返回': function() {
    // 搜索后的返回操作
    let func = this.retreatSearch_pre || this.retreatSearch
    func()
  },
}

export default MxTable