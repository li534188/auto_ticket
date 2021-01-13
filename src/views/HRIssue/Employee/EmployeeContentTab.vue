<template>
  <!-- <a-list item-layout="horizontal" class="list-wrapper" :data-source="popData">
    <template v-slot:renderItem="{ item }">
      <a-list-item  class="list-item-devider">
        <div class="list-item-meta">
          <div>
            <img class="img-style" v-if="phase==='sop'" src="@/assets/img/viewavatar.svg">
            <img class="img-style" v-else src="@/assets/img/issue-type-icons.svg">
            <a :href="item.link" target="_blank" class="ticket gutter">{{item.issueKey}}</a>
            <span class="title gutter">{{item.title}}</span>
            <span class="title gutter">{{item.usercode}}</span>
            <span v-show="false" class="status gutter">
              <span v-if="item.status">
                <check-circle-outlined  style="color:green"/>
              </span>
              <span v-else-if="!item.status">
                <close-circle-outlined style="color:red" />
                <span class="status-err">Retry</span>
              </span>
              <span v-else-if="item.title.length < 0">
                <in-process />
              </span>
            </span>
          </div>
          <div :class="['option',item.status]">
            {{item.status}}
          </div>
        </div>
      </a-list-item>
    </template>
  </a-list> -->
  <div class="table-wrapper">
    <auto-table
      :showLoading="false"
      :tableStyle="tableStyle"
      :colums="colum"
      v-model:table-data="popData"
      :showChekbox="false"
    >
      <template #issueKey="{  text, item }">
        <img class="img-style" v-if="phase==='sop'" src="@/assets/img/viewavatar.svg">
        <img class="img-style" v-else src="@/assets/img/issue-type-icons.svg">
        <a :href="item.link" target="_blank" class="ticket gutter">{{text}}</a>
      </template>
    </auto-table>
  </div>
</template>
<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { LockOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons-vue';
import InProcess from '@/components/InProcess.vue';
import AutoTable from '@/components/AutoTable.vue';
@Options({
  components: {
    LockOutlined,
    CheckCircleOutlined,
    InProcess,
    CloseCircleOutlined,
    AutoTable
  }
})
export default class EmployeeContentTab extends Vue {
    @Prop({ required: true }) private popData!: {};
    @Prop({ required: true }) private phase!: string;
    private colum =   [
      {
        title: 'issueKey',
        dataIndex: 'issueKey',
        width: '130px',
        showText: true,
        showSort: false,
      }, {
        title: 'title',
        dataIndex: 'title',
        width: '100px',
        showText: false,
        showSort: false,
        showFilter: false,
        sortMethod: (a: any, b: any) => {
          return a.company < b.company;
        }
      }, {
        title: 'usercode',
        dataIndex: 'usercode',
        width: '100px',
        showSort: false,
        showFilter: false,
      }, {
        title: 'Creator',
        dataIndex: 'creator',
        width: '100px',
        showSort: false,
      }, {
        title: 'status',
        dataIndex: 'status',
        width: '80px',
        showSort: false,
        showText: false,
      },
    ];
}
</script>
<style lang="scss" scoped>
    .list-wrapper{
      height: 370px;
      overflow: auto;
    }
    .img-style{
             margin-right:5px;
           }
    .list-item-devider{
        font-size: 11px;
        .list-item-meta{
           width: 100%;
           display: flex;
           justify-content: space-between;
        }
        .gutter{
            margin-right: 10px;
        }
        .ticket{
            color: #2063d1;
        }
        .title{
            color: #000000;
        }
        .status-err{
            border: 1px solid #f05008;
            color:  #f05008;
            margin-left: 10px;
            border-radius: 2px;
            padding: 0 2px;
            font-size: 0.75rem;
        }
        .option{
            float: right;
            border-radius: 2px;
            padding: 2px 5px;
            &.process{
                box-shadow: 2px 2px 2px 0 rgba(180, 205, 199, 0.4);
                background-color: #E0ECFF;
                color: #124EAA;
            }
            &.open{
                background-color: #42526E;
                color: #F4F5F7;
            }
            &:hover{
                background-color:#5095fc;
            }
        }
    }
    .table-wrapper{
      height: 330px;
      width: 512px;
      overflow-y: scroll;
    }

</style>