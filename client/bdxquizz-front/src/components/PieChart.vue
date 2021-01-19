<script>
import { Pie } from "vue-chartjs";

export default {
    extends: Pie,
    props:['chartdata'],
    mounted() {
        this.$refs.canvas.style.width = "75%";
        this.renderChart(this.chartdata ,{ 
            responsive: true, 
            maintainAspectRatio: false
        });
    }
};
</script>