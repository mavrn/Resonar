<template>
  <div class="wrapper flex w-full">
    <div class="columnLeft bg-gray-600 min-h-screen">
      <FilterConfigSidebar />
    </div>
    <div class="dividerLeft"></div>
    <div class="columnMiddle bg-gray-600 min-h-screen">
      <ResultsGrid />
    </div>
    <div class="dividerRight"></div>
    <div class="columnRight bg-gray-600 min-h-screen">
      <RightSideBar />
    </div>
  </div>
</template>

<script setup>
const snappingThreshold = 0.5;
const sidebarMinWidth = 140;
const sidebarMaxWidth = 400;
const isDividerLeftDragging = ref(false);
const isDividerRightDragging = ref(false);
const dividerLeft = ref(null);
const dividerRight = ref(null);
const columnLeft = ref(null);
const columnRight = ref(null);
const containerOffsetLeft = ref(0);
const containerOffsetRight = ref(0);
const pointerRelativeXposLeft = ref(0);
const pointerRelativeXposRight = ref(0);
const wrapper = ref(null);

const handleMouseDown = (e) => {
  console.log('mouse down!');

  if (e.target === dividerLeft.value) {
    e.preventDefault();
    isDividerLeftDragging.value = true;
  } else if (e.target === dividerRight.value) {
    e.preventDefault();
    isDividerRightDragging.value = true;
  }
};

const handleMouseUp = (e) => {
  console.log('mouse up!');
  isDividerLeftDragging.value = false;
  isDividerRightDragging.value = false;
};

const handleMouseMove = (e) => {
  if (isDividerLeftDragging.value) {
    containerOffsetLeft.value = wrapper.value.offsetLeft;
    pointerRelativeXposLeft.value = e.clientX;
    if (pointerRelativeXposLeft.value / sidebarMinWidth < snappingThreshold) {
      columnLeft.value.style.display = 'none';
      columnLeft.value.style.width = '0px';
    } else {
      columnLeft.value.style.display = 'block';
      columnLeft.value.style.width = `${Math.min(
        Math.max(sidebarMinWidth, pointerRelativeXposLeft.value),
        sidebarMaxWidth
      )}px`;
    }
    columnLeft.value.style.flexGrow = '0';
  } else if (isDividerRightDragging.value) {
    containerOffsetRight.value = wrapper.value.offsetLeft;
    pointerRelativeXposRight.value = window.innerWidth - e.clientX - 12;
    if (pointerRelativeXposRight.value / sidebarMinWidth < snappingThreshold) {
      columnRight.value.style.display = 'none';
      columnRight.value.style.width = '0px';
    } else {
      columnRight.value.style.display = 'block';
      columnRight.value.style.width = `${Math.min(
        Math.max(sidebarMinWidth, pointerRelativeXposRight.value),
        sidebarMaxWidth
      )}px`;
    }
    columnRight.value.style.flexGrow = '0';
  } else {
    return false;
  }
};

onMounted(() => {
  dividerLeft.value = document.querySelector('.dividerLeft');
  dividerRight.value = document.querySelector('.dividerRight');
  columnLeft.value = document.querySelector('.columnLeft');
  columnRight.value = document.querySelector('.columnRight');
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
.columnLeft {
  flex: 1 1 auto;
  box-sizing: border-box;
  width: 14%;
}
.columnMiddle {
  flex: 1 1 auto;
  box-sizing: border-box;
  width: 72%;
}
.columnRight {
  flex: 1 1 auto;
  box-sizing: border-box;
  width: 14%;
}

.dividerLeft {
  width: 10px;
  padding: 0;
  cursor: ew-resize;
  flex: 0 0 auto;
}

.dividerLeft::before {
  content: '';
  display: block;
  width: 2px;
  height: 100%;
}

.dividerRight {
  width: 10px;
  padding: 0;
  cursor: ew-resize;
  flex: 0 0 auto;
}

.dividerRight::before {
  content: '';
  display: block;
  width: 2px;
  height: 100%;
}
</style>
