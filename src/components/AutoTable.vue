<template>
  <div>
    <table class="auto-table"  :style="{width:(tableStyle&&tableStyle.width)}">
      <tr :class="['tr-style','tr-header',{'show-line':showLine}]">
        <th v-show="showChekbox" style="width:30px">
          <a-checkbox class="special-box" v-model:checked="allCheckStatus" @change="selectAll($event)"  value="all"/>
        </th>
        <th :style="{width:item.width}" class="th-title" v-for="(item) in colums" :key="item.dataIndex">
          <a-tooltip :trigger="['hover']" placement="topLeft" overlay-class-name="numeric-input">
            <template v-if="chooseListStr[item.dataIndex]" #title>
              <span class="numeric-input-title">
                {{ chooseListStr[item.dataIndex] }}
              </span>
            </template>
            <span>{{item.title}}</span>
          </a-tooltip>
          <down-outlined @click="sortData(item.sortMethod)" class="th-icon" v-if="item.showSort" />
          <filter-outlined :style="{color:(chooseSearchList[item.dataIndex]&&(chooseSearchList[item.dataIndex].length > 0)?'#fa6400':'')}" @click.stop="openFilter(item.dataIndex, item)" class="th-icon" v-if="item.showFilter" />
          <div class="filter-search"  @click.stop="" v-if="showFilterSearch === item.dataIndex">
            <a-input class="filter-input" v-if="showFilterSearch!=='company'" v-model:value="valueInput[item.dataIndex]" @change="mateFilterData" placeholder="Search">
              <template #prefix> <search-outlined /></template>
              <template #suffix>
                <close-circle-filled @click.stop="clearFilterData(item.dataIndex)" class="th-icon" v-if="valueInput[item.dataIndex]&&(valueInput[item.dataIndex].length > 0)" />
              </template>
            </a-input>
            <div v-if="(showFilterSearch === item.dataIndex)&&showManagerPrompt" class="prompt-wrapper">
              <a-checkbox-group v-if="showFilterSearch==='company'" v-model:value="chooseSearchList[showFilterSearch]"  @change="checkedValue">
                <a-row v-for="(item) in tableFilterData[showFilterSearch]" :key="item.value">
                  <a-checkbox :value="item.value">
                    <span  :class="['company-color','checkbox-label',item.title]">{{item.title}}</span><br>
                    <span class="checkbox-item">{{item.context}}</span>
                  </a-checkbox>
                </a-row>
              </a-checkbox-group>
              <a-checkbox-group v-else v-model:value="chooseSearchList[showFilterSearch]" :options="tableFilterData[showFilterSearch]"  @change="checkedValue">
              </a-checkbox-group>
            </div>
          </div>
        </th>
      </tr>
      <div class="spin-wrapper">
        <a-spin :spinning='showLoading'>
          <template v-slot:indicator>
            <loading-outlined style="font-size: 35px" spin />
          </template>
        </a-spin>
      </div>
      <tbody v-show="!showLoading">
        <tr  :class="['tr-style','tr-body',{'show-line':showLine}]" v-for="(item,index)  in thisTableData" :key="item[primaryKey]">
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
import { DownOutlined, FilterOutlined, SearchOutlined, CloseCircleFilled, LoadingOutlined } from '@ant-design/icons-vue';
@Options({
  components: {
    DownOutlined,
    FilterOutlined,
    SearchOutlined,
    CloseCircleFilled,
    LoadingOutlined
  },
})
export default class AutoTable extends Vue {
    @Prop({ required: true }) private colums!: ColumsType[]
    // 所有数据
    @Prop({ required: true }) private tableData!: any[]
    @Prop({ required: true }) private tableStyle!: {}
    // 是头部checkbox选择列表
    @Prop() private changeSearchValue!: any;
    // 头部过滤器
    @Prop() private serachInput!: {};
    // loading
    @Prop() private showLoading!: {};
    // 搜索框中下拉列表的数据
    @Prop() private filterData!: {[key: string]: string[]};
    // 格式化company 显示 对象的值可能是一个对象或者字符串
    @Prop() private formatCompany!: {[key: string]: {title?: string; context?: string}&string};

    @Prop() private showChekbox!: boolean;

    @Prop() private showLine!: boolean;
    // 默认选中
    @Prop() private defaultCheck!: boolean;
    // 主键
    @Prop() private primaryKey!: string;

    private thisSelectIds: string[] = [];
    private showFilterSearch  = '';
    private valueInput: any = {}
    // 展示搜索框
    private showManagerPrompt = false;
    // 涉及重新排序所以需要重新赋值
    private tableFilterData: {[key: string]: string[] }= {};
    // 选中的数据
    private chooseSearchList: ChooseListObject = {};
    // 筛选条件字符串
    private chooseListStr = {};
    private thisTableData: any[] = [];
    private allCheckStatus = false;

