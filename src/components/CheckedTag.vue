<template>
  <span :class="['check-wrapper',{'checked':checked}]" @click="changeClick">
    {{title}}
  </span>
</template>
<script lang="ts">
import { Options, Vue, } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';


@Options({
  props: {
    title: String,
    checked: Boolean,
  }
})
export default class CheckedTag extends Vue {
  @Prop({ required: true }) private title!: string;
  private checked1 = true;
  private handleChange(checked: boolean) {
    console.log(checked);
  }

  private changeClick() {
    this.$emit('change-click', this.title);
  }

}
</script>
<style lang="scss" scoped>
  .check-wrapper{
      font-size: 12px;
      padding: 5px 15px;
      background-color: rgba($color: #2517df, $alpha: 0);
      border: 1px solid rgba(224, 224, 224, 1);
      transition: all 2s;
      border-radius: 5px;
      height: 20px;
      margin: 0 20px 0 0 ;
  }
  .checked{
       background-color: rgba($color: #2517df, $alpha: 1);
       color:#fff;
  }
</style>