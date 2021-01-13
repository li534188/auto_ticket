<template>
  <div class="jiraChecklist-wrapper">
    <sloid-layout >
      <template v-slot:menu>
        <a-menu  theme="light" style="text-align:left" v-model:selectedKeys="selectedKeys" mode="vertical">
          <a-menu-item key="1">
            <pie-chart-outlined />
            <span>Checklist Management</span>
          </a-menu-item>
        </a-menu>
      </template>
      <template v-slot:content>
        <check-list />
      </template>
    </sloid-layout>
  </div>
</template>
<script lang="ts">
import { Options, Vue, } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import SloidLayout from '@/components/layout/SloidLayout.vue';
import CheckList from './CheckList.vue';
import {
  PieChartOutlined,
} from '@ant-design/icons-vue';
@Options({
  components: {
    SloidLayout,
    CheckList,
    PieChartOutlined
  },
})
export default class DashBoard extends Vue {
  private collapsed = false;
  private selectedKeys: string [] = ['1'];

  mounted() {
    console.log(this.$route.path);
  }

  @Watch('selectedKeys')
  private onSlectedKeysChange(value: string []) {
    console.log(value[0]);
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
</style>>