<template>
  <div class="employee-wrapper">
    <!-- <a-button @click="test">測試</a-button> -->
    <!-- <sloid-layout >
      <template v-slot:menu>
        <div class="template-menu">
          <div @click="changeActiveKey(item.key)" :data-test="item.key" :class="['menu-item', {'active-item':activeKey==item.key}]" v-for="(item, index) in itemData" :key="index">
            <img class='menu-icon'  :src='item.url'/>
            <span>{{item.title}}</span>
          </div>
      </template>
      <template v-slot:content>

      </template>
    </sloid-layout> -->
    <router-view />
  </div>
</template>

<script lang="ts">

enum RouterKeys {
  template ='/hrissue/template/list',
  employee = '/hrissue/employee'
}
import { Options, Vue, } from 'vue-class-component';
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
  private itemData = [{ title: 'New Employees', url: require('@/assets/img/icons8-pass-fail-80.png'), key: RouterKeys.employee },
    // { title: 'Existing Employees', url: require('@/assets/img/employee_profiles.png') },
    { title: 'Template Management', url: require('@/assets/img/icons8-load-resume-template.png'), key: RouterKeys.template }
  ]
  private activeKey!: string

  data() {
    return {
      activeKey: RouterKeys.employee
    };
  }
  mounted() {
    // HRIssueModule.asyncGetIssueList();
    // this.routeChange(this.$route);
  }


  // @Watch('activeKey')
  // private onSlectedKeysChange(value: string) {
  //   switch (value) {
  //   case RouterKeys.employee:
  //     this.$router.push(RouterKeys.employee);
  //     break;
  //   case '1':
  //     this.$router.push(RouterKeys.employee);
  //     break;
  //   case RouterKeys.template:
  //     this.$router.push(RouterKeys.template);
  //     break;
  //   default:
  //     break;
  //   }
  // }

  // @Watch('$route')
  // private routeChange(value: any) {
  //   console.log(value);
  //   if (value.href.indexOf(RouterKeys.template) > -1) {
  //     this.activeKey = RouterKeys.template;
  //   } else if (value.href.indexOf(RouterKeys.employee) > -1) {
  //     this.activeKey = RouterKeys.employee;
  //   } else {
  //     this.activeKey = '';
  //   }
  // }

  private changeActiveKey(key: string) {
    this.activeKey = key;
  }

}
</script>
<style lang="scss">
  .employee-wrapper{
    height: 100%;
    width: 100%;
    padding: 0 10px;
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