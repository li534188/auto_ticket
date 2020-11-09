<template>
  <a-layout theme="dark" id="components-layout-demo-top" class="layout">
    <a-layout-header class="basic-layout" >
      <slot name="header" />
    </a-layout-header>
    <a-layout-content  theme="dark">
      <div :style="{ background: '#fff', padding: '10px', height: '100%'}">
        <slot name="content" />
      </div>
    </a-layout-content>
    <!-- <a-layout-footer style="text-align: center">
      Ant Design ©2018 Created by Ant UED
    </a-layout-footer> -->
  </a-layout>
</template>
<script lang="ts" >
import {  Vue, } from 'vue-class-component';
export default class BasicLayout extends Vue {
}
</script>
<style scoped>
#components-layout-demo-top .logo {
  width: 120px;
  height: 31px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px 24px 16px 0;
  float: left;
}

#components-layout-demo-top{
    height: 100%;
}

.basic-layout{
  background: #193442;
}

</style>