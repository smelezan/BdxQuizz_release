<template>
  <b-container style="margin: 0px; max-width: 100%">
    <b-row class="mb-5">
      <b-col cols="auto" md="6"> RoomCode: {{ roomCode }} </b-col>
      <b-col cols="auto" md="6">
        <b-container style="margin: 0px; max-width: 100%">
          <b-row>
            <b-col cols="6" md="6" class="text-right">
              <span>Players in :</span>
            </b-col>
            <b-col cols="6" md="6" class="text-left">
              <div v-for="player in usernames" :key="player">
                {{ player }}
              </div>
            </b-col>
          </b-row>
        </b-container>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12" md="12">
        <b-button size="sm" class="my-2 my-sm-0" variant="primary" @click="handleClick">
          Start quizz
        </b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  props: {
    roomCode: String,
    socket: Object,
  },
  data() {
    return {
      usernames: [],
    };
  },
  created() {
    this.socket.on('join', (params) => {
      this.usernames = params.playersUsernames;
    });
  },
  methods: {
    handleClick() {
      this.$emit('start-quizz');
    },
  },
};
</script>