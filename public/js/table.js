const getdata = async (abc) => {
    const response = await fetch('http://localhost:1111/datatable');
    const data = await response.json();
    return data;
}

function buildHeadings(obj) {
    const keys = Object.keys(obj);
    return keys.map(key => `<th>${key}</th>`).join('');
}

function buildCell(cell) {
    return `<td>${cell}</td>`;
}

function buildRow(obj) {
    const values = Object.values(obj);
    return `<tr>${values.map(buildCell).join('')}</tr>`;
}

function buildRows(data) {
    return data.map(buildRow).join('');
}

function buildTable(data) {
    return `
    <table>
        <thead>${buildHeadings(data[0])}</thead>
        <tbody>${buildRows(data)}</tbody>
    </table>
    `;
}

function getSubset(data) {
    return data.map(obj => {
        const {
            ID,
            CountryCode,
            Slug,
            Date,
            Premium,
            ...rest
        } = obj;
        return { ...rest };
    });
}

const container = document.getElementById('table');
async function main() {
    const data = getSubset(await getdata());
    const table = buildTable(data);
    container.innerHTML = table;
}

let tablefrequency = "";

async function frequency4() {
    const response = await fetch('http://localhost:1111/frequency1');
    const data = await response.json();
    Object.values(data[0]).forEach((doc) => {
        tablefrequency = doc
    })
}

function foo4() {
    main();
    frequency4();
    setTimeout(foo4, tablefrequency);
}

foo4();