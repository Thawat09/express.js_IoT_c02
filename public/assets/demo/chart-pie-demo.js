// Set new default font family and font color to mimic Bootstrap's default styling
(Chart.defaults.global.defaultFontFamily = "Metropolis"),
    '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = "#858796";

var data = [];
var temp = [];
var humi = [];
var aqi = [];

async function getRandomUser2() {
    const response = await fetch('http://localhost:1111/chartpie');
    const data = await response.json();
    addData(data);
}

function addData(object) {
    temp.pop();
    humi.pop();
    aqi.pop();
    temp.push(object.temperature);
    humi.push(object.humidity);
    aqi.push(object.aqi);
    getValues2(temp, humi, aqi)
}

function getValues2(temp, humi, aqi) {
    var z = 80;
    var y = z - temp;

    document.getElementById("resultX").innerHTML = temp + '°C';
    document.getElementById("resultY").innerHTML = y + '°C';

    // Pie Chart Example temperature
    var ctx = document.getElementById("myPieChart");
    myPieChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Temperature", "Remaining Area"],
            datasets: [{
                data: [temp, y],
                backgroundColor: [
                    "orange",
                    "grey"
                ],
                hoverBackgroundColor: [
                    "orange",
                    "grey"
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

    var zz = 100
    var yy = zz - humi

    document.getElementById("resultXX").innerHTML = humi + '%';
    document.getElementById("resultYY").innerHTML = yy + '%';

    // Pie Chart Example humidity
    var ctxx = document.getElementById("myPieChart1");
    myPieChart1 = new Chart(ctxx, {
        type: "doughnut",
        data: {
            labels: ["Humidity", "Remaining Area"],
            datasets: [{
                data: [humi, yy],
                backgroundColor: [
                    "RGB(15, 65, 225)",
                    "grey"
                ],
                hoverBackgroundColor: [
                    "RGB(15, 65, 225)",
                    "grey"
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

    var zzz = 500
    var yyy = zzz - aqi

    document.getElementById("resultXXX").innerHTML = aqi + '%';
    document.getElementById("resultYYY").innerHTML = yyy + '%';

    // Pie Chart Example humidity
    var ctxxx = document.getElementById("myPieChart2");
    myPieChart2 = new Chart(ctxxx, {
        type: "doughnut",
        data: {
            labels: ["AQI", "Remaining Area"],
            datasets: [{
                data: [aqi, yyy],
                backgroundColor: [
                    "green",
                    "grey",
                ],
                hoverBackgroundColor: [
                    "green",
                    "grey",
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

function foo2() {
    getRandomUser2();
    setTimeout(foo2, 10000);
}

foo2();