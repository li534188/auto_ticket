<template>
  <a-layout  id="components-layout-demo-side">
    <a-layout-sider theme="dark" v-model:collapsed="collapsed" class="sloid-layout" collapsible>
      <slot name="menu" />
    </a-layout-sider>
    <a-layout>
      <a-layout-content style="margin: 0 16px">
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
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
#components-layout-demo-side{
  height: 100%;
}
.sloid-layout {
  .ant-layout-sider-trigger {
    bottom: unset;
  }

}
</style>