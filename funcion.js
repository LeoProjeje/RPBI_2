// 1. Clase ResiduoRPBI: Define la estructura de nuestro objeto
class ResiduoRPBI {
    constructor(area, tipo, peso) {
        this.area = area;
        this.tipo = tipo; // Puede ser 'punzocortante' o 'patologico'
        this.peso = parseFloat(peso); // Convertimos el texto a número decimal
    }
}

// 2. Estado inicial: Intentamos leer los datos de LocalStorage. Si no hay nada, iniciamos un arreglo vacío.
let residuos = JSON.parse(localStorage.getItem('datosRPBI')) || [];

// Capturamos todos los elementos del DOM (HTML) que vamos a manipular
const inputArea = document.getElementById('areaHosp');
const selectTipo = document.getElementById('tipoRPBI');
const inputPeso = document.getElementById('pesoKg');
const btnAgregar = document.getElementById('btnAgregarResiduo');
const listaContenedor = document.getElementById('listaResiduos');
const badgePunzo = document.getElementById('totPunzo');
const badgePato = document.getElementById('totPato');

// Función principal para pintar la lista y calcular los totales
function actualizarInterfaz() {
    // Limpiamos la lista en pantalla para no duplicar datos al volver a dibujar
    listaContenedor.innerHTML = '';
    
    // Contadores para nuestros totales
    let sumaPunzo = 0;
    let sumaPato = 0;

    // Recorremos el arreglo de residuos clásico
    for (let i = 0; i < residuos.length; i++) {
        let residuoActual = residuos[i];

        // A. Sumamos los pesos dependiendo del tipo
        if (residuoActual.tipo === 'punzocortante') {
            sumaPunzo += residuoActual.peso;
        } else if (residuoActual.tipo === 'patologico') {
            sumaPato += residuoActual.peso;
        }

        // B. Creamos el elemento visual para la lista (<li>)
        let li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center mb-1 shadow-sm';
        
        // Le damos un color al texto según el tipo para que sea más visual
        let colorTexto = residuoActual.tipo === 'punzocortante' ? 'text-danger' : 'text-warning';
        
        li.innerHTML = `
            <span><strong>${residuoActual.area}</strong> - <span class="${colorTexto}">${residuoActual.tipo.toUpperCase()}</span></span>
            <span class="badge bg-secondary rounded-pill">${residuoActual.peso} kg</span>
        `;
        
        // Inyectamos el nuevo <li> en el <ul> del HTML
        listaContenedor.appendChild(li);
    }

    // Actualizamos las tarjetas de resumen (Badges) redondeando a 2 decimales
    badgePunzo.textContent = sumaPunzo.toFixed(2);
    badgePato.textContent = sumaPato.toFixed(2);
}

// 3. Evento para registrar un nuevo desecho
btnAgregar.addEventListener('click', function() {
    let valorArea = inputArea.value.trim();
    let valorTipo = selectTipo.value;
    let valorPeso = inputPeso.value;

    // Pequeña validación para evitar que guarden campos vacíos
    if (valorArea === '' || valorPeso === '') {
        alert('Por favor, ingresa el área y el peso antes de registrar.');
        return; 
    }

    // Instanciamos nuestro nuevo objeto a partir de la Clase
    let nuevoDesecho = new ResiduoRPBI(valorArea, valorTipo, valorPeso);

    // Lo metemos al arreglo
    residuos.push(nuevoDesecho);

    // Persistencia: Guardamos el arreglo completo convertido a Texto (JSON) en LocalStorage
    localStorage.setItem('datosRPBI', JSON.stringify(residuos));

    // Actualizamos la pantalla y limpiamos el formulario para el siguiente registro
    actualizarInterfaz();
    inputArea.value = '';
    inputPeso.value = '';
});

// Arrancamos la interfaz por primera vez al cargar la página para mostrar lo guardado
actualizarInterfaz();