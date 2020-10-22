/* 
  API:
*/
export default {
  data() {
    return {
      editForm: {
        visible: false
      }
    }
  },
  computed: {
    richTypes() {
      return {
        array: ['checkbox', 'select', 'list', 'checkboxes'],
        object: ['radio', 'selectOne']
      }
    },
    formTitle() {
      return this.activeIndex==-1? '新增信息': '信息编辑'
    },
    formDataEdit() {
      let form = []
      // 新增数据时activeIndex为-1, -1不存在则设置默认值[]
      let column = this.trimmedTableData[this.activeIndex]||[]
      // 通过表头遍历
      for (const item of this.table.columns) {
        if(item.readonly) continue //跳过不可编辑项
        let value = column[item.prop]

      // 1.数据剥离：将{label, value} 转为 value
      // 2.给数据一个相应类型的默认值
        // 多选项为数组
        try {
          if(this.richTypes.array.includes(item.type)) {
            // console.log('column[item.prop]', column[item.prop])
            value = (column[item.prop]||[]).map(e => {
              return e.value||e
            })
          }
          // 单选项为对象
          else if(this.richTypes.object.includes(item.type)) {
            value = (column[item.prop]||{}).value
          }
        } catch (error) {
          console.error('请确认' + item.prop + ' type是否选择正确')
          console.error('错误信息：', error)
        }
        // 拷贝表头配置数据，再加上对应的值
        let dict = JSON.parse(JSON.stringify(item))
        dict.key = item.prop
        dict.value = value
        form.push(dict)
      }
      // console.log('form in mx', form)
      return form
    }
  },
  methods: {
  // 辅助逻辑
    showEditForm() {
      this.editForm.visible = true
    },
    hideEditForm() {
      this.editForm.visible = false
    },
  // EditForm中触发的方法
    editCancel() {
      this.hideEditForm()
    },
    editConfirm(column) {
    // 数据还原：
      for (const key in column) {
        // 先遍历本行数据，如果存在被数据剥离的键，将value 转为 {label, value}
        if (this.payload && this.payload.hasOwnProperty(key)) {
          // 数组为多选，否则为单选
          if(column[key] instanceof Array) {
            // 循环替换
            for (let i=0; i<column[key].length; i++) {
              // 在keyData存在的情况下，优先用keyData的数据来还原，key可能为方便展示作了处理
              // 比如多层菜单
              let source = this.payload[key+'Data']||this.payload[key]
              for (const item of source) {
                if(column[key][i] == item.value) {
                  column[key][i] = item
                }
              }
            }
          }
          else {
            for (const item of this.payload[key]) {
              if(column[key] == item.value) {
                column[key] = item
              }
            }
          }
        }
      }
      // 替换入新数组，index在activeIndex中
      let func = this.setColumnData_pre || this.setColumnData
      // console.log('column in editConfirm', column)
      func(column)
      // this.table.data[this.activeIndex] = column vue无法监听
    },
  },
}