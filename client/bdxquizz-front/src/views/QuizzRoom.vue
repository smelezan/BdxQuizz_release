<template>
  <div>
    <div id="title">
      <h1>{{ categoryName }}</h1>
      <br />
      <h2>Try out our different quizz modes</h2>
      <h4>Choose a mode below</h4>
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
        <h1>Waiting room</h1>
        <WaitingRoom :roomCode="roomCode" @start-quizz="handleStartQuizzClick" />
      </b-row>
      <b-row v-else>
        <QuestionView :roomCode="roomCode" />
      </b-row>
      <b-modal v-model="showAuthInfoModale" ok-only>
        To continue, you must be authenticated
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
        })
        .catch(() => (this.showAuthInfoModale = true));
    },
    handleStartQuizzClick() {
      this.isQuizzStarted = true;
    },
  },
};
</script>
