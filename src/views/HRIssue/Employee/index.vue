<template>
  <div class="wrapper">
    <div class="left-content">
      <employee-header />
    </div>
    <div class="divider"/>
    <div class="right-content">
      <employee-content />
    </div>

  </div>
</template>
<script lang="ts">
interface InfoType{
  title: string;
  value: string;
}
import { Options, Vue, } from 'vue-class-component';
import EmployeeHeader from './EmployeeHeader.vue';
import EmployeeContent from './EmployeeContent.vue';
import { RedoOutlined, CheckCircleOutlined } from '@ant-design/icons-vue';
@Options({
  components: {
    RedoOutlined,
    CheckCircleOutlined,
    EmployeeHeader,
    EmployeeContent
  },
})
export default class Employee extends Vue {
  private ridaoValue = '1';
  private datas: {title: string}[] = [
    {
      title: 'Ant Design Title 1',
    },
    {
      title: 'Ant Design Title 2',
    },
    {
      title: 'Ant Design Title 3',
    },
    {
      title: 'Ant Design Title 4',
    },
  ];
  private info: InfoType[] = [
    {
      title: 'Name',
      value: 'Lyt',
    }, {
      title: 'Perfered Name',
      value: 'Job Title',
    }, {
      title: 'Company',
      value: 'Lyt',
    }, {
      title: 'Location',
      value: 'Lyt',
    }, {
      title: 'Department',
      value: 'Lyt',
    },
  ]
}

</script>
<style lang="scss" scoped>
  .wrapper{
    width: 100%;
    height: 100%;
    padding-top: 1%;
    display: flex;
    flex-direction: row;
    .left-content{
      flex: 1 1 20%;
    }
    .right-content{
      flex: 1 1 80%;
    }
    .divider{
      border: 1px solid rgba($color: #000000, $alpha: .1);
      float: left;
      height: 85%;
    }
  }
</style>>