<template>
  <div id="app">
    <p>{{ categories }}</p>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'App',
  data() {
    return {
      categories: [],
    };
  },
  components: {},
  created() {
    axios
      .get('http://localhost:4000/categories')
      .then((res) => (this.categories = res.data));
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
