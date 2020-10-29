<template>
  <basic-layout>
    <template v-slot:header>
      <div class="logo" />
      <a-menu
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
      </a-menu>
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
// import { reactive, computed, ref, onMounted } from 'vue';
@Options({
  components: {
    BasicLayout
  },
})
export default class Home extends Vue {
  private selectedKeys = ['1']
  @Watch('selectedKeys')
  private onSlectedKeysChange(value: string []) {
    console.log(value[0]);
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
  .home-header{
    text-align: left;
    margin-left: 15rem;
  }
</style>>
