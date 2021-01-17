<template>
  <b-container style="margin: 0px; max-width: 100%">
    <b-row v-if="!isModeSelected">
      <ModeSelection
        :categoryName="categoryName"
        @mode-chosen="handleModeClick"
      />
    </b-row>
    <b-row v-else-if="!isQuizzStarted">
      <h1>Waiting room</h1>
      <WaitingRoom
        :roomCode="roomCode"
        @start-quizz="handleStartQuizzClick"
        :socket="socket"
      />
    </b-row>
    <b-row v-else>
      <QuestionView :roomCode="roomCode" :socket="socket" />
    </b-row>
    <b-modal v-model="showAuthInfoModale" ok-only>
      To continue, you must be authenticated
    </b-modal>
  </b-container>
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
      isModeSelected: false,
      categoryName: '',
      mode: '',
      roomCode: '',
      test: true,
      isQuizzStarted: '',
      showAuthInfoModale: false,
      socket: null,
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

        axios.get(`/api/room/${roomCode}`).then(() => {
          this.roomCode = roomCode;
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
          this.socket.emit('join-room', { roomcode: this.roomCode });
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
      this.socket.emit('start', { roomcode: this.roomCode });
    },
  },
};
</script>
