<template>
  <div class="list-wrapper">
    <div class="header">
      <a-row >
        <a-input class="search-input" v-model:value="searchValue" />
        <a-button class="search-button" >
          Search
        </a-button>
      </a-row>
      <a-row >
        <a-col class="label"  :span="1">
          Company
        </a-col>
        <a-col :offset='1' :span="19">
          <checked-tag v-for="(item) in listData" :key="item.title" :title='item.title' @changeClick="change" :checked="item.checked"/>
        </a-col>
      </a-row>
      <a-row>
        <a-col class="label" :span="1">
          Start Time
        </a-col>
        <a-col  :offset="1" :span="19">
          <a-time-picker :default-open-value="startTime" @change="onChange">
            <a-icon  type="smile" />
          </a-time-picker>
          <span>to</span>
          <a-time-picker :default-open-value="startTime" @change="onChange">
            <a-icon  type="smile"/>
          </a-time-picker>
        </a-col>
      </a-row>
      <a-row>
        <a-col class="label" :span="1">
          Repeat
        </a-col>
        <a-col :offset="1"  :span="19">
          <span>Every</span>
          <span>
            <a-dropdown>
              <template v-slot:overlay>
                <a-menu @click="handleMenuClick">
                  <a-menu-item key="1"><UserOutlined />1st menu item</a-menu-item>
                  <a-menu-item key="2"><UserOutlined />2nd menu item</a-menu-item>
                  <a-menu-item key="3"><UserOutlined />3rd item</a-menu-item>
                </a-menu>
              </template>
              <a-button style="margin-left: 8px"> Button <DownOutlined /> </a-button>
            </a-dropdown>
          </span>
          <span>
            <a-radio-group v-model:value="ridaoValue">
              <a-radio style="margin-right:3rem"  value="0">
                particular data
              </a-radio>
              <a-radio style="margin-right:3rem"  value="1">
                particular day of the week
              </a-radio>
            </a-radio-group>
          </span>
        </a-col>
        <a-col :offset="2"  :span="19">
          <a-dropdown>
            <template v-slot:overlay>
              <a-menu @click="handleMenuClick">
                <a-menu-item key="1"><UserOutlined />2end week</a-menu-item>
                <a-menu-item key="2"><UserOutlined />2nd menu item</a-menu-item>
                <a-menu-item key="3"><UserOutlined />3rd item</a-menu-item>
              </a-menu>
            </template>
            <a-button > Button <DownOutlined /> </a-button>
          </a-dropdown>
          <checked-tag v-for="(item) in listData" :key="item.title" :title='item.title' @changeClick="change" :checked="item.checked"/>
        </a-col>
      </a-row>
    </div>
    <div class="divider" />
    <div class="context">
      <a-row >
        <a-col class="label"  :span="1">
          order by
        </a-col>
        <a-col :offset='1' :span="19">
          <a-radio-group v-model:value="ridaoValue">
            <a-radio style="margin-right:3rem"  value="0">
              Compareny
            </a-radio>
            <a-radio style="margin-right:3rem"  value="1">
              Start Time
            </a-radio>
            <a-radio style="margin-right:3rem"  value="1">
              Repeat
            </a-radio>
          </a-radio-group>
        </a-col>
      </a-row>
      <a-list item-layout="horizontal" :data-source="datas">
        <template v-slot:renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta
              description="Ant Design, a design language for background applications, is refined by Ant UED Team"
            >
              <template v-slot:title>
                <a href="https://www.antdv.com/">{{ item.title }}</a>
              </template>
              <template v-slot:avatar>
                <a-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
    </div>
  </div>
</template>
<script lang="ts">
import { Options, Vue, } from 'vue-class-component';
import moment from 'moment';
import CheckedTag from '@/components/CheckedTag.vue';
import { UserOutlined } from '@ant-design/icons-vue';


@Options({
  components: {
    CheckedTag,
    UserOutlined
  },
})
export default class CheckList extends Vue {
  private checked1 = true ;
  private listData = [
    {
      title: 'All',
      checked: true,
    }, {
      title: 'WON',
      checked: false,
    }, {
      title: 'DAI',
      checked: false,
    }, {
      title: 'ODS',
      checked: false,
    }, {
      title: 'ONS',
      checked: false,
    }, {
      title: 'IBD',
      checked: false,
    },
  ];
  searchValue = 'test'

  private startTime = moment('00:00:00', 'HH:mm:ss');

  private ridaoValue = '1'

  private datas: {title: string}[] = [
    {
      title: 'Ant Design Title 1',
    },
    {
      title: 'Ant Design Title 2',
    },
    {
      title: 'Ant Design Title 3',
    },
    {
      title: 'Ant Design Title 4',
    },
  ];
  private handleChange(checked: boolean) {
    console.log(checked);
  }



  private change(val: string) {
    this.listData = this.listData.map(item => {
      if (item.title === val) {
        item.checked = !item.checked;
      }
      return item;
    });
  }

  handleMenuClick(e: any) {
    console.log('click', e);
  }


}
// export default {
//   name:'checkList',
//   components:{
//      CheckedTag
//   },
//   data(){
//     return {
//       checked1:true,
//       listData:[
//         {
//           title:'All',
//           checked:true,
//         },{
//           title:'WON',
//           checked:false,
//         },{
//           title:'DAI',
//           checked:false,
//         },{
//           title:'ODS',
//           checked:false,
//         },{
//           title:'ONS',
//           checked:false,
//         },{
//           title:'IBD',
//           checked:false,
//         },
//       ]
//     }
//   },
//   methods:{
//       handleChange(checked){
//           console.log(checked)
//       },
//       change(val){
//           this.listData = this.listData.map(item=>{
//               if(item.title === val){
//                   item.checked = !item.checked
//               }
//               return item
//           })
//       }
//   },
// }
</script>
<style lang="scss" scoped>
  .list-wrapper{
    padding: 0 50px;
    line-height: 50px;

      .label{
        text-align: right;
      }
      .header{
          .search-input{
            width: 70%;
          }
          .search-button{
            color:orange;
            border-color: orange;
            margin-left: 50px;
          }
      }
      .divider{
        width: 100%;
        border: 1px solid rgba($color: #000000, $alpha: .1);
      }
      .context{
        padding: 0 30px;
      }
  }
</style>