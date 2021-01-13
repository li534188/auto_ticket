<template>
  <router-view />
</template>

<script lang="ts">
import { Vue, } from 'vue-class-component';
import { TemplateModule } from '@/store/modules/template';
export default class Template extends Vue {
  mounted() {
    TemplateModule.asyncGetManagerList();
  }
}
</script>


<style lang="scss" scoped>
</style>
