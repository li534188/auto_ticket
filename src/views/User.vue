<template>
  <div class="wrapper">
    <div class="logo">
    </div>
    <div class="from-model">
      <div class="from-header">
        Welcome to the O’Neil Plant Dashboard
      </div>
      <a-form :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input class="login-input" v-model:value="form.userName" />
        <a-input class="login-input" type="password" v-model:value="form.passWord" />
        <a-button class="login-input login-button" type="primary"  @click="submit">sign in</a-button>
      </a-form>
    </div>
  </div>
</template>
<script lang="ts">
import { Options, Vue, } from 'vue-class-component';
import BasicLayout from '@/components/layout/BasicLayout.vue';

@Options({
  components: {
    BasicLayout
  }
})
export default class User extends Vue {
  private form: {userName: string; passWord: string} =  { userName: '', passWord: '' } ;
  private submit() {
    console.log(this.form);
  }
}
</script>
<style lang="scss" scoped>
  .wrapper{
    width: 100%;
    height: 100%;
    background: linear-gradient(#143883,#18429c);
    display: flex;
    flex-direction: column;
    align-items: center;
    .logo{
      margin-top:8%;
      width:300px;
      height: 150px;
      background-image: url('~@/assets/ods-logo.png');
      background-repeat: no-repeat;
      background-position: center center;
    }
    .from-model{
      width: 400px;
      margin-top: 30px;
      height: 220px;
      padding: 20px;
      border-radius: 5px;
      background-color: #fff;
      font-size: 16px;
      font-weight: 700;
      .login-input{
        margin-top: 20px;
        border-radius: 5px;
      }
      .login-button{
        width:100%;
        font-weight: 700;
      }
      .from-header{
        font-weight: 700;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.19;
        letter-spacing: .24px;
        text-align: center;
        color: #22505b;
      }
    }
  }

</style>