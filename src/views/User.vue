<template>
  <div @keydown="enter($event)" class="wrapper">
    <div class="logo">
      <div class="logo-noc">NOC</div>
      <div class="logo-tick">Ticket</div>
    </div>
    <!-- <canvas
      style="border: aqua solid 1px"
      id="canvas"
      width="500"
      height="500"
    ></canvas> -->
    <div class="from-model">
      <div class="from-header">Log in with your DAI account:</div>
      <a-form :model="form">
        <span v-show="showError.status" class="error-info">{{showError.info}}</span>
        <a-input style="color:#fff" class="login-input" v-model:value="form.userName" placeholder="DAI account" />
        <a-input
          class="login-input"
          style="color:#fff"
          type="password"
          v-model:value="form.passWord"
          placeholder="Password"
        />
        <a-button
          class="login-input login-button"
          type="primary"
          @click="submit"
        >CONTINUE</a-button
        >
      </a-form>
    </div>
  </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import BasicLayout from '@/components/layout/BasicLayout.vue';
import { post } from '@/utils/httpUtils';
import { LoadingModule } from '@/store/modules/loading';
import { UserModule } from '@/store/modules/user';

@Options({
  components: {
    BasicLayout,
  },
})
export default class User extends Vue {

  data() {
    return {
      test: 456,
      from: {
        userName: '',
        passWord: '',
      }
    };
  }

  // data define type
  private test!: number;
  private form!: { userName: string; passWord: string };

  private showError = {
    status: false,
    info: '',
    time: 1500,
  }


  private submit() {
    console.log(this.form);
    if (!this.form.userName) {
      this.setErrorInfo('username required');
      return;
    }

    if (!this.form.passWord) {
      this.setErrorInfo('password required');
      return;
    }


    const data: {userName: string; password: string} = { userName: this.form.userName, password: this.form.passWord };
    LoadingModule.asyncChangeStatus(true);
    post('/api/login', data).then((res) => {
      LoadingModule.asyncChangeStatus(false);
      if (res.mseeage==='Success') {
        this.$router.push('/hrissue');
        UserModule.asyncChangeUserName(res.username);
      } else {
        this.setErrorInfo('Wrong username or password');
      }

    });
  }

  private setErrorInfo(value: string) {
    this.showError.status = true;
    this.showError.info = value;
    setTimeout(() => {
      this.showError.status = false;
    }, this.showError.time);
    return;
  }

  private enter(e: KeyboardEvent) {
    if (e.keyCode === 13)
      this.submit();
  }

}
</script>
<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  background: linear-gradient(#193542, #1f4252);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  font-family: LucidaGrande;
  font-size: 1rem;
  .logo {
    margin-top: 20%;
    margin-bottom: 53px;
    width: 274px;
    color: #fff;
    padding: 0 60px;
    position: relative;
    .logo-noc {
      text-align: left;
      position: absolute;
      font-size: 28px;
      font-family: "Zapfino";
    }
    .logo-tick {
      margin-top: 2px;
      text-align: right;
      font-size: 21px;
      font-weight: 700;
      font-stretch: narrower;
    }
  }
  .from-model {
    width: 274px;
    height: 220px;
    border-radius: 5px;
    font-weight: 700;
    .login-input {
      margin-top: 20px;
      border-radius: 2px;
      border: solid 1px rgba(255, 252, 252, 0.45);
      background-color: rgba(255, 255, 255, 0.18);
    }
    .error-info{
      font-size: 0.8rem;
      color: rgb(247, 83, 83);
      display: block;
      margin-top: 0.2rem;
    }
    .login-button {
      width: 100%;
      font-weight: 700;
      background-color: #cce1fb;
      color: #224b53;
      font-family: LucidaGrande;
    }
    .from-header {
      font-weight: 700;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.19;
      text-align: center;
      color: #dddddd;
      font-size: 18px;
    }
  }
}
</style>