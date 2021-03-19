<template>
  <div>
    <div>
      <table  class="auto-table"  :style="{width:(tableStyle&&tableStyle.width)}">
        <colgroup>
          <col v-show="showChekbox" style="width:30px;" />
          <col :style="{width:item.width}" v-for="(item) in colums" :key="item.dataIndex" />
        </colgroup>
        <thead>
          <tr :class="['tr-style','tr-header',{'show-line':showLine}, {'show-underline':specialModal}]">
            <th v-show="showChekbox" style="width:30px">
              <a-checkbox class="special-box" v-model:checked="allCheckStatus" @change="selectAll($event)"  value="all"/>
            </th>
            <th :style="{width:item.width}" class="th-title" v-for="(item) in colums" :key="item.dataIndex">
              <!-- <a-tooltip :trigger="['hover']" placement="topLeft" overlay-class-name="numeric-input">
                <template v-if="chooseListStr[item.dataIndex]" #title>
                  <span class="numeric-input-title">
                    {{ chooseListStr[item.dataIndex] }}
                  </span>
                </template>
                <span>{{item.title}}</span>
              </a-tooltip> -->
              <span>{{item.title}}</span>
              <down-outlined v-if="item.showSort" @click="sortData(item.sortMethod)"  :class="['th-icon',{'reverse':sortStatus}]" />
              <span v-if="item.showFilter">
                <slot :name="'sort_'+item.dataIndex" :key="item.dataIndex" />
              </span>
            </th>
          </tr>
        </thead>
      </table>
    </div>
    <div class="fixed-table-wrapper" ref="fixedTable" :style="{height:(tableStyle&&tableStyle.height)}">
      <table class="auto-table"  :style="{width:(tableStyle&&tableStyle.width)}">
        <colgroup>
          <col v-show="showChekbox" style="width:30px;" />
          <col :style="{width:item.width}" v-for="(item) in colums" :key="item.dataIndex" />
        </colgroup>
        <div class="spin-wrapper">
          <a-spin :spinning='showLoading'>
            <template v-slot:indicator>
              <loading-outlined style="font-size: 35px" spin />
            </template>
          </a-spin>
          <div class="empty-info" v-if="thisTableData&&thisTableData.length===0&&!showLoading">No Data</div>
        </div>
        <tbody v-show="!showLoading">
          <tr  :class="['tr-style','tr-body',{'show-line':showLine}, {'tr-checked':itemInArr(item[primaryKey]||item.id)}, {'special-tr':specialModal}, {'special-tr-checked':specialModal&&itemInArr(item[primaryKey]||item.id)}]" v-for="(item,index)  in thisTableData" :key="item[primaryKey]">
            <td v-show="showChekbox">
              <a-checkbox class="special-box" :checked="itemInArr(item[primaryKey]||item.id)"  @change="selectOne($event)" :value="item[primaryKey]||item.id"/>
            </td>
            <td :colspan="item.specialStatus==='create'?2:1" class="td-style" v-for="tableItem in tableStructure" :key="tableItem.dataIndex">
              <div class="td-text" :title="item[tableItem.dataIndex]" v-if="!tableItem.showText">{{item[tableItem.dataIndex]}}</div>
              <div v-else class="td-text">
                <slot :name="tableItem.dataIndex" :item="item" :key="tableItem.dataIndex" :index="index" :text="item[tableItem.dataIndex]" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script lang="ts">
interface ColumsType {
    title: string;
    showSort: boolean;
    dataIndex: string;
    showText: boolean;
}
interface ChooseListObject{
  [key: string]: string[];
}
import { Vue, Options } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { DownOutlined, FilterOutlined, SearchOutlined, CloseCircleFilled, LoadingOutlined, UpOutlined } from '@ant-design/icons-vue';
@Options({
  components: {
    DownOutlined,
    FilterOutlined,
    SearchOutlined,
    CloseCircleFilled,
    LoadingOutlined,
    UpOutlined
  },
})
export default class AutoTable extends Vue {
    @Prop({ required: true }) private colums!: ColumsType[]
    // 所有数据
    @Prop({ required: true }) private tableData!: any[]
    @Prop({ required: true }) private tableStyle!: {}
    // loading
    @Prop() private showLoading!: {};

    @Prop() private showChekbox!: boolean;

    @Prop() private showLine!: boolean;
    // 默认选中
    @Prop() private defaultCheck!: boolean;
    // 主键
    @Prop() private primaryKey!: string;
    // EmployeeModal use
    @Prop() private specialModal!: boolean;
    @Prop() private selectIds!: string[];
    @Prop() private reverseData!: {(status: boolean): void};
    private thisSelectIds: string[] = [];
    private thisTableData: any[] = [];
    private allCheckStatus = false;
    private sortStatus = false;
    private mySortMethod!: {(paramA: any, paramB: any): any[]};
    mounted() {
      this.initData();
      this.defaultCheck&&(this.allCheckStatus = true);
    }

    initData() {
      this.thisTableData = this.tableData;
      this.allCheckStatus = false;
      if (this.defaultCheck) {
        // 12
        this.allCheckStatus = true;
      } else {
        this.thisSelectIds = [];
      }
    }


    @Watch('tableData', { deep: true })
    private setTableData() {
      this.initData();
    }

    get tableStructure() {
      const structure: {dataIndex: string;showText: boolean}[] = [];
      this.colums.map(item => {
        structure.push({ dataIndex: item.dataIndex, showText: item.showText });
      });
      return structure;
    }

