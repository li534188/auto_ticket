<template>
  <div class="content">
    <header>
      {{ticketNumber}}
    </header>
    <a-spin :spinning='showLoading' class="spin-position">
      <template v-slot:indicator>
        <loading-outlined style="font-size: 30px" spin />
      </template>
    </a-spin>
    <section  class="content-details">
      <a-row class="list-style" v-for="(val, key, index) in employeeInfo" :key="index">
        <a-col  :span="8">
          <span class="details-lable">{{`${key} :`}}</span>
        </a-col>
        <a-col  :span="16">
          <span class="details-content">{{getVal(val)}}</span>
          <span class="template-exit" v-show="key === 'Job Title'">{{hasTemplate?'Template Exists!':'Template Does Not Exist!'}}</span>
        </a-col>
      </a-row>
    </section>
    <section v-if="!showLoading&&!ticketCreate">
      <a-button
        @click="createHrissue"
        :disabled="percentage > 0||!hasTemplate"
        :loading="autoCreateLoading"
        :class="[hasTemplate?'create-button':'no-create',]"
      >
        Auto-Create
      </a-button>
      <div v-show="percentage > 0" class="content-divider">
        <span class="divider-info">{{`Creating tickets and Confluence page for ${ticketNumber}`}}</span>
        <div class="content-progress">
          <div>{{`${percentage} %`}}</div>
          <a-progress class="content-process" strokeColor="#3aca60" :percent="parseInt(percentage)" size="small" :showInfo="false" status="active" />
        </div>
      </div>
    </section>
    <section v-if="!showLoading&&ticketCreate" class="content-list">
      <a-tabs class="content-phase" v-model="activeKey">
        <a-tab-pane key="1">
          <template v-slot:tab>
            <span>
              Access Tickets
            </span>
          </template>
          <employee-content-tab :popData="accessData" phase="access"/>
        </a-tab-pane>
        <a-tab-pane key="2">
          <template v-slot:tab>
            <span>
              SOP Tickets
            </span>
          </template>
          <employee-content-tab :popData="sopData" phase="sop"/>
        </a-tab-pane>
      </a-tabs>
    </section>
    <section v-if="!hasTemplate&&!ticketCreate&&!showLoading">
      <div class="create-template">
        <div class="create-text">
          Template does not exist.
        </div>
        <a-button @click="jumpToTemplate" class="create-button new-template">
          Create New Template
        </a-button>
      </div>
    </section>
  </div>
  <EmployeeModal
    :show="showModal"
    :changeShow="changeShow"
    :hrInfo="employeeInfo"
    :confirCallback="confirCallback"
  />
</template>
<script lang="ts">
interface InfoType{
  title: string;
  value: string;
}

import { Options, Vue, } from 'vue-class-component';
import { RedoOutlined, CheckCircleOutlined, LoadingOutlined  } from '@ant-design/icons-vue';
import { Watch, } from 'vue-property-decorator';
import EmployeeContentTab from './EmployeeContentTab.vue';
import { HRIssueModule } from '@/store/modules/hrissue';
import { getPrecent, getCompletedJiraTicket, checkDuplicate, autoCreate, syncTemplate } from '@/utils/server';
import EmployeeModal from './EmployeeModal.vue';
@Options({
  components: {
    RedoOutlined,
    CheckCircleOutlined,
    LoadingOutlined,
    EmployeeContentTab,
    EmployeeModal
  },
})
export default class EmployeeContent extends Vue {
  private ridaoValue = '1';
  private activeKey = '1';
  private showLoading = false;
  private ticketNumber = ''
  private hasTemplate = false;
  private percentage = 0;
  private ticketCreate = false;
  private sopData = [];
  private accessData = [];
  private jiraName = '';
  private autoCreateLoading = false;
  private intervalTime = 0;
  private showModal = false;
  get employeeInfo() {
    const { employeeInfo } = HRIssueModule;
    this.ticketNumber = employeeInfo.issue_number;
    this.ticketCreate = false;
    this.percentage = 0;
    this.jiraName = employeeInfo.name;
    checkDuplicate({ jobTitle: employeeInfo.job_title, manager: employeeInfo.manager, templateId: '' }).then((res) => {
      console.log(res);
      if (res) {
        this.hasTemplate = true;
      } else {
        this.hasTemplate = false;
      }
    });
    const issueInfo = { Name: employeeInfo.name,
      'Perfered Name': employeeInfo.preferred_full_name,
      'Job Title': employeeInfo.job_title,
      Company: employeeInfo.company,
      Location: employeeInfo.location,
      department: employeeInfo.Department,
      'Start Date': employeeInfo.start_date,
      Manager: employeeInfo.manager,
    };
    return issueInfo;
  }


  private jumpToTemplate() {
    const { employeeInfo } = HRIssueModule;
    const { job_title, manager, company } = employeeInfo;
    this.$router.push({ path: '/hrissue/template/detail/create', query: { templateName: job_title, manager, company }});
  }