    mounted() {
      this.thisTableData = this.tableData;
    }

    private onloadClick() {
      this.showFilterSearch = '';
      this.showManagerPrompt = false;
      window.removeEventListener('click', this.onloadClick);
    }

    // 当过滤框关闭时传递过滤值
    @Watch('showManagerPrompt')
    private transferDataToParent(value: boolean) {
      if (!value) {
        const transferData: {[key: string]: string} = {};
        for (const key in this.chooseSearchList) {
          if (this.chooseSearchList[key]&&(this.chooseSearchList[key].length>0))
            transferData[key] = this.chooseSearchList[key].reduce((pre, cur,) => {
              return `${pre}|${cur}`;
            });
        }
        this.chooseListStr = transferData;
        this.changeSearchValue(transferData);
      }
    }

    @Watch('tableData', { deep: true })
    private setTableData(value: any) {
      this.thisTableData = value;
    }

    @Watch('filterData', { deep: true, immediate: true })
    private settableFilterData(value: any) {
      if (!value) {
        return;
      }
      const arr = JSON.parse(JSON.stringify(value));
      this.tableFilterData = arr;
    }

    get tableStructure() {
      const structure: {dataIndex: string;showText: boolean}[] = [];
      this.colums.map(item => {
        structure.push({ dataIndex: item.dataIndex, showText: item.showText });
      });
      return structure;
    }

    private sortData(method: any) {
      if (!method) {
        return;
      }
      const newData = JSON.parse(JSON.stringify(this.tableData));
      const res = this.sort(newData, method);
      this.thisTableData = res;
    }

    // 采用冒泡排序和传递的方法进行排序
    private sort(element: any[], method: any) {
      for (let i = 0; i<element.length-1; i++) {
        for (let j = 0; j<element.length-i-1; j++) {
          if (method(element[j], element[j+1])) {
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
        const selectIds = this.tableData.map(item => {
          return item[this.primaryKey]||item.id;
        });
        this.thisSelectIds = selectIds;
        console.log(selectIds);
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

    @Watch('showLoading')
    private changeChecked(value: boolean) {
      if (!value) {
        if (this.defaultCheck) {
          console.log('ffffffffff');
          this.allCheckStatus = true;
          const selectIds = this.tableData.map(item => {
            return item[this.primaryKey]||item.id;
          });
          this.thisSelectIds = selectIds;
          console.log(selectIds);
        }
      }
    }

    private itemInArr(value: string) {
      return this.thisSelectIds.some(item => item === value);
    }

    private openFilter(dataIndex: string,) {
      this.showFilterSearch = dataIndex;
      this.showManagerPrompt = true;
      window.addEventListener('click', this.onloadClick);
    }

    private clearFilterData(index: string) {
      this.valueInput[index] = '';
      this.mateFilterData();
    }


    // method
    private checkedValue(value: string[]) {
      const index = this.showFilterSearch;
      const deepFilter: {[key: string]: any[]} = JSON.parse(JSON.stringify(this.tableFilterData));
      // 将已经选中的数据排除出去然后两个数组进行拼接
      console.log('fff');
      const selectArr: any[] = [];
      const resolveArr = deepFilter[index].filter(item => {
        return !value.some(subitem => {
          if (subitem === item||(subitem === (item&&item.value))) {
            selectArr.push(item);
            return true;
          } else {
            return false;
          }
        });
      });
      const newdata = selectArr.concat(resolveArr);
      this.tableFilterData[index] = newdata;
    }

    private mateFilterData() {
      const index = this.showFilterSearch;
      const deepFilter: {[key: string]: string[]} = JSON.parse(JSON.stringify(this.filterData));
      if (this.valueInput[index]) {
        const arr = deepFilter[index].filter(item => {
          return item&&(item.toLowerCase().indexOf(this.valueInput[index].toLowerCase()) > -1);
        });
        this.tableFilterData[index] = arr;
      } else {
        this.tableFilterData = deepFilter;
      }
    }



}
</script>
<style lang="scss">
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
            }
        }
        &.tr-body:hover{
            background-color: #eceff1;
        }
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
        position: absolute;
        right: 0px;
        top: 100%;
        .prompt-wrapper{
          width: 157px;
          height: 149px;
          margin: 1px 0 0;
          padding: 10px 0 1px 0;
          border: 0.5px solid #D6D6D6;
          border-radius: 5px;
          overflow: scroll;
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
