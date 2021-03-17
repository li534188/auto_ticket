<template>
  <div class="jiraChecklist-wrapper">
    <sloid-layout >
      <template v-slot:menu>
        <!-- <a-menu  theme="light" style="text-align:left" v-model:selectedKeys="selectedKeys" mode="vertical">
          <a-menu-item key="1">
            <pie-chart-outlined />
            <span>Checklist Management</span>
          </a-menu-item>
        </a-menu> -->
        <div class="jira-side-wrapper">
          <auto-tree :clickMethod="changeView" :treeData="treeData"></auto-tree>
          <div class="side-item setting">
            <SettingOutlined class="setting-icon"/>
            <span>Setting</span>
          </div>
        </div>
      </template>
      <template v-slot:content>
        <router-view />
      </template>
    </sloid-layout>
  </div>
</template>
<script lang="ts">
import { Options, Vue, } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import SloidLayout from '@/components/layout/SloidLayout.vue';
import { AutoTree } from '@/components';
// import CheckList from './CheckList.vue';
// import ListView from './ListView.vue';

import {
  PieChartOutlined,
  SettingOutlined
} from '@ant-design/icons-vue';
@Options({
  components: {
    SloidLayout,
    PieChartOutlined,
    AutoTree,
    SettingOutlined,
  },
})
export default class DashBoard extends Vue {
  private collapsed = false;
  private selectedKeys: string [] = ['1'];
  private activekey = 'all';
  mounted() {
    console.log(this.$route.path);
  }

  @Watch('selectedKeys')
  private onSlectedKeysChange(value: string []) {
    console.log(value[0]);
  }

  private treeData = [{
    title: 'All',
    value: 'All',
  }, {
    title: 'key1',
    value: 'key1',
    children: [{
      title: 'subkey1',
      value: 'subkey1',
      children: [{
        title: 'subsubkey5',
        value: 'subsubkey5',
      }, {
        title: 'subsubkey6',
        value: 'subsubkey6',
      }]
    }, {
      title: 'subkey2',
      value: 'subkey2',
    }]
  }, {
    title: 'key2',
    value: 'key2',
    children: [{
      title: 'subkey3',
      value: 'subkey3',
    }, {
      title: 'subkey4',
      value: 'subkey4',
    }]
  }]

  private changeView(activeKey: string) {
    console.log(activeKey);
  }
}
//
// export default {
//   name:'dashboard',
//    components: {
//     PieChartOutlined,
//     SloidLayout,
//     CheckList
//   },
//   data(){
//     return {
//       collapsed: false,
//       selectedKeys: ['1'],
//     }
//   },
//   mounted(){
//     console.log(this.$route.path)
//   },
//   watch:{
//     selectedKeys: {
//       handler(val){
//         console.log(val[0])
//       },
//       deep: true,
//     }
//   }
// }
</script>
<style lang="scss" scoped>
  .jiraChecklist-wrapper{
    height: 100%;
    width: 100%
  }
  .jira-side-wrapper{
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .side-item{
      cursor: pointer;
      height: 40px;
      line-height: 40px;
      font-family: HelveticaNeue;
      color: #6A778B;
      padding-left: 38px;
      letter-spacing: 2.4px;
      font-size: 12px;
    }
    .all-item{
      font-weight: 600;
    }
    .setting{
      border-top: 1px solid #F2F2F2;
      padding-left: 20px;
      color: #FA6400;
      .setting-icon{
        margin-right:20px;
      }
    }
  }
</style>