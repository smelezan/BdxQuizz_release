<template>
  <div>
    <div id="title" class="home">
      <h1>Categories</h1>
      <br />
      <h2>We hope you will find one to your liking</h2>
      <h4>Check on the categories below</h4>
    </div>
    <div id="content">
      <b-container style="margin: 0px; max-width: 100%">
        <b-row class="m-auto">
          <b-col v-for="category in allCategories"
          :key="category.id" class="m-auto" cols="auto" md="auto">
            <CategoryCard
            :name="category.name"
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
  name: 'Categories',
  components: {
    CategoryCard,
  },
  data() {
    return {
      allCategories: [],
    };
  },
  created() {
    axios.get('/api/categories').then((res) => {
      this.allCategories = res.data.categories;
    });
  },
};
</script>

<style>
@media screen and (max-width: 1796px){
  #content:before{
    height: 2000px;
  }
}

@media screen and (max-width: 1504px){
  #content:before{
    height: 2200px;
  }
}

@media screen and (max-width: 1212px){
  #content:before{
    height: 2700px;
  }
}

@media screen and (max-width: 921px){
  #content:before{
    height: 3900px;
  }
}

@media screen and (max-width: 629px){
  #content:before{
    left: -300px;
    height: 7600px;
  }
}
</style>