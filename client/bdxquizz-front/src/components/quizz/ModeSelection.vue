<template>
  <b-container style="margin: 0px; max-width: 100%">
    <h1>{{ categoryName }}</h1>
    <h2>Select your mode</h2>
    <b-row>
      <b-col md="2"></b-col>
      <b-col md="3">
        <b-card title="Zen" tag="article" style="max-width: 20rem" class="mb-2">
          <b-card-text> </b-card-text>
          <b-form-group
            id="input-group-3"
            label="Difficulty:"
            label-for="input-3"
          >
            <b-form-select
              id="input-3"
              v-model="form.difficulty"
              :options="difficulty"
              required
            ></b-form-select>
          </b-form-group>
          <b-button variant="primary" @click="startQuizz('ZEN')"
            >Start quizz</b-button
          >
        </b-card>
      </b-col>
      <b-col md="3">
        <b-card
          title="Standard"
          tag="article"
          style="max-width: 20rem"
          class="mb-2"
        >
          <b-card-text> </b-card-text>
          <b-form-group
            id="input-group-3"
            label="Difficulty:"
            label-for="input-3"
          >
            <b-form-select
              id="input-3"
              v-model="form.difficulty"
              :options="difficulty"
              required
            ></b-form-select>
          </b-form-group>
          <b-button variant="primary" @click="startQuizz('STANDARD')">
            Start quizz
          </b-button>
        </b-card>
      </b-col>
      <b-col md="3">
        <b-card
          title="Endless"
          tag="article"
          style="max-width: 20rem"
          class="mb-2"
        >
          <b-card-text> </b-card-text>
          <b-form-group
            id="input-group-3"
            label="Difficulty:"
            label-for="input-3"
          >
            <b-form-select
              id="input-3"
              v-model="form.difficulty"
              :options="difficulty"
              required
            ></b-form-select>
          </b-form-group>
          <b-button variant="primary" @click="startQuizz('ENDLESS')">
            Start quizz
          </b-button>
        </b-card>
      </b-col>

      <b-col md="1"></b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  props: {
    categoryName: String,
  },
  data() {
    return {
      form: {
        difficulty: 'easy',
      },
      difficulty: ['easy', 'medium', 'hard', 'any'],
    };
  },
  methods: {
    startQuizz(mode) {
      this.$emit('mode-chosen', { mode, difficulty: this.form.difficulty });
    },
  },
};
</script>
