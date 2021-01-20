<script>
import { Line } from "vue-chartjs";

export default {
    extends: Line,
    props:['chartdata', 'title'],
    mounted() {
        this.$refs.canvas.style.height = "300px";
        this.renderChart(this.chartdata ,{ 
            responsive: true, 
            maintainAspectRatio: false,
            title: {
                display: true,
                text: this.title
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            } 
        });
    }
};
</script>