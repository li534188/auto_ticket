<template>
  <div class="employee-content">
    <header>
      <a :href="hrIssueLink" rel="noopener" target="_blank">{{ticketNumber}}</a>
    </header>
    <div v-if="!globalLoading">
      <a-spin :spinning='showLoading' class="spin-position">
        <template v-slot:indicator>
          <loading-outlined style="font-size: 30px" spin />
        </template>
      </a-spin>
    </div>
    <section  class="content-details">
      <a-row class="list-style" v-for="(val, key, index) in employeeInfo" :key="index">
        <a-col  :span="8">
          <span class="details-lable">{{`${key} :`}}</span>
        </a-col>
        <a-col  :span="16">
          <span class="details-content">{{getVal(val)}}</span>
          <span class="template-exit" v-show="key === 'Job Title'">{{hasTemplate?'':'Template Does Not Exist!'}}</span>
        </a-col>
      </a-row>
      <a-row >
        <a-col v-if="confluenceUrl" :span="8">
          <span class="details-lable">Confluence Page:</span>
        </a-col>
        <a-col class="confluence-lable" :span="16">
          <a :href="confluenceUrl" rel="noopener" target="_blank">{{confluenceUrl}}</a>
        </a-col>
      </a-row>
    </section>
    <section v-if="(autoCreateLoading||!globalLoading)">
      <a-button
        @click="createHrissue"
        :disabled="!hasTemplate||(percentage>0&&percentage<100)"
        :loading="autoCreateLoading"
        :class="[hasTemplate?'create-button':'no-create',]"
        data-test="create-button"
      >
        {{buttonText}}
      </a-button>
      <div v-show="showProcess" class="content-divider">
        <span class="divider-info">{{`Creating tickets and Confluence page for ${ticketNumber}`}}</span>
        <div class="content-progress">
          <div>{{`${percentage} %`}}</div>
          <a-progress class="content-process" strokeColor="#3aca60" :percent="parseInt(percentage)" size="small" :showInfo="false" status="active" />
        </div>
      </div>
    </section>
    <section v-if="!globalLoading&&secondaryCreation" class="content-list">
      <a-tabs class="content-phase" v-model="activeKey">
        <a-tab-pane key="1">
          <template v-slot:tab>
            <span>
              Access
            </span>
          </template>
          <employee-content-tab @createAccout="generalAccout" :createPwStatus="createPwStatus" :popData="accessData" phase="access"/>
        </a-tab-pane>
        <a-tab-pane key="2">
          <template v-slot:tab>
            <span>
              SOP
            </span>
          </template>
          <employee-content-tab :popData="sopData" phase="sop"/>
        </a-tab-pane>
      </a-tabs>
    </section>
    <section v-if="!hasTemplate&&!secondaryCreation&&!globalLoading">
      <div class="create-template">
        <div class="create-text">
          Template does not exist.
        </div>
        <a-button data-test="jumpButton" @click="jumpToTemplate" class="create-button new-template">
          Create New Template
        </a-button>
      </div>
    </section>
    <section v-if="secondaryCreation">
      <div class="generation-block">
        <a-button
          @click="generalAccout()"
          :disabled="banCreateAd"
          :loading="createAdLoading"
          class="create-button new-template">
          Auto-Account Generation
        </a-button>
      </div>
    </section>
  </div>
  <EmployeeModal
    :show="showModal"
    :changeShow="changeShow"
    :hrInfo="employeeInfo"
    :confirCallback="confirCallback"
    :secondaryCreation="secondaryCreation"
    :complateSopData="sopData"
    :complateAccessData="accessData"
  />
  <a-modal
    v-model:visible="visible"
    title="Please save the password, it will not be available after closing the window."
    ok-text="ok"
    cancel-text="close"
  >
    <p v-for="(key, item) in createPwStatus" :key="key">
      <span v-show="item.status== 2">{{`${item} :`}} </span>
      <span>{{item.password}}</span>
    </p>
  </a-modal>
</template>
<script lang="ts">
export interface ComplateJiraInfoType{
  issueKey: string;
  link: string;
  status: string;
  title: string;
  usercode: string;
}
enum PwStatus{
  NOTCREATED,
  LOADING,
  SUCCESS,
  ERROR,
}

export interface PwStatusType{
  DAI: {status: PwStatus; password: string; message: string};
  ODS: {status: PwStatus; password: string; message: string};
}

export type ComplateJiraInfoTypeArr = ComplateJiraInfoType[];

