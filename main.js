const {DateTime} = require('luxon');

const fechaActual = DateTime.now(); //.local()
console.log(fechaActual.toISODate());

if (fechaActual.month === 4) {
    console.log("Es abril");
}

if (fechaActual.weekYear === 2024) {
    console.log('Es 2024');
}