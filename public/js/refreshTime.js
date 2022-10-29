function refreshTime() {
    var x = new Date()
    var ampm = x.getHours() >= 12 ? ' PM' : ' AM';
    hours = x.getHours() % 12;
    hours = hours ? hours : 12;
    hours = hours.toString().length == 1 ? 0 + hours.toString() : hours;
    var minutes = x.getMinutes().toString()
    minutes = minutes.length == 1 ? 0 + minutes : minutes;
    var seconds = x.getSeconds().toString()
    seconds = seconds.length == 1 ? 0 + seconds : seconds;
    var month = (x.getMonth() + 1).toString();
    month = month.length == 1 ? 0 + month : month;
    var dt = x.getDate().toString();
    dt = dt.length == 1 ? 0 + dt : dt;
    var x1 = month + "/" + dt + "/" + x.getFullYear();
    x1 = x1 + " - " + hours + ":" + minutes + ":" + seconds + " " + ampm;
    document.getElementById('time').innerHTML = x1;
}
setInterval(refreshTime, 1000);