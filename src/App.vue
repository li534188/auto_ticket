<template>
  <!-- <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div> -->
  <div class="wrapper">
    <div class="wrapper-item">
      <loading />
      <router-view/>
    </div>
  </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Loading from  '@/components/Loading.vue';
import { UserModule } from '@/store/modules/user';

@Options({
  components: {
    Loading,
  },
})
export default class App extends Vue {
  mounted() {
    const storage = window.localStorage;
    const userName = storage.getItem('userName');
    if (userName) {
      UserModule.asyncChangeUserName(userName);
    }
  }
}
</script>>

<style lang="scss" scope>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  background:#f6faf9;;
}
  .wrapper{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    min-height: 900px;
    height: 100vh;
  }
  .wrapper-item{
    width: 1024px;
    height: 900px;
    position: relative;
  }

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
