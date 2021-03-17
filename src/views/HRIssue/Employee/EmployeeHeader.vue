<template>
  <div class="sloid">
    <header>
      <div class="sloid-title">
        <span style="margin-right:55px">Pending HR Issue</span>
        <redo-outlined @click="reloadData" data-test="reloadButton" class="go" :style="{transform:'rotateZ('+deg*360+'deg)'}" />
      </div>
      <div class="sloid-divider"/>
    </header>
    <section class="list-wrapper">
      <a-list item-layout="horizontal" :data-source="hrIssueList">
        <template v-slot:renderItem="{ item, index }">
          <a-list-item  :class="['list-item-devider', {'active': item.issue_number === activeKey}]">
            <div @click="changeHrissueNumber(item.issue_number)" class="list-item-meta">
              <div class="title-wrapper">
                <CloseOutlined @click="closeTicket(item.issue_number, index)" class="close-icon"/>
                <div class="info">
                  <a-tooltip :trigger="['hover']" placement="topLeft" overlay-class-name="numeric-input">
                    <template v-if="item&&item.name&&item.name.length>20" #title>
                      <span>
                        {{ item.name }}
                      </span>
                    </template>
                    <div class="title unpredictable-length">{{item.name}}</div>
                  </a-tooltip>
                  <div class="detail">{{`Start Date: ${item.start_date}`}}</div>
                </div>
              </div>
              <div v-if="item.status!=='error'" :class="['ticket-icon',`ticket-icon-${item.status}`]">
              </div>
              <div class='icon-wrapper' v-else>
                <!-- <img class="error-img" src="@/assets/img/icons-error.svg"/> -->
                <WarningFilled class="error-img"/>
              </div>
            </div>
          </a-list-item>
        </template>
      </a-list>
    </section>
  </div>
</template>
<script lang="ts">
interface StatusType
  { issue_num: string;
    status: string;
    dai_error_message: string;
    dai_password: string;
    ods_error_message: string;
    ods_password: string;
  }
import { Options, Vue, } from 'vue-class-component';
import { RedoOutlined, CheckCircleOutlined, CloseOutlined, WarningFilled } from '@ant-design/icons-vue';
import { getIssueStatus, getCloseTicket } from '@/utils/server';
import { HRIssueModule, EmployeeInfoType } from '@/store/modules/hrissue';
import { Watch } from 'vue-property-decorator';
@Options({
  components: {
    RedoOutlined,
    CheckCircleOutlined,
    CloseOutlined,
    WarningFilled
  },
})
export default class EmployeeHeader extends Vue {

  private activeKey!: string;

  private deg = 0;

  private intervalTime = 0;

  private thisStatus!: StatusType[];

  data() {
    return {
      activeKey: '0',
      thisStatus: []
    };
  }

  beforeMount() {
    const { employeeInfo, } = HRIssueModule;
    this.activeKey = employeeInfo.issue_number;
  }

  mounted() {
    this.setInterVal();
    this.reloadData();
  }

  private changeHrissueNumber(issueNumber: string) {
    this.activeKey = issueNumber;
  }

  private async reloadData() {
    await HRIssueModule.asyncGetIssueList();
    await this.getStatus();
    this.deg++;
  }

  private setInterVal() {
    this.getStatus();
    window.clearInterval(this.intervalTime);
    this.intervalTime = window.setInterval(() => {
      this.getStatus();
    }, 20000);
  }

  private getStatus() {
    const { hrIssueList, } = HRIssueModule;
    const param = hrIssueList.map(item => {
      return item.issue_number;
    });
    if (param.length > 0) {
      // getStatsu(param);
      getIssueStatus({ issueNumList: param }).then(res => {
        this.thisStatus = res;
      });
    }
  }

  private closeTicket(issue_number: string, index: number) {
    getCloseTicket({ issueNum: issue_number }).then(item => {
      if (item === 'status changed') {
        const { hrIssueList, } = HRIssueModule;
        const list = JSON.parse(JSON.stringify(hrIssueList)) as EmployeeInfoType[];
        list.splice(index, 1);
        HRIssueModule.changeHrIssueList(list);
      }
    });
  }

  @Watch('thisStatus', { deep: true })
  private thisStatusChange(value: StatusType[]) {
    const { employeeInfo } = HRIssueModule;
    value.map(item => {
      if (item.issue_num===employeeInfo.issue_number) {
        const { dai_error_message, dai_password, ods_error_message, ods_password } = item;
        HRIssueModule.asyncGetEmployeeInfo({ ...employeeInfo, extraInfo: {
          dai_error_message, dai_password, ods_error_message, ods_password
        }});
      }
    });
  }

