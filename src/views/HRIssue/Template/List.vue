<template>
  <div class="template-list-wrapper">
    <div class="template-title">
      <a-input class="template-search" v-model:value="searchInput" @change="searchList" placeholder="Search">
        <template #prefix> <search-outlined /></template>
      </a-input>
      <a-button @click="jumpToDetail" class="auto-button create-button">Create New Template</a-button>
    </div>
    <div  class="table-wrapper">
      <auto-table
        :showLoading="showLoading"
        :colums="colum"
        v-model:table-data="filterTableData"
        :tableStyle="tablestyle"
        v-model:selectIds="selectIds"
        :showChekbox="true"
        :showLine="true"
        :reverseData="reverseData"
      >
        <template #job_title="{  text, item }">
          <a @click="openTemplate(text, item)" class="ticket-name">{{text}}</a>
        </template>
        <template #company="{ text }">
          <span  :class="['company-color', text]">{{text}}</span>
        </template>
        <template #created_time="{ text }">
          <span >{{formatTime(text)}}</span>
        </template>
        <template #sort_company >
          <Filter
            :filterData="filterData.company"
            filterType="company"
            v-model:value="filterSelectData.company"
          />
        </template>
        <template #sort_manager >
          <Filter
            :filterData="filterData.manager"
            v-model:value="filterSelectData.manager"
          />
        </template>
      </auto-table>
    </div>
    <div class="bottom-button">
      <a-pagination size="small" :defaultPageSize="20" :total="tableDatas&&tableDatas.length" v-model:current="currentPage" />
      <a-button v-if="selectIds&&selectIds.length > 0" @click="showConfirm" class="auto-button delete-button">Delete</a-button>
    </div>
  </div>

</template>

<script lang="ts">

interface FormatCompany{
  title?: string;
  context?: string;
}
import { Options, Vue, } from 'vue-class-component';
import { SearchOutlined, LeftOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import moment from 'moment';
import { Filter, AutoTable } from '@/components';
import Sop from './Sop.vue';
import { searchTemplate, deleteTemplate } from '@/utils/server';
import Access from './Access.vue';
import { TemplateModule } from '@/store/modules/template';
import * as _ from 'lodash';
import { Modal } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { Watch } from 'vue-property-decorator';
@Options({
  components: {
    Sop,
    Access,
    SearchOutlined,
    LeftOutlined,
    AutoTable,
    LoadingOutlined,
    Filter
  },
})
export default class TemplateList extends Vue {


    // data
    private tablestyle= {
      width: '950px',
      height: '585px',
    }
    private selectIds: string[] = [];
    private companyList: string[] = [];
    private managerList = [];
    private searchInput = '';
    private currentPage = 1;
    private showLoading = false;
    private tableDatas = [];
    private sortStatus = false;
    private colum =   [
      {
        title: 'Template Name',
        dataIndex: 'job_title',
        width: '220px',
        showText: true,
        showSort: false,
      }, {
        title: 'Company',
        dataIndex: 'company',
        width: '250px',
        showText: true,
        showSort: false,
        showFilter: true,
        sortMethod: (a: any, b: any) => {
          return a.company < b.company;
        }
      }, {
        title: 'Manager',
        dataIndex: 'manager',
        width: '150px',
        showSort: false,
        showFilter: true,
      }, {
        title: 'Creator',
        dataIndex: 'creator',
        width: '180px',
        showSort: false,
      }, {
        title: 'Created Time',
        dataIndex: 'created_time',
        width: '200px',
        showSort: true,
        showText: true,
        sortMethod: '',
      },
    ];

    private filterSelectData = {
      company: [],
      manager: []
    }

    // hooks
    mounted() {
      this.getTemplateData({ jobTitle: '', manager: '', company: '' });
    }

    get filterData()  {
      return {
        company: TemplateModule.companyList,
        manager: TemplateModule.managerList,
      };
    }

    get filterTableData() {
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


    private openTemplate(text: string, item: {id: string; company: string; job_title: string; manager: string}) {
      const { id, company, job_title, manager } = item;
      this.$router.push({ path: '/hrissue/template/detail/edit', query: { templateId: id, company, job_title, manager  }});
    }

    @Watch('filterSelectData', { deep: true })
    private searchDataByFilter(value: {company: string[];manager: string[]}) {
      const manager = value.manager&&value.manager.join('|');
      const company = value.company&&value.company.join('|');
      this.getTemplateData({ jobTitle: this.searchInput, manager: manager||'', company: company||'' });
    }

    private jumpToDetail() {
      this.$router.push({ path: '/hrissue/template/detail/create', query: { templateName: this.searchInput }});
    }

    private searchList =  _.debounce(() => {
      const manager = this.filterSelectData.manager&&this.filterSelectData.manager.join('|');
      const company = this.filterSelectData.company&&this.filterSelectData.company.join('|');
      this.getTemplateData({ jobTitle: this.searchInput, manager, company });
    }, 500);

    private getTemplateData(data: { jobTitle: string; manager: string; company: string }) {
      const { jobTitle, manager, company } = data;
      this.showLoading = true;
      searchTemplate({ jobTitle, manager, company }).then((res) => {
        this.showLoading = false;
        if (this.sortStatus&&res.length> 0) {
          res.reverse();
        }
        this.tableDatas = res;
      });
    }

    private formatTime(text: string) {
      const res = moment(text).format('YYYY-MM-DD HH:mm:ss');
      return res;
    }

    private showConfirm() {
      Modal.confirm({
        title: 'Do you want to delete these items?',
        onOk: () => {
          if (this.selectIds.length>0) {
            this.showLoading = true;
            const res  = this.selectIds.reduce((pre: string, cur: string) => {
              return `${pre},${cur}`;
            });
            const result = deleteTemplate({ templateId: res });
            result.then(data => {
              this.showLoading = false;
              if (data === 'Template Deleted') {
                message.info('Templates  Deleted!');
              } else {
                message.info('Failed To Deleted!');
              }
              this.selectIds = [];
              const manager = this.filterSelectData.manager&&this.filterSelectData.manager.join('|');
              const company = this.filterSelectData.company&&this.filterSelectData.company.join('|');
              this.getTemplateData({ jobTitle: this.searchInput, manager, company });
            });
          }

        },
      });
    }
    private reverseData(sortStatus: boolean) {
      this.sortStatus = sortStatus;
      const res = JSON.parse(JSON.stringify(this.tableDatas));
      res.reverse();
      this.tableDatas = res;
    }


}
</script>


<style lang="scss" scoped>
    .template-list-wrapper{
        padding: 40px 30px 0 30px;
    }
    .template-search{
        width: 80%;
        border-radius: 3px;
        height: 28px;
        line-height: 28px;
    }
    .delete-button{
      height: 15px;
    }
    .template-title{
      display: flex;
      align-items: center;
      justify-content: space-around;
        margin-bottom: 35px;
        .create-button{
            height: 15px;
            line-height: 15px;
            margin-left: 5px;
        }
    }
    .template-list-table{
        .ant-table-thead > tr > th, .ant-table-tbody > tr > td{
            padding: unset!important;
        }
    }
    .bottom-button{
      display: flex;
      justify-content: space-between;
      flex-direction: row-reverse;
      margin-right: 75px;
      margin-top: 60px;
    }
    .table-wrapper{
      height: 585px;
      width: 100%;
      overflow: hidden;
    }
</style>
