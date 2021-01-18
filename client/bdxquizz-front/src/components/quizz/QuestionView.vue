<template>
  <b-container style="margin: 0px; max-width: 100%">
    <div v-if="!isEnded">
      <b-row class="mt-3">
        <b-col cols="12" md="12">
          <b-card class="text-center w-75 mx-auto" align="center">
            <b-card-text>{{ question.question }}</b-card-text>
          </b-card>
          <span id="true">{{ result.correct }}</span> |
          <span id="false">{{ result.wrong }}</span>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col cols="12" md="12">
          <b-row>
            <b-col
              cols="auto"
              md="6"
              class="w-75 mx-auto mt-3"
              v-for="(proposition, index) in question.propositions"
              :key="proposition"
              @click="handleClick(index)"
            >
              <b-card
                class="response"
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
      </b-row>
    </div>
    <div v-else>
      <b-row>
        <b-col cols="12" md="12" class="text-center" align="center">
          <h2>The quizz is over</h2>
          <h4>We hope you had fun</h4>
          <br />
          <h2>
            You scored: {{ result.correct }}/
            {{ result.correct + result.wrong }}
          </h2>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script>
import axios from 'axios';
export default {
  props: {
    roomCode: String,
    socket: Object,
  },
  data() {
    return {
      isDisabled: true,
      question: {},
      propositionsCards: [],
      currentAnswer: '',
      result: {
        correct: 0,
        wrong: 0,
      },
      isEnded: false,
    };
  },
  created() {
    this.socket.on('question', (params) => {
      this.isDisabled = false;
      console.log(params);
      this.displayQuestion(params);
    });
    this.socket.on('answer', (params) => {
      console.log(params);
      this.showAnswer(params.correctAnswer, this.currentAnswer);
      this.currentAnswer = '';

      this.isDisabled = true;
    });
    //this.getNextQuestion();
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
    displayQuestion(question) {
      if (question.message) {
        this.isEnded = true;
        this.$emit('update-stats', this.result);
      } else {
        this.propositionsCards = question.propositions.map(() => ({
          header_border_variant: 'secondary',
          header_text_variant: 'secondary',
          border_variant: 'secondary',
        }));

        this.question = question;
      }
    },
    handleClick(index) {
      if (this.isDisabled) return;
      this.currentAnswer = this.question.propositions[index];

      console.log(this.currentAnswer);
      this.socket.emit('answer', {
        roomcode: this.roomCode,
        answer: this.currentAnswer,
      });
      this.isDisabled = true;
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

<style>
.response {
  border-width: 2px;
}

#true::before {
  content: '';
  position: absolute;
  border-color: #198754;
  border-style: solid;
  border-width: 0 0.3em 0.25em 0;
  height: 1em;
  transform: translate(-20px, 18px) rotate(45deg);
  margin-top: -1em;
  width: 0.5em;
}
#false::after {
  content: 'X';
  font-weight: bolder;
  font-size: 120%;
  position: absolute;
  color: #dc3545;
  transform: translate(6px, -2px);
}
</style>