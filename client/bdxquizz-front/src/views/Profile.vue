<template>
  <div>
    <div id="title" class="profile">
      <h1>Profile</h1>
      <br />
      <h2>Check out your stats below</h2>
      <h4>And try to upgrade them</h4>
    </div>
    <div id="content">
      <b-container style="margin: 0px; max-width: 100%">
        <b-container id="stats" class="w-75 mx-auto shadow">
          <b-row class="w-75 d-flex align-items-center mx-auto my-4 shadow sub">
            <b-col cols="12" md="12">
              <strong>Pseudo :</strong> {{ name }} <br />
            </b-col>
          </b-row>
          <b-row class="w-75 d-flex align-items-center mx-auto my-5 shadow sub">
            <b-col cols="12" md="6">
              <strong>Quizz Played :</strong> {{ nbQuizzPlayed }} <br />
              <strong>Quizz Won :</strong> {{ nbQuizzWon }} <br />
              <strong>Quizz Lost :</strong> {{ nbQuizzLost }} <br />
              <strong>Quizz Ratio :</strong>
              {{ (nbQuizzWon / nbQuizzPlayed).toFixed(2) }}
            </b-col>
            <b-col cols="12" md="6" class="mb-3">
              <PieChart
                v-if="loaded"
                ref="quizz_chart"
                :chartdata="quizzData"
              ></PieChart>
            </b-col>
            <b-col cols="12" md="12">
              <BarChart
                v-if="loaded"
                ref="quizz_chart"
                :chartdata="catQuizzData"
              ></BarChart>
            </b-col>
          </b-row>
          <b-row class="w-75 d-flex align-items-center mx-auto my-5 p-2 shadow sub">
            <b-col cols="12" md="6">
              <strong>Best Score :</strong> {{ bestScore }}
            </b-col>
            <b-col cols="12" md="6" class="mb-3">
              <strong>Average Score :</strong> {{ averageScore }}
            </b-col>
            <b-col cols="12" md="12" class="mb-3">
              <LineChart
                v-if="loaded"
                ref="score_chart"
                :chartdata="scoreData"
              ></LineChart>
            </b-col>
            <b-col cols="12" md="12" class="mb-3">
              <BarChart
                v-if="loaded"
                ref="quizz_chart"
                :chartdata="catScoreData"
              ></BarChart>
            </b-col>
          </b-row>
          <b-row class="w-75 d-flex align-items-center mx-auto my-5 p-2 shadow sub">
            <b-col cols="12" md="6">
              <strong>Best Time :</strong> {{ bestTime }}
            </b-col>
            <b-col cols="12" md="6" class="mb-3">
              <strong>Average Time :</strong> {{ averageTime }}
            </b-col>
            <b-col cols="12" md="12" class="mb-3">
              <LineChart
                v-if="loaded"
                ref="time_chart"
                :chartdata="timeData"
              ></LineChart>
            </b-col>
            <b-col cols="12" md="12" class="mb-3">
              <BarChart
                v-if="loaded"
                ref="quizz_chart"
                :chartdata="catTimeData"
              ></BarChart>
            </b-col>
          </b-row>
        </b-container>
      </b-container>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios';
import PieChart from '@/components/PieChart';
import LineChart from '@/components/LineChart';
import BarChart from '@/components/BarChart';

export default {
  components: {
    PieChart,
    LineChart,
    BarChart,
  },
  data() {
    return {
      loaded: false,
      name: 'username',
      nbQuizzWon: 0,
      nbQuizzLost: 0,
      nbQuizzPlayed: 0,
      bestScore: 0,
      averageScore: 0,
      bestTime: 0,
      averageTime: 0,
      categories: {},

      quizzData: null,
      scoreData: null,
      timeData: null,

      catQuizzData: null,
      catScoreData: null,
      catTimeData: null,
    };
  },
  mounted() {
    axios.get('/api/stats/user').then((res) => {
      this.name = res.data.username;

      this.nbQuizzWon = res.data.stats.nbQuizzWon;
      this.nbQuizzLost = res.data.stats.nbQuizzLost;
      this.nbQuizzPlayed = res.data.stats.nbQuizzPlayed;

      this.bestScore = res.data.stats.bestScore;
      this.averageScore = res.data.stats.averageScore;

      const bestTime = res.data.stats.bestTime;
      this.bestTime = parseInt(bestTime / 60) + ':' + (bestTime % 60);
      const averageTime = res.data.stats.averageTime;
      this.averageTime = parseInt(averageTime / 60) + ':' + (averageTime % 60);

      this.categories = res.data.stats.category;

      this.setGeneralChart(res.data.stats.scores, res.data.stats.times);
      this.setCategoryChart();
      this.loaded = true;
    });
  },
  methods: {
    setGeneralChart(scores, times) {
      let labels = [];
      for (let index = 0; index < scores.length; index++)
        labels.push(index + 1);

      this.quizzData = {
        labels: ['Win', 'Lose'],
        datasets: [
          {
            backgroundColor: ['#00D8FF', '#AA0055'],
            data: [this.nbQuizzWon, this.nbQuizzLost],
          },
        ],
      };
      this.scoreData = {
        labels: labels,
        datasets: [
          {
            label: 'Score',
            backgroundColor: '#00D8FF',
            data: scores,
          },
        ],
      };
      this.timeData = {
        labels: labels,
        datasets: [
          {
            label: 'Time',
            backgroundColor: '#00D8FF',
            data: times,
          },
        ],
      };
    },
    setCategoryChart() {
      console.log(this.categories);

      let labels = [];

      let dataWon = [];
      let dataLost = [];
      let dataPlay = [];

      let dataBScore = [];
      let dataAScore = [];

      let dataBTime = [];
      let dataATime = [];

      for (const category in this.categories) {
        labels.push(category);

        dataWon.push(this.categories[category].nbQuizzWon);
        dataLost.push(this.categories[category].nbQuizzLost);
        dataPlay.push(this.categories[category].nbQuizzPlayed);

        dataBScore.push(this.categories[category].bestScore);
        dataAScore.push(this.categories[category].averageScore);

        dataBTime.push(this.categories[category].bestTime);
        dataATime.push(this.categories[category].averageTime.toFixed(2));
      }

      this.catQuizzData = {
        labels: labels,
        datasets: [
          {
            label: 'Quizz Play',
            backgroundColor: '#f1c40f',
            data: dataPlay,
          },
          {
            label: 'Quizz Won',
            backgroundColor: '#00D8FF',
            data: dataWon,
          },
          {
            label: 'Quizz Lost',
            backgroundColor: '#AA0055',
            data: dataLost,
          },
        ],
      };

      this.catScoreData = {
        labels: labels,
        datasets: [
          {
            label: 'Best Score',
            backgroundColor: '#3eac3e',
            data: dataBScore,
          },
          {
            label: 'Average Score',
            backgroundColor: '#8e44ad',
            data: dataAScore,
          },
        ],
      };

      this.catTimeData = {
        labels: labels,
        datasets: [
          {
            label: 'Best Time',
            backgroundColor: '#3eac3e',
            data: dataBTime,
          },
          {
            label: 'Average Time',
            backgroundColor: '#8e44ad',
            data: dataATime,
          },
        ],
      };
    },
  },
};
</script>

<style scoped>
#title {
  height: 250px;
}
#stats {
  border: 1px solid transparent;
  border-radius: 10px;
  background-color: white;
  transform: translateY(-200px);
}
.sub{
  border-radius: 20px;
  background-color: #e6e6e675;
}

#content:before {
  height: 3200px;
}
</style>