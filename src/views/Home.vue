<template>
  <basic-layout>
    <template v-slot:header>
      <div class="header-wrapper">
        <div class="home-logo" />
        <!-- <a-menu
          theme="dark"
          class="home-header"
          mode="horizontal"
          v-model:selectedKeys="selectedKeys"
          :style="{ lineHeight: '64px' }"
        >
          <a-menu-item key="1">
            <router-link to="/dashboard">Dashboard</router-link>
          </a-menu-item>
          <a-menu-item key="2">
            <router-link to="/hrissue">HR Issue</router-link>
          </a-menu-item>
          <a-menu-item key="3">
            nav 3
          </a-menu-item>
        </a-menu> -->
        <ul class="home-header">
          <li v-for="(item, index) in headLink" :key="index" >
            <router-link :class="['link',{'active':index===selectedKey}]" :to="item.link">{{item.title}}</router-link>
          </li>
        </ul>
        <div class="user-logos">
          <img  class='user-image gutter'  src=''>
          <a-dropdown placement="bottomRight">
            <a class="ant-dropdown-link" @click="e => e.preventDefault()">{{userInfo.userName}}<down-outlined class="down-icon" /></a>
            <template v-slot:overlay>
              <a-menu>
                <a-menu-item>
                  <a href="javascript:;">1st menu item</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>

    </template>
    <template v-slot:content>
      <router-view />
    </template>
  </basic-layout>
  <!-- <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
  </div> -->
</template>

<script lang="ts">
import { Options, Vue, } from 'vue-class-component';
import BasicLayout from '@/components/layout/BasicLayout.vue';
import { Watch } from 'vue-property-decorator';
import { DownOutlined } from '@ant-design/icons-vue';
// import { reactive, computed, ref, onMounted } from 'vue';
@Options({
  components: {
    BasicLayout,
    DownOutlined
  },
})
export default class Home extends Vue {
  private selectedKey = 0;
  private userInfo = {
    userName: 'Claire Sun',
  }
  private headLink = [
    {
      title: 'Dashboard',
      link: '/dashboard'
    }, {
      title: 'HR Issue',
      link: '/hrissue'
    }

  ];

  mounted() {
    if (this.$route.path) {
      this.changeSelectedkey(this.$route.path);
    }
  }
  @Watch('selectedKey')
  private onSlectedKeysChange(value: string []) {
    console.log(value[0]);
  }


  @Watch('$route.path')
  private onRouterChange(value: string) {
    this.changeSelectedkey(value);
  }

  private changeSelectedkey(value: string) {
    this.headLink.map((item, index) => {
      if (value.indexOf(item.link) > -1) {
        this.selectedKey = index;
      }
    });
  }

}
// export default  {
//   components: {
//     HelloWorld,
//     MailOutlined,
//     AppstoreOutlined,
//     SettingOutlined
//   },
//   data() {
//       return {
//         name: '小明',
//       }
//     },
//   mounted() {
//     console.log(9999)
//     console.log(this.name )
//   },
//   setup(props: any, context: any) {

//     // 通过reactive 可以初始化一个可响应的数据，与Vue2.0中的Vue.observer很相似
//     const count = ref('小四')
//     const state = reactive({
//       todoList: [{
//         id: 1,
//         done: false,
//         text: '吃饭'
//       },{
//         id: 2,
//         done: false,
//         text: '睡觉'
//       },{
//         id: 3,
//         done: false,
//         text: '打豆豆'
//       }],
//       todo: '',
//       text:'123'
//     })
//     // 使用计算属性生成待办列表
//     const todos = computed(() => {
//       return state.todoList.filter(item => !item.done)
//     })

//     // 使用计算属性生成已办列表
//     const dones = computed(() => {
//       return state.todoList.filter(item => item.done)
//     })

//     // 修改待办状态
//     const handleChangeStatus = (item: { done: any } ,status: any) => {
//       item.done = status;
//     }

//      onMounted(() => {
//       console.log('Component is mounted!')
//     })
//     // 新增待办
//     const handleAddTodo = () => {
//       if(!state.todo) {
//         alert('请输入待办事项')
//         return
//       }
//       state.todoList.push({
//         text: state.todo,
//         id: Date.now(),
//         done: false
//       })
//       state.todo = ''
//     }

// // 在Vue3.0中，所有的数据和方法都通过在setup 中 return 出去，然后在template中使用
//     return {
//       count,
//       state,
//       todos,
//       dones,
//       handleChangeStatus,
//       handleAddTodo,

//     }
//   }

// }
// export default {
//   name: "About",
//   components: {
//     HelloWorld,
//     MailOutlined,
//     AppstoreOutlined,
//     SettingOutlined,
//   },
//   beforeMount() {
//     console.log(this)
//   },
//   mounted(){
//     console.log(this)
//   },
//   data(){
//     return {
//       current: ['mail'],
//     }
//   },
//   methods:{
//     test(){
//       console.log(this)
//     }

//   }

// };
</script>
<style lang="scss" scoped>
  .header-wrapper{
    display: flex;
    font-family: HelveticaNeue;
    font-size: 1rem;
  }
  .home-logo{
    width: 120px;
    height: 31px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px 28px 16px 0;
  }
  .home-header{
    flex:1;
    background: #193442;
    list-style-type:none;
    li{
      display: inline;
      color: #ffffff;
      width: 101px;
      margin-right: 2rem;
      .link{
        color: #ffffff;
        &.active{
          // text-decoration:underline;
          border-bottom:1px solid #fff ;
          font-weight: bold;
        }
      }
    }
  }
  .user-logos{
    display: flex;
    height: 100%;
    width: 300px;
    align-items: center;
    font-family: HelveticaNeue;
    color: #ffffff;
    font-size: 1rem;
    .user-image{
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
    }
    .gutter{
      margin-right: 1rem;
    }
  }
  .down-icon{
    color: #fff;
    font-size: 1rem;
  }
</style>
