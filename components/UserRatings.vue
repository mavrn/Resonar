<template>
  <div class="ratings-wrapper">
    <NuxtLink
      class="rating-card"
      v-for="rating in user?.ratings"
      :to="'/release/' + rating.release.uid"
    >
      <div class="rating-card-info">
        <div class="rating-card-release">
          <p>{{ rating.release.name }}</p>
          <p class="artist">{{ rating.release.artist?.name }}</p>
          <p class="date">
            {{
              ' ' +
              getTimeDescriptor(rating.created)
            }}
          </p>
        </div>
      </div>
      <div class="rating-card-end">
        <div class="rating-card-score">{{ rating.rating }}</div>
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
  display: grid;
  grid-template-columns: minmax(0, 1000px) minmax(0, 170px);
  grid-template-rows: 1fr;
  padding: 10px;
  margin-top: 10px;
  border-radius: var(--border-radius);
  text-decoration: none;
  min-width: 300px;
  color: black;
  outline: 1px solid black;
  @media (max-width: 599px) {
    grid-template-columns:  minmax(0, 1000px) minmax(0, 80px);;
  }
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
  opacity: 70%;
}

.artist {
  opacity: 90%;
  font-size: 17px;
}
.rating-card-end {
  align-items: center;
  justify-content: flex-end;
  display: flex;
}

.rating-card-info {
  display: flex;
  align-items: center;
}
.rating-card-score {
  height: 60px;
  width: 60px;
  border-radius: 50%;
  border-style: solid;
  border-width: 2px;
  border-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 25px;
  margin-right: 20px;
  @media (max-width: 599px) {
    display: none;
  }
}
.rating-card-score-sm {
  height: 60px;
  width: 60px;
  border-radius: 50%;
  border-style: solid;
  border-width: 2px;
  border-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 25px;
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
