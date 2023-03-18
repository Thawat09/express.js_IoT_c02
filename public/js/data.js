var tempdata = [];
var humdata = [];
var aqidata = [];
var currentdata = [];

async function getData() {
    const response = await fetch('http://localhost:1111/data');
    const data = await response.json();
    tempd = data[0].temperature
    humd = data[0].humidity
    aqid = data[0].aqi
    currentd = data[0].current
    Data(tempd, humd, aqid, currentd);
}

function Data(temp, hum, pm, cr) {
    tempdata.pop();
    humdata.pop();
    aqidata.pop();
    currentdata.pop();
    tempdata.push(temp);
    humdata.push(hum);
    aqidata.push(pm);
    currentdata.push(cr);

    document.getElementById("tempdata").innerHTML = tempdata + ' °C';
    document.getElementById("humdata").innerHTML = humdata + ' %';
    document.getElementById("aqidata").innerHTML = aqidata + ' µg./m3';
    document.getElementById("currentdata").innerHTML = currentdata * 220 + ' Watt';
}

let datafrequency = "";

async function frequency3() {
    try {
        const response = await fetch('http://localhost:1111/frequency1');
        const data = await response.json();
        datafrequency = data[0]?.[Object.keys(data[0])[0]] || 0;
    } catch (error) {
        console.error('Error fetching frequency:', error);
        datafrequency = 0;
    }
}

function foo3() {
    getData();
    setTimeout(() => {
        frequency3().then(foo3);
    }, datafrequency);
}

foo3();