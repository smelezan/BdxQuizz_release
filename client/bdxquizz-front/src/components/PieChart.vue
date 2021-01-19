<script>
import { Pie } from "vue-chartjs";

export default {
    extends: Pie,
    props:['chartdata'],
    methods: {
        update() {
            this.renderChart(this.chartdata ,{ responsive: true, maintainAspectRatio: false });
        }
    },
    mounted() {
        this.update();
    }
};
</script>