export default {
  methods: {
    skip() {},
    success(message, title) {
      this.$notify({
        title: title || '操作成功',
        message,
        type: 'success'
      })
    },
    error(message, title) {
      this.$notify.error({
        title: title || '操作失败',
        message
      })
    },
    warning(message, title) {
      this.$notify({
        title: title || '操作提醒',
        message,
        type: 'warning'
      });
    },
    info(message, title) {
      this.$notify.info({
        title: title || '消息',
        message
      });
    },
    alerts(message, title = '提示', confirmFun, confirmButtonText = '确定') {
      this.$alert(message, title, {
        confirmButtonText: confirmButtonText,
        callback: action => {
          confirmFun(action)
        }
      });
    },
    confirms(message, title = '提示', type, confirmFun, cancelFun, confirmButtonText = '确定', cancelButtonText = '取消') {
      this.$confirm(message, title, {
        confirmButtonText: confirmButtonText,
        cancelButtonText: cancelButtonText,
        type: type
      }).then(() => {
        confirmFun()
      }).catch(() => {
        cancelFun()
      });
    },
    prompt(message, title = '提示', rule, errorInfo, confirmFun, cancelFun, confirmButtonText = '确定', cancelButtonText = '取消') {
      this.$prompt(message, title, {
        confirmButtonText: confirmButtonText,
        cancelButtonText: cancelButtonText,
        inputPattern: rule,
        inputErrorMessage: errorInfo
      }).then(({ value }) => {
        confirmFun(value)
      }).catch(() => {
        cancelFun()
      });
    }
  }
}