import { Options, Vue, } from 'vue-class-component';
import { RedoOutlined, CheckCircleOutlined, LoadingOutlined, } from '@ant-design/icons-vue';
import { Watch, } from 'vue-property-decorator';
import EmployeeContentTab from './EmployeeContentTab.vue';
import { EmployeeInfoType, HRIssueModule } from '@/store/modules/hrissue';
import { LoadingModule } from '@/store/modules/loading';
import { getPrecent, getCompletedJiraTicket, checkDuplicate, autoCreate, syncTemplate, getConfluence, generalDaiAccount } from '@/utils/server';
import EmployeeModal from './EmployeeModal.vue';
import { message, } from 'ant-design-vue';
import * as _ from 'lodash';
@Options({
  components: {
    RedoOutlined,
    CheckCircleOutlined,
    LoadingOutlined,
    EmployeeContentTab,
    EmployeeModal
  }
})
export default class EmployeeContent extends Vue {

  data() {
    return {
      showLoading: false,
      hasTemplate: true,
      secondaryCreation: false,
      showModal: false,
      accessData: [],
      sopData: [],
      percentage: 0,
      ticketNumber: ''
    };
  }

  private activeKey = '1';
  private ticketNumber!: string;
  private hasTemplate!: boolean;;
  private percentage!: number;
  private secondaryCreation!: boolean;;
  private sopData!: ComplateJiraInfoTypeArr;
  private accessData!: ComplateJiraInfoTypeArr;
  private jiraName = '';
  private autoCreateLoading = false;
  private intervalTime = 0;
  private confluenceUrl = '';
  private showModal!: boolean;
  private ticketError = false;
  private retry = false;
  private hrIssueLink = '';
  private banCreateAd = true;
  private createAdLoading = false;
  private showProcess = false;
  private visible = false;
  private createPwStatus: PwStatusType = {
    DAI: { status: PwStatus.NOTCREATED, password: '', message: '' },
    ODS: { status: PwStatus.NOTCREATED, password: '', message: '' },
  }


  private initData() {
    this.autoCreateLoading = false;
    this.hasTemplate = true;
    this.retry = false;
    this.secondaryCreation = false;
    this.confluenceUrl = '';
    this.percentage = 0;
    this.banCreateAd = true;

    window.clearInterval(this.intervalTime);
  }

  @Watch('watchEmployeeInfo')
  private employeeInfoChange() {
    const { employeeInfo } = HRIssueModule;
    this.ticketNumber = employeeInfo.issue_number;
    // Ticket status timed update
    this.ticketError = (employeeInfo.status&&employeeInfo.status==='error')||false;
    if (employeeInfo.extraInfo) {
      const { dai_error_message, dai_password, ods_error_message, ods_password } = employeeInfo.extraInfo;
      if (dai_password||dai_error_message) {
        this.createPwStatus = { ...this.createPwStatus, DAI: { status: dai_password?PwStatus.SUCCESS:PwStatus.ERROR, password: dai_password, message: dai_error_message }};
      }
      if (ods_error_message||ods_password) {
        this.createPwStatus = { ...this.createPwStatus, ODS: { status: ods_password?PwStatus.SUCCESS:PwStatus.ERROR, password: ods_password, message: ods_error_message }, };
      }
    } else {
      this.createPwStatus = {
        DAI: { status: PwStatus.NOTCREATED, password: '', message: '' },
        ODS: { status: PwStatus.NOTCREATED, password: '', message: '' },
      };
    }
  }

  get globalLoading() {
    return LoadingModule.isloading;
  }

  get watchEmployeeInfo() {
    return HRIssueModule.employeeInfo;
  }

  get employeeInfo() {
    const { employeeInfo } = HRIssueModule;
    const issueInfo = { Name: employeeInfo.name,
      'Perfered Name': employeeInfo.preferred_full_name,
      'Job Title': employeeInfo.job_title,
      Company: employeeInfo.company,
      Location: employeeInfo.location,
      Department: employeeInfo.department,
      'Start Date': employeeInfo.start_date,
      Manager: employeeInfo.manager,
    };
    return issueInfo;
  }

  get buttonText() {
    const { retry, secondaryCreation, ticketError } = this;
    if (ticketError||retry) {
      return 'Retry';
    } else if (!ticketError&&secondaryCreation) {
      return 'Add-More';
    } else {
      return 'Auto-Create';
    }
  }

  @Watch('ticketNumber')
  private async ticketNumberCahgne() {
    this.init();
  }

