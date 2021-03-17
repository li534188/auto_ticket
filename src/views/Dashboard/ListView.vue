<template>
  <div class="list-view-wrapper">
    <div class="list-header">
      <a-input class="jira-template-search" v-model:value="searchInput" @change="searchList" placeholder="Choose a Jira Checklist Item">
        <template #prefix> <search-outlined /></template>
      </a-input>
      <a-button @click="jumpToDetail" class="auto-button create-button">Create New Template</a-button>
    </div>
    <!-- :filterData="filterData" -->
    <!-- :changeSearchValue="changeSearchValue" -->
    <!-- :reverseData="reverseData" -->
    <auto-table
      :showLoading="showLoading"
      :colums="colums"
      v-model:table-data="pagingTableData"
      :tableStyle="tablestyle"
      v-model:selectIds="selectIds"
      :showChekbox="true"
      :showLine="true"
    >
      <template #company="{ text }">
        <span  :class="['company-color', text]">{{text}}</span>
      </template>
      <template #created_time="{ text }">
        <span >{{formatTime(text)}}</span>
      </template>
      <template #sort_new_company >
        <Filter
          :filterData="companyFilterData"
          filterType="company"
          v-model:value="filterData.company"
        />
      </template>
      <template #sort_group>
        <Filter
          :filterData="testGroupList"
          filterType="group"
          v-model:value="filterData.group"
        />
      </template>
    </auto-table>
  </div>
</template>
<script lang="ts">
import { Options, Vue, } from 'vue-class-component';
import { AutoTable } from '@/components';
import moment from 'moment';
import { Filter } from '@/components';
import { TemplateModule } from '@/store/modules/template';
import { Watch } from 'vue-property-decorator';
// import { Watch } from 'vue-property-decorator';

// import {
//   PieChartOutlined,
//   SettingOutlined
// } from '@ant-design/icons-vue';
@Options({
  components: {
    AutoTable,
    Filter
  },
})
export default class ListView extends Vue {
    private showLoading = false;
    private currentPage = 0;
    private selectIds: string[] = [];
    private filterData: {company: string[];group: string[]} = {
      company: [],
      group: []
    }
    private colums =   [
      {
        title: 'Item Name',
        dataIndex: 'name',
        width: '170px',
        showText: false,
        showSort: false,
      }, {
        title: 'Company',
        dataIndex: 'new_company',
        width: '100px',
        showText: true,
        showFilter: true,
        sortMethod: (a: any, b: any) => {
          return a.company < b.company;
        }
      }, {
        title: 'Recurrence',
        dataIndex: 'recurrence',
        width: '100px',
        showSort: false,
        showFilter: false,
      }, {
        title: 'Group',
        dataIndex: 'group',
        width: '100px',
        showSort: false,
        showFilter: true,
      }, {
        title: 'Creator',
        dataIndex: 'creator',
        width: '100px',
        showSort: false,
        showFilter: false,
      }, {
        title: 'Created Time',
        dataIndex: 'created_time',
        width: '110px',
        showSort: true,
        showText: true,
        sortMethod: '',
      },
    ];
    private tableDatas=[{
      created_time: '2020-11-11 10:00:00',
      creator: 'test',
      group: 'group1',
      recurrence: '0 0 1/2 * *',
      new_company: 'Dai',
      name: 'NetSuite Files',
      id: '0'
    }, {
      created_time: '2020-11-11 10:00:00',
      creator: 'test',
      group: 'group2',
      recurrence: '0 0 1/2 * *',
      new_company: 'Dai',
      name: 'NetSuite Files',
      id: '1'
    }]

    private  tablestyle= {
      width: '606px',
      height: '585px',
    }

    get pagingTableData() {
      if (this.tableDatas.length>0) {
        if (this.tableDatas.length < 20) {
          return this.tableDatas;
        } else if (this.tableDatas.length >= this.currentPage * 20) {
          return this.tableDatas.slice(this.currentPage===1?0: (this.currentPage-1)*20, this.currentPage * 20);
        } else if (this.tableDatas.length < this.currentPage * 20) {
          return this.tableDatas.slice(this.currentPage===1?0: (this.currentPage-1)*20, this.tableDatas.length);
        }
      } else {
        return [];
      }
      return this.tableDatas;
    }

    private formatTime(text: string) {
      const res = moment(text).format('YYYY-MM-DD HH:mm:ss');
      return res;
    }

    private testGroupList = ['test', 'pose', 'apple'];

    get companyFilterData() {
      return TemplateModule.companyList;
    }

    @Watch('filterData', { deep: true })
    private filterChange(value: {company: string[];group: string[]}) {
      console.log(value);
    }

}
</script>
<style lang="scss" scoped>
.list-view-wrapper{
    height: 100%;
    width: 100%;
    padding: 50px 0 0 50px;
    .list-header{
        margin-bottom: 35px;
        .create-button{
            height: 15px;
            line-height: 15px;
            margin-left: 5px;
        }
        .jira-template-search{
        width: 563px;
        border-radius: 3px;
        height: 28px;
        line-height: 28px;
    }
    }

}
</style>