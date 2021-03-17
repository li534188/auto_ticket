<template>
  <div class='error-wrapper'>
    <div class="title">
      404
    </div >
    <div class='info'>
      page not found
    </div>
  </div>
</template>
<script lang="ts">
import { Vue } from 'vue-class-component';
// import { reactive, computed, ref, onMounted } from 'vue';
export default class  extends Vue {
}
</script>
<style lang="scss" scoped>
    .error-wrapper{
        width: 100%;
        height: 100%;
        text-align: center;
        background: linear-gradient(#193542, #1f4252);
        color: #fff;
        display: flex;
        justify-content: center;
        padding-top: 200px;
        .title{
            font-size: 60px;
        }
        .info{

            font-size: 2rem;
        }
    }
</style>