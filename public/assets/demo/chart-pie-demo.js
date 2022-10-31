// Set new default font family and font color to mimic Bootstrap's default styling
(Chart.defaults.global.defaultFontFamily = "Metropolis"),
    '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = "#858796";

var data = [];
var temp = [];
var humi = [];
var aqi = [];

async function getRandomUser() {
    const response = await fetch('http://localhost:1111/chartpie');
    const data = await response.json();
    addData(data);
}

function addData(object) {
    temp.push(object.temperature);
    humi.push(object.humidity);
    aqi.push(object.aqi);

    var z = 80;
    var y = z - temp;

    document.getElementById("resultX").innerHTML = temp + '°C';
    document.getElementById("resultY").innerHTML = y + '°C';

    // Pie Chart Example temperature
    var ctx = document.getElementById("myPieChart");
    myPieChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Temperature", "Null"],
            datasets: [{
                data: [temp, y],
                backgroundColor: [
                    "orange",
                    "rgba(0, 172, 105, 1)"
                ],
                hoverBackgroundColor: [
                    "orange",
                    "rgba(0, 172, 105, 0.9)"
                ],
                hoverBorderColor: "rgba(234, 236, 244, 1)"
            }]
        },
        options: {
            maintainAspectRatio: false,
            tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                borderColor: "#dddfeb",
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                caretPadding: 10
            },
            legend: {
                display: false
            },
            cutoutPercentage: 70
        }
    });

    // Pie Chart Example humidity
    var zz = 100
    var yy = zz - humi

    document.getElementById("resultXX").innerHTML = humi + '%';
    document.getElementById("resultYY").innerHTML = yy + '%';

    var ctxx = document.getElementById("myPieChart1");
    myPieChart1 = new Chart(ctxx, {
        type: "doughnut",
        data: {
            labels: ["Humidity", "Null"],
            datasets: [{
                data: [humi, yy],
                backgroundColor: [
                    "blue",
                    "rgba(0, 172, 105, 1)"
                ],
                hoverBackgroundColor: [
                    "blue",
                    "rgba(0, 172, 105, 0.9)"
                ],
                hoverBorderColor: "rgba(234, 236, 244, 1)"
            }]
        },
        options: {
            maintainAspectRatio: false,
            tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                borderColor: "#dddfeb",
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                caretPadding: 10
            },
            legend: {
                display: false
            },
            cutoutPercentage: 70
        }
    });

    // Pie Chart Example humidity
    var zzz = 100
    var yyy = zzz - aqi

    document.getElementById("resultXXX").innerHTML = aqi + '%';
    document.getElementById("resultYYY").innerHTML = yyy + '%';

    var ctxxx = document.getElementById("myPieChart2");
    myPieChart2 = new Chart(ctxxx, {
        type: "doughnut",
        data: {
            labels: ["AQI", "Null"],
            datasets: [{
                data: [aqi, yyy],
                backgroundColor: [
                    "green",
                    "red",
                ],
                hoverBackgroundColor: [
                    "green",
                    "red",
                ],
                hoverBorderColor: "rgba(234, 236, 244, 1)"
            }]
        },
        options: {
            maintainAspectRatio: false,
            tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                borderColor: "#dddfeb",
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                caretPadding: 10
            },
            legend: {
                display: false
            },
            cutoutPercentage: 70
        }
    });
}

getRandomUser()