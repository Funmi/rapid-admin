import Axios from '@/api/resource' // 请求接口
export default {
  created() {
    if(this.reqAddress==undefined) {
      console.error('data中需要声明reqAddress来指定表格请求路径')
    }
  },
  computed: {
    // 数据处理 ///////////////////////////
    // 根据rawPayload生产出{label, value}格式的荷载payload
    payload() {
      let cooked = {}
      for (const key in this.rawPayload) {
        let map = this.rawPayload[key].map((item, index) => {
          return typeof item == "string"?
          {label: item, value: index+1}:
          item
        })
        cooked[key] = map
      }
      return cooked
    },
    payloadMap() {
      let map = {}
      let payload = this.payload
      for (const key in payload) {
        let dict = {}
        for (const item of payload[key]) {
          dict[item.value] = item
        }
        map[key] = dict
      }
      return map
    },
  },

  methods: {
    // 数据包装：将请求获得的相关数据转为{label, value}形式
    payloadPack(item) {
      let map = this.payloadMap
      for (const key in item) {
        // 如果有 xxxData则用xxxData作为映射
        let map_for_key = map[key+'Data'] || map[key]
        if (map_for_key!=undefined) {
          if(item[key] instanceof Array) {
            // console.log('item[key]', item[key])
            item[key] = item[key].map(ele => {
              let _ele = map_for_key[ele]
              if(_ele!=undefined) 
              return map_for_key[ele]
              console.log(`payload未匹配成功 ${key} 或 ${key}Data`, ele)
              return {label: `未匹配成功(${ele})`, value: ele}
            })
          }
          else if(map_for_key[item[key]]) {
            item[key] = map_for_key[item[key]]
          }
          else {
            if(item[key]===null) continue
            console.log(`payload未匹配成功 ${key}||${key}Data`, item[key])
            // item[key] = {label: item[key]}
          }
        }
      }
      return item
    },
    // 数据拆箱：
    payloadUnpack(row) {
      let form = JSON.parse(JSON.stringify(row))
      for (const key in form) {
        // 将{label, value}转为value
        if(form[key]&&form[key].value!=undefined) {
          form[key] = form[key].value
        }
        // 数组类型：文件、TODO list的拆箱
        else if(form[key] instanceof Array) {
          form[key] = form[key].map(item => {
            // checkboxes 针对菜单，仅二级菜单加入了表单中
            // 在addData_re中加入一级菜单时已经进行了数据拆箱处理
            // file、image地址在name字段，TODO list内容在label字段
            return item.name||item.label||item
          })
        }
      }
      return form
    },
    // 数据操作 ////////////////////
    // 设置表格当前页数据
    setTableData(page) {
      this.status.loading = true
      let getData = this.getData_re||this.getData
      getData(page||this.status.page)
      .then(res=> {
        this.status.loading = false
        let {pageInfo, columns} = res
        this.setTable('data', columns)
        this.setStatus(pageInfo)
      })
      .finally(() => {
        this.status.loading = false
      }) 
    },
    setColumnData_pre(row) {
      row = this.payloadUnpack(row)
      // 新增，点击工具栏新增按钮时addRow方法将activeIndex设为了-1
      let isAddData = this.activeIndex == -1
      let addData = this.addData_re || this.addData
      let editData = this.editData_re || this.editData
      let func = isAddData? addData: editData
      return func(row).then(res => {
        let {type, message, title} = res
        if(type=='success') {
          // 后端采用不返回id的方式，通过重新请求数据解决新增数据id获取问题
          isAddData? 
            this.setTableData(): 
            this.setColumnData(row)
          this.hideEditForm() //MxEditForm中的方法
          this.success()
          return true
        }
        else {
          this[type](message, title)
          return false
        }
      })
      .catch(err => {
        let {type, message, title} = err
        this[type](message, title)
        return false
      })
    },
    displayDetails_pre() {
      console.log('display pre')
      let getDetail = this.getDetail_re||this.getDetail
      getDetail().then(res => {
        this.setColumnData(res)
        this.displayDetails()
      })
    },
    editRow_pre() {
      let getDetail = this.getDetail_re||this.getDetail
      getDetail().then(res => {
        this.setColumnData(res)
        this.editRow()
      })
    },
    removeColumnData_pre() {
      let removeData = this.removeData_re||this.removeData
      removeData().then(res => {
        let {type, message, title} = res
        if(type=='success') {
          this.success()
          this.removeColumnData()
        }
        else {
          this[type](message, title)
        }
      })
      .catch(err => {
        let {type, message, title} = err
        this[type](message, title)
      })
    },

    // 请求 ///////////////////////
    // 详情
    getDetail() {
      return Axios.get(this.reqAddress+'/'+this.activeColumn.id)
      .then(res => {
        let {type, message, title} = res
        if(type=='success') return this.payloadPack(res.data)
        else {
          this[type](message, title)
        }
      })
      .catch(err => {
        let {type, message, title} = err
        this[type](message, title)
      })
    },
    // 列表
    getData(page) {
      let params = JSON.parse(JSON.stringify(this.searchParams))
      // if(params) {
        params.pageSize = this.status.pageSize
        params.page = page||this.status.page
      // }
      return Axios.get(this.reqAddress, {params})
      .then(res => {
        let {type, message, title} = res
        if(type=='success') {
          // 设置了listName则返回字段上的数据
          res.data.columns = (this.listName? res.data[this.listName]: res.data)
          .map(item => {
            return this.payloadPack(item)
          })
          return res.data
        }
        else {
          this[type](message, title)
        }
      })
      .catch(err => {
        console.log('err', err)
        let {type, message, title} = err
        this[type](message, title)
      })
    },
    // 新增
    addData(row) {
      return Axios.post(this.reqAddress, row)
    },
    // 编辑
    editData(row) {
      return Axios.put(this.reqAddress+'/'+this.activeColumn.id, row)
    },
    removeData() {
      return Axios.delete(this.reqAddress+'/' + this.activeColumn.id)
    }
  },
}