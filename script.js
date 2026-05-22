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
    { id: 12, merge: true, nombre: 'sanciones', registros: 85, tamanoMB: 0.2, estado: 'Fallida' }
];

document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 Cargando Dashboard Máxima Compatibilidad...");
    prepararEstructuraModal();
    llenarTabla(datosMigracionGlobal);
    configurarBotonesFiltros();
});

function llenarTabla(datos) {
    const tablaCuerpo = document.querySelector("table tbody");
    if (!tablaCuerpo) return;
    tablaCuerpo.innerHTML = "";

    datos.forEach(fila => {
        const tr = document.createElement("tr");
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
                <button class="btn-detalle" onclick="mostrarMapeoReal('${fila.nombre}')" style="padding: 4px 8px; cursor: pointer;">Ver Mapeo</button>
            </td>
        `;
        tablaCuerpo.appendChild(tr);
    });
}

function prepararEstructuraModal() {
    if (document.getElementById("modalMapeoReal")) return;

    const estilos = document.createElement("style");
    estilos.innerHTML = `
        .modal-migracion { display: none !important; position: fixed !important; z-index: 99999 !important; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.6) !important; backdrop-filter: blur(4px); justify-content: center; align-items: center; }
        .modal-migracion.mostrar-modal { display: flex !important; }
        .modal-contenido { background: #ffffff !important; padding: 25px !important; border-radius: 12px !important; width: 90%; max-width: 600px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); position: relative; }
        .modal-cabecera { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; margin-bottom: 15px; }
        .modal-cabecera h2 { margin: 0; color: #0f172a; font-size: 1.3rem; }
        .btn-cerrar-modal { background: none; border: none; font-size: 1.8rem; cursor: pointer; color: #94a3b8; }
        .btn-cerrar-modal:hover { color: #ef4444; }
        .tabla-mapeo-real { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .tabla-mapeo-real th, .tabla-mapeo-real td { padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0; font-size: 0.9rem; }
        .tabla-mapeo-real th { background-color: #f8fafc; color: #64748b; font-weight: 600; }
        .badge-llave { background-color: #dcfce7; color: #16a34a; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 0.8rem; }
    `;
    document.head.appendChild(estilos);

    const modalHTML = document.createElement("div");
    modalHTML.id = "modalMapeoReal";
    modalHTML.className = "modal-migracion";
    modalHTML.innerHTML = `
        <div class="modal-contenido">
            <div class="modal-cabecera">
                <h2 id="modalTituloTabla">Metadata SSMA Mapping</h2>
                <button class="btn-cerrar-modal" onclick="cerrarVentanaMapeo()">&times;</button>
            </div>
            <div style="margin-bottom: 12px; font-size: 0.85rem; color: #64748b;">
                <strong>Destino SSMA:</strong> Esquema mapeado hacia el catálogo unificado en SQL Server 2012.
            </div>
            <table class="tabla-mapeo-real">
                <thead>
                    <tr>
                        <th>Origen (MySQL 5.7)</th>
                        <th>Destino (SQL Server 2012)</th>
                        <th>Mapeo</th>
                    </tr>
                </thead>
                <tbody id="modalTablaCuerpo"></tbody>
            </table>
        </div>
    `;
    document.body.appendChild(modalHTML);

    modalHTML.onclick = (e) => { if (e.target === modalHTML) cerrarVentanaMapeo(); };
}

// Hacemos las funciones globales de forma explícita para que el HTML las encuentre sí o sí
window.mostrarMapeoReal = function(nombreBD) {
    const modal = document.getElementById("modalMapeoReal");
    const titulo = document.getElementById("modalTituloTabla");
    const cuerpoTabla = document.getElementById("modalTablaCuerpo");

    if (modal && titulo && cuerpoTabla) {
        titulo.innerHTML = `Metadata Mapping: <span style="color:#2563eb;">${nombreBD}</span>`;
        cuerpoTabla.innerHTML = `
            <tr>
                <td style="color:#e11d48; font-family:monospace; font-weight:bold;">3307 ➡️ ${nombreBD}</td>
                <td style="color:#16a34a; font-family:monospace; font-weight:bold;">Proyecto_Migracion.${nombreBD}</td>
                <td><span class="badge-llave">OK</span></td>
            </tr>
        `;
        modal.classList.add("mostrar-modal");
    }
}

window.cerrarVentanaMapeo = function() {
    const modal = document.getElementById("modalMapeoReal");
    if (modal) modal.classList.remove("mostrar-modal");
}

function configurarBotonesFiltros() {
    const botones = document.querySelectorAll("button");
    const botonesFiltro = Array.from(botones).filter(btn => !btn.classList.contains("btn-detalle"));
    const filas = document.querySelectorAll("table tbody tr");

    function filtrar(estadoObjetivo) {
        filas.forEach(fila => {
            const estadoFila = fila.getAttribute("data-estado-fila");
            if (estadoObjetivo === "todas") {
                fila.style.display = "";
            } else if (estadoFila && estadoFila.includes(estadoObjetivo)) {
                fila.style.display = "";
            } else {
                fila.style.display = "none";
            }
        });
    }

    botonesFiltro.forEach(btn => {
        const txt = btn.textContent.trim().toLowerCase();
        if (txt.includes("todas")) btn.onclick = () => filtrar("todas");
        if (txt.includes("exito")) btn.onclick = () => filtrar("exito");
        if (txt.includes("proceso")) btn.onclick = () => filtrar("proceso");
        if (txt.includes("falli") || txt.includes("error")) btn.onclick = () => filtrar("falli");
    });
}