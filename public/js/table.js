var temptable = [];
var humtable = [];
var aqitable = [];

async function getTable() {
    const response = await fetch('http://localhost:1111/data');
    const data = await response.json();
    console.log(data)
    tempt = data[0].temperature
    humt = data[0].humidity
    aqit = data[0].aqi
    table(tempd, humd, aqid);
}

function table(temp, hum, pm) {
    temptable.pop();
    humtable.pop();
    aqitable.pop();
    temptable.push(temp);
    humtable.push(hum);
    aqitable.push(pm);
}

function foo3() {
    getTable();
    setTimeout(foo3, 10000);
}

foo3();