<template>
  <a-list item-layout="horizontal" :data-source="datas">
    <template v-slot:renderItem="{ item }">
      <a-list-item  class="list-item-devider">
        <div class="list-item-meta">
          <div>
            <lock-outlined class="gutter" />
            <span class="ticket gutter">{{item.title}}</span>
            <span class="title gutter">{{item.title}}</span>
            <span class="status gutter">
              <span v-if="item.title.length ===0">
                <check-circle-outlined  style="color:green"/>
              </span>
              <span v-else-if="item.title.length > 0">
                <close-circle-outlined style="color:red" />
                <span class="status-err">Retry</span>
              </span>
              <span v-else-if="item.title.length < 0">
                <in-process />
              </span>
            </span>
          </div>
          <div :class="['option',{'process':item.title.length>0},{'open':item.title.length<0},{'test':item.title.length===0}]">
            In Process
          </div>
        </div>
      </a-list-item>
    </template>
  </a-list>
</template>
<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { LockOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons-vue';
import InProcess from '@/components/InProcess.vue';
@Options({
  components: {
    LockOutlined,
    CheckCircleOutlined,
    InProcess,
    CloseCircleOutlined
  }
})
export default class EmployeeContentTab extends Vue {
    @Prop({ required: true }) private datas = [{

    }]
}
</script>
<style lang="scss" scoped>
    .list-item-devider{
        font-size: 0.8rem;
        .list-item-meta{
           width: 100%;
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

</style>