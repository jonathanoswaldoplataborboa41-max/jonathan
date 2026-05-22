// 1. Datos estáticos de respaldo para GitHub Pages
const datosMigracionGlobal = [
    { id: 1, nombre: 'documentacion', registros: 12450, tamanoMB: 4.2, estado: 'Exitosa' },
    { id: 2, nombre: 'edofuerza', registros: 45200, tamanoMB: 12.8, estado: 'Exitosa' },
    { id: 3, nombre: 'edofuerza_servicios', registros: 850321, tamanoMB: 142.5, estado: 'En Proceso' },
    { id: 4, nombre: 'fatiga', registros: 140, tamanoMB: 0.5, estado: 'Fallida' },
    { id: 5, nombre: 'infraestructura', registros: 23100, tamanoMB: 9.1, estado: 'Exitosa' },
    { id: 6, nombre: 'infraestructura_servicios', registros: 642100, tamanoMB: 110.4, estado: 'En Proceso' },
    { id: 7, nombre: 'mexico', registros: 5400, tamanoMB: 1.2, estado: 'Exitosa' },
    { id: 8, nombre: 'plataformaneza', registros: 3420, tamanoMB: 1.8, estado: 'Exitosa' },
    { id: 9, nombre: 'rechum', registros: 1540, tamanoMB: 0.8, estado: 'Exitosa' },
    { id: 10, nombre: 'rrhh', registros: 9200, tamanoMB: 3.1, estado: 'En Proceso' },
    { id: 11, nombre: 'saia', registros: 4120, tamanoMB: 2.3, estado: 'Exitosa' },
    { id: 12, nombre: 'sanciones', registros: 85, tamanoMB: 0.2, estado: 'Fallida' }
];

// 2. Evento principal de carga
document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 Cargando Dashboard Estable...");
    
    // Pintamos la tabla de inmediato
    llenarTabla(datosMigracionGlobal);
    
    // Activamos los filtros
    configurarBotonesFiltros();
});

// 3. Función para rellenar la tabla HTML
function llenarTabla(datos) {
    const tablaCuerpo = document.querySelector("table tbody");
    if (!tablaCuerpo) return;
    tablaCuerpo.innerHTML = "";

    datos.forEach(fila => {
        const tr = document.createElement("tr");
        // Atributo para que el filtro sepa qué estado es cada fila
        tr.setAttribute("data-estado-fila", fila.estado.toLowerCase());
        
        let badgeColor = "badge-en-proceso";
        if (fila.estado.toLowerCase().includes("exito")) badgeColor = "badge-exitosa";
        if (fila.estado.toLowerCase().includes("falli")) badgeColor = "badge-fallida";

        tr.innerHTML = `
            <td><strong>📁 BD: ${fila.nombre}</strong></td>
            <td>${Number(fila.registros).toLocaleString()}</td>
            <td>${fila.tamanoMB} MB</td>
            <td><span class="badge ${badgeColor}">${fila.estado}</span></td>
            <td>
                <button class="btn-detalle" style="padding: 4px 8px; cursor: pointer;">Ver Mapeo</button>
            </td>
        `;
        tablaCuerpo.appendChild(tr);
    });
}

// 4. Función para controlar los botones de filtro
function configurarBotonesFiltros() {
    const botones = document.querySelectorAll("button");
    // Filtramos para ignorar los botones de "Ver Mapeo" dentro de la tabla
    const botonesFiltro = Array.from(botones).filter(btn => !btn.classList.contains("btn-detalle"));
    const filas = document.querySelectorAll("table tbody tr");

    function filtrar(estadoObjetivo) {
        filas.forEach(fila => {
            const estadoFila = fila.getAttribute("data-estado-fila");
            if (estadoObjetivo === "todas") {
                fila.style.display = ""; // Muestra todo
            } else if (estadoFila && estadoFila.includes(estadoObjetivo)) {
                fila.style.display = ""; // Muestra coincidencia
            } else {
                fila.style.display = "none"; // Oculta las demás
            }
        });
    }

    // Buscamos los botones por su texto e inyectamos el evento clic
    botonesFiltro.forEach(btn => {
        const txt = btn.textContent.trim().toLowerCase();
        if (txt.includes("todas")) btn.onclick = () => filtrar("todas");
        if (txt.includes("exito")) btn.onclick = () => filtrar("exito");
        if (txt.includes("proceso")) btn.onclick = () => filtrar("proceso");
        if (txt.includes("falli") || txt.includes("error")) btn.onclick = () => filtrar("falli");
    });
}