<template>
  <div>
    <span class="weui-switch" :class="{'weui-switch-on' : isChecked}" :value="value" @click="toggle" style="position:relative">
      <div v-if="isChecked && direction.length > 0" style="width:100%;height:100%;position:absolute;padding:0 5px;line-height:20px;color:#FFF;user-select:none">
        {{direction[0]}}
      </div>
      <div v-if="!isChecked && direction.length > 0" style="width:100%;height:100%;position:absolute;padding:0 5px;right:2px;line-height:22px;color:#7A7A7A;text-align:right;user-select:none">
        {{direction[1]}}
      </div>
    </span>
  </div>
</template>
<script lang="ts">
import { Options, Vue, } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

@Options({
  components: {},
})
export default class AutoSwitch extends Vue {
    @Prop() value!: boolean;
    @Prop() text!: string;
    private isChecked = this.value;

    get direction() {
      if (this.text) {
        return this.text.split('|');
      } else {
        return [];
      }
    }

    @Watch('value')
    private valueChange(value: boolean) {
      this.isChecked = value;
    }

    @Watch('isChecked')
    private isCheckedChange(value: boolean) {
      this.$emit('update:value', value);
    }

    private toggle() {
      this.isChecked = !this.isChecked;
    }
}
</script>
<style  lang="scss" scoped>
    $auto-weight:26px;
    $auto-height:12px;
    .weui-switch {
        display: block;
        position: relative;
        width: $auto-weight;
        height: $auto-height;
        border: 1px solid #DFDFDF;
        outline: 0;
        border-radius: 16px;
        box-sizing: border-box;
        background-color: #DFDFDF;
        transition: background-color 0.1s, border 0.1s;
        cursor: pointer;
      }
      .weui-switch:before {
        content: " ";
        position: absolute;
        top: 0;
        left: 0;
        width: $auto-weight - 1;
        height:  $auto-height - 1;
        border-radius: 15px;
        background-color: #FDFDFD;
        transition: transform 0.35s cubic-bezier(0.45, 1, 0.4, 1);
      }
      .weui-switch:after {
        content: " ";
        position: absolute;
        top: 0;
        left: 0;
        width: 10px;
        height: 10px;
        border-radius: 6px;
        background-color: #FFFFFF;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
        transition: transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
      }
      .weui-switch-on {
        border-color: #6F6F6F;
        background-color: #1AAD19;
      }
      .weui-switch-on:before {
        border-color: #1AAD19;
        background-color: #1AAD19;
      }
      .weui-switch-on:after {
        transform: translateX(13px);
      }
</style>