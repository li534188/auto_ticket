<template>
  <slot :name="value"/>
  <slot/>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop, } from 'vue-property-decorator';
@Options({
  components: {
  }
})
export default class VSwitch extends Vue {
    @Prop({ require: true }) value!: string;
}
</script>