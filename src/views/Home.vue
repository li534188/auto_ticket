<template>
  <basic-layout>
    <template v-slot:header>
      <div class="header-wrapper" >
        <a class="home-logo" @click="backToHome">
          <img class="logo-img" src="@/assets/img/DAI_light_green_logo.svg"/>
        </a>
        <ul class="home-header">
          <li v-for="(item, index) in headLink" :key="index" >
            <router-link :class="['link',{'active':index===selectedKey}]" :to="item.link">{{item.title}}</router-link>
          </li>
        </ul>
        <div class="user-logos">
          <div  class='user-image gutter'>
            <img  class='user-img'  src='@/assets/img/user.svg'>
          </div>
          <a-dropdown placement="bottomRight">
            <span @click="e => e.preventDefault()">{{userName}}<down-outlined class="down-icon" /></span>
            <template v-slot:overlay>
              <a-menu>
                <a-menu-item>
                  <a @click="logOut">LogOut</a>
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
import { post } from '@/utils/httpUtils';
import { UserModule } from '@/store/modules/user';
// import { reactive, computed, ref, onMounted } from 'vue';
@Options({
  components: {
    BasicLayout,
    DownOutlined
  },
})
export default class Home extends Vue {
  private selectedKey = 0;

  private headLink = [
    {
      title: 'HR Issue',
      link: '/hrissue'
    },
    {
      title: 'Jira Checklist',
      link: '/dashboard'
    }
  ];

  mounted() {
    if (this.$route.path) {
      this.changeSelectedkey(this.$route.path);
    }
  }

  get userName() {
    return UserModule.userName;
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

  private logOut() {
    post('/api/logout',).then((res) => {
      if (res.message) {
        const storage = window.localStorage;
        storage.removeItem('userName');
        UserModule.asyncChangeUserName('');
        this.$router.push({
          path: '/login',
        });
      }
    });
  }

  private backToHome() {
    this.$router.push('/hrissue');
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
    font-size: 12px;
    height: 78px;
    justify-content: space-around;
    font-size: 12px;
  }
  .home-logo{
    font-family: Futura;
    cursor: pointer;
    width: 175px;
    color: #b3c5c0;
    display: flex;
    align-items: center;
    height: 78px;
    margin-left: 21px;
    .logo-img{
      width: 100%;
      height: 100%;
    }

  }
  .home-header{
    flex:1;
    background: #193442;
    list-style-type:none;
    li{
      display: inline;
      color: #ffffff;
      width: 101px;
      margin-right: 20px;
      .link{
        color: #ffffff;
        font-size: 14px;
        letter-spacing: 2.4px;
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
    margin-right: 24px;
    align-items: center;
    font-family: HelveticaNeue;
    color: #ffffff;
    font-size: 15px;
    cursor: pointer;
    .user-image{
      width: 2rem;
      line-height: 1.5rem;
      border-radius: 50%;
      overflow: hidden;
      .user-img{
        width: 100%
      }
    }
    .gutter{
      margin-right: 6px;
    }
  }
  .down-icon{
    color: #fff;
    font-size: 1rem;
    margin-left: 6px;
    margin-top: -10px;
  }
</style>
