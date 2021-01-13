<template>
  <b-container style="margin: 0px; max-width: 100%">
    <b-row>
      <b-col> RoomCode: {{ roomCode }} </b-col>
      <b-col> Waiting for players ..... </b-col>
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
  },
  methods: {
    handleClick() {
      this.$emit('start-quizz');
    },
  },
};
</script>
