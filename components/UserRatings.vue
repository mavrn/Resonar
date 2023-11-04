<template>
  <div class="ratings-wrapper">
    <NuxtLink
      class="rating-card"
      v-for="rating in user?.ratings"
      :to="'/release/' + rating.release.uid"
    >
      <div class="rating-card-info">
        <div class="rating-card-release">
          <p>{{ rating.release.title }}</p>
          <p>{{ rating.release.artist?.name }}</p>
          <p class="date">
            {{
              ' ' +
              getTimeDescriptor(rating.created)
            }}
          </p>
        </div>
        <div class="rating-card-score">{{ rating.rating }}</div>
      </div>
      <div class="rating-card-end">
        <img class="cover" :src="rating.release.cover" />
        <div class="rating-card-score-sm">{{ rating.rating }}</div>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
defineProps({ user: User });
</script>

<style scoped>
.ratings-wrapper {
  padding: 10px;
}
.rating-card {
  display: flex;
  padding: 10px;
  margin-top: 10px;
  border-radius: var(--border-radius);
  background-color: #e9f2ef;
  text-decoration: none;
  color: black;
  gap: 10px;
  justify-content: space-between;
}

.rating-card:hover {
  background-color: #d5e3de;
}

.rating-card-release {
  font-size: 23px;
  min-width: 180px;
}

.date {
  font-size: 13px;
  padding-top: 15px;
}

.rating-card-end {
  align-items: center;
}

.rating-card-info {
  display: flex;
  align-items: center;
}
.rating-card-score {
  height: 90px;
  width: 90px;
  border-radius: 50%;
  border-style: solid;
  border-width: 2px;
  border-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  margin-right: 20px;
  @media (max-width: 600px) {
    display: none;
  }
}
.rating-card-score-sm {
  height: 90px;
  width: 90px;
  border-radius: 50%;
  border-style: solid;
  border-width: 2px;
  border-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  margin-right: 20px;
  @media (min-width: 600px) {
    display: none;
  }
}
.cover {
  height: 90px;
  width: auto;
  aspect-ratio: 1;
  border-radius: var(--border-radius);
  @media (max-width: 600px) {
    display: none;
  }
}
</style>
