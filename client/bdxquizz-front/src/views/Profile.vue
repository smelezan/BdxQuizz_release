<template>
  <div>
    <div id="title" class="profile">
      <h1>Profile</h1>
      <br />
    </div>
    <div>
      <b-container id="content" style="margin: 0px; max-width: 100%">
        <b-row>
          <b-col >
            <button class="button" @click="updateChart">Update</button>
          </b-col>
        </b-row>
        <b-row class="d-flex align-items-center mx-auto my-5">
            <b-col cols="12" md="6">
              Quizz Played : {{nbQuizzPlayed}} <br />
              Quizz Won : {{nbQuizzWon}} <br />
              Quizz Lost : {{nbQuizzLost}} <br />
              Quizz Ratio : {{nbQuizzWon/nbQuizzPlayed}}
          </b-col>
          <b-col cols="12" md="6">
            <PieChart ref="quizz_chart" :chartdata="quizzData"></PieChart>
          </b-col>
        </b-row>
        <b-row class="mx-auto my-3">
          <b-col cols="6" md="6">
            Best Score : {{bestScore}}
          </b-col>
          <b-col cols="6" md="6">
            Average Score : {{averageScore}}
          </b-col>
        </b-row>
        <b-row class="mx-auto mb-5">
          <b-col cols="12" md="12">
            <LineChart ref="score_chart" :chartdata="scoreData"></LineChart>
          </b-col>
        </b-row>
        <b-row class="mx-auto my-3">
          <b-col cols="6" md="6">
            Best Time : {{bestTime}}
          </b-col>
          <b-col cols="6" md="6">
            Average Time : {{averageTime}}
          </b-col>
        </b-row>
        <b-row class="mx-auto mb-5">
          <b-col cols="12" md="12">
            <LineChart ref="time_chart" :chartdata="timeData"></LineChart>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios';
import PieChart from '@/components/PieChart';
import LineChart from '@/components/LineChart';

    export default {
    components: {
        PieChart,
        LineChart,
    },
    data() {
        return {
            nbQuizzWon: 0,
            nbQuizzLost: 0,
            nbQuizzPlayed: 0,
            bestScore: 0,
            averageScore: 0,
            bestTime: 0,
            averageTime: 0,
            quizzData: null,
            scoreData: null,
            timeData: null,
        };
    },
    mounted() {
        axios.get('/api/stats/user').then((res) => {
            this.nbQuizzWon = res.data.nbQuizzWon;
            this.nbQuizzLost = res.data.nbQuizzLost;
            this.nbQuizzPlayed = res.data.nbQuizzPlayed;
            this.bestScore = res.data.bestScore;
            this.averageScore = res.data.averageScore;
            this.bestTime = res.data.bestTime;
            this.averageTime = res.data.averageTime;

            const scores = res.data.scores;
            const times = res.data.times;
            console.log(times);

            let labels = [];
            for(let index = 0; index < scores.length; index++)
                labels.push(index+1);

            this.quizzData = {
                labels: ["Win", 'Lose'],
                datasets: [{
                    backgroundColor: ["#AA0055", "#00D8FF"],
                    data: [this.nbQuizzWon, this.nbQuizzLost]
                }]
            }
            this.scoreData = {
                labels: labels,
                datasets: [{
					lineTension: 0,
                    backgroundColor: "#00D8FF",
                    data: scores
                }]
            }
            this.timeData = {
                labels: labels,
                datasets: [{
					lineTension: 0,
                    backgroundColor: "#00D8FF",
                    data: times
                }]
            }
            this.updateChart();
        });
    },
    methods: {
        updateChart () {
            console.log(this.scoreData);
            this.$refs.quizz_chart.update();
            this.$refs.score_chart.update();
            this.$refs.time_chart.update();
        },
    }
};
</script>

<style>
#content:before{
  height: 2000px;
}
</style>