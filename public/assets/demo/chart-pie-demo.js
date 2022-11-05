// Set new default font family and font color to mimic Bootstrap's default styling
(Chart.defaults.global.defaultFontFamily = "Metropolis"),
    '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = "#858796";

async function getRandomUser2() {
    const response = await fetch('http://localhost:1111/chartpie');
    const data = await response.json();
    addData(data);
}

function addData(object) {
    var temp = [];
    var humi = [];
    temp.pop();
    humi.pop();
    temp.push(object.temperature);
    humi.push(object.humidity);
    getValues2(temp, humi)
}

function getValues2(temp, humi) {
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
}

function foo2() {
    getRandomUser2();
    setTimeout(foo2, 30000);
}

foo2();