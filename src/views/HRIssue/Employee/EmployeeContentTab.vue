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
  <div class="employee-table-wrapper">
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
        <a :href="item.link" rel="noopener" target="_blank" class="ticket gutter">{{text}}</a>
      </template>
      <template #title="{text}">
        <div class="ticket-wrapper">
          <span class="ticket-text unpredictable-length">{{text}}</span>
          <VSwitch :value="pwStatus(text)">
            <template #1>
              <InProcess class="status-icon"/>
            </template>
            <template #2>
              <a-tooltip :trigger="['hover',]" placement="top" overlay-class-name="numeric-input">
                <template  #title>
                  <span>
                    Password:
                  </span>
                  <span :class="[{'copy-password':copyStatus}]">
                    {{getTooltip(text)}}
                  </span>
                  <img @click="copypw(getTooltip(text))" @mousemove="selectStyle" @mouseleave="outStyle" class='copy-image'  src='@/assets/img/Vector.svg'>
                </template>
                <img  class='pass-image'  src='@/assets/img/icons8-key-96.svg'>
              </a-tooltip>
              <CheckCircleOutlined class="status-icon" style="color:#3ACA60"/>
            </template>
            <template #3>
              <a-tooltip :trigger="['hover']" placement="top" overlay-class-name="numeric-input">
                <template  #title>
                  <span>
                    {{ getTooltip(text) }}
                  </span>
                </template>
                <CloseCircleOutlined class="status-icon" style="color:#FA5757" />
              </a-tooltip>
              <span @click="reCreate(text)" class="button-retry">Retry</span>
            </template>
          </VSwitch>
        </div>
      </template>
      <template #status="{ text }">
        <div :class="['base-style', getClass(text)]" :title="text">{{text}}</div>
      </template>
    </auto-table>
  </div>
</template>
<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { LockOutlined, CheckCircleOutlined, CloseCircleOutlined, } from '@ant-design/icons-vue';
import { PwStatusType } from './EmployeeContent.vue';
import InProcess from '@/components/InProcess.vue';
import AutoTable from '@/components/AutoTable.vue';
import VSwitch from '@/components/VSwitch.vue';
import { HRIssueModule } from '@/store/modules/hrissue';
@Options({
  components: {
    LockOutlined,
    CheckCircleOutlined,
    InProcess,
    CloseCircleOutlined,
    AutoTable,
    VSwitch
  }
})
export default class EmployeeContentTab extends Vue {
    @Prop({ required: true }) private popData!: {};
    @Prop({ required: true }) private phase!: string;
    @Prop({ required: true }) private ticketStatus!: string;
    @Prop({ required: false }) private createPwStatus?: PwStatusType;
    private colum =   [
      {
        title: 'Ticket No.',
        dataIndex: 'issueKey',
        width: '120px',
        showText: true,
        showSort: false,
      }, {
        title: 'Ticket Summary',
        dataIndex: 'title',
        width: '180px',
        showText: true,
        showSort: false,
        showFilter: false,
        sortMethod: (a: any, b: any) => {
          return a.company < b.company;
        }
      }, {
        title: 'Usercode',
        dataIndex: 'usercode',
        width: '180px',
        showSort: false,
        showFilter: false,
      }, {
        title: 'Status',
        dataIndex: 'status',
        width: '50px',
        showSort: false,
        showText: true,
      },
    ];
    private tableStyle = {
      width: '600px',
      height: '230px'
    }

    private copyStatus = false;

    private getClass(text: string) {
      const arr = text.split(' ');
      if (arr.length > 1) {
        return arr.join('-');
      } else {
        return text;
      }
    }


    private pwStatus(text: string) {
      if (text&&this.createPwStatus) {
        if (text.indexOf('A/D (ODSDAI)') > -1) {
          return this.createPwStatus.ODS.status;
        } else if (text.indexOf('A/D (DAI)') > -1) {
          return this.createPwStatus.DAI.status;
        }
      }
    }

    private getTooltip(text: string) {
      if (text&&this.createPwStatus) {
        if (text.indexOf('A/D (ODSDAI)') > -1) {
          if (this.createPwStatus.ODS.status===2) {
            return this.createPwStatus.ODS.password;
          } else if (this.createPwStatus.ODS.status===3) {
            return this.createPwStatus.ODS.message;
          }
        } else if (text.indexOf('A/D (DAI)') > -1) {
          if (this.createPwStatus.DAI.status===2) {
            return this.createPwStatus.DAI.password;
          } else if (this.createPwStatus.DAI.status===3) {
            return this.createPwStatus.DAI.message;
          }
        }
      }
    }

    private reCreate(text: string) {
      const { employeeInfo } = HRIssueModule;
      const { extraInfo } =employeeInfo;
      if (text.indexOf('A/D (ODSDAI)') > -1) {
        this.$emit('create-accout', 'ODS');
        if (extraInfo) {
          HRIssueModule.asyncGetEmployeeInfo({ ...employeeInfo,
            extraInfo: {
              ...extraInfo,
              ...{
                ods_error_message: '',
                ods_password: '',
              }
            }
          });
        }
      } else {
        this.$emit('create-accout', 'DAI');
        if (extraInfo) {
          HRIssueModule.asyncGetEmployeeInfo({ ...employeeInfo,
            extraInfo: {
              ...extraInfo,
              ...{
                dai_error_message: '',
                dai_password: '',
              }
            }
          });
        }
      }
    }

    private copypw(text: string) {
      const input = document.createElement('input');   // 直接构建input
      input.value = text;  // 设置内容
      document.body.appendChild(input);    // 添加临时实例
      input.select();   // 选择实例内容
      document.execCommand('Copy');   // 执行复制
      document.body.removeChild(input); // 删除临时实例
    }

    private selectStyle() {
      this.copyStatus = true;
    }

    private outStyle() {
      this.copyStatus = false;
    }
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
    .employee-table-wrapper{
      width: 650px;
      .ticket-wrapper{
        display: flex;
        flex-direction: row;
        align-items: center;
        cursor: pointer;
        .ticket-text{
          display: inline-block;
          max-width: 145px;
          margin-right: 5px;
        }
        .status-icon{
          margin-left: 20px;
        }
        .button-retry{
            display: inline-block;
            margin-left: 5px;
            padding: 1px 3px;
            font-size: 8px;
            line-height: 9px;
            text-align: center;
            color: #F05008;
            border: 1px solid #f1966c ;
          }
      }

    }
    .To-Do{
      background-color: #42526e;
      border-color: #42526e;
    }
    .Access-Granted{
      background-color: #0052cc;
      border-color: #0052cc;
    }
    .Access-Revoked{
      background-color: #00875a;
      border-color: #00875a;
    }
    $colors:(
      (title:To-Do, color:#42526e),
      (title:Access-Granted, color:#0052cc),
      (title:Access-Revoked, color:#00875a),
      (title:Canceled, color:#00875a),
      (title:Reviewed, color:#00875a),
    );
    @each $c in $colors{
      .#{map-get($c, title)}{
        background-color: map-get($c, color);
        border-color: map-get($c, color);
      }
    }
    .base-style{
      color: #fff;
      padding: 1px 3px;
      border-radius: 3px;
      text-align: center;
      height: 15px;
      line-height: 15px;
      cursor: pointer;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .copy-image{
      width: 10px;
      margin-left: 10px;
      cursor: pointer;
    }
    .copy-password{
      background-color: #1e71ee;
    }

</style>