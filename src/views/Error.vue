<template>
  <div class='wrapper'>
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
export default class Error extends Vue {
}
</script>
<style lang="scss" scoped>
    .wrapper{
        font-family: Silom;
        width: 100%;
        height: 100%;
        text-align: center;
        background: linear-gradient(#193542, #1f4252);
        color: #fff;
        .title{
            padding-top: 60px;
            font-size: 60px;
        }
        .info{
            font-size: 2rem;
        }
    }
</style>