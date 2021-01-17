<template>
  <b-container style="margin: 0px; max-width: 100%">
    <b-row>
      <b-col> RoomCode: {{ roomCode }} </b-col>
      <b-col>
        <b-list-group>
          <b-list-group-item v-for="player in usernames" :key="player">
            {{ player }}
          </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
    <b-row>
      <b-button size="sm" class="my-2 my-sm-0" @click="handleClick">
        Start quizz
      </b-button>
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
      console.log(params.playersUsernames);
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
