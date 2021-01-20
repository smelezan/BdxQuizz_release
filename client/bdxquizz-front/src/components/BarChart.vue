<script>
import { Bar } from "vue-chartjs";

export default {
    extends: Bar,
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
        });
    }
};
</script>