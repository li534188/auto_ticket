<template>
  <div class='key-wrapper'>
    <div class="input-wrapper">
      <a-textarea
        v-model:value="key"
        placeholder="please enter primary key"
        :auto-size="{ minRows: 2, maxRows: 5 }"
      />
      <a-textarea
        class="text"
        v-model:value="value"
        :auto-size="{ minRows: 2, maxRows: 5 }"
      />
      <a-button @click="generalKey">encrypt</a-button>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue } from 'vue-class-component';
import { getEncryptInfo } from '@/utils/server';
// import { reactive, computed, ref, onMounted } from 'vue';
export default class  extends Vue {
    private key = ''
    private value = ''
    private generalKey() {
      this.value = '';
      const { key } = this;
      key&&getEncryptInfo({ encryptInfo: key }).then(res => {
        this.value = res;
      });
    }
}
</script>
<style lang="scss" scoped>
    .key-wrapper{
        font-family: Silom;
        width: 100%;
        height: 100%;
        text-align: center;
        // background: linear-gradient(#193542, #1f4252);
        color: #fff;
        display: flex;
        justify-content: center;
        padding-top: 150px;
        .input-wrapper{
            width: 80%;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            button{
                width: 200px;
                margin-top:20px;
            }
        }
        .title{
            padding-top: 10px;
            font-size: 60px;
        }
        .info{

            font-size: 2rem;
        }
        .text{
          margin: 20px 0 0 0;
        }
    }
</style>