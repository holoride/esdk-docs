const MIN_INPUT = 0;
const MAX_INPUT = 5;

/* Helper functions */
// Adapted from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
let _seed = Date.now();

function rand(min, max) {
    _seed = (_seed * 9301 + 49297) % 233280;
    return min + (_seed / 233280) * (max - min);
}

/* Chart functions */

function addLabel(labels) {
    const value = "Location ";
    let values = [];
    let count = labels.length + 1;
    values = labels;
    values.push(value + count.toString());
    return values;
}

function updateOutputChart(inputChart, outputChart) {
    let inputDataLength = inputChart.data.datasets[0].data.length;
    let offset = inputDataLength - outputChart.data.datasets[0].data.length;
    if (offset > 0) {
        for (let i = 0; i < offset; i++) {
            outputChart.data.datasets[0].data.push(0);
            addLabel(outputChart.data.labels);
        }
    }

    for (let i = 0; i < inputDataLength; i++) {
        outputChart.data.datasets[0].data[i] = inputChart.data.datasets[0].data[i] * inputChart.data.datasets[1].data[i];
        outputChart.data.datasets[1].data[i] = inputChart.data.datasets[0].data[i] + inputChart.data.datasets[1].data[i];
    }
    outputChart.update();
}

function addData(chart, minDataVal, maxDataVal) {
    const data = chart.data;
    if (data.datasets.length > 0) {
        data.labels = addLabel(data.labels);

        for (let index = 0; index < data.datasets.length; ++index) {
            data.datasets[index].data.push(rand(minDataVal, maxDataVal));
        }

        chart.update();
    }
}

function addInputOutputData(inputChart, outputChart) {
    addData(inputChart, MIN_INPUT, MAX_INPUT);
    updateOutputChart(inputChart, outputChart);
}

function removeData(chart) {
    chart.data.labels.splice(-1, 1); // remove the label first

    chart.data.datasets.forEach(dataset => {
        dataset.data.pop();
    });

    chart.update();
}

function removeInputOutputData(inputChart, outputChart) {
    removeData(inputChart);
    removeData(outputChart);
}

function randomizeData(inputChart) {
    inputChart.data.datasets.forEach(dataset => {
        let values = [];
        for (let i = 0; i < dataset.data.length; i++) {
            values.push(rand(MIN_INPUT, MAX_INPUT));
        }
        dataset.data = values;
    });
    inputChart.update();

}

function randomizeInputOutput(inputChart, outputChart) {
    randomizeData(inputChart);
    updateOutputChart(inputChart, outputChart);
}

/* Chart configs */

const config = {
    type: 'line',
    data: {
        labels: ["Location 1", "Location 2", "Location 3", "Location 4", "Location 5", "Location 6"],
        datasets: [
            {
                label: 'InputA',
                data: [0, 0, 4, 0.5, 2, 5],
                fill: true,
                borderWidth: 1,
                backgroundColor: "rgba(204, 0, 255, 0.5)",
                borderColor: "rgb(204, 0, 255)",
                pointStyle: 'circle',
                pointRadius: 5,
                pointHoverRadius: 10,
                pointHitRadius: 25,
                cubicInterpolationMode: 'monotone'
            },
            {
                label: 'InputB',
                data: [1.0, 3.5, 4, 2, 2, 0.0],
                fill: true,
                borderWidth: 1,
                backgroundColor: "rgba(51, 51, 204, 0.5)",
                borderColor: "rgb(51, 51, 204)",
                pointStyle: 'circle',
                pointRadius: 5,
                pointHoverRadius: 10,
                pointHitRadius: 25,
                cubicInterpolationMode: 'monotone'
            }
        ]
    },
    options: {
        plugins: {
            dragData: {
                round: 1,
                showTooltip: true,
                onDragStart: function (e, element) {
                },
                onDrag: function (e, datasetIndex, index, value) {
                    updateOutputChart(inputChart, outputChart);
                },
                onDragEnd: function (e, datasetIndex, index, value) {
                },
            }
        },
        scales: {
            x: {},
            y: {
                beginAtZero: true,
                step: 0.1,
                stepValue: 0.1,
                max: 5
            }
        }
    }
};

const configOutput = {
    type: 'line',
    data: {
        labels: ["Location 1", "Location 2", "Location 3", "Location 4", "Location 5", "Location 6"],
        datasets: [
            {
                label: 'Multiply',
                data: [0, 0, 0, 0, 0, 0],
                fill: true,
                borderWidth: 1,
                backgroundColor: "rgba(0, 204, 255, 0.5)",
                borderColor: "rgb(0, 204, 255)",
                pointRadius: 5,
                pointHitRadius: 25,
                dragData: false,
                cubicInterpolationMode: 'monotone',
                order: 2

            },
            {
                label: 'Add',
                data: [0, 0, 0, 0, 0, 0],
                fill: true,
                borderWidth: 1,
                backgroundColor: "rgba(255, 0, 255, 0.5)",
                borderColor: "rgb(255, 0, 255)",
                pointRadius: 5,
                pointHitRadius: 25,
                dragData: false,
                cubicInterpolationMode: 'monotone',
                order: 1

            }
        ]
    },
    options: {
        scales: {
            x: {},
            y: {
                beginAtZero: true,
                step: 0.1,
                stepValue: 0.1,
                max: 25
            }
        }
    }
};

let inputChart;
let outputChart;

/* Chart instances */
$(function () {
    inputChart = new Chart(
        document.getElementById('inputChartElement'),
        config
    );

    outputChart = new Chart(
        document.getElementById('outputChartElement'),
        configOutput
    );

    updateOutputChart(inputChart, outputChart);
});