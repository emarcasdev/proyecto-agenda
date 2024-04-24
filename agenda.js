// Práctica 9 - La agenda
// Vamos a crear una agenda. Para ello usaremos un JSON a modo de base de datos. Esta
// base de datos contendrá un array de objetos de este tipo:
// {
// "fecha": "2023-04-12T18:15:00.000+02:00",
// "titulo": "Título del evento",
// "duracion": 180
// }
// ● fecha {string}: la fecha en formato ISO
// ● titulo {string}: el título del evento
// ● duracion {number}: la duración del evento (importante que sea un número)

// Menú:
// 1. Nuevo evento
// Pedirá el año, mes, día, hora y minuto; el título y la duración. Comprobará que este
// evento no se solape con ningún otro y lo guardará en el JSON.
// 2. Ver eventos de hoy.
// Mostrará los eventos para hoy ordenados por fecha de la siguiente manera:
// ● Título: Título del evento
// ● Fecha de inicio: fecha del evento
// ● Fecha de fin: fecha en la que termina el evento
// 3. Buscar eventos para una fecha
// Pedirá año, mes y día y mostrará los eventos tal y como lo hace el punto 2.
// 4. Borrar evento
// Mostrará la lista de eventos y te pedirá uno para borrar (aquí hay libertad en cuanto
// a cómo hacerlo).
// 5. Salir
// Cada vez que se agregue o se borre un evento se tendrá que actualizar el JSON.

const {DateTime} = require('luxon');

class Agenda {
  constructor(json){
    this.eventos = this.cargarJSON(json);
    this.listaTareas = [];
  }

  getEventos() {
    return this.eventos;
  }

  cargarJSON(eventosJson) {
    try {
      const eventoJSON = fs.readFileSync(eventosJson, "utf8");
      return JSON.parse(eventoJSON);
    } catch (error) {
      console.error("Error al cargar la carta: ", error);
      return [];
    }
  }

  agregarTareas(tarea){
    this.listaTareas.push(tarea);
  }

  getTareas(){
    return this.listaTareas;
  }
}
class Tareas {
  constructor(fecha, titulo, duracion){
    this.fecha = fecha;
    this.titulo = titulo;
    this.duracion = duracion
  }
}

const miAgenda = new Agenda('eventos.json');

const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function leeMenu(texto) {
  return new Promise((resolve) => {
    rl.question(texto, (respuesta) => {
      resolve(respuesta);
    });
  });
}

async function menuAgenda() {
  let menu = 0;
  while (menu != 5) {
    console.log("Bienvenido a tu agenda: ");
    console.log("1. Nuevo evento");
    console.log("2. Ver eventos de hoy");
    console.log("3. Buscar eventos para una fecha");
    console.log("4. Borrar evento");
    console.log("5. Salir");
    menu = await leeMenu("Selecciona una opción:\n");
    menu = parseInt(menu);
    switch (menu) {
      case 1:
        console.log("Opción 1: Nuevo evento");
        console.log("\n");
        break;
      case 2:
        console.log("Opción 2: Ver eventos de hoy");
        console.log("\n");
        break;
      case 3:
        console.log("Opción 3: Buscar eventos para una fecha");
        console.log("\n");
        break;
      case 4:
        console.log("Opción 4: Borrar evento");
        console.log("\n");
        break;
      case 5:
        console.log("Opción 5: Salir");
        console.log("Ha salido del menu");
        console.log("\n");
        break;
      default:
        console.log("Debe introducir un valor entre 1 y 5");
        console.log("\n");
        break;
    }
  }
}

menuAgenda();

async function nuevoEvento() {
    console.log("Cuando sera el nuevo evento:\n");
    let diaInput = await leeMenu("Dia:\n");
    let mesInput = await leeMenu("Mes:\n");
    let anhoInput = await leeMenu("Anho:\n");
    let horaInput = await leeMenu("Hora:\n");
    let minutosInput = await leeMenu("Minutos:\n");
    diaInput = parseInt(diaInput);
    mesInput = parseInt(mesInput);
    anhoInput = parseInt(anhoInput);
    horaInput = parseInt(horaInput),
    minutosInput = parseInt(minutosInput);
    let descripcionInput = await leeMenu("Que tarea va ha realizar:\n");
    let duracionInput = await leeMenu("Cunatos minutos va ha durar la tarea:\n");
    duracionInput = parseInt(duracionInput);

    const fechaEvento = DateTime.local(anhoInput, mesInput, diaInput, horaInput, minutosInput);

    const nuevoEvento = {
      "fecha": fechaEvento,
      "titulo": descripcionInput,
      "duracion": duracionInput
    }


    // miAgenda.agregarTareas.push(nuevoEvento, descripcionInput, duracionInput);
    // console.log("El evento ha sido agregado");
}

async function eventosHoy() {
    
}