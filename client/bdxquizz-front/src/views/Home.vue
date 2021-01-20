<template>
  <div>
    <div id="title" class="home">
      <h1>Welcome to bdxQuiz!!</h1>
      <br />
      <h2>Have fun and test your knowledge</h2>
      <h4>Check on the categories below</h4>
    </div>
    <div id="content">
      <b-container style="margin: 0px; max-width: 100%">
        <b-row
          class="mt-2 mb-5 text-center justify-content-center d-flex align-items-center"
        >
          <b-col cols="12" md="3">
            <h1>Categories</h1>
          </b-col>
          <b-col cols="8" md="6">
            <b-form-input
              id="type-search"
              type="search"
              placeholder="Search ..."
              v-model="searchQuery"
            ></b-form-input>
          </b-col>
          <b-col cols="4" md="3">
            <h4>
              <router-link to="/categories"><span>Show all</span></router-link>
            </h4>
          </b-col>
        </b-row>
        <b-row class="m-auto">
          <b-col class="m-auto" cols="auto" md="auto" v-for="i in 6" :key="i">
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
      roomcode: '',
    };
  },
  created() {
    axios.get('/api/categories').then((res) => {
      this.allCategories = res.data.categories;
    });
  },
  methods: {
    handleJoinRoomClick() {},
  },
  computed: {
    resultQuery() {
      if (this.searchQuery) {
        const filter = this.allCategories.filter((item) =>
          item.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
        return filter;
      } else {
        return this.allCategories;
      }
    },
  },
};
</script>

<style>
h1 {
  margin: 0px;
}
h4 {
  margin: 0px;
}
</style>