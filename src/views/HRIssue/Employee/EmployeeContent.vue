<template>
  <div class="content">
    <header>
      HR-113
    </header>
    <section class="content-details">
      <a-row v-for="(item, index) in employeeInfo" :key="index">
        <a-col  :span="8">
          <span class="details-lable">{{`${item.title} :`}}</span>
        </a-col>
        <a-col  :span="16">
          <span class="details-content">{{item.value}}</span>
        </a-col>
      </a-row>
      <a-button class="auto-button">
        Auto-Create
      </a-button>
    </section>
    <div class="content-divider">
      <span>Creating tickets and confluence page for</span>
      <div class="content-progress">
        <div>50%</div>
        <a-progress class="content-process" :percent="50" :showInfo="false" status="active" />
      </div>
    </div>
    <section class="content-list">
      <a-tabs v-model="activeKey">
        <a-tab-pane key="1">
          <template v-slot:tab>
            <span>
              <apple-outlined />
              Access
            </span>
          </template>
          <employee-content-tab :datas="datas"/>
        </a-tab-pane>
        <a-tab-pane key="2">
          <template v-slot:tab>
            <span>
              <android-outlined />
              Sop
            </span>
          </template>
          <employee-content-tab :datas="datas"/>
        </a-tab-pane>
      </a-tabs>
    </section>
  </div>
</template>
<script lang="ts">
interface InfoType{
  title: string;
  value: string;
}

import { Options, Vue, } from 'vue-class-component';
import { RedoOutlined, CheckCircleOutlined } from '@ant-design/icons-vue';
import EmployeeContentTab from './EmployeeContentTab.vue';
import { HRIssueModule } from '@/store/modules/hrissue';
@Options({
  components: {
    RedoOutlined,
    CheckCircleOutlined,
    EmployeeContentTab
  },
})
export default class EmployeeContent extends Vue {
  private ridaoValue = '1';
  private activeKey = '1';

  mounted() {
    HRIssueModule.asyncGetEmployeeInfo();
  }



  get employeeInfo() {
    const { employeeInfo } = HRIssueModule;
    const mapInfo: {title: string; value: string}[] = [];
    const titleInfo: {[key: string]: string} = {
      employee_name: 'Name',
      preferred_name: 'Perfered Name',
      job_title: 'Job Title',
      company: 'Company',
      location: 'Location',
      department: 'Department',
      start_date: 'Start Date',
      manager: 'Manager',
    };
    for (const key in titleInfo) {
      mapInfo.push({ title: titleInfo[key], value: employeeInfo[key] });
    }
    console.log(mapInfo);
    console.log(employeeInfo);
    return mapInfo;
  }
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
}

</script>
<style lang="scss" scoped>
    .content{
      height: 100%;
      margin-left: 5rem;
      padding-right: 5rem;
      font-family: HelveticaNeue;
      font-size: 0.8rem;
      header{
          color: #2063d1;
          font-size: 1.25rem;
          line-height: 2.5rem;
          margin-left: -2rem;
      }
      .content-details{
          min-height: 30%;
          line-height: 1.8rem;
      }
      .auto-button{
        border: 1px solid orange;
        color: orange;
      }
      .content-divider{
        border-top: 2px solid rgba($color: #000000, $alpha: .1);
        border-bottom: 2px solid rgba($color: #000000, $alpha: .1);
        color: #5d656f;
        padding: 0 2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        span{
          line-height: 3rem;
          margin-right: 2rem;
        }
      }
      .content-progress{
        // width: 20%;
        flex: 0 0 20%;
        flex-direction: column;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .details-lable{
        color: #5d656f;
      }
      .details-content{
        color: #000000;
      }
    }
</style>