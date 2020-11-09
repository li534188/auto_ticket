<template>
  <a-layout  id="components-layout-demo-side">
    <a-layout-sider  theme="light" v-model:collapsed="collapsed" class="sloid-layout" @collapsible="false">
      <slot name="menu" />
    </a-layout-sider>
    <a-layout class="special-layout">
      <a-layout-content>
        <slot name="content" />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">

import { Vue, } from 'vue-class-component';

export default class SloidLayout extends Vue {
  private collapsed = false;
}

</script>

<style lang='scss' scope>
#components-layout-demo-side .logo {
  height: 32px;
  background:#f6faf9;
  margin: 16px;
}
#components-layout-demo-side{
  height: 100%;
}
.sloid-layout {
  width:18.8rem!important;
  flex:unset!important;
  max-width: unset!important;
  .ant-layout-sider-trigger {
    bottom: unset;
  }
  background: #ffffff;
  margin-right: 10px;
}
.special-layout{
  background: #ffffff;
}
</style>