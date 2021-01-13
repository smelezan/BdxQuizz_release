<template>
  <b-card
    :title="name"
    :img-src="require(`@/assets/categories-images/${name}.png`)"
    :img-alt="name"
    img-top
    tag="article"
    style="max-width: 20rem"
    class="mb-2"
  >
    <b-card-text> </b-card-text>
    <router-link :to="`/quizz-room/${name}`"
      ><b-button variant="primary">Play</b-button></router-link
    >
  </b-card>
</template>

<script>
export default {
  props: {
    id: String,
    categoryId: Number,
    name: String,
  },
};
</script>
