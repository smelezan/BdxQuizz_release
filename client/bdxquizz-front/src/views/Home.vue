<template>
  <div>
    <div id="title" class="home">
      <h1>Welcome to bdxQuizz!!</h1>
      <br />
      <h2>Have fun and test your knowledge</h2>
      <h4>Check on the categories below</h4>
    </div>
    <div id="content">
      <b-container style="margin: 0px; max-width: 100%">
        <b-row class="mt-2 mb-2">
          <b-col md="2">
            <h1>Categories</h1>
          </b-col>
          <b-col md="6">
            <b-form-input
              id="type-search"
              type="search"
              placeholder="Search ..."
              v-model="searchQuery"
            ></b-form-input>
          </b-col>
          <b-col>
            <h4>Show all</h4>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="2" v-for="i in 6" :key="i">
            <CategoryCard
              v-if="i - 1 < resultQuery.length"
              v-bind="resultQuery[i - 1]"
            />
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios';
import CategoryCard from '@/components/categories/categoryCard.vue';

export default {
  name: 'Home',
  components: {
    CategoryCard,
  },
  data() {
    return {
      allCategories: [],
      searchQuery: null,
    };
  },
  created() {
    axios.get('/api/categories').then((res) => {
      console.log(res.data);
      this.allCategories = res.data.categories;
    });
  },
  computed: {
    resultQuery() {
      if (this.searchQuery) {
        const filter = this.allCategories.filter((item) =>
          item.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
        console.log(filter);
        return filter;
      } else {
        return this.allCategories;
      }
    },
  },
};
</script>
