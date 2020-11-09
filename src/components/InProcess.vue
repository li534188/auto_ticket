
<template>
  <div class="sp sp-3balls"></div>
</template>
<script lang="ts">
import { Vue, } from 'vue-class-component';
export default class InProcess extends Vue {
}
</script>

<style lang="scss" scoped>

/*css加载动画 begin*/
.sp {
	width: 24px;
	height: 24px;
	clear: both;
    margin-left: 0.75rem;
}
.sp-3balls,
.sp-3balls:before,
.sp-3balls:after {
  border-radius: 50%;
  background-color: #7aa2e4;
  width: 0.5rem;
  height: 0.5rem;
  transform-origin: center center;
  display: inline-block;
}
.sp-3balls {
  position: relative;
  animation: spScaleAlpha 1s infinite linear;
}
.sp-3balls::before,.sp-3balls::after {
  content: '';
  position: absolute;
  opacity: .25;
}
.sp-3balls:before {
	left: 0.75rem;
	top: 0px;
	animation: spScaleAlphaBefore 1s infinite linear;
}
.sp-3balls::after {
  left: -0.75rem;
  top: 0px;
  animation: spScaleAlphaAfter 1s infinite linear;
}
@keyframes spScaleAlpha {
	0% { opacity: 1; }
	33% {  opacity: 0.25; }
	66% { opacity: 0.25; }
	100% {  opacity: 1; }
}
@keyframes spScaleAlphaBefore {
	0% { opacity: 0.25; }
	33% { opacity: 1; }
	66% { opacity: 0.25; }
}
@keyframes spScaleAlphaAfter {
	33% { opacity: 0.25; }
	66% { opacity: 1; }
	100% { opacity: 0.25; }
}
</style>