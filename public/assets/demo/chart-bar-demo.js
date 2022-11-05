// Set new default font family and font color to mimic Bootstrap's default styling
(Chart.defaults.global.defaultFontFamily = "Metropolis"),
    '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = "#858796";

async function getRandomUser1() {
    var tempbars = [];
    var datebars = [];
    var humbars = [];
    var aqibars = [];
    var curbars = [];
    const response = await fetch('http://localhost:1111/chartbar');
    const data = await response.json();
    tempbars = data[0].temp
    datebars = data[0].date
    humbars = data[0].hum
    aqibars = data[0].aqi
    curbars = data[0].cur.map(multiplyByTwo2)
    getValues1(tempbars, datebars, humbars, aqibars, curbars)
}

function getValues1(tempbars, datebars, humbars, aqibars, curbars) {
    // Bar Chart Example Temperature
    var ctx = document.getElementById("myBarChart");
    myBarChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: datebars,
            datasets: [{
                label: "Temperature",
                backgroundColor: "rgba(0, 97, 242, 1)",
                hoverBackgroundColor: "rgba(0, 97, 242, 0.9)",
                borderColor: "#4e73df",
                data: tempbars,
                maxBarThickness: 25
            }]
        },
        options: {
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 25,
                    top: 25,
                    bottom: 0
                }
            },
            scales: {
                xAxes: [{
                    time: {
                        unit: "Day"
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        reverse: true,
                        maxTicksLimit: 7
                    }
                }],
                yAxes: [{
                    ticks: {
                        min: 0,
                        max: 80,
                        maxTicksLimit: 5,
                        padding: 10,
                        // Include a dollar sign in the ticks
                        callback: function (value, index, values) {
                            return value + "°C";
                        }
                    },
                    gridLines: {
                        color: "rgb(234, 236, 244)",
                        zeroLineColor: "rgb(234, 236, 244)",
                        drawBorder: false,
                        borderDash: [2],
                        zeroLineBorderDash: [2]
                    }
                }]
            },
            legend: {
                display: false
            },
            tooltips: {
                titleMarginBottom: 10,
                titleFontColor: "#6e707e",
                titleFontSize: 14,
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                borderColor: "#dddfeb",
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                caretPadding: 10,
                callbacks: {
                    label: function (tooltipItem, chart) {
                        var datasetLabel =
                            chart.datasets[tooltipItem.datasetIndex].label || "";
                        return datasetLabel + tooltipItem.yLabel + "°C";
                    }
                }
            }
        }
    });

    // Bar Chart Example Humidity
    var ctx1 = document.getElementById("myBarChart1");
    myBarChart = new Chart(ctx1, {
        type: "bar",
        data: {
            labels: datebars,
            datasets: [{
                label: "Humidity",
                backgroundColor: "rgba(0, 97, 242, 1)",
                hoverBackgroundColor: "rgba(0, 97, 242, 0.9)",
                borderColor: "#4e73df",
                data: humbars,
                maxBarThickness: 25
            }]
        },
        options: {
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 25,
                    top: 25,
                    bottom: 0
                }
            },
            scales: {
                xAxes: [{
                    time: {
                        unit: "Day"
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        reverse: true,
                        maxTicksLimit: 7
                    }
                }],
                yAxes: [{
                    ticks: {
                        min: 0,
                        max: 100,
                        maxTicksLimit: 5,
                        padding: 10,
                        // Include a dollar sign in the ticks
                        callback: function (value, index, values) {
                            return value + "%";
                        }
                    },
                    gridLines: {
                        color: "rgb(234, 236, 244)",
                        zeroLineColor: "rgb(234, 236, 244)",
                        drawBorder: false,
                        borderDash: [2],
                        zeroLineBorderDash: [2]
                    }
                }]
            },
            legend: {
                display: false
            },
            tooltips: {
                titleMarginBottom: 10,
                titleFontColor: "#6e707e",
                titleFontSize: 14,
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                borderColor: "#dddfeb",
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                caretPadding: 10,
                callbacks: {
                    label: function (tooltipItem, chart) {
                        var datasetLabel =
                            chart.datasets[tooltipItem.datasetIndex].label || "";
                        return datasetLabel + tooltipItem.yLabel + "%";
                    }
                }
            }
        }
    });

    // Bar Chart Example aqi
    var ctx2 = document.getElementById("myBarChart2");
    myBarChart = new Chart(ctx2, {
        type: "bar",
        data: {
            labels: datebars,
            datasets: [{
                label: "AQI",
                backgroundColor: "rgba(0, 97, 242, 1)",
                hoverBackgroundColor: "rgba(0, 97, 242, 0.9)",
                borderColor: "#4e73df",
                data: aqibars,
                maxBarThickness: 25
            }]
        },
        options: {
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 25,
                    top: 25,
                    bottom: 0
                }
            },
            scales: {
                xAxes: [{
                    time: {
                        unit: "Day"
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        reverse: true,
                        maxTicksLimit: 7
                    }
                }],
                yAxes: [{
                    ticks: {
                        min: 0,
                        max: 500,
                        maxTicksLimit: 5,
                        padding: 10,
                        // Include a dollar sign in the ticks
                        callback: function (value, index, values) {
                            return value + "%";
                        }
                    },
                    gridLines: {
                        color: "rgb(234, 236, 244)",
                        zeroLineColor: "rgb(234, 236, 244)",
                        drawBorder: false,
                        borderDash: [2],
                        zeroLineBorderDash: [2]
                    }
                }]
            },
            legend: {
                display: false
            },
            tooltips: {
                titleMarginBottom: 10,
                titleFontColor: "#6e707e",
                titleFontSize: 14,
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                borderColor: "#dddfeb",
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                caretPadding: 10,
                callbacks: {
                    label: function (tooltipItem, chart) {
                        var datasetLabel =
                            chart.datasets[tooltipItem.datasetIndex].label || "";
                        return datasetLabel + tooltipItem.yLabel + "%";
                    }
                }
            }
        }
    });

    // Bar Chart Example power
    var ctx3 = document.getElementById("myBarChart3");
    myBarChart = new Chart(ctx3, {
        type: "bar",
        data: {
            labels: datebars,
            datasets: [{
                label: "Power",
                backgroundColor: "rgba(0, 97, 242, 1)",
                hoverBackgroundColor: "rgba(0, 97, 242, 0.9)",
                borderColor: "#4e73df",
                data: curbars,
                maxBarThickness: 25
            }]
        },
        options: {
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 25,
                    top: 25,
                    bottom: 0
                }
            },
            scales: {
                xAxes: [{
                    time: {
                        unit: "Day"
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        reverse: true,
                        maxTicksLimit: 7
                    }
                }],
                yAxes: [{
                    ticks: {
                        min: 0,
                        max: 100,
                        maxTicksLimit: 5,
                        padding: 10,
                        // Include a dollar sign in the ticks
                        callback: function (value, index, values) {
                            return value + "Watt";
                        }
                    },
                    gridLines: {
                        color: "rgb(234, 236, 244)",
                        zeroLineColor: "rgb(234, 236, 244)",
                        drawBorder: false,
                        borderDash: [2],
                        zeroLineBorderDash: [2]
                    }
                }]
            },
            legend: {
                display: false
            },
            tooltips: {
                titleMarginBottom: 10,
                titleFontColor: "#6e707e",
                titleFontSize: 14,
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                borderColor: "#dddfeb",
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                caretPadding: 10,
                callbacks: {
                    label: function (tooltipItem, chart) {
                        var datasetLabel =
                            chart.datasets[tooltipItem.datasetIndex].label || "";
                        return datasetLabel + tooltipItem.yLabel + "Watt";
                    }
                }
            }
        }
    });
}

const multiplyByTwo2 = function (number) {
    return number * 220
}

function foo1() {
    getRandomUser1();
    setTimeout(foo1, 30000);
}

foo1();