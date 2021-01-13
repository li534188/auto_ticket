<template>
  <div>
    <header class="table-header">{{`${type}: ${tableData.length|0} Tickets`}}</header>
    <div ref="tableWrapper" class="table-wrapper">
      <auto-table
        :showLoading="showLoading"
        :colums="colum"
        v-model:table-data="tableData"
        :showChekbox="true"
        :tableStyle="tableStyle"
        defaultCheck="true"
        v-model:selectIds="selectIds"
        primaryKey="RealTask"
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
              <div class="search-input" ref="searchInput" @click.stop="changeManagerShow(index)" placeholder="Manager">
                <span>{{text}}</span>
                <DownOutlined :class="['icon-dowload', {'icon-reserve':showManagerPrompt&&activeIndex===index}]" />
              </div>
              <div :style="{top:(((activeIndex+1)*27+25)+'px')}" v-if="showManagerPrompt" class="prompt-wrapper">
                <a-input class="select-search-input" v-model:value="filterText" placeholder="Basic usage" @click.stop="">
                  <template #prefix><SearchOutlined/></template>
                </a-input>
                <div @click.stop="handleChange(subitem,activeIndex)" class="prompt-item" v-for="(subitem) in filterSelectData" :key="subitem">
                  {{subitem}}
                </div>
              </div>
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
      <span class="icon-add-wrpper" @click="addData">
        <PlusOutlined />
        Add More...
      </span>
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
    @Prop({ required: true }) private popData!: {};
    @Prop({ required: true }) private type!: ModalType;
    @Prop({ required: true }) private modalData!: {};
    @Prop({ required: true }) private selectChangeMethod!: {(value: string[], type: ModalType): void};
    @Prop({ required: true }) private showLoading!: boolean;
    @Prop({ required: true }) private selectData!: ModalDataObj[];
    private value = '';
    private showManagerPrompt = false;
    private tableStyle = {
      width: '410px',
    }
    private selectIds: string[] = [];
    private activeIndex = 0;
    private filterText = ''
    private datas=[{
      text: '123',
      value: '132'
    }]

    private tableData: ModalDataObj[] = [];

    private addData() {
      this.tableData.push(
        {
          summary: '',
          usercode: '',
          RealTask: '',
          specialStatus: 'create',
        });
    }

    private changeData(index: number,) {
      this.tableData.splice(index, 1);
    }


    @Watch('modalData', { deep: true })
    private modalDataChange(val: any) {
      const res = JSON.parse(JSON.stringify(val));
      this.tableData = res;
    }

    @Watch('selectIds', { deep: true })
    private change(val: string[]) {
      this.selectChangeMethod(val, this.type);
    }


    private deleteData(index: number) {
      console.log(index);
      this.tableData.splice(index, 1);
      console.log(this.tableData);
    //   this.tableData.push({ issueKey: 'test',
    //     title: 'test',
    //     operation: 'delete',
    //     status: 'create'
    //   });
    }

    private handleChange(text: string, index: number) {
      const data = this.tableData[index];
      data.summary = text;
      data.specialStatus = 'modify';
      this.selectData.forEach(element => {
        if (element.summary === text) {
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

      const searchObj = this.$refs.tableWrapper as HTMLElement;
      this.showManagerPrompt = true;
      this.activeIndex = index;
      console.log(searchObj.scrollTop);
      setTimeout(() => {
        searchObj.scrollTop = index*27;
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

    get filterSelectData() {
      const { filterText, selectData } = this;
      const list = JSON.parse(JSON.stringify(selectData));
      return list.map((item: {summary: string}) => {
        const checkRepeat = this.tableData.some((element: ModalDataObj) => {
          return element.summary === item.summary;
        });
        if (!filterText) {
          if (!checkRepeat)
            return item.summary;
        } else  if (filterText && item.summary && item.summary.toLowerCase().indexOf(filterText.toLowerCase()) > -1) {
          if (!checkRepeat)
            return item.summary;
        }
      });

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
        width: 350px;
        height: 18px;
        line-height: 18px;
    }
    .search-manager-wrapper{
      width: 122px;
      margin-right: unset;
      .prompt-wrapper{
        position: absolute;
        width: 350px;
        height: 158px;
        margin: 1px 0 0;
        padding: 0 0 1px;
        border-radius: 3px;
        overflow: scroll;
        background-color: #fff;
        z-index: 9;
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
      }
    }
    .icon-dowload{
      font-size: 13px;
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