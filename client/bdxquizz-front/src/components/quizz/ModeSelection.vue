<template>
  <b-container style="margin: 0px; max-width: 100%">
    <b-row class="m-auto">
      <b-col cols="auto" md="auto" class="mx-auto mb-3">
        <b-card
          class="shadow"
          title="Zen"
          :img-src="require('@/assets/modes-images/zen.jpg')"
          img-alt="zen"
          img-height="132"
          img-width="198"
          tag="article"
          style="height: 410px; width: 260px"
        >
          <b-card-text>No timer, no pressure</b-card-text>
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
      <b-col cols="auto" md="auto" class="mx-auto mb-3">
        <b-card
          class="shadow"
          title="Classic"
          :img-src="require('@/assets/modes-images/classic.png')"
          img-alt="classic"
          img-height="132"
          img-width="198"
          tag="article"
          style="height: 410px; width: 260px"
        >
          <b-card-text>Do your best</b-card-text>
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
      <b-col cols="auto" md="auto" class="mx-auto mb-3">
        <b-card
          class="shadow"
          title="Infinite"
          :img-src="require('@/assets/modes-images/infinite.png')"
          img-alt="infinite"
          img-height="132"
          img-width="198"
          tag="article"
          style="height: 410px; width: 260px"
        >
          <b-card-text>How long will you last ?</b-card-text>
          <b-form-group
            id="input-group-3"
            label="Difficulty:"
            label-for="input-3"
            style="visibility:hidden"
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
      <b-col cols="auto" md="auto" class="mx-auto mb-3">
        <b-card
          title="Versus"
          class="shadow"
          :img-src="require('@/assets/modes-images/defy.png')"
          img-alt="versus"
          img-height="132"
          img-width="198"
          tag="article"
          style="height: 410px; width: 260px"
        >
          <b-card-text>Join a quizz with your friends</b-card-text>
          <b-form-group
            id="input-group-3"
            label="Room code:"
            label-for="input-4"
          >
            <b-form-input
              id="input-4"
              type="search"
              placeholder="Enter the room code here"
              v-model="searchQuery"
            ></b-form-input>
          </b-form-group>
          <b-button variant="primary" @click="startQuizz('Join')">
            Start quizz
          </b-button>
        </b-card>
      </b-col>
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
      searchQuery: '',
      form: {
        difficulty: 'any',
      },
      difficulty: ['easy', 'medium', 'hard', 'any'],
    };
  },
  methods: {
    startQuizz(mode) {
      this.$emit('mode-chosen', {
        mode,
        difficulty: this.form.difficulty,
        roomcode: this.searchQuery,
      });
    },
  },
};
</script>

<style scopped>
#content > .container{
  padding: 0px;
}
#content > .container > .row > .container{
  padding: 0px;
}
#content > .container > .row > .container > .row > div{
  padding: 0px;
}
@media screen and (max-width: 764px) {
  #content:before {
    height: 2300px;
  }
}
</style>