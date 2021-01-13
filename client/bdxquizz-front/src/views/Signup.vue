<template>
  <div>
    username: <input type="text" v-model="username" /> <br />
    password: <input type="text" v-model="password" /> <br />
    <button @click="signup">signup</button>
    <button @click="login">login</button>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Signup',
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    signup() {
      let newUser = {
        username: this.username,
        password: this.password,
      };
      axios.post('/api/auth/signup', newUser);
    },
    login() {
      let user = {
        username: this.username,
        password: this.password,
      };
      axios.post('/api/auth/login', user).then(
        (res) => {
          if (res.status === 200) {
            localStorage.setItem('token', res.data.token);
            this.$router.push('/');
          }
        },
        (err) => {
          console.log(err.response);
        }
      );
    },
  },
};
</script>
