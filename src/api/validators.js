/* 只验证格式，若需要非空要显式加上notNull */
function empty(value) {
  return [
    "[]",
    "{}",
    JSON.stringify(undefined),
    "null",
    '""'
  ].includes(JSON.stringify(value))
}

// validators中非空需要单独添加

// TODO:
function validOrEmpty(reg, tip) {
  return function(rule, value, callback) {
    if(empty(value)) {
      callback()
      return
    }
  }
}

export default {
  // 生成rules
  rules(form) {
    let rules = {}
    let lib = this.lib()
    for (const item of form) {
      if(!item.validators) continue
      rules[item.key] = []
      for (const validator of item.validators) {
        if(!lib.includes(validator)) {
          console.error('没有vaildator: ', item.validator)
          continue
        }
        rules[item.key].push({
          validator: this[validator],
          trigger: 'blur',
          required: validator=='notNull'
        })
      }
    }
    return rules
  },
  lib() {
    // 使用验证方法时，可调用lib()确认是否有这个方法
    let lib = []
    for (const key in this) {
      if(['lib', 'rules'].includes(key)) continue
      lib.push(key)
    }
    return lib
  },

  // 数字
  number: (rule, value, callback) => {
    if(empty(value)) {
      callback()
      return 
    }
    // 字符串类型也可
    if(!isNaN(value)) {
      callback()
      return
    }
    callback("请输入数字")

  },
  
  // 手机座机
  phoneNumber(rule, value, callback) {
    if(empty(value)) {
      callback()
      return 
    }
    if(/^1[3456789]\d{9}$/.test(value)||/0\d{2}-\d{7,8}/.test(value)) {
      callback()
    }
    callback("座机号或手机号")
  },

  // 身份证号
  idCode(rule, value, callback) {
    /(^\d{15}$)|(^\d{17}([0-9]|X)$)/
  },

  // 非空
  notNull: (rule, value, callback) => {
    if(empty(value)) {
      callback('不能为空')
      return 
    }
    callback()
  }
}