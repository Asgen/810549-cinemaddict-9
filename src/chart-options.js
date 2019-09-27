/* eslint-disable */
import Chart from 'chart.js';

const renderStatisticChart = (container, labelsArr, dataArr) => {

  const chartOptions = {
    tooltips: {
      enabled: false
    },
    hover: {
      animationDuration: 0
    },
    responsive: true,
    scales: {
      xAxes: [{
        ticks: {
          display: false,
          min: 0
        },
        gridLines: {
          display: false,
          drawBorder: false
        }
      }],
      yAxes: [{
        barThickness: 25,
        barPercentage: 1,
        categoryPercentage: 1,
        ticks: {
          beginAtZero: true,
          fontColor: `#ffffff`,
          fontSize: 16,
          display: true,
          padding: 100
        },
        gridLines: {
          offsetGridLines: false,
          display: false,
          drawBorder: false
        }
      }]
    },
    legend: {
      display: false
    },
    animation: {
      onComplete() {
        const chartInstance = this.chart;
        const ctx = chartInstance.ctx;
        ctx.textAlign = `right`;
        ctx.font = `16px Open Sans`;
        ctx.fillStyle = `#fff`;

        Chart.helpers.each(this.data.datasets.forEach(function (dataset, i) {
          const meta = chartInstance.controller.getDatasetMeta(i);
          Chart.helpers.each(meta.data.forEach(function (bar, index) {
            const data = dataset.data[index];
            if (i === 0) {
              ctx.fillText(data, 140, bar._model.y + 4);
            } else {
              ctx.fillText(data, bar._model.x - 25, bar._model.y + 4);
            }
          }), this);
        }), this);
      }
    },
    plugins: {
      datalabels: {
        display: false,
      }
    }
  };

  const daysChart = new Chart(container, {
    type: `horizontalBar`,
    data: {
      labels: labelsArr,
      datasets: [{
        data: dataArr,
        backgroundColor: `#ffe800`,
      }]
    },
    options: chartOptions,
  });

  return daysChart;
};

export {renderStatisticChart};
