<template>
  <div class="about">
    <!-- <a-button @click="test">測試</a-button> -->
    <sloid-layout >
      <template v-slot:menu>
        <a-menu  class="template-menu" theme="light" v-model:selectedKeys="selectedKeys" mode="vertical">
          <a-menu-item key="1">
            <pie-chart-outlined />
            <span>New Employees</span>
          </a-menu-item>
          <a-menu-item key="2">
            <desktop-outlined />
            <span>Existing Employees</span>
          </a-menu-item>
          <a-menu-item key="3">
            <user-outlined />
            <span>Template Management</span>
          </a-menu-item>
        </a-menu>
      </template>
      <template v-slot:content>
        <router-view />
      </template>
    </sloid-layout>
  </div>
</template>

<script lang="ts">

enum RouterKeys {
  template ='/hrissue/template',
  employee = '/hrissue/employee'
}
import { Options, Vue, } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import SloidLayout from '@/components/layout/SloidLayout.vue';
import { HRIssueModule } from '@/store/modules/hrissue';
import { LoadingModule } from '@/store/modules/loading';
import {
  PieChartOutlined,
  DesktopOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
@Options({
  components: {
    SloidLayout,
    DesktopOutlined,
    PieChartOutlined,
    UserOutlined
  },
})
export default class HRIssue extends Vue {
  private collapsed = false;
  private selectedKeys: string [] = ['1'];

  mounted() {
    HRIssueModule.asyncGetIssueList();
  }

  get datas() {
    return HRIssueModule.hrIssueList;
  }

  @Watch('selectedKeys')
  private onSlectedKeysChange(value: string []) {
    console.log(value[0]);
    switch (value[0]) {
    case '1':
      this.$router.push(RouterKeys.employee);
      break;
    case '2':
      this.$router.push(RouterKeys.employee);
      break;
    case '3':
      this.$router.push(RouterKeys.template);
      break;
    default:
      break;
    }
  }

  @Watch('datas')
  private onDatasChange(value: any) {
    console.log(value[0].title);
  }

  get loadingstate() {
    return LoadingModule.isloading;
  }

  private test() {
    LoadingModule.asyncChangeStatus(!this.loadingstate);
    setTimeout(() => {
      LoadingModule.asyncChangeStatus(!this.loadingstate);
    }, 1000);
  }

}
</script>
<style lang="scss" scoped>
  .about{
    height: 100%;
    width: 100%
  }
  .template-menu{
    background: transparent;
    text-align: left;
    color: #6a778b;
  }
</style>>