  @Watch('createPwStatus', { deep: true })
  private pwStatusChange() {
    this.getComplateJiraInfo();
  }

  private init() {
    this.initData();
    const { employeeInfo } = HRIssueModule;
    const { name, issue_link, job_title, manager, } = employeeInfo;
    this.jiraName = name;
    this.hrIssueLink = issue_link;
    checkDuplicate({ jobTitle: job_title, manager, templateId: '' }).then((res) => {
      if (res) {
        this.hasTemplate = true;
      } else {
        this.hasTemplate = false;
      }
    });
    this.getTicketRateOfProgress();
  }

  private async getTicketRateOfProgress() {
    LoadingModule.asyncChangeStatus(true);
    if (this.ticketError) {
      LoadingModule.asyncChangeStatus(false);
      return;
    }
    const res = await getPrecent({ issueNum: this.ticketNumber });
    if (!res) {
      this.showProcess = false;
      LoadingModule.asyncChangeStatus(false);
      return;
    }
    if (res == 100) {
      const { jiraName } = this;
      await this.getComplateJiraInfo();
      await this.setConfluence(jiraName);
      LoadingModule.asyncChangeStatus(false);
      this.percentage = res;
      this.showProcess = false;
    } else {
      this.generalInterval(this.ticketNumber);
    }
  }


  private jumpToTemplate() {
    const { employeeInfo } = HRIssueModule;
    const { job_title, manager, company } = employeeInfo;
    this.$router.push({ path: '/hrissue/template/detail/create', query: { templateName: job_title, manager, company }});
  }

  private createHrissue() {
    const { hrIssueList } = HRIssueModule;
    const arr = hrIssueList.filter(((item: EmployeeInfoType) => {
      return item.name === this.jiraName;
    }));
    if (arr.length > 1) {
      message.error('name already exists, please check Jira HR ticket and change name');
    } else {
      this.changeShow(true);
    }
  }

  private async confirCallback(param: {access: string[]; sop: string[]; footerCheck: boolean}) {
    const { ticketError }=this;
    if (ticketError) {
      this.retry = true;
    }
    const { access, sop, footerCheck } = param;
    const res = access.concat(sop) as string[];
    const { employeeInfo } = HRIssueModule;
    const { manager, job_title, name, issue_number,  } = employeeInfo;
    this.autoCreateLoading = true;
    const userName = localStorage.getItem('userName');
    LoadingModule.asyncChangeStatus(true);
    await autoCreate({ issueNum: this.ticketNumber, manager, jobTitle: job_title, jiraSummary: name, allTask: res, user: userName||'' });
    if (footerCheck) {
      syncTemplate({ jobTitle: job_title, manager, access, sop });
    }
    this.generalInterval(issue_number);
  }

  private async setConfluence(jiraSummary: string) {
    const res = await getConfluence({ jiraSummary });
    if (res&&res.Confluence_link) {
      this.confluenceUrl = res.Confluence_link;
    }
  }


  private generalInterval(issue_number: string) {
    this.intervalTime = window.setInterval(() => {
      if (!this.retry&&this.ticketError) {
        window.clearInterval(this.intervalTime);
        return;
      }
      getPrecent({ issueNum: issue_number }).then(async res => {
        if (issue_number === this.ticketNumber) {
          if (res!==''&&res<100) {
            LoadingModule.asyncChangeStatus(false);
            this.autoCreateLoading = false;
            this.percentage = res;
            this.showProcess = true;
          }
          if (res == 100) {
            // 清除定时器
            window.clearInterval(this.intervalTime);
            this.intervalTime = 0;
            const { jiraName } = this;
            this.percentage = 99;
            await this.getComplateJiraInfo();
            this.percentage = 100;
            this.showProcess = false;
            LoadingModule.asyncChangeStatus(false);
            this.autoCreateLoading = false;
            await this.setConfluence(jiraName);
          }
          if (res==='') {
            this.autoCreateLoading = true;
          }
        } else {
          window.clearInterval(this.intervalTime);
          this.intervalTime = 0;
          this.percentage = 0;
        }
      });
    }, 3000);
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

  private async generalAccout(option?: string) {
    this.banCreateAd = true;
    this.createAdLoading = true;
    const { employeeInfo: { job_title, manager, name, location, department, company }} = HRIssueModule;
    const createPwStatus  = JSON.parse(JSON.stringify(this.createPwStatus)) as PwStatusType;
    const adArr: string [] = [];
    const issureArr: string[] = [];

    this.accessData.map(item => {
      if (item.title&&(item.title.indexOf('A/D (ODSDAI)') > -1)&&item.status=='To Do') {
        if (!option||option==='ODS') {
          adArr.push('ODS');
          issureArr.push(item.issueKey);
          _.set(createPwStatus, 'ODS.status', PwStatus.LOADING);
        }

      } else if (item.title&&(item.title.indexOf('A/D (DAI)') > -1)&&item.status=='To Do') {
        if (!option||option==='DAI') {
          adArr.push('DAI');
          issureArr.push(item.issueKey);
          _.set(createPwStatus, 'DAI.status', PwStatus.LOADING);
        }
      }
    });
    this.createPwStatus = createPwStatus;
    const res = await generalDaiAccount({ jobTitle: job_title, company, jiraSummary: name, office: location, department, manager, dai_or_ods: adArr, ticketNum: issureArr, issueNum: this.ticketNumber  });
    if (res) {
      this.banCreateAd = false;
    } else {
      this.banCreateAd = true;
    }
    this.createAdLoading = false;
    // if (res) {
    //   this.createAdLoading = false;
    //   if (res&&res.dai_status) {
    //     if (res.dai_status==='success') {
    //       this.createPwStatus = { ...this.createPwStatus, DAI: { status: PwStatus.SUCCESS, password: res.dai_password, message: '' }};
    //     } else if (res.dai_status==='error') {
    //       this.banCreateAd = false;
    //       this.createPwStatus = { ...this.createPwStatus, DAI: { status: PwStatus.ERROR, password: '', message: res.dai_message }};
    //       message.error(res.dai_message);
    //     }
    //   } else if (res&&res.ods_status) {
    //     if (res.ods_status==='success') {
    //       this.createPwStatus = { ...this.createPwStatus, ODS: { status: PwStatus.SUCCESS, password: res.ods_password, message: '' }};
    //     } else if (res.ods_status==='error') {
    //       this.banCreateAd = false;
    //       this.createPwStatus = { ...this.createPwStatus, ODS: { status: PwStatus.ERROR, password: '', message: res.dai_message }};
    //       message.error(res.dai_message);
    //     }
    //   }
    //   await this.getComplateJiraInfo();
    //   if (this.createPwStatus.DAI.status===PwStatus.SUCCESS||this.createPwStatus.ODS.status===PwStatus.SUCCESS) {
    //     this.visible = true;
    //   }
    // } else {
    //   this.createAdLoading = false;
    // }
  }

  private checkAdCanBeCheck(data: ComplateJiraInfoTypeArr) {
    let flag = true;
    data.map(item => {
      if (item.title&&(item.title.indexOf('A/D (ODSDAI)') > -1 || item.title.indexOf('A/D (DAI)') > -1)) {
        if (item.status&&(item.status==='To Do')) {
          flag = false;
        }
      }
    });
    this.banCreateAd = flag;
  }

  private async getComplateJiraInfo() {
    const { ticketNumber,  jiraName } = this;
    const res = await getCompletedJiraTicket({ jiraSummary: jiraName, issueNum: ticketNumber });
    if (res!=='False') {
      this.secondaryCreation = true;
      this.sopData = res.Sop;
      this.accessData =res.Access;
      this.checkAdCanBeCheck(this.accessData);
    }
  }
}

</script>
<style lang="scss" >
    .employee-content{
      height: 100%;
      margin-left: 40px;
      font-family: HelveticaNeue;
      position: relative;
      font-size: 12px;
      padding-right:34px;
      header{
        cursor: pointer;
      }
      .confluence-lable{
        word-wrap: break-word;
      }
      .content-phase{
        width: 650px;
        .ant-tabs-nav .ant-tabs-tab{
          padding: 0px 25px!important;
          margin: unset;
          text-align: center;
          width: 100px;
        }
        .ant-tabs-ink-bar{
          background-color: unset;
        }
        .ant-tabs-bar{
          margin-bottom: 5px;
        }
        .ant-tabs-nav-scroll{
          background: #F7F7F7;
          height: 23px;
        }
        .ant-tabs-tab{
          height: 23px;
          line-height: 23px;
        }
        .ant-tabs-tab-active{
          background: #3B4859;
          color: #fff;
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
        min-height: 230px;
        line-height: 30px;
        .template-exit{
          margin-left: 10px;
          color: rgb(230, 29, 29);
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
        margin-bottom: 20px;
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