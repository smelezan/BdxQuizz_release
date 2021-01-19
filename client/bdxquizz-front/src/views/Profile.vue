<template>
    <div>
        <div id="title" class="profile">
            <h1>Profile</h1>
            <br />
        </div>
        <div>
            <b-container id="content" style="margin: 0px; max-width: 100%">
                <b-container id="stats" class="w-75 mx-auto shadow">
                    <b-row class="p-2">
                        <b-col >
                            <h1>Profile</h1>
                        </b-col>
                    </b-row>
                    <b-row class="w-75 d-flex align-items-center mx-auto my-5 shadow">
                        <b-col>
                            <strong>Pseudo :</strong> {{name}} <br />
                        </b-col>
                    </b-row>
                    <b-row class="w-75 d-flex align-items-center mx-auto my-5 shadow">
                        <b-col>
                            <strong>Quizz Played :</strong> {{nbQuizzPlayed}} <br />
                            <strong>Quizz Won :</strong> {{nbQuizzWon}} <br />
                            <strong>Quizz Lost :</strong> {{nbQuizzLost}} <br />
                            <strong>Quizz Ratio :</strong> {{nbQuizzWon/nbQuizzPlayed}}
                        </b-col>
                        <b-col>
                            <PieChart v-if="loaded" ref="quizz_chart" :chartdata="quizzData"></PieChart>
                        </b-col>
                    </b-row>
                    <b-row class="w-75 d-flex align-items-center mx-auto my-5 p-2 shadow">
                        <b-col cols="6" md="5" class='m-2'>
                            <strong>Best Score :</strong> {{bestScore}}
                        </b-col>
                        <b-col cols="6" md="5" class='m-2'>
                            <strong>Average Score :</strong> {{averageScore}}
                        </b-col>
                        <b-col cols="12" md="12" class='m-2'>
                            <LineChart v-if="loaded" ref="score_chart" :chartdata="scoreData"></LineChart>
                        </b-col>
                    </b-row>
                    <b-row class="w-75 d-flex align-items-center mx-auto my-5 p-2 shadow">
                        <b-col cols="6" md="5" class='m-2'>
                            <strong>Best Time :</strong> {{bestTime}}
                        </b-col>
                        <b-col cols="6" md="5" class='m-2'>
                            <strong>Average Time :</strong> {{averageTime}}
                        </b-col>
                        <b-col cols="12" md="12">
                            <LineChart v-if="loaded" ref="time_chart" :chartdata="timeData"></LineChart>
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

    export default {
    components: {
        PieChart,
        LineChart,
    },
    data() {
        return {
            loaded: false,
            name: "username",
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
            console.log(res.data);
                
            this.name = res.data.username;

            this.nbQuizzWon = res.data.stats.nbQuizzWon;
            this.nbQuizzLost = res.data.stats.nbQuizzLost;
            this.nbQuizzPlayed = res.data.stats.nbQuizzPlayed;
            this.bestScore = res.data.stats.bestScore;
            this.averageScore = res.data.stats.averageScore;
            this.bestTime = res.data.stats.bestTime;
            this.averageTime = res.data.stats.averageTime;

            const scores = res.data.stats.scores;
            const times = res.data.stats.times;

            let labels = [];
            for(let index = 0; index < scores.length; index++)
                labels.push(index+1);

            this.quizzData = {
                labels: ["Win", 'Lose'],
                datasets: [{
                    backgroundColor: ["#00D8FF", "#AA0055"],
                    data: [this.nbQuizzWon, this.nbQuizzLost]
                }]
            }
            this.scoreData = {
                labels: labels,
                datasets: [{
                    label: "Score",
                    backgroundColor: "#00D8FF",
                    data: scores
                }]
            }
            this.timeData = {
                labels: labels,
                datasets: [{
                    label: "Time",
                    backgroundColor: "#00D8FF",
                    data: times
                }]
            }
            this.loaded = true;
        });
    }
};
</script>

<style scoped>
#stats{
  border: 1px solid transparent;
  border-radius: 10px;
  background-color: white;
  transform: translateY(-200px);
}

#content:before{
  height: 2000px;
}
</style>