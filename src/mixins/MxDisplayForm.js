export default {
  data() {
    return {
      // TODO: 下个项目将visible下移到组件中
      displayForm: {
        visible: false
      }
    }
  },
  computed: {
    // 展示对应的文字
    formDataDisplay() {
      let form = []
      // 新增数据时activeIndex为-1
      let column = this.trimmedTableData[this.activeIndex]||[]
      for (const item of this.table.columns) {
        if(item.hidden_display) continue //跳过不展示的项
        let value = column[item.prop]
        if(value!=undefined) {
          if(item.type == 'list' && value instanceof Array) {
            value = value.map(item => {
              if(item.label!=undefined) return item.label
              else if(item.name!=undefined) return item.name
              else return item
            })
          }
          else if(value.label!=undefined) value = value.label
          else if(value.name!=undefined) value = value.name
        }
        let dict = JSON.parse(JSON.stringify(item))
        dict.key = item.prop
        dict.value = value
        form.push(dict)
      }
      return form
    }
  },
  methods: {
  // 辅助逻辑
    showDisplayForm() {
      this.displayForm.visible = true
    },
    hideDisplayForm() {
      this.displayForm.visible = false
    },
  }
}