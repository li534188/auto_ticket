<template>
  <div class="sloid">
    <header>
      <div class="sloid-title">
        <span style="margin-right:5px">pending hr issue</span>
        <redo-outlined />
      </div>
      <div class="sloid-divider"/>
    </header>
    <section>
      <a-list item-layout="horizontal" :data-source="hrIssueList">
        <template v-slot:renderItem="{ item }">
          <a-list-item  :class="['list-item-devider', {'active': item.issue_number === activeKey}]">
            <div @click="changeHrissueNumber(item.issue_number)" class="list-item-meta">
              <div class="info">
                <div class="title">{{item.name}}</div>
                <div class="detail">{{`Start Date: ${item.time}`}}</div>
              </div>
              <div class="icon">
                <check-circle-outlined :style="{color:item.priority?'':'green'}"/>
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
@Options({
  components: {
    RedoOutlined,
    CheckCircleOutlined
  },
})
export default class EmployeeHeader extends Vue {

  private activeKey = '0';
  mounted() {
    HRIssueModule.asyncGetIssueList();
  }
  get hrIssueList() {
    const { hrIssueList } = HRIssueModule;
    const isSelect =  hrIssueList.every(item => {
      return item.issue_number !== this.activeKey;
    });
    console.log(isSelect, hrIssueList, this.activeKey);
    if (isSelect && hrIssueList.length > 0) {
      this.activeKey = hrIssueList[0].issue_number;
    }
    return hrIssueList;
  }

  private changeHrissueNumber(issueNumber: string) {
    this.activeKey = issueNumber;
  }
}
</script>
<style lang="scss" scoped>
    .sloid{
      width: 100%;
      padding: 0 20px;
    }

    .sloid-divider{
      width: 100%;
      border-bottom: 1px solid #5d656f;
    }
    .sloid-title{
      color: #193542;
      font-weight: bold;
      font-size: 1rem;
      height: 3rem;
      line-height: 3rem;
      text-align: left;
      letter-spacing: 2.4px;
      padding: 0 20px;
      .title-icon{
        width: 12px;
      }
    }
    .list-item-devider{
      border-bottom: 1px solid #5d656f!important;
      &.active{
        background-image: linear-gradient(to right,#e4e6e6, #f5f7f7);
      }
    }
    .list-item-meta{
      padding: 0 20px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      .info{
        .title{
          font-size: 0.85rem;
          font-weight: 700;
          color: #5d656f;
        }
        .detail{
          color: #5d656f;
          font-size: 0.8rem;
          max-width: 12rem;
          word-break: break-all;
        }
      }
      .icon{
        font-size: 20px;
        color: #ced0d3;
      }
    }
</style>