  private createHrissue() {
    this.changeShow(true);

  }

  private confirCallback(param: {access: string[]; sop: string[]; footerCheck: boolean}) {

    const { access, sop, footerCheck } = param;
    const res = access.concat(sop) as string[];
    const { employeeInfo } = HRIssueModule;
    const { manager, job_title, name, issue_number,  } = employeeInfo;
    this.autoCreateLoading = true;
    autoCreate({ issueNum: this.ticketNumber, manager, jobTitle: job_title, jiraSummary: name, allTask: res, }).then(res => {
      console.log(res);
    });
    if (footerCheck) {
      syncTemplate({ jobTitle: job_title, manager, access, sop }).then(res => {
        console.log(res);
      });
    }
    this.generalInterval(issue_number);
  }

  @Watch('ticketNumber')
  private ticketNumberCahgne(value: string) {
    this.showLoading = true;
    window.clearInterval(this.intervalTime);
    this.percentage = 0;
    getPrecent({ issueNum: value }).then(res => {
      this.showLoading = false;
      if (!res||res == '0') {
        return;
      }
      if (res == 100) {
        this.showLoading = true;
        const { ticketNumber,  jiraName } = this;
        getCompletedJiraTicket({ jiraSummary: jiraName, issueNum: ticketNumber }).then(res => {
          this.showLoading = false;
          if (res!=='False') {
            this.ticketCreate = true;
            this.sopData = res.Sop;
            this.accessData =res.Access;
          }
        });
        return;
      }
      this.generalInterval(value);
    });
  }

  private generalInterval(issue_number: string) {
    this.intervalTime = window.setInterval(() => {
      getPrecent({ issueNum: issue_number }).then(res => {
        if (issue_number === this.ticketNumber) {

          if (res&&res<100&&res>0) {
            this.autoCreateLoading = false;
            this.percentage = res;
          }
          if (res == 100) {
            // 清除定时器
            window.clearInterval(this.intervalTime);
            this.intervalTime = 0;
            const { ticketNumber,  jiraName } = this;
            this.percentage = 99;
            getCompletedJiraTicket({ jiraSummary: jiraName, issueNum: ticketNumber }).then(res => {
              this.percentage = 100;
              console.log(res);
              if (res!=='False') {
                this.ticketCreate = true;
                this.sopData = res.Sop;
                this.accessData =res.Access;
              }
            });
          }
          if (!res) {
            window.clearInterval(this.intervalTime);
            this.intervalTime = 0;
          }
        } else {
          this.percentage = 0;
        }


      });
    }, 1000);
  }
  private getVal(val: string|null) {
    if (!val) {
      return 'null';
    } else if (val ==='None') {
      return '--';
    } else {
      return val;
    }
  }
  private changeShow(even: boolean) {
    this.showModal = even;
  }
}

</script>
<style lang="scss" >
    .content{
      height: 100%;
      margin-left: 40px;
      font-family: HelveticaNeue;
      position: relative;
      font-size: 12px;
      padding-right:34px;
      .content-phase{
        .ant-tabs-nav .ant-tabs-tab{
          padding: 12px 2px!important;
        }
      }
      .spin-position{
        position: absolute;
        top: 75%;
        left: 45%;
      }
      header{
          color: #2063d1;
          font-size: 14px;
          line-height: 24px;
          margin-left: -2rem;
      }
      .content-details{
        max-height: 249px;
        line-height: 1.8rem;
        .template-exit{
          margin-left: 10px;
          color: #c377f0;
          cursor: pointer;
        }
        .list-style{
          line-height: 25px;
        }
      }
      .create-button{
        height: 15px;
        line-height: 15px;
        font-size: 10px;
        border: 1px solid #fa6400!important;
        color: #fa6400!important;
        font-size: 9px;
        margin: 10px 0 20px 0;
        &.new-template{
          margin-top: 36px;
        }
      }
      .no-create{
        height: 15px;
        line-height: 15px;
        font-size: 9px;
        margin: 10px 0 20px 0;
      }
      .content-divider{
        height: 50px;
        border-top: 2px solid rgba($color: #000000, $alpha: .1);
        border-bottom: 2px solid rgba($color: #000000, $alpha: .1);
        color: #5d656f;
        display: flex;
        justify-content: center;
        align-items: center;
        .divider-info{
          width: 300px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-style: italic;
          font-size: 12px;
          font-weight: 100;
          opacity: 0.8;
          letter-spacing: 0.5px;
          color: #5d656f
        }
        span{
          line-height: 36px;
          margin-right: 24px;
        }
      }
      .content-progress{
        // width: 20%;
        flex: 0 0 120px;
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
      .create-template{
        border-top: 2px solid rgba($color: #000000, $alpha: .1);
        display: flex;
        align-items: center;
        flex-direction: column;
        .create-text{
          margin-top: 10%;
          color: #5d656f;
        }
      }
    }
</style>