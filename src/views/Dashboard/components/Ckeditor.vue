<template>
  <div id="app">
    <ckeditor :editor="editor" @onReady="onReady" v-model="editorData" :config="editorConfig"></ckeditor>
  </div>
</template>
<script lang="ts">
import { Options, Vue, } from 'vue-class-component';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import UploadAdapter from '@/components/ckeditor/index';
import {
  PieChartOutlined,
} from '@ant-design/icons-vue';
import { Watch } from 'vue-property-decorator';
@Options({
  components: {
    PieChartOutlined
  },
})
export default class DatePicker extends Vue {
  private editor = ClassicEditor;
  private editorData = '<p>Content of the editor.</p>';
  private editorConfig = {
    extraPlugins: [this.uploader]
  }

  private uploader(editor: any) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
      return new UploadAdapter(loader);
    };
  }

  @Watch('editorData')
  private editorDataChange(value: HTMLElement) {
    console.log(value);
  }
}
</script>
<style lang="scss">
  .ck-content {
    height:150px;
  }
</style>