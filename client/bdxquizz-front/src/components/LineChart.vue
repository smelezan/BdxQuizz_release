<script>
import { Line } from "vue-chartjs";

export default {
    extends: Line,
    props:['chartdata'],
    mounted() {
        this.$refs.canvas.style.height = "300px";
        this.renderChart(this.chartdata ,{ 
            responsive: true, 
            maintainAspectRatio: false,
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