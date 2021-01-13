<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="#"
        ><img
          src="@/assets/logo/Logo_white.png"
          alt="logo"
          height="50"
          width="50"
      /></b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item><router-link to="/">Home</router-link></b-nav-item>
          <b-nav-item> <router-link to="/about">About</router-link></b-nav-item>

          <b-nav-item href="#" disabled>Disabled</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <div v-if="isLoggedIn">
            <b-nav-item-dropdown right>
              <!-- Using 'button-content' slot -->
              <template #button-content>
                <em>{{ username }}</em>
              </template>
              <b-dropdown-item href="#">Profile</b-dropdown-item>
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

    <b-modal v-model="modalShow" title="Modal Variants" :hide-footer="true">
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
