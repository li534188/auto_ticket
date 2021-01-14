<template>
  <div class="sloid">
    <header>
      <div class="sloid-title">
        <span style="margin-right:10px">Pending HR Issue</span>
        <redo-outlined @click="reloadData" data-test="reloadButton" class="go" :style="{transform:'rotateZ('+deg*360+'deg)'}" />
      </div>
      <div class="sloid-divider"/>
    </header>
    <section class="list-wrapper">
      <a-list item-layout="horizontal" :data-source="hrIssueList">
        <template v-slot:renderItem="{ item }">
          <a-list-item  :class="['list-item-devider', {'active': item.issue_number === activeKey}]">
            <div @click="changeHrissueNumber(item.issue_number)" class="list-item-meta">
              <div class="info">
                <div class="title">{{item.name}}</div>
                <div class="detail">{{`Start Date: ${item.start_date}`}}</div>
              </div>
              <div class="icon">
                <check-circle-outlined :style="{color:item.priority?'green':''}"/>
              </div>
            </div>
          </a-list-item>
        </template>
      </a-list>
    </section>
  </div>
</template>
<script lang="ts">
import { Options, Vue, } from 'vue-class-component';
import { RedoOutlined, CheckCircleOutlined } from '@ant-design/icons-vue';
import { HRIssueModule } from '@/store/modules/hrissue';
import { Watch } from 'vue-property-decorator';
@Options({
  components: {
    RedoOutlined,
    CheckCircleOutlined
  },
})
export default class EmployeeHeader extends Vue {

  private activeKey!: string;

  private deg = 0;

  data() {
    return {
      activeKey: '0'
    };
  }

  mounted() {
    const { employeeInfo, } = HRIssueModule;
    this.activeKey = employeeInfo.issue_number;
  }

  private changeHrissueNumber(issueNumber: string) {
    console.log('fffffffff');
    this.activeKey = issueNumber;
  }

  private reloadData() {
    HRIssueModule.asyncGetIssueList();
    this.deg++;
  }

  get hrIssueList() {
    const { hrIssueList, } = HRIssueModule;
    const isSelect =  hrIssueList.every(item => {
      return item.issue_number !== this.activeKey;
    });
    if (isSelect && hrIssueList.length > 0) {
      this.activeKey = hrIssueList[0].issue_number;
    }
    return hrIssueList;
  }



  @Watch('activeKey')
  private changeActiveKey(val: string) {
    const { hrIssueList } = HRIssueModule;
    const selectInfo = hrIssueList.filter(item => item.issue_number === val);
    if (selectInfo.length > 0) {
      HRIssueModule.asyncGetEmployeeInfo(selectInfo[0] as any);
    }
  }

}
</script>
<style lang="scss" scoped>
    .sloid{
      width: 100%;
      padding: 0 10px;
      height: 85%;
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
      border-bottom: 1px solid #5d656f!important;
      height: 50px;
      &.active{
        background-image: linear-gradient(90deg, #e4e6e6 70%,  #f5f7f7 100%);
      }
      &:hover{
        background-color: #f5f7f7;
      }
    }
    .list-item-meta{
      padding: 0 18px 0 22px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      .info{
        .title{
          font-weight: 500;
          font-size: 13px;
          color: #5d656f;
        }
        .detail{
          color: #5d656f;
          opacity: 0.3;
          max-width: 12rem;
          word-break: break-all;
          font-size: 12px;
        }
      }
      .icon{
        color: #ced0d3;
      }
    }
    .go{
      transition: all 2s;
    }
</style>