<script>
import { Bar } from "vue-chartjs";

export default {
    extends: Bar,
    props:['chartdata'],
    mounted() {
        this.$refs.canvas.style.height = "300px";
        this.renderChart(this.chartdata ,{ 
            responsive: true, 
            maintainAspectRatio: false
        });
    }
};
</script>