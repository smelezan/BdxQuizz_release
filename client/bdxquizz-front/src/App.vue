<template>
  <div id="app">
    <Navbar />
    <router-view />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';

export default {
  components: {
    Navbar,
  },
};
</script>
<style>
html {
  position: relative;
  min-height: 100%;
  margin: 0px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-image: linear-gradient(
    to right top,
    #0552e3,
    #3e47db,
    #573ad2,
    #6a2ac7,
    #790fbc
  );
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  position: relative;
}
#title {
  min-height: 20vh;
  background-size: cover;
  padding-top: 50px;
  color: #ffffff;
}
#content {
  margin-left: 2%;
  margin-right: 2%;
  padding-bottom: 30px;
  position: relative;
  color: #422e9b;
  margin-top: 150px;
  padding-top: 50px;
}
#content:before {
  content: "";
  background-image: linear-gradient(
    to top,
    #144553,
    #205565,
    #2d6677,
    #39778a,
    #46899e,
    #5898ac,
    #69a8ba,
    #7bb8c9,
    #95c8d6,
    #aed9e3,
    #c7e9f1,
    #e0faff
  );
  position: absolute;
  min-height: 70vh;
  width: 2200px;
  top: -50px;
  left: -250px;
  transform: rotate(4deg);
  z-index: 0;

  -webkit-box-shadow: -2px -1px 15px 7px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: -3px -2px 30px 14px rgba(0, 0, 0, 0.425);
  box-shadow: -4px -3px 45px 21px rgba(0, 0, 0, 0.35);
}
.col {
  margin-bottom: 10px;
}
</style>
