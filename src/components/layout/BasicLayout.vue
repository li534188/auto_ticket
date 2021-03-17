<template>
  <a-layout theme="dark" id="components-layout-demo-top" class="layout">
    <a-layout-header class="basic-layout" >
      <slot name="header" />
    </a-layout-header>
    <a-layout-content  theme="dark">
      <div class="layout-content-wrapper">
        <slot name="content" />
      </div>
    </a-layout-content>
    <a-layout-footer class="basic-footer" style="">
      {{`© ${date} Data Analysis Incorporated. All rights reserved.`}}
    </a-layout-footer>
  </a-layout>
</template>
<script lang="ts" >
import {  Vue, } from 'vue-class-component';
import moment from 'moment';
export default class BasicLayout extends Vue {
  private date = moment(new Date()).year()
}
</script>
<style scoped lang='scss'>
#components-layout-demo-top .logo {
  width: 120px;
  height: 31px;
  background: rgba(255, 255, 255, 0.2);
  margin:  0;
  float: left;
}

#components-layout-demo-top{
    height: 100%;
    .ant-layout-content{
      position: relative;
      .layout-content-wrapper{
        background: #fff;
        height:100%;
        position: absolute;
        width: 100%;
      }
    }
}

.basic-layout{
  background: #193442;
  height: 78px;
  padding: 0 ;
  line-height: 78px;
}

.basic-footer{
  text-align: center;
  padding:12px 50px;
  background: #f6faf9;
}

</style>