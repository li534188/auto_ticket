<template>
  <!-- <a-tooltip :trigger="['hover']" placement="topLeft" overlay-class-name="numeric-input">
    <template v-if="selectData.length > 0" #title>
      <span class="numeric-input-title">
        {{ selectData.join(' | ') }}
      </span>
    </template>
  </a-tooltip> -->
  <filter-outlined
    :style="{color:(selectData.length > 0)?'#fa6400':''}"
    @click.stop="openFilter"
    class="th-icon"
    ref="filterIcon"
  />
  <div v-if="showPop" :style="{left:this.popPoistion.left+'px', top:this.popPoistion.top+20+'px', position:'fixed'}">
    <div v-if="filterType==='company'" @click.stop="" class="prompt-wrapper">
      <a-checkbox-group v-model:value="selectData" >
        <a-row v-for="(item) in filterData" :key="item.value">
          <a-checkbox :value="item.value">
            <span  :class="['company-color','checkbox-label',item.title]">{{item.title}}</span><br>
            <span class="checkbox-item">{{item.context}}</span>
          </a-checkbox>
        </a-row>
      </a-checkbox-group>
    </div>
    <div v-if="filterType!=='company'" @click.stop="" class="filter-search">
      <a-input class="filter-input" v-model:value="inputValue" placeholder="Search">
        <template #prefix> <search-outlined /></template>
        <template #suffix>
          <close-circle-filled @click.stop="clearFilterData" class="th-icon" v-if="inputValue&&(inputValue.length > 0)" />
        </template>
      </a-input>
      <div  class="prompt-wrapper">
        <a-checkbox-group v-model:value="selectData" :options="mateFilterData" >
        </a-checkbox-group>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Options, Vue, } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { SearchOutlined, FilterOutlined, CloseCircleFilled } from '@ant-design/icons-vue';
@Options({
  components: {
    SearchOutlined,
    FilterOutlined,
    CloseCircleFilled
  },
})
export default class Filter extends Vue {
    @Prop() private filterData!: any;
    @Prop() private filterType!: string;
    @Prop() private value!: string[];
    private selectData: string[] = [];
    private inputValue = '';
    private showPop = false;
    private popPoistion = {
      left: 0,
      top: 0
    }

    get mateFilterData() {
      const { inputValue } =this;
      if (inputValue) {
        const arr = this.filterData.filter((item: string) => {
          return item&&(item.toLowerCase().indexOf(this.inputValue.toLowerCase()) > -1);
        });
        return arr;
      } else {
        return this.filterData;
      }
    }

    private clearFilterData() {
      this.inputValue = '';
      this.selectData = [];
    }

    @Watch('showPop')
    private watchPopClose(value: boolean) {
      if (!value) {
        this.$emit('update:value', this.selectData);
      }
    }

    private openFilter() {
      this.showPop = true;
      const positionObj = this.$refs.filterIcon as HTMLElement;
      if (positionObj) {
        this.popPoistion = { left: positionObj.getBoundingClientRect().left - 90, top: positionObj.getBoundingClientRect().top };
      }
      window.addEventListener('click', this.closeFilter);
    }

    private closeFilter() {
      this.showPop = false;
      window.removeEventListener('click', this.closeFilter);
    }
}
</script>
<style lang="scss" scoped>
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
  .checkbox-label{
    font-size: 10px;
  }
  .checkbox-item{
    margin-left: 41px;
    font-size: 8px;
  }
  .filter-input{
    width: 157px;
    line-height: 26px;
    input{
      height: 26px;
      font-size: 12px;
    }
  }
  .th-icon{
    font-size: 10px;
    margin-left: 8px;
    cursor: pointer;
    transition: all 0.5s;
  }
}
</style>