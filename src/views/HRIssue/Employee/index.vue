<template>
  <div class="issue-wrapper">
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
// import { HRIssueModule } from '@/store/modules/hrissue';
@Options({
  components: {
    RedoOutlined,
    CheckCircleOutlined,
    EmployeeHeader,
    EmployeeContent
  },
})
export default class Employee extends Vue {
}

</script>
<style lang="scss" scoped>
  .issue-wrapper{
    width: 100%;
    height: 95%;
    padding-top: 1%;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    .left-content{
      width: 290px;
      height: 100%;
    }
    .right-content{
      width: 800px;
    }
    .divider{
      border: 1px solid rgba($color: #000000, $alpha: .1);
      float: left;
      height: 100%;
    }
  }
</style>>