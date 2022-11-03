var tempdata = [];
var humdata = [];
var aqidata = [];

async function getData() {
    const response = await fetch('http://localhost:1111/data');
    const data = await response.json();
    tempd = data[0].temperature
    humd = data[0].humidity
    aqid = data[0].aqi
    Data(tempd, humd, aqid);
}

function Data(temp, hum, pm) {
    tempdata.pop();
    humdata.pop();
    aqidata.pop();
    tempdata.push(temp);
    humdata.push(hum);
    aqidata.push(pm);

    document.getElementById("tempdata").innerHTML = tempdata + ' °C';
    document.getElementById("humdata").innerHTML = humdata + ' %';
    document.getElementById("aqidata").innerHTML = aqidata + ' µg./m3';
}

function foo3() {
    getData();
    setTimeout(foo3, 10000);
}

foo3();