  get hrIssueList() {
    const { hrIssueList, } = HRIssueModule;
    const isSelect =  hrIssueList.every(item => {
      return item.issue_number !== this.activeKey;
    });
    if (isSelect && hrIssueList.length > 0) {
      this.activeKey = hrIssueList[0].issue_number;
    }
    const res = hrIssueList.map(item => {
      if (this.thisStatus&&this.thisStatus.length>0) {
        this.thisStatus.forEach(subitem => {
          if (item.issue_number===subitem.issue_num) {
            item.status = subitem.status;
            const { dai_error_message, dai_password, ods_error_message, ods_password } = subitem;
            if (dai_error_message||dai_password||ods_error_message||ods_password) {
              item.extraInfo = Object.assign({}, { dai_error_message, dai_password, ods_error_message, ods_password });
            }
          }
        });
      }
      return item;
    });
    return res;
  }



  @Watch('activeKey')
  private changeActiveKey(val: string) {
    const { hrIssueList } = HRIssueModule;
    const selectInfo = hrIssueList.filter(item => item.issue_number === val);
    if (selectInfo.length > 0) {
      HRIssueModule.asyncGetEmployeeInfo(selectInfo[0] as any);
    }
  }

  @Watch('$route')
  private routeChange() {
    window.clearInterval(this.intervalTime);
  }

}
</script>
<style lang="scss" scoped>
    .sloid{
      width: 100%;
      padding: 0 10px;
      height: 700px;
      font-size: 12px;
    }
    .list-wrapper{
      height: 100%;
      overflow-y: auto;
    }
    .sloid-divider{
      width: 100%;
      border-bottom: 1px solid #5d656f;
    }
    .sloid-title{
      font-family: 'HelveticaNeue';
      color: #193542;
      font-weight: bolder;
      height: 55px;
      line-height: 55px;
      text-align: left;
      letter-spacing: 2.4px;
      padding: 0 0px 0 22px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      span:first-child{
        width: 149px;
      }
    }
    .list-item-devider{
      border-bottom: 1px solid #c1c6cc!important;
      height: 50px;
      &.active{
        background: #F2F2F2;
      }
      &:hover{
        background-color: #F2F2F2;
      }
    }
    .list-item-meta{
      padding: 0 15px 0 8px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      transform: rotate(0deg);
      .title-wrapper{
        display: flex;
        align-items: center;
        .close-icon{
          visibility: hidden;
          cursor: pointer;
        }
        &:hover{
          .close-icon{
            visibility: visible;
          }
        }
      }
      .info{
        margin-left: 10px;
        cursor: default;
        .title{
          font-weight: 500;
          font-size: 13px;
          color: #5d656f;
          width: 170px;
        }
        .detail{
          color: #5d656f;
          opacity: 0.3;
          max-width: 12rem;
          word-break: break-all;
          font-size: 12px;
        }
      }

      .ticket-icon{
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: 2px solid #CED0D3;
      }
      .icon-wrapper{
        width: 14px;
        height: 14px;
        .error-img{
          width: 100%;
          height: 100%;
        }
        .error-img{
          font-size: 15px;
          color: red;
        }
      }
      .ticket-icon-in-progress{
        border-top: 2px solid #3ACA60;
        border-right: 2px solid #3ACA60;
        transform: rotate(45deg);
        // animation: myfirst 1.5s linear infinite;
      }

      .ticket-icon-created{
        border: 2px solid #3ACA60;
        display: flex;
        justify-content: center;
        align-items: center;
        &::after{
            display: table;
            border: 2px solid #3ACA60;
            border-top: 0;
            border-left: 0;
            width: 3.8px;
            height: 7px;
            transform: rotate(45deg) scale(1);
            opacity: 1;
            transition: all 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46) 0.1s;
            content: ' ';
        }
      }


      @keyframes myfirst
      {
        0%{-webkit-transform:rotate(0deg);}
        25%{-webkit-transform:rotate(90deg);}
        50%{-webkit-transform:rotate(180deg);}
        75%{-webkit-transform:rotate(270deg);}
        100%{-webkit-transform:rotate(360deg);}
      }

    }
    .go{
      transition: all 2s;
    }
</style>