    private sortData(method: {(paramA: any, paramB: any): any[]}, callByinit = false) {
      if (!method) {
        !callByinit&&(this.sortStatus = !this.sortStatus);
        this.reverseData(this.sortStatus);
        return;
      }
      this.mySortMethod = method;
      !callByinit&&(this.sortStatus = !this.sortStatus);
      const newData = JSON.parse(JSON.stringify(this.tableData));
      if (this.sortStatus) {
        const res = this.sort(newData, method,);
        this.thisTableData = res;
      } else {
        this.thisTableData = newData;
      }

    }

    // 采用冒泡排序和传递的方法进行排序
    private sort(element: any[], method: any,) {
      for (let i = 0; i<element.length-1; i++) {
        for (let j = 0; j<element.length-i-1; j++) {
          if (!method(element[j], element[j+1])) {
            const swap = element[j];
            element[j] = element[j+1];
            element[j+1] = swap;
          }
        }
      }
      return element;
    }

    private selectAll(e: any) {
      const { target: { checked }} = e;
      if (checked) {
        const selectIds: string[] = [];
        this.tableData.map(item => {
          const res = item[this.primaryKey]||item.id;
          if (res) {
            selectIds.push(res);
          }
        });
        this.thisSelectIds = selectIds;
      } else {
        this.thisSelectIds = [];
      }
    }

    private selectOne(e: any) {
      const { target: { checked, value }} = e;
      this.allCheckStatus = false;
      if (!value) {
        return;
      }
      if (checked) {
        const arr = JSON.parse(JSON.stringify(this.thisSelectIds));
        arr.push(value);
        this.thisSelectIds = arr;
      } else {
        const arr = this.thisSelectIds.filter(item => {
          return item !== value;
        });
        this.thisSelectIds = arr;
      }
    }

    @Watch('thisSelectIds')
    private whenSelectChange(value: any[]) {
      this.$emit('update:selectIds', value);
    }

    @Watch('selectIds')
    private whenSelChange(value: any[]) {
      this.thisSelectIds = value;
    }

    @Watch('sortStatus')
    private sortStatusChange(value: string) {
      if (!value) {
        this.thisTableData = this.tableData;
      }
    }

    private itemInArr(value: string) {
      return this.thisSelectIds.some(item => item === value);
    }

  // method
  // private checkedValue(value: string[]) {
  //   const index = this.showFilterSearch;
  //   this.mateFilterData();
  //   const deepFilter: {[key: string]: any[]} = JSON.parse(JSON.stringify(this.tableFilterData));
  //   // 将已经选中的数据排除出去然后两个数组进行拼接
  //   const selectArr: any[] = [];
  //   const resolveArr = deepFilter[index].filter(item => {
  //     return !value.some(subitem => {
  //       if (subitem === item||(subitem === (item&&item.value))) {
  //         selectArr.push(item);
  //         return true;
  //       } else {
  //         return false;
  //       }
  //     });
  //   });
  //   const newdata = selectArr.concat(resolveArr);
  //   this.tableFilterData[index] = newdata;
  // }


}
</script>
<style lang="scss">
    .fixed-table-wrapper{
      overflow-y: auto;
      overflow-x: hidden;
    }
    .empty-info{
      // height: 100%;
      // display: flex;
      // justify-content: center;
      // align-items: center;
      color: #5d656f;
    }
    .spin-wrapper{
      position: absolute;
      top: 40%;
      left: 45%;
    }
    .checkbox-label{
      font-size: 10px;
    }
    .checkbox-item{
      margin-left: 41px;
      font-size: 8px;
    }
    .show-line{
      border-bottom: solid 1px rgba(0, 0, 0, 0.06);
    }
    .show-underline{
      border-bottom: 1px solid #DADADA;
    }
    .special-tr{
      height: 30px !important;
      line-height: 30px !important;
    }
    .special-tr-checked{
      background: linear-gradient(to bottom, #ffF 0, #ffF 10%, #F5F7F7 10%, #F5F7F7 90%, #fff 90%, #fff 100%)!important;
    }
    .tr-checked{
      background: #F5F7F7;
    }
    .tr-style{
        height: 24px;
        line-height: 24px;
        font-size: 11px;
        color: #5d656f;
        &.tr-header{
            font-size: 12px;
            font-weight: bold;
            .th-icon{
              font-size: 10px;
              margin-left: 8px;
              cursor: pointer;
              transition: all 0.5s;
            }
            .reverse{
              transform: rotate(-180deg);
              color:#1890ff;
            }
            .th-icon.sort{
              font-size: 8px;
            }
        }
        &.tr-body:hover{
            background-color: #eceff1;
        }
    }
    .sort-icon{
      display: inline-block;
      flex-direction: column;
      margin-right: 15px;
      line-height: 10px;
      vertical-align: top;
    }
    .td-style{
        word-break: break-word;
    }
    .td-text{
      width: 95%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .auto-table{
        table-layout: fixed;
        word-break:break-all;
        font-family: 'HelveticaNeue';
    }
    .table-wrapper{
      position: relative;
      height: 100%;
      width: 100%;
    }
    .th-title{
      position: relative;
      .filter-search{
        position: fixed;
        .prompt-wrapper{
          width: 157px;
          height: 149px;
          margin: 1px 0 0;
          padding: 10px 0 1px 0;
          border: 0.5px solid #D6D6D6;
          border-radius: 5px;
          overflow: auto;
          background-color: #fff;
          z-index: 9;
          .ant-checkbox{
            transform: scale(0.7);
          }
          .ant-checkbox-wrapper{
            min-width: 90%;
            margin-left: 5px;
            font-size: 10px;
            font-weight: normal;
            color: #3b4859;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .filter-input{
          width: 157px;
          line-height: 26px;
          input{
            height: 26px;
            font-size: 12px;
          }
        }
      }
    }
</style>
