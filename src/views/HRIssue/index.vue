<template>
  <div class="about">
    <!-- <a-button @click="test">測試</a-button> -->
    <sloid-layout >
      <template v-slot:menu>
        <div class="template-menu">
          <div @click="changeActiveKey(index)" :data-test="index" :class="['menu-item', {'active-item':activeKey==index}]" v-for="(item, index) in itemData" :key="index">
            <img class='menu-icon'  :src='item.url'/>
            <span>{{item.title}}</span>
          </div>
          <!-- <div class="menu-item">
            <img class='menu-icon'  src='@/assets/img/icons8-pass-fail-80.png'/>
            <span>New Employees</span>
          </div>
          <div class="menu-item">
            <img class='menu-icon'  src='@/assets/img/icons8-pass-fail-80.png'/>
            <span>Existing Employees</span>
          </div>
          <div class="menu-item">
            <img class='menu-icon'  src='@/assets/img/icons8-pass-fail-80.png'/>
            <span>New Employees</span>
          </div> -->
        </div>
        <!-- <a-menu  class="template-menu" theme="light" v-model:selectedKeys="selectedKeys" mode="vertical">
          <a-menu-item key="1">
            <img class='menu-icon'  src='@/assets/img/icons8-pass-fail-80.png'/>
            <span>New Employees</span>
          </a-menu-item>
          <a-menu-item key="2">
            <img class='menu-icon user-icon'  src='@/assets/img/employee_profiles.png'/>
            <span>Existing Employees</span>
          </a-menu-item>
          <a-menu-item key="3">
            <img class='menu-icon'  src='@/assets/img/icons8-load-resume-template.png'/>
            <span>Template Management</span>
          </a-menu-item>
        </a-menu> -->
      </template>
      <template v-slot:content>
        <router-view />
      </template>
    </sloid-layout>
  </div>
</template>

<script lang="ts">

enum RouterKeys {
  template ='/hrissue/template/list',
  employee = '/hrissue/employee'
}
import { Options, Vue, } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import SloidLayout from '@/components/layout/SloidLayout.vue';
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
  private selectedKeys: string [] = ['0'];
  private itemData = [{ title: 'New Employees', url: require('@/assets/img/icons8-pass-fail-80.png') },
    { title: 'Existing Employees', url: require('@/assets/img/employee_profiles.png') },
    { title: 'Template Management', url: require('@/assets/img/icons8-load-resume-template.png') }]
  private activeKey!: string

  data() {
    return {
      activeKey: '0'
    };
  }
  mounted() {
    // HRIssueModule.asyncGetIssueList();
    this.routeChange(this.$route);
  }


  @Watch('activeKey')
  private onSlectedKeysChange(value: string) {
    switch (value) {
    case '0':
      this.$router.push(RouterKeys.employee);
      break;
    case '1':
      this.$router.push(RouterKeys.employee);
      break;
    case '2':
      this.$router.push(RouterKeys.template);
      break;
    default:
      break;
    }
  }

  @Watch('$route')
  private routeChange(value: any) {
    if (value.href.indexOf(RouterKeys.template) > -1) {
      this.activeKey = '2';
    } else if (value.href.indexOf(RouterKeys.employee) > -1) {
      this.activeKey = '0';
    }
  }

  private changeActiveKey(key: string) {
    this.activeKey = key+'';
  }

}
</script>
<style lang="scss">
  .about{
    height: 100%;
    width: 100%
  }
  .template-menu{
    background: transparent;
    text-align: left;
    color: #6a778b;
    .menu-item{
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 50px;
      padding-left: 20px;
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
    }
    .active-item{
      background: #F2F2F2;
      font-weight: 600;
    }
  }
  .menu-icon{
    width: 15px;
    height: 15px;
    margin-right: 10px;
    color: #6A778B;
  }
</style>>