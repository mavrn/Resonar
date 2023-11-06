<template>
  <div class="comments-wrapper">
    <NuxtLink
      class="comment-card"
      v-for="comment in user?.comments"
      :to="'/release/' + comment.release.uid"
    >
      <div class="comment-card-row-1 show-bigger-than-md-block">
        Commented on {{ comment.release.name }}<br>
        {{ getTimeDescriptor(comment.created) }}
      </div>
      <div class="comment-card-row-1-sm show-smaller-than-md-block">
        {{ comment.release.name }}<br>
        {{ getTimeDescriptor(comment.created) }}
      </div>
      <div class="comment-card-row-2">"{{ comment.content }}"</div>
      <div class="comment-card-col-1">
        <img class="cover" :src="comment.release.cover" />
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
defineProps({ user: User });
</script>

<style scoped>
.comments-wrapper {
  padding: 10px;
}
.comment-card {
  display: grid;
  grid-template-columns: minmax(0, 1000px) minmax(0, 100px);
  grid-template-rows: 1fr 1fr;
  padding: 10px;
  margin-top: 10px;
  border-radius: var(--border-radius);
  text-decoration: none;
  min-width: 300px;
  color: black;
  outline: 1px solid black;
}

.comment-card:hover {
  background-color: #d5e3de;
}

.comment-card-row-1 {
  grid-area: 1 / 1 / 2 / 2;
  font-size: 12px;
}

.comment-card-row-1-sm {
  grid-area: 1 / 1 / 2 / 2;
  font-size: 12px;
}

.comment-card-row-2 {
  grid-area: 2 / 1 / 3 / 2;
  font-size: 20px;
}
.comment-card-col-1 {
  grid-area: 1 / 2 / 3 / 3;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.cover {
  height: 90px;
  width: auto;
  aspect-ratio: 1;
  border-radius: var(--border-radius);
  margin-left: 40px;
}
</style>
