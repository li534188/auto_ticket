<template>
  <div>
    <header class="table-header">{{`${type}: ${selectIds.length|0} Tickets`}}</header>
    <div ref="tableWrapper" class="table-wrapper">
      <auto-table
        ref="autoTableRef"
        :showLoading="showLoading"
        :colums="colum"
        v-model:table-data="tableData"
        :showChekbox="true"
        :tableStyle="tableStyle"
        :defaultCheck="true"
        v-model:selectIds="selectIds"
        primaryKey="RealTask"
        specialModal="true"
      >
        <template #summary="{text, item, index}">
          <span v-if="item.specialStatus!=='create'">
            {{text}}
          </span>
          <div v-else>
            <!-- <a-select
            show-search
            placeholder="input search text"
            style="width: 100px"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            @change="handleChange(text, index)"
          >
            <a-select-option v-for="d in datas" :key="d.value">
              {{ d.text }}
            </a-select-option>
          </a-select> -->
            <section class="input-wrapper search-manager-wrapper">
              <div class="search-input" :ref="'searchInput'+index" @click.stop="changeManagerShow(index)" placeholder="Manager">
                <span class="search-place">{{text||type==='Access'?'Add Access Account':'Add SOP'}}</span>
                <DownOutlined :class="['icon-dowload', {'icon-reserve':showManagerPrompt&&activeIndex===index}]" />
              </div>
              <CloseOutlined class="close-icon" @click="clearCreateItem(index)" />
            </section>
          </div>
        </template>
        <template #phase="{text}">
          <span>
            {{getText(text)}}
          </span>
        </template>
        <!-- <template #operation="{index}">
          <span class="icon-wrapper">
            <DeleteFilled @click="deleteData(index)"/>
          </span>
        </template> -->
      </auto-table>
    </div>
    <div class="icon-add" >
      <span class="icon-add-wrpper" data-test="icon-add" @click="addData">
        <PlusOutlined />
        Add More...
      </span>
    </div>
    <div :style="{top:(popPositionY+20)+'px',left:popPositionX+'px'}" v-if="showManagerPrompt" class="modal-prompt-wrapper">
      <a-input class="select-search-input" v-model:value="filterText" placeholder="Search" @click.stop="">
        <template #prefix><SearchOutlined/></template>
      </a-input>
      <div v-if="(filterSelectData&&filterSelectData.length > 0)" class="item-wrapper">
        <div @click.stop="handleChange(subitem,activeIndex)" :class="['prompt-item', {'added':subitem.status==='added'}]" v-for="(subitem) in filterSelectData" :key="subitem">
          {{subitem.title}}
        </div>
      </div>
      <div v-else class="item-wrapper-none">
        You have already seleted all tickets.
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export enum ModalType {
  Access='Access',
  SOP='SOP'
}
import { Vue, Options } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { DeleteFilled, PlusOutlined, DownOutlined, SearchOutlined, CloseOutlined } from '@ant-design/icons-vue';
import AutoTable from '@/components/AutoTable.vue';
import { ModalDataObj } from './EmployeeModal.vue';
import { ComplateJiraInfoType, ComplateJiraInfoTypeArr } from './EmployeeContent.vue';
@Options({
  components: {
    DeleteFilled,
    PlusOutlined,
    AutoTable,
    DownOutlined,
    SearchOutlined,
    CloseOutlined
  }
})
export default class EmployeeModalTab extends Vue {
    @Prop({ required: true }) private type!: ModalType;
    @Prop({ required: true }) private modalData!: {};
    @Prop({ required: true }) private selectChangeMethod!: {(value: string[], type: ModalType): void};
    @Prop({ required: true }) private showLoading!: boolean;
    @Prop({ required: true }) private selectData!: ModalDataObj[];
    @Prop({ required: true }) private secondaryCreation!: boolean;
    @Prop({ required: true }) private complateData!: ComplateJiraInfoTypeArr;
    data() {
      return {
        selectIds: '',
        tableData: [],
        showManagerPrompt: false,
        activeIndex: 0,
        filterText: '',
      };
    }

    private value = '';
    private showManagerPrompt!: boolean;
    private tableStyle = {
      width: '410px',
      height: '220px',
    }
    private selectIds: string[] = [];
    private activeIndex!: number;
    private filterText!: string;
    private tableData!: ModalDataObj[];

    private addData() {
      this.tableData.push(
        {
          summary: '',
          usercode: '',
          RealTask: '',
          specialStatus: 'create',
        });
      setTimeout(() => {
        const tableObj = this.$refs.autoTableRef as Vue;
        const wrapperObj = tableObj.$refs.fixedTable as HTMLElement;
        wrapperObj.scrollTop = wrapperObj.scrollHeight;
      }, 100);
    }

    private popPositionX = 0;
    private popPositionY = 0;


    @Watch('modalData', { deep: true })
    private modalDataChange(val: any) {
      if (!this.secondaryCreation) {
        const res = JSON.parse(JSON.stringify(val));
        this.selectIds = res.map((item: { RealTask: string }) => {
          return item.RealTask;
        });
        this.tableData = res;
      } else {
        this.tableData = [];
        this.selectIds = [];
      }
    }

    @Watch('selectIds', { deep: true })
    private change(val: string[]) {
      this.selectChangeMethod(val, this.type);
    }



    private handleChange(item: {title: string;status?: string}, index: number) {
      if (item.status&&item.status==='added') {
        return;
      }
      const data = this.tableData[index];
      data.summary = item.title;
      data.specialStatus = 'modify';
      this.selectData.forEach(element => {
        if (element.summary === item.title) {
          data.RealTask = element.RealTask||'';
          this.selectIds.push(element.RealTask||'');
          if (this.type===ModalType.Access) {
            data.usercode = element.usercode||'';
          }
        }
      });
      this.tableData.splice(index, 1, data);
      setTimeout(() => {
        this.showManagerPrompt = false;
      }, 100);
    }


    private changeManagerShow(index: number) {
      const searchInput = this.$refs['searchInput'+index] as HTMLElement;
      if (searchInput) {
        this.popPositionX = searchInput.getBoundingClientRect().left;
        this.popPositionY = searchInput.getBoundingClientRect().top;
      }
      const searchObj = this.$refs.tableWrapper as HTMLElement;
      this.showManagerPrompt = true;
      this.activeIndex = index;
      setTimeout(() => {
        searchObj.scrollTop = index*32;
      }, 200);
      // const newArr = JSON.parse(JSON.stringify(this.itemList));
      // this.itemList = newArr.filter((item: string) => item.toLowerCase().indexOf(value.toLowerCase())>-1);
      window.addEventListener('click', this.closeMamagerPrompt);
    }

    private closeMamagerPrompt() {
      this.showManagerPrompt = false;
      window.removeEventListener('click', this.closeMamagerPrompt);
    }

    private getText(item: string[]) {
      if (item) {
        return item.join(',');
      }
    }

    private clearCreateItem(idnex: number) {
      this.tableData.splice(idnex, 1);
    }

    get filterSelectData() {
      const { filterText, selectData, secondaryCreation } = this;
      const list = JSON.parse(JSON.stringify(selectData));
      const arr: {title: string; status?: string}[] = [];
      list.map((item: {summary: string}) => {
        const checkRepeat = this.tableData.some((element: ModalDataObj) => {
          return element.summary === item.summary;
        });
        let complateFlag = false;
        if (secondaryCreation) {
          complateFlag = this.complateData.some((element: ComplateJiraInfoType) => {
            const arr = element.title&&element.title.split(':');
            const contrastArr = item.summary&&item.summary.split(':');
            const str = arr.length===2&&arr[1];
            const contraststr = contrastArr.length===2&&contrastArr[1];
            return str === contraststr;
          });
        }

        if (!filterText) {
          if (!checkRepeat&&!complateFlag)
            arr.push({ title: item.summary });
          else {
            arr.push({ title: item.summary, status: 'added' });
          }
        } else  if (filterText && item.summary && item.summary.toLowerCase().indexOf(filterText.toLowerCase()) > -1) {
          if (!checkRepeat&&!complateFlag)
            arr.push({ title: item.summary });
          else {
            arr.push({ title: item.summary, status: 'added' });
          }
        }
      });
      return arr;
    }

    get colum() {
      if (this.type===ModalType.SOP) {
        return  [
          {
            title: 'Ticket Summary',
            dataIndex: 'summary',
            width: '190px',
            showText: true,
            showSort: false,
          }, {
            title: 'Phase',
            dataIndex: 'phase',
            width: '190px',
            showText: true,
            showSort: false,
            showFilter: false,
          },
        ];
      } else {
        return  [
          {
            title: 'Ticket Summary',
            dataIndex: 'summary',
            width: '190px',
            showText: true,
            showSort: false,
          }, {
            title: 'Usercode',
            dataIndex: 'usercode',
            width: '190px',
            showText: false,
            showSort: false,
            showFilter: false,
          },
        ];
      }
    }

}
</script>
<style lang="scss">
    .list-wrapper{
      height: 370px;
      overflow: auto;
    }
    .icon-add{
        border-top: 1px solid #DADADA;
        padding: 10px 0;
        font-size: 11px;
        .icon-add-wrpper{
            cursor: pointer;
        }
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
    .icon-wrapper{
        margin-left: 5px;
    }
    .table-wrapper{
      position: relative;
      height: 250px;
      width: 410px;
      overflow-y: auto;
    }
    .table-header{
      background: #3B4859;
      line-height: 23px;
      text-align: center;
      color: #fff;
      font-size: 13px;
    }
    .search-input{
        border: 1px solid #d9d9d9;
        width: 320px;
        margin-right: 10px;
        height: 18px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        .search-place{
          text-align: center;
          color: #A2A8B0;
          flex: 1;
        }
    }
    .search-manager-wrapper{
      display: flex;
      align-items: center;
      margin-right: unset;
      .close-icon{
        cursor: pointer;
        &:hover{
          color: #5095fc;
        }
      }
    }
    .modal-prompt-wrapper{
        position: fixed;
        width: 350px;
        margin: 1px 0 0;
        padding: 10px 10px;
        border-radius: 3px;
        background-color: #fff;
        z-index: 9;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.188729);
        border-radius: 5px;
        .item-wrapper{
          height: 240px;
          overflow-y: auto;
          padding-left: 15px;
        }
        .item-wrapper-none{
          height: 240px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #A2A8B0;
          font-size: 10px;
        }
        .select-search-input{
          height: 20px;
          line-height: 20px;
          border: 1px solid #DADADA;
          border-radius: 3px;
          outline: unset;
          .ant-input{
            height: 20px;
            line-height: 20px;
            &:focus{
              border: 1px solid #DADADA!important;
              outline: unset;
              box-shadow: unset;
            }
          }
        }
        .prompt-item{
          line-height: 27px;
          color: #3b4859;
          padding-left: 5px;
          font-size: 1rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding-left: 15px;
          &:hover{
            background-color: #f1f5fc;
          }
        }
        .added{
          color: #979797;
        }
      }
    .icon-dowload{
      font-size: 9px;
      transition: all 0.5s;
      transform: rotate(360deg);
      float: right;
      margin-right: 5px;
      transform-origin: center;
    }
    .icon-reserve{
      transform: rotate(180deg);
    }

</style>