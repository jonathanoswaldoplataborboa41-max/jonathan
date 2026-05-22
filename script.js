function llenarTabla(datos) {
    const tablaCuerpo = document.querySelector("table tbody");
    if (!tablaCuerpo) return;
    tablaCuerpo.innerHTML = "";

    datos.forEach(fila => {
        const tr = document.createElement("tr");
        // Guardamos el estado en un atributo del HTML para que los filtros lo reconozcan fácilmente
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
                <button class="btn-detalle" data-tabla="${fila.nombre}" style="padding: 4px 8px; cursor: pointer;">Ver Mapeo</button>
            </td>
        `;
        tablaCuerpo.appendChild(tr);
    });

    // Escuchador para el botón "Ver Mapeo"
    tablaCuerpo.addEventListener("click", (evento) => {
        const boton = evento.target.closest(".btn-detalle");
        if (boton) {
            const nombreTabla = boton.getAttribute("data-tabla");
            mostrarMapeoReal(nombreTabla);
        }
    });

    // CONFIGURACIÓN DE LOS FILTROS (Todas, Exitosas, En Proceso, Fallidas)
    configurarBotonesFiltros();
}

function configurarBotonesFiltros() {
    // Buscamos los botones de filtro basándonos en el texto que contienen
    const botones = document.querySelectorAll("button");
    let btnTodas, btnExitosas, btnProceso, btnFallidas;

    botones.forEach(btn => {
        const texto = btn.textContent.trim().toLowerCase();
        if (texto === "todas") btnTodas = btn;
        if (texto === "exitosas") btnExitosas = btn;
        if (texto === "en proceso") btnProceso = btn;
        if (texto === "fallidas") btnFallidas = btn;
    });

    const filas = document.querySelectorAll("table tbody tr");

    function filtrar(estadoObjetivo) {
        filas.forEach(fila => {
            const estadoFila = fila.getAttribute("data-estado-fila");
            if (estadoObjetivo === "todas") {
                fila.style.display = ""; // Muestra todas
            } else if (estadoFila.includes(estadoObjetivo)) {
                fila.style.display = ""; // Muestra las que coinciden
            } else {
                fila.style.display = "none"; // Oculta las demás
            }
        });
    }

    // Asignamos los eventos de clic si los botones existen en tu HTML
    if (btnTodas) btnTodas.onclick = () => filtrar("todas");
    if (btnExitosas) btnExitosas.onclick = () => filtrar("exito");
    if (btnProceso) btnProceso.onclick = () => filtrar("proceso");
    if (btnFallidas) btnFallidas.onclick = () => filtrar("falli");
}