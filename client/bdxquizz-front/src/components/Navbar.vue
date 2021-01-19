<template>
  <div id="navbar">
    <b-navbar toggleable="lg" type="dark">
      <b-navbar-brand href="/"
        ><img
          src="@/assets/logo/Logo_white.png"
          alt="logo"
          height="100"
          width="100"
      /></b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav id="roads">
          <b-nav-item><router-link to="/">Home</router-link></b-nav-item>
          <b-nav-item><router-link to="/about">About</router-link></b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav id="logs" class="ml-auto">
          <div v-if="isLoggedIn">
            <b-nav-item-dropdown right>
              <!-- Using 'button-content' slot -->
              <template #button-content>
                <em>{{ username }}</em>
              </template>
              <b-dropdown-item><router-link :to="`/stats/user`">Profile</router-link></b-dropdown-item>
              <b-dropdown-item @click="handleLogout"> Logout </b-dropdown-item>
            </b-nav-item-dropdown>
          </div>
          <div v-else>
            <b-nav-item-dropdown right>
              <!-- Using 'button-content' slot -->
              <template #button-content>
                <em> User</em>
              </template>
              <b-dropdown-item @click="modalShow = !modalShow">
                Sign In
              </b-dropdown-item>
            </b-nav-item-dropdown>
          </div>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <b-modal v-model="modalShow" title="Login or sign up" :hide-footer="true">
      <modale-signup @on-click-event="handleLogEvent" />
    </b-modal>
  </div>
</template>

<script>
import ModaleSignup from './auth/ModaleSignup.vue';
import axios from 'axios';
export default {
  components: {
    ModaleSignup,
  },
  data() {
    return {
      modalShow: false,
      username: '',
      isLoggedIn: false,
    };
  },
  methods: {
    handleLogout() {
      localStorage.clear();
      this.isLoggedIn = false;
      this.$router.go(0);
    },
    handleLogEvent() {
      this.modalShow = false;
    },
  },
  mounted() {
    console.log(localStorage.getItem('token'));
    axios
      .get('/api/user')
      .then((res) => {
        this.username = res.data.user.username;
        this.isLoggedIn = true;
      })
      .catch((err) => {
        this.username = 'User';
        console.log(err);
        this.isLoggedIn = false;
      });
  },
};
</script>

<style>
#navbar{
  background-color: transparent;
}
#roads > li > a > a{
  color: white;
  font-size: x-large;
  text-decoration: none;
}
#roads > li > a > a:after {
  background: none repeat scroll 0 0 transparent;
  bottom: 25%;
  content: "";
  display: block;
  height: 2px;
  position: relative;
  background: #ffffff;
  transition: width 0.3s ease 0s, left 0.3s ease 0s;
  width: 0;
}
#roads > li > a > a:hover:after {
  width: 100%;
  left: 0;
}
#logs > div > li > a{
  font-size: large;
  outline: none;
}
#logs > div > li{
  outline: none;

}
a > a{
  color: #16181b;
}
a > a:hover {
  color: #16181b;
  text-decoration: none;
}
a > a:active {
  text-decoration: none;
}
</style>