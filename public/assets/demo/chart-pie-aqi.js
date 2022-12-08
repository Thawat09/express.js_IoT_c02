// Set new default font family and font color to mimic Bootstrap's default styling
(Chart.defaults.global.defaultFontFamily = "Metropolis"),
    '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = "#858796";

async function getRandomUser22() {
    const response = await fetch('http://localhost:1111/chartpie1');
    const data = await response.json();
    addData2(data);
}

function addData2(object) {
    var aqi = [];
    aqi.pop();
    aqi.push(object.aqi);
    getValues22(aqi)
}

function getValues22(aqi) {
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

let pieaqifrequency = "";

async function frequency22() {
    const response = await fetch('http://localhost:1111/frequency');
    const data = await response.json();
    Object.values(data[0]).forEach((doc) => {
        pieaqifrequency = doc
    })
}

function foo22() {
    getRandomUser22();
    frequency22();
    setTimeout(foo22, pieaqifrequency);
}

foo22();