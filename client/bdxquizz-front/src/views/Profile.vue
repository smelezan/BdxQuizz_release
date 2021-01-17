<template>
  <div>
    <div id="title" class="profile">
      <h1>Profile</h1>
      <br />
    </div>
    <div id="content">
      <b-container style="margin: 0px; max-width: 100%">
        <b-row class="m-auto">
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios';

export default {
  created() {
    axios.get('/api/user/profile').then((res) => {
      console.log(res.data);
      //this.allCategories = res.data.categories;
    });
  },
};
</script>