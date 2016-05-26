"use strict";

function getRandomColor() {
    let letters = '0123456789ABCDEF'.split('');
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

$(document).ready(() => {
  $.getJSON("/api/v1/config")
  .done((config) => {
    let charts = [];

    for (let arrayIndex = 0; arrayIndex < config.POINTS.ARRAYS_NUM; arrayIndex++) {

      // Chart initializing
      $("<canvas id='chart" + arrayIndex + "' width='600px' height='400px'></canvas>").appendTo("body");
      let ctx = $("#chart" + arrayIndex);
      let chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              data: [],
              label: "Array " + arrayIndex,
              fill: false,
              pointRadius: 0,
              borderColor: getRandomColor()
            }
          ]
        },
        options: {
          responsive:false,
          tooltips: {
            enabled: false
          },
          scales: {
              yAxes: [{
                  ticks: {
                      min: config.POINTS.MIN,
                      max: config.POINTS.MAX,
                  }
              }]
          }
        }
      });

      charts.push(chart);
      charts[arrayIndex].data.labels = new Array(config.POINTS.QTY);
    }

    setInterval(() => {
      let requests = [];
      for (let arrayIndex = 0; arrayIndex < config.POINTS.ARRAYS_NUM; arrayIndex++) {
        requests.push($.getJSON("/api/v1/points/" + arrayIndex));
      }
      $.when.apply($, requests)
      .done(function () {
        for (let arrayIndex = 0; arrayIndex < config.POINTS.ARRAYS_NUM; arrayIndex++) {
          charts[arrayIndex].data.datasets[0].data = arguments[arrayIndex][0];
          charts[arrayIndex].update(0);
        }
      })
      .fail((error) => {
        console.log(error);
      })
    }, config.POINTS.UPDATE_INTERVAL);
  })
  .fail((error) => {
    console.log(error);
  });
});
