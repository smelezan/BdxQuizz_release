<template>
  <b-container style="margin: 0px; max-width: 100%">
    <div v-if="!isEnded">
      <b-row class="mt-3">
        <b-col md="3"></b-col>
        <b-col md="6">
          <b-card class="text-center" align="center">
            <b-card-text>{{ question.question }}</b-card-text>
          </b-card>
          {{ result.correct }} ----- {{ result.wrong }}
        </b-col>
        <b-col md="3"></b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col md="2"></b-col>
        <b-col md="8">
          <b-row>
            <b-col
              md="6"
              class="mt-3"
              v-for="(proposition, index) in question.propositions"
              :key="proposition"
              @click="handleClick(index)"
            >
              <b-card
                :border-variant="propositionsCards[index].border_variant"
                :header-border-variant="
                  propositionsCards[index].header_border_variant
                "
                :header-text-variant="
                  propositionsCards[index].header_text_variant
                "
              >
                <b-card-text>
                  {{ proposition }}
                </b-card-text>
              </b-card>
            </b-col>
          </b-row>
        </b-col>
        <b-col md="2"></b-col>
      </b-row>
    </div>
    <div v-else>
      <b-row>
        <b-col md="3"></b-col>
        <b-col md="6" class="text-center" align="center"
          ><b-row class="text-center" align="center">
            <h2>Nice, it's over</h2>
          </b-row>
          <b-row class="text-center" align="center">
            <h2>
              Your score: {{ result.correct }}/
              {{ result.correct + result.wrong }}
            </h2>
          </b-row></b-col
        >
        <b-col md="3"></b-col>
      </b-row>
    </div>
  </b-container>
</template>
<script>
import axios from 'axios';
export default {
  props: {
    roomCode: String,
  },
  data() {
    return {
      question: {},
      propositionsCards: [],
      result: {
        correct: 0,
        wrong: 0,
      },
      isEnded: false,
    };
  },
  created() {
    this.getNextQuestion();
  },
  methods: {
    getNextQuestion() {
      axios
        .put('/api/room/question', { roomCode: this.roomCode })
        .then((response) => {
          if (response.data.message) {
            this.isEnded = true;
          } else {
            const question = response.data.question;
            this.propositionsCards = question.propositions.map(() => ({
              header_border_variant: 'secondary',
              header_text_variant: 'secondary',
              border_variant: 'secondary',
            }));
            this.question = response.data.question;
          }
        });
    },
    handleClick(index) {
      const answer = this.question.propositions[index];
      console.log(answer);
      axios
        .post('/api/room/answer', {
          roomCode: this.roomCode,
          answer,
        })
        .then((response) => {
          console.log(response.data);
          this.showAnswer(
            response.data.correctAnswer,
            this.question.propositions[index]
          );
          setTimeout(() => {
            this.getNextQuestion();
          }, 2000);
        });
    },
    showAnswer(answer, propsitionSelected) {
      const propositions = this.question.propositions;
      const indexProposition = propositions.findIndex(
        (element) => element === propsitionSelected
      );
      const indexAnswer = propositions.findIndex(
        (element) => element === answer
      );
      if (answer === propsitionSelected) this.result.correct += 1;
      else this.result.wrong += 1;
      console.log(indexProposition);
      this.propositionsCards[indexProposition]['header_border_variant'] =
        'danger';
      this.propositionsCards[indexProposition]['border_variant'] = 'danger';
      this.propositionsCards[indexProposition]['header_text_variant'] =
        'danger';
      this.propositionsCards[indexAnswer]['header_border_variant'] = 'success';
      this.propositionsCards[indexAnswer]['border_variant'] = 'success';
      this.propositionsCards[indexAnswer]['header_text_variant'] = 'success';
    },
  },
};
</script>
