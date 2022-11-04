async function getTable() {
    const response = await fetch('http://localhost:1111/data');
    const data = await response.json();
    // repayment()
    for (var i = 0; i < data.lenght; i++) {
        for (var j = 0; j < data.length; j++) {
            document.getElementById("datatable1").innerHTML = data[i].date
            document.getElementById("datatable2").innerHTML = data[i].time
            document.getElementById("datatable3").innerHTML = data[i].temperature
            document.getElementById("datatable4").innerHTML = data[i].humidity
            document.getElementById("datatable5").innerHTML = data[i].aqi
        }
    }
}

// document.getElementById("datatable1").innerHTML = data[i].date
// document.getElementById("datatable2").innerHTML = data[i].time
// document.getElementById("datatable3").innerHTML = data[i].temperature
// document.getElementById("datatable4").innerHTML = data[i].humidity
// document.getElementById("datatable5").innerHTML = data[i].aqi

// function repayment() {
//     var x = document.getElementById("yr");
//     if (x.style.display === "none") {
//         x.style.display = "block";
//     } else {
//         //x.style.display = "none";
//     }
//     var test, tr;
//     test =
//         `<table border="4px">
//             <thead>
//                 <tr>
//                     <th>Date</th>
//                     <th>Time</th>
//                     <th>temperature</th>
//                     <th>humidity</th>
//                     <th>aqi</th>
//                 </tr>
//             </thead>
//             <tbody>${createRows()}</tbody>
//         </table>`;
//     document.getElementById("yr").innerHTML = test;
// }

// function createRows() {
//     let tr = '';
//     for (var i = 0; i < 5; i++) {
//         tr += '<tr>' + '<tr>' + '<tr>' + '<tr>' + '<tr>';
//         for (var j = 0; j < 5; j++) {
//             tr = '<td>' + 1 + '<td>' + 2 + '<td>' + 3+ '<td>' + 4 + '<td>' + 5;
//         }
//     }
//     return tr;
// }


function foo4() {
    getTable();
    setTimeout(foo4, 10000);
}

foo4();