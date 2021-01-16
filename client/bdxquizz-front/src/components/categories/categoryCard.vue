<template>
  <b-card
    :title="name"
    :img-src="require(`@/assets/categories-images/${name}.png`)"
    img-height="132"
    img-width="198"
    :img-alt="name"
    img-top
    tag="article"
    style="height: 300px; width: 250px"
    class="mb-2"
  >
    <router-link :to="`/quizz-room/${name}`"
      ><b-button variant="primary" class="m-auto">Play</b-button></router-link
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

<style>
.card-body{
  padding: 5px;
}
.card-body > .card-title {
  display: flex;
  vertical-align: middle;
  justify-content: center;
  align-items: center;
  height: 84px;
}
.card-body > a {
  width: 108px;
  margin-bottom: 2em;
}
.card-body > a > .btn {
  width: 108px;
}
</style>