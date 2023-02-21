async function on() {
    const response = await fetch('http://localhost:1111/on');
}

function foo3() {
    on();
    setTimeout(foo3, 10000);
}

foo3();