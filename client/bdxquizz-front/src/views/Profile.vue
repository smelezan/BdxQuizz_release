<template>
  <div>
    <div id="title" class="profile">
      <h1>Profile</h1>
      <br />
    </div>
    <div id="">
      <b-container style="margin: 0px; max-width: 100%">
        <b-row class="m-auto">
            Quizz Played : {{nbQuizzPlayed}}
        </b-row>
        <b-row class="m-auto">
            Quizz Won : {{nbQuizzWon}}
        </b-row>
        <b-row class="m-auto">
            Quizz Lost : {{nbQuizzLost}}
        </b-row>
        <b-row class="m-auto">
            Quizz Ratio : {{nbQuizzWon/nbQuizzPlayed}}
        </b-row>
        <b-row class="m-auto">
            Best Score : {{bestScore}}
        </b-row>
        <b-row class="m-auto">
            Average Score : {{averageScore}}
        </b-row>
        <b-row class="m-auto">
            Best Time : {{bestTime}}
        </b-row>
        <b-row class="m-auto">
            Average Time : {{averageTime}}
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios';

export default {
    data() {
        return {
            nbQuizzWon: 0,
            nbQuizzLost: 0,
            nbQuizzPlayed: 0,
            bestScore: 0,
            averageScore: 0,
            bestTime: 0,
            averageTime: 0
        };
    },
    created() {
        axios.get('/api/stats/user').then((res) => {
            console.log(res.data);
            this.nbQuizzWon = res.data.nbQuizzWon;
            this.nbQuizzLost = res.data.nbQuizzLost;
            this.nbQuizzPlayed = res.data.nbQuizzPlayed;
            this.bestScore = res.data.bestScore;
            this.averageScore = res.data.averageScore;
            this.bestTime = res.data.bestTime;
            this.averageTime = res.data.averageTime;
        });
    }
};

</script>