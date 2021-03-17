<template>
  <div @keydown="enter($event)" class="login-wrapper">
    <div class="logo">
      <img class="logo-noc" src='@/assets/img/logo.png'/>
      <div class="logo-tick">Ticket</div>
    </div>
    <!-- <canvas
      style="border: aqua solid 1px"
      id="canvas"
      width="500"
      height="500"
    ></canvas> -->
    <div class="from-model">
      <div class="from-header">Log in with your DAI/ODSDAI account:</div>
      <div v-show="showError.status" class="error-info">{{showError.info}}</div>
      <div class="center-block">
        <div class="login-user-wrapper">
          <div class="left-block">
            <section class="input-wrapper search-manager-wrapper">
              <div class="login-search-input" ref="searchInput" @click.stop="changeManagerShow(index)" placeholder="Manager">
                <span class="search-place">{{prefix.toUpperCase()}}</span>
                <DownOutlined :class="['icon-dowload', {'icon-reserve':showManagerPrompt}]" />
              </div>
            </section>
          </div>
          <a-input style="color:#fff;" class="login-input" v-model:value="userName" placeholder="Username" />
        </div>
        <a-input
          class="login-input"
          style="color:#fff"
          type="password"
          v-model:value="passWord"
          placeholder="Password"
        />
        <a-button
          class="login-input login-button"
          type="primary"
          @click="submit">
          CONTINUE
        </a-button>
      </div>
    </div>
  </div>
  <div :style="{top:(popPositionY+35)+'px',left:popPositionX+'px'}" v-if="showManagerPrompt" class="login-prompt-wrapper">
    <div class="item-wrapper">
      <div @click.stop="handleChange(subitem.value)" :class="['prompt-item', {'active-item':subitem.value===prefix}]" v-for="(subitem) in selectData" :key="subitem.key">
        {{subitem.key}}
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import BasicLayout from '@/components/layout/BasicLayout.vue';
import { DownOutlined, } from '@ant-design/icons-vue';
import { post } from '@/utils/httpUtils';
import { LoadingModule } from '@/store/modules/loading';
import { UserModule } from '@/store/modules/user';

@Options({
  components: {
    BasicLayout,
    DownOutlined
  },
})
export default class User extends Vue {

  data() {
    return {
      test: 456,
      userName: '',
      passWord: '',
      prefix: 'odsdai'
    };
  }


  // data define type
  private test!: number;
  private userName!: string;
  private passWord!: string;
  private prefix!: string;
  private showError = {
    status: false,
    info: '',
    time: 1500,
  }
  private showManagerPrompt = false;
  private popPositionX = 0;
  private popPositionY = 0;
  private selectData = [{ key: 'DAI', value: 'dai' }, { key: 'ODSDAI', value: 'odsdai' }]


  private submit() {
    if (!this.userName) {
      this.setErrorInfo('username required');
      return;
    }

    if (!this.passWord) {
      this.setErrorInfo('password required');
      return;
    }


    const data: {userName: string; password: string} = { userName: this.prefix+'\\'+this.userName, password: this.passWord };
    LoadingModule.asyncChangeStatus(true);
    post('/api/login', data).then((res) => {
      LoadingModule.asyncChangeStatus(false);
      if (res.message==='Success') {
        this.$router.push('/hrissue');
        UserModule.asyncChangeUserName(res.username);
      } else {
        this.setErrorInfo(res.message);
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

  private changeManagerShow() {
    const searchInput = this.$refs['searchInput'] as HTMLElement;
    if (searchInput) {
      this.popPositionX = searchInput.getBoundingClientRect().right-75;
      this.popPositionY = searchInput.getBoundingClientRect().top;
    }
    this.showManagerPrompt = true;
    window.addEventListener('click', this.closeMamagerPrompt);
  }

  private closeMamagerPrompt() {
    this.showManagerPrompt = false;
    window.removeEventListener('click', this.closeMamagerPrompt);
  }

  private handleChange(value: string) {
    this.prefix = value;
    this.closeMamagerPrompt();
  }

}
</script>
<style lang="scss">
.login-wrapper {
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
    width: 357px;
    color: #fff;
    padding: 0 100px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .logo-noc {
      object-fit: cover;
      width: 120px;
    }
    .logo-tick {
      margin-top: 2px;
      text-align: right;
      font-size: 21px;
      font-weight: 700;
      font-stretch: narrower;
    }
  }
  .center-block{
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding-right: 50px;
  }
  .from-model {
    width: 357px;
    height: 220px;
    border-radius: 5px;
    .login-input {
      margin-top: 20px;
      border-radius: 2px;
      width: 70%;
      border: solid 1px rgba(255, 252, 252, 0.45);
      background-color: rgba(255, 255, 255, 0.18);
    }
    .error-info{
      font-size: 0.8rem;
      color: rgb(247, 83, 83);
      display: block;
    }
    .login-button {
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
    .login-user-wrapper{
      display: flex;
      width: 100%;
      justify-content: flex-end;
      align-items: flex-end;
    }
    .left-block{
      color: #fff;
      width: 80px;
      height: auto;
    }
    .user-select{
      width: 30%;
      background-color: #cce1fb!important;
      .ant-select-selection{
        background-color: rgb(232, 240, 254);
      }
    }
  }
}
.login-search-input{
    border-bottom: 1px solid #98A4AA;
    width: 75px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 30px;
    color: #DDDDDD;
    .search-place{
      text-align: center;
      font-weight: bold;
      font-size: 12px;
      flex: 1;
    }
}
.icon-dowload{
  font-size: 9px;
  transition: all 0.5s;
  transform: rotate(360deg);
  float: right;
  margin-right: 5px;
  transform-origin: center;
}
.icon-reserve{
  transform: rotate(180deg);
}
.login-prompt-wrapper{
  position: fixed;
  width: 75px;
  border-radius: 3px;
  z-index: 9;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.188729);
  border-radius: 5px;
  .item-wrapper{
    border: 1px solid #D6D6D6;
    padding: 2px;
    text-align: right;
  }
  .prompt-item{
    background-color: unset;
    color: #F1F5FC;
    margin-bottom: 3px;
    height: 26px;
    line-height: 26px;
    padding: 0 10px 0 0;
    font-weight: bold;
    font-size: 11px;
    &:hover{
      color: #193542;
      background-color: #d5d8dd;
    }
  }
  .active-item{
    color: #193542;
    background-color: #f1f5fc;
  }
}
</style>