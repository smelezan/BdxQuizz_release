<template>
  <b-container id="quizz" class="w-75 mx-auto shadow">
    <div v-if="!isEnded">
      <b-row class="mt-3" :style="{visibility: mode === 'STANDARD' ? 'visible' : 'hidden'}">
        <b-col cols="12" md="12">
          <div class="text-center mx-auto"><h4 ref="chrono">00:0</h4></div>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col cols="12" md="12">
          <b-card class="text-center w-75 mx-auto shadow mb-3" align="center">
            <b-card-text>{{ question.question }}</b-card-text>
          </b-card>
          <span id="true">{{ result.correct }}</span> |
          <span id="false">{{ result.wrong }}</span>
        </b-col>
      </b-row>
      <b-row class="w-75 mx-auto">
        <b-col cols="12" md="12" >
          <b-row class="my-5">
            <b-col
              cols="auto"
              md="6"
              class="w-75 mx-auto mt-3"
              v-for="(proposition, index) in question.propositions"
              :key="proposition"
              @click="handleClick(index)"
            >
              <b-card
                class="response shadow"
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
        <b-col cols="12" md="12" class="text-center my-3" align="center">
          <h2>The quizz is over</h2>
          <h4>We hope you had fun</h4>
          <br />
          <h2>
            <span>You scored:</span>
            <br />
            <span>{{ result.correct }} /
            {{ result.correct + result.wrong }}</span>
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
    mode: String,
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
      firstQuestion: true,
      isEnded: false,
      start: 0,
      end: 0,
      diff: 0,
      timerID: 0,
    };
  },
  created() {
    console.log(this.mode);
    this.socket.on('question', (params) => {
      if (this.firstQuestion) {
        this.firstQuestion = false;
        setTimeout(this.chronoStart, 10);
      }
      this.isDisabled = false;
      console.log(params);
      this.displayQuestion(params);
    });
    this.socket.on('answer', (params) => {
      console.log(params);
      this.showAnswer(
        params.correctAnswer,
        this.currentAnswer,
        params.isCorrect
      );
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
        this.chronoStop();
        this.$emit('update-stats', this.result, this.getTimer());
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
      this.nbQuestion++;
      this.socket.emit('answer', {
        roomcode: this.roomCode,
        answer: this.currentAnswer,
        mode: this.mode,
      });
      this.isDisabled = true;
    },
    showAnswer(answer, propsitionSelected, isCorrect) {
      const propositions = this.question.propositions;
      const indexAnswer = propositions.findIndex(
        (element) => element === answer
      );
      console.log(propsitionSelected);
      let indexProposition = indexAnswer;
      if (propsitionSelected) {
        indexProposition = propositions.findIndex(
          (element) => element === propsitionSelected
        );
      }
      if (isCorrect) this.result.correct += 1;
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

    chrono() {
      this.end = new Date();
      this.diff = new Date(this.end - this.start);
      this.$refs.chrono.innerText = this.getTimer();
      this.timerID = setTimeout(this.chrono, 1000);
    },
    
    getTimer() {
      let minutes = this.diff.getMinutes();
      let seconds = this.diff.getSeconds();

      if (minutes < 10) minutes = '0' + minutes;
      if (seconds < 10) seconds = '0' + seconds;
      return minutes + ':' + seconds;
    },

    chronoStart() {
      this.start = new Date();
      this.chrono();
    },

    chronoPause(time) {
      clearTimeout(this.timerID);
      this.timerID = setTimeout(this.chrono, time);
    },

    chronoStop() {
      clearTimeout(this.timerID);
    },
  },
};
</script>

<style scoped>
#quizz{
  border: 1px solid transparent;
  border-radius: 10px;
  background-color: white;
  transform: translateY(-200px);
}

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