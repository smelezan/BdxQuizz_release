<template>
  <div>
    <div id="title">
      <h1>{{ categoryName }}</h1>
      <br />
      <h2 v-if="!isModeSelected">Try out our different quizz modes</h2>
      <h2 v-else>Bring some friends with you</h2>
      <h4 v-if="!isModeSelected">Choose a mode below</h4>
      <h4 v-else>And start whenever you want</h4>
    </div>
    <div id="content">
      <b-container style="margin: 0px; max-width: 100%">
        <b-row v-if="!isModeSelected" class="m-auto">
          <ModeSelection
            :categoryName="categoryName"
            @mode-chosen="handleModeClick"
          />
        </b-row>
        <b-row v-else-if="!isQuizzStarted">
          <b-col class="mb-5">
            <h1>Waiting room</h1>
          </b-col>
          <WaitingRoom
            :roomCode="roomCode"
            @start-quizz="handleStartQuizzClick"
            :socket="socket"
          />
        </b-row>
        <b-row v-else>
          <QuestionView
            :roomCode="roomCode"
            :socket="socket"
            @update-stats="updateStats"
            :mode="mode"
          />
        </b-row>
        <b-modal v-model="showAuthInfoModale" ok-only>
          {{ errorMessage }}
        </b-modal>
      </b-container>
    </div>
  </div>
</template>

<script>
import ModeSelection from '@/components/quizz/ModeSelection.vue';
import WaitingRoom from '@/components/quizz/WaitingRoom.vue';
import QuestionView from '@/components/quizz/QuestionView.vue';
import axios from 'axios';
import { io } from 'socket.io-client';
export default {
  data() {
    return {
      username: '',
      isModeSelected: false,
      categoryName: '',
      mode: '',
      roomCode: '',
      test: true,
      isQuizzStarted: '',
      showAuthInfoModale: false,
      socket: null,
      errorMessage: 'To continue, you must be authenticated',
    };
  },
  components: {
    ModeSelection,
    WaitingRoom,
    QuestionView,
  },
  created() {
    this.categoryName = this.$route.params.name;
  },

  methods: {
    handleModeClick(payload) {
      this.mode = payload.mode;
      if (this.mode == 'Join') {
        const roomCode = payload.roomcode;
        console.log(payload);
        console.log(roomCode);
        axios
          .get(`/api/room/${roomCode}`)
          .then((result) => {
            this.roomCode = roomCode;
            this.isModeSelected = true;
            this.mode = result.data.mode;
            console.log(this.mode);
            this.socket = io({
              withCredentials: true,
              extraHeaders: {
                'my-custom-header': 'abcd',
              },
              query: {
                roomcode: this.roomCode,
                token: localStorage.getItem('token'),
              },
            });
            console.log(this.roomCode);
            this.socket.emit('join-room', { roomCode });
          })
          .catch(() => {
            this.errorMessage = "This room doesn't exist";
            this.showAuthInfoModale = true;
          });
      } else {
        axios
          .post('/api/room/', {
            host: localStorage.getItem('userId'),
            mode: this.mode,
            category: this.categoryName,
            difficulty: payload.difficulty,
          })
          .then((response) => {
            this.roomCode = response.data.roomCode;
            console.log(this.roomCode);
            this.isModeSelected = true;
            this.socket = io({
              withCredentials: true,
              extraHeaders: {
                'my-custom-header': 'abcd',
              },
              query: {
                roomcode: this.roomCode,
                token: localStorage.getItem('token'),
              },
            });
          })
          .catch(() => (this.showAuthInfoModale = true));
      }
    },
    handleStartQuizzClick() {
      this.isQuizzStarted = true;
      this.socket.emit('start', { roomcode: this.roomCode, mode: this.mode });
    },

    updateStats(result, timeResult) {
      // console.log('TEMPS' + time);
      axios.put('/api/stats/' + this.categoryName, {
        nbGoodAnswers: result.correct,
        nbBadAnswers: result.wrong,
      });

      if (result.wrong == 0) {
        this.quizzWon = 1;
        this.quizzLost = 0;
      } else {
        this.quizzWon = 0;
        this.quizzLost = 1;
      }
      axios.put('/api/stats/user', {
        category: this.categoryName,
        nbQuizzWon: this.quizzWon,
        nbQuizzLost: this.quizzLost,
        score: result.correct,
        time: timeResult,
      });
    },
  },
};
</script>

<style>
#content > h1 {
  color: black;
}
</style>