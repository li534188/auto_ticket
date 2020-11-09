<template>
  <div class="wrapper">
    <div class="logo">
      <div class="logo-noc">
        noc
      </div>
      <div class="logo-tick">
        Ticketing
      </div>
    </div>
    <!-- <canvas
      style="border: aqua solid 1px"
      id="canvas"
      width="500"
      height="500"
    ></canvas> -->
    <div class="from-model">
      <div class="from-header">Log in with your DAI account:</div>
      <a-form :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input class="login-input" v-model:value="form.userName" />
        <a-input
          class="login-input"
          type="password"
          v-model:value="form.passWord"
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

@Options({
  components: {
    BasicLayout,
  },
})
export default class User extends Vue {
  private form: { userName: string; passWord: string } = {
    userName: '',
    passWord: '',
  };

  private submit() {
    console.log(this.form);
    post('/api/login', this.form).then((res) => {
      console.log(res);
    });
  }

  mounted() {
    console.log(123);
    // const obj: HTMLCanvasElement = document.querySelector('#canvas') as HTMLCanvasElement;
    // if (obj) {
    //   const context: CanvasRenderingContext2D = obj.getContext('2d') as CanvasRenderingContext2D;
    //   if (context) {
    //     context.font = 'italic 30pt Finger Paint';
    //     context.fillStyle = '#cce1fb';
    //     context.strokeStyle = '#ffff';
    //     context.strokeText('NOC', 100, 100);
    //     context.fillText('NOC', 100, 100);
    //     // context.strokeText('hellocav', 100, 100);
    //   }
    // }
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
  font-family: LucidaGrande;
  font-size: 1rem;
  .logo {
    margin-top: 8%;
    width:  23rem;
    color: #fff;
    font-family: 'Zapfino';
    padding: 0 5rem;
    .logo-noc{
      text-align: left;
      font-size: 3rem;
      font-weight: 300;
    }
    .logo-tick{
      text-align: right;
      font-family: Silom;
      font-size: 2rem;
    }
  }
  .from-model {
    width: 23rem;
    margin-top: 30px;
    height: 220px;
    border-radius: 5px;
    font-weight: 700;
    .login-input {
      margin-top: 20px;
      border-radius: 5px;
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
      letter-spacing: 0.24px;
      text-align: center;
      color: #dddddd;
    }
  }
}
</style>