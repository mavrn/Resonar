<template>
  <div class="wrapper flex">
    <div class="box bg-gray-600 min-h-screen">
      <FilterConfigSidebar />
    </div>
    <div class="handler"></div>
    <div class="box bg-gray-600 min-h-screen">
      <ResultsGrid />
    </div>
    <div class="bg-gray-600 min-h-screen">
      <RightSideBar />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isHandlerDragging = ref(false);
const containerOffsetLeft = ref(0);
const pointerRelativeXpos = ref(0);
const handler = ref(null);
const boxA = ref(null);
const wrapper = ref(null);

const handleMouseDown = (e) => {
  if (e.target === handler.value) {
    isHandlerDragging.value = true;
  }
};

const handleMouseMove = (e) => {
  if (!isHandlerDragging.value) {
    return false;
  }
  containerOffsetLeft.value = wrapper.value.offsetLeft;
  pointerRelativeXpos.value = e.clientX - containerOffsetLeft.value;
  const boxAminWidth = 60;
  boxA.value.style.width = `${Math.max(
    boxAminWidth,
    pointerRelativeXpos.value - 8
  )}px`;
  boxA.value.style.flexGrow = '0';
};

const handleMouseUp = (e) => {
  isHandlerDragging.value = false;
};

onMounted(() => {
  handler.value = document.querySelector('.handler');
  boxA.value = document.querySelector('.box');
  wrapper.value = document.querySelector('.wrapper');

  document.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleMouseDown);
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
});
</script>

<style scoped>
.w-12 {
  width: 12%;
}

.box {
  flex: 1 1 auto;
}

.handler {
  width: 10px;
  padding: 0;
  cursor: ew-resize;
  flex: 0 0 auto;
}

.handler::before {
  content: '';
  display: block;
  width: 1px;
  height: 100%;
  background: white;
}
</style>
