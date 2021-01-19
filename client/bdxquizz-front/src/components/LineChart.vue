<script>
import { Line } from "vue-chartjs";

export default {
    extends: Line,
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