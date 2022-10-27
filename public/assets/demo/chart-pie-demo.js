// Set new default font family and font color to mimic Bootstrap's default styling
(Chart.defaults.global.defaultFontFamily = "Metropolis"),
    '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = "#858796";

var data = [];
var data1 = [];
var temp = [];
var humi = [];

async function getRandomUser() {
    const response = await fetch('http://localhost:1111/chart');
    const data = await response.json();
    addData(data);
}

function addData(object) {
    data.push(object);
    addData1(data);
}

function addData1(object) {
    data.push(object[0][0].temperature);
    data1.push(object[0][0].humidity);
    temp = data['1']
    humi = data1['1']

    var z = 80
    var y = z - temp


    document.getElementById("resultX").innerHTML = temp + '°C';
    document.getElementById("resultY").innerHTML = y + '°C';

    // Pie Chart Example
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

    // -----
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
}

getRandomUser()