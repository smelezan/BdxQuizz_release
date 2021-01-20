<template>
  <b-form>
    <b-form-group id="input-group-1" label="Username: " label-for="input-1">
      <b-form-input
        id="input-1"
        v-model="form.username"
        type="text"
        placeholder="Put your username here"
        required
      ></b-form-input>
      <b-form-invalid-feedback :state="validation">
        {{ errorMessage }}
      </b-form-invalid-feedback>
    </b-form-group>

    <b-form-group id="input-group-2" label="Your Password:" label-for="input-2">
      <b-form-input
        id="input-2"
        v-model="form.password"
        placeholder="And your password here"
        required
        type="password"
      ></b-form-input>
      <b-form-invalid-feedback :state="validation">
        {{ errorMessage }}
      </b-form-invalid-feedback>
    </b-form-group>

    <b-button class="mr-2" @click="handleLogin" variant="primary">
      Login
    </b-button>
    <b-button class="ml-2" variant="success" @click="handleSignup">
      Sign up
    </b-button>
  </b-form>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      form: {
        username: '',
        password: '',
      },
      validation: true,
      errorMessage: '',
    };
  },
  methods: {
    handleSignup() {
      let newUser = {
        username: this.form.username,
        password: this.form.password,
      };

      axios.post('/api/auth/signup', newUser).then(
        (res) => {
          if (res.status === 200) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userId', res.data.userId);
            this.$router.go(0);
          } else {
            this.validation = false;
            this.errorMessage = 'something goes wrong';
          }
        },
        (err) => {
          console.log(err);
          this.validation = false;
          this.errorMessage = 'something goes wrong';
        }
      );
    },
    handleLogin() {
      let user = {
        username: this.form.username,
        password: this.form.password,
      };
      axios.post('/api/auth/login', user).then(
        (res) => {
          if (res.status === 200) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userId', res.data.userId);
            this.$router.go(0);
          }
        },
        (err) => {
          this.validation = false;
          this.errorMessage = 'Wrong username or password';
          console.log(err.response);
        }
      );
    },
  },
};
</script>
