<template>
  <div class="box absolute flexbox align-center justify-center">
    <div label-width="80px" class="box-login shadow-light padding-medium-px-vertical">
      <div class="margin-medium-px">
        <el-input v-model="form.username"></el-input>
      </div>
      <div class="margin-medium-px">
        <el-input v-model="form.password" type="password"></el-input>
      </div>
      <div class="margin-medium-px relative">
        <el-button type="primary" class="btn-login" @click="login">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Axios from '@/api/resource'
export default {
  name: "login",
  data() {
    return {
      form: {
        username: "admin",
        password: "123456"
      }
    };
  },
  methods: {
    login() {
      Axios.post('/login', this.form).then(res => {
        let {type, data} = res
        if(type == 'success') {
          this.$store.commit("userInfo", {
            token: data.token,
            nickname: data.nickName,
          });
          this.$router.replace("/");
        }
      })
    }
  }
};
</script>

<style scoped>
.box {
  top: 0; left: 0; bottom: 0; right: 0;
}
.box-login {
  width: 300px;
}
.btn-login {
  width: 100%;
}
</style>