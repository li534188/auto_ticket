<template>
  <div v-show="thisShow" class="modal-root">
    <section class="modal-mask"></section>
    <section class="modal-wrapper">
      <div class="modal-body">
        <div class="modal-close">
          <CloseOutlined @click="closeModal"/>
        </div>
        <header class="modal-header">
          <slot name="header"/>
        </header>
        <section class="modal-content">
          <slot name="content"/>
        </section>
        <footer class="modal-footer">
          <slot name="footer"/>
        </footer>
        <footer v-if="showFooter" class="modal-footer">
          <div>
            <a-button  data-test="confirm-button" @click="confirm" class="auto-button create-button">{{comfileText||'ok'}}</a-button>
            <a-button @click="test" v-show="cancelText" class="auto-button create-button">{{cancelText||'cancel'}}</a-button>
          </div>
        </footer>
      </div>
    </section>
  </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { CloseOutlined } from '@ant-design/icons-vue';
import { Prop, Watch } from 'vue-property-decorator';
@Options({
  components: {
    CloseOutlined
  }
})
export default class AutoModal extends Vue {
  @Prop({ require: true }) private show!: boolean;
  @Prop({ require: true }) private comfileText!: string;
  @Prop({ require: true }) private cancelText!: string;
  @Prop({ require: true }) private changeShow!: {(even: boolean): string};
  @Prop({ require: true }) private confirmMethod!: {(): void};
  @Prop({ require: true }) private showFooter!: boolean;
  private thisShow = false;

  private test() {
    console.log('ffffffffff');
  }

  private closeModal() {
    this.changeShow(false);
  }

  private confirm() {
    this.confirmMethod();
  }


  @Watch('show', { immediate: true })
  private parentChangeShow(val: boolean) {
    this.thisShow = val;
  }
}
</script>

<style lang="scss" scoped>
  .modal-wrapper{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    outline: 0;
    z-index:1000;
  }

  .modal-body{
    box-sizing: border-box;
    margin: 0;
    padding: 10px 10px;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5715;
    list-style: none;
    font-feature-settings: 'tnum';
    position: relative;
    top: 200px;
    width: 875px;
    height: 428px;
    margin: 0 auto;
    padding-bottom: 24px;
    pointer-events: auto;
    background-color: #fff;
    background-clip: padding-box;
    border: 0;
    border-radius: 2px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    .modal-content{
      // position: relative;

      pointer-events: auto;
    }
    .create-button{
      height: 15px;
      line-height: 15px;
      margin-left: 5px;
    }
  }
  .modal-close{
    position: absolute;
    font-size: 15px;
    right: 20px;
    cursor: pointer;
    &:hover{
      color: rgb(18, 135, 231);
    }
  }
  .modal-mask{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    height: 100%;
  }
</style>
