<template>
  <div>
    <div id="title">
      <h1>Ranking</h1>
      <br />
      <h2>See the best players by categories</h2>
      <h4>And try to be the next one</h4>
    </div>
    <div id="content">
      <b-container id="ranking" class="py-5 w-75 mx-auto" style="margin: 0px; max-width: 100%">
        <b-row class="mb-3 d-flex align-items-center">
          <b-col cols="12" md="12">
            <h2>Category</h2>
          </b-col>
          <b-col cols="6" md="6">
            <h2>Best player</h2>
          </b-col>
          <b-col cols="6" md="6">
            <h2>You</h2>
          </b-col>
        </b-row>
        <hr class="w-75">
        <b-row class="w-75 mx-auto"
        v-for="category in categories"
        :key="category.id">
          <b-col cols="12" md="12"
          class="py-3 w-75 mx-auto shadow category">
            <b-container style="margin: 0px; padding: 0px; max-width: 100%">
              <b-row class="d-flex align-items-center">
                <b-col cols="12" md="12">
                  <h4>{{category.name}}</h4>
                  <hr class="w-75">
                </b-col>
                <b-col cols="6" md="6">
                  <b-container style="margin: 0px; max-width: 100%">
                    <b-row>
                      <b-col cols="12" md="12">
                        {{category.genStats.bestPlayer}}
                      </b-col>
                      <b-col cols="12" md="12">
                        {{category.genStats.bestScore}}
                      </b-col>
                    </b-row>
                  </b-container>
                </b-col>
                <b-col cols="6" md="6">
                  <b-container style="margin: 0px; max-width: 100%">
                    <b-row>
                      <b-col cols="12" md="12">
                        {{name}}
                      </b-col>
                      <b-col cols="12" md="12">
                        {{category.userStats.bestScore}}
                      </b-col>
                    </b-row>
                  </b-container>
                </b-col>
              </b-row>
            </b-container>
          </b-col>
          <b-col cols="12" md="12" class="my-3">
            <hr>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Ranking',
  data() {
    return {
      categories: [],
      name: "username",
    };
  },
  mounted() {
    axios.get('/api/categories').then((resCat) => {
      axios.get('/api/stats/user').then((resUser) => {
        console.log(resCat.data);
        console.log(resUser.data);
        
        this.name = resUser.data.username;

        const allCategories = resCat.data.categories;
        for(let category in resUser.data.stats.category){
          const genStats = this.getCategory(allCategories, category);
          this.categories.push({
            name: category,
            userStats: resUser.data.stats.category[category],
            genStats: genStats
          });
        }
        
        console.log(this.categories);
      });
    });
  },
  methods: {
    getCategory(allCategories, name){
      for(let index in allCategories){
        if(allCategories[index].name === name)
          return allCategories[index].stats;
      }
      return null;
    }
  }
};
</script>

<style scoped>
#title{
  height: 250px;
}
#content:before{
  width: 2500px;
  height: 6000px;
}
#ranking{
  border: 1px solid transparent;
  border-radius: 10px;
  background-color: white;
  transform: translateY(-200px);
}
.category{
  border-radius: 20px;
  background-color: #e6e6e675;
}
</style>