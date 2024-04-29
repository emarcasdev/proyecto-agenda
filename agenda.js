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

const { DateTime } = require("luxon");
const fs = require("fs");

class Agenda {
  constructor(json) {
    this.listaEventos = this.cargarJSON(json);
  }

  getListaEventos() {
    return this.listaEventos;
  }

  cargarJSON(eventosJson) {
    try {
      // Leer datos JSON
      const datosJSON = fs.readFileSync(eventosJson, "utf8");
      // Paersear el contenido del json para trabajar en javascript
      return JSON.parse(datosJSON);
    } catch (error) {
      console.error("Error al cargar la carta: ", error);
      return [];
    }
  }

  guardarJSON() {
    try {
      fs.writeFileSync("eventos.json",JSON.stringify(this.listaEventos, null, 2)); // Repasar pq el null y el 2
    } catch (error) {
      console.log("Error al guardar en la agenda: ", error);
    }
  }

  async nuevoEvento() {
    console.log("Crear nuevo evento:\n");
    let diaInput = await leeMenu("Dia:\n");
    let mesInput = await leeMenu("Mes:\n");
    let anhoInput = await leeMenu("Anho:\n");
    let horaInput = await leeMenu("Hora:\n");
    let minutosInput = await leeMenu("Minutos:\n");
    diaInput = parseInt(diaInput);
    mesInput = parseInt(mesInput);
    anhoInput = parseInt(anhoInput);
    horaInput = parseInt(horaInput);
    minutosInput = parseInt(minutosInput);
    let descripcionInput = await leeMenu("Que tarea va ha realizar:\n");
    let duracionInput = await leeMenu("Cuantos minutos va ha durar la tarea:\n");
    duracionInput = parseInt(duracionInput);

    // Confirmar si los valores de fecha y hora son válidos
    if (isNaN(diaInput) || isNaN(mesInput) || isNaN(anhoInput) || isNaN(horaInput) || isNaN(minutosInput)) {
      console.log("Por favor, ingrese valores numéricos válidos para la fecha y la hora.");
      return;
    }

    const fechaEvento = DateTime.fromObject({
      year: anhoInput,
      month: mesInput,
      day: diaInput,
      hour: horaInput,
      minute: minutosInput,
    });

    if (!fechaEvento.isValid) {
      console.log("La fecha ingresada no es válida.");
      return;
    }

    const nuevoEvento = {
      fecha: fechaEvento.toISO(),
      titulo: descripcionInput,
      duracion: duracionInput,
    };

    const fechaInicio = DateTime.fromISO(nuevoEvento.fecha);
    const fechaFinal = fechaInicio.plus({ minutes: duracionInput });

    let solapado = false;
    for (const cadaevento of this.listaEventos) {
      const eventoFechaInicio = DateTime.fromISO(cadaevento.fecha);
      const eventoFechaFinal = eventoFechaInicio.plus({
        minutes: cadaevento.duracion,
      });
      if (fechaInicio < eventoFechaFinal && fechaFinal > eventoFechaInicio) {
        solapado = true;
        console.log("Lo siento, al parecer su nueva tarea se solapa con otra.");
        break;
      }
    }

    if (solapado === false) {
        this.listaEventos.push(nuevoEvento);
        this.guardarJSON();
        console.log("Ok, la tarea se ha creado correctamente.");
    }
    
  }

  async verEventosHoy(){
    const hoy = DateTime.local();
    let eventosDeHoy = [];
    for (const evento of this.listaEventos) {
        const fechaInicio = DateTime.fromISO(evento.fecha);
        if (fechaInicio.hasSame(hoy, 'day')) {
            eventosDeHoy.push(evento);
        }
    }

    if (eventosDeHoy.length === 0) {
        console.log("No tienes eventos para el dia de hoy.");
        return;
    }
    
    console.log("Eventos para el dia de hoy:");
    for (let i = 0; i < eventosDeHoy.length; i++) {
        const evento = eventosDeHoy[i];
        const fechaInicio = DateTime.fromISO(evento.fecha);
        const fechaFin = fechaInicio.plus({ minutes: evento.duracion });
        console.log(`${i + 1}. El evento que tiene es: ${evento.titulo}`);
        console.log(`   - Empieza a las: ${fechaInicio.toFormat('HH:mm')}`);
        console.log(`   - Termina a las: ${fechaFin.toFormat('HH:mm')}`);
  }
  }

  async buscarEventos(){
    console.log("Seleciona la fecha de los eventos que quieres ver: ");
    let anhoInput = await leeMenu("Anho:\n");
    let mesInput = await leeMenu("Mes:\n");
    let diaInput = await leeMenu("Dia:\n");
    diaInput = parseInt(diaInput);
    mesInput = parseInt(mesInput);
    anhoInput = parseInt(anhoInput);
  
    const fechaBuscada = DateTime.fromObject({
      year: anhoInput,
      month: mesInput,
      day: diaInput,
    });

    let eventosFechaBuscada = [];
    for (let i = 0; i < this.listaEventos.length; i++) {
      const evento = this.listaEventos[i];
      const fechaEvento = DateTime.fromISO(evento.fecha);
      if (fechaEvento.hasSame(fechaBuscada, 'day')) { // el hasSame sirve para verificar si los eventos ocurren en la misma fecha que la fecha buscada por el usuario.
        eventosFechaBuscada.push(evento);
      }
    }

    if (eventosFechaBuscada.length === 0) {
      console.log('No hay eventos en esa fecha');
      return;
    }

    console.log(`Eventos para la fecha ${fechaBuscada.toFormat('dd/MM/yyyy')}:`);
    for (let i = 0; i < eventosFechaBuscada.length; i++) {
        const evento = eventosFechaBuscada[i];
        const fechaInicio = DateTime.fromISO(evento.fecha);
        const fechaFin = fechaInicio.plus({ minutes: evento.duracion });
        console.log(`${i + 1}. El evento que tiene es: ${evento.titulo}`);
        console.log(`   - Empieza a las: ${fechaInicio.toFormat('HH:mm')}`);
        console.log(`   - Termina a las: ${fechaFin.toFormat('HH:mm')}`);
    }

  }

  async eliminarEventos(){
    console.log("Estos son tus eventos que se han creado y puedes eliminar: ");
    for (let i = 0; i < this.listaEventos.length; i++) {
      let fecha = DateTime.fromISO(this.listaEventos[i].fecha);
      console.log(`${[i + 1]}. Su tarea es:"${this.listaEventos[i].titulo}", y la fecha es a las ${fecha.toFormat('HH:mm el dd/MM/yyyy ')}`);
    }

    let idEliminar = await leeMenu("Ingrese el id del evento a eliminar:\n")
    idEliminar = parseInt(idEliminar);
    
    if (idEliminar >= 1 && idEliminar <= this.listaEventos.length) {
      this.listaEventos.splice(idEliminar - 1, 1);
      this.guardarJSON();
      console.log("Se borró el evento con el ID: " + idEliminar + ".");
      this.getListaEventos();
    } else {
      console.log('No hay eventos con la ID: ' + idEliminar + ".");
    }
  }
}

const miAgenda = new Agenda("eventos.json");

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
        await miAgenda.nuevoEvento();
        console.log("\n");
        break;
      case 2:
        console.log("Opción 2: Ver eventos de hoy");
        await miAgenda.verEventosHoy();
        console.log("\n");
        break;
      case 3:
        console.log("Opción 3: Buscar eventos para una fecha");
        await miAgenda.buscarEventos();
        console.log("\n");
        break;
      case 4:
        console.log("Opción 4: Borrar evento");
        await miAgenda.eliminarEventos();
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
