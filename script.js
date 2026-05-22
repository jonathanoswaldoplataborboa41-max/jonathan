function configurarBotonesFiltros() {
    // Buscamos la fila de botones que está justo arriba de la tabla
    const botones = document.querySelectorAll(".estado-tablas button, .estado-mapeo button, button");
    
    // Filtramos para quedarnos solo con los botones de control (Todas, Exitosas, En Proceso, Fallidas)
    // Evitamos los botones de "Ver Mapeo" descartando los que tienen la clase 'btn-detalle'
    const botonesFiltro = Array.from(botones).filter(btn => !btn.classList.contains("btn-detalle"));

    const filas = document.querySelectorAll("table tbody tr");

    function filtrar(estadoObjetivo) {
        filas.forEach(fila => {
            const estadoFila = fila.getAttribute("data-estado-fila");
            if (estadoObjetivo === "todas") {
                fila.style.display = ""; // Muestra todas
            } else if (estadoFila && estadoFila.includes(estadoObjetivo)) {
                fila.style.display = ""; // Muestra las que coinciden
            } else {
                fila.style.display = "none"; // Oculta las demás
            }
        });
    }

    // Asignamos los filtros por posición estricta según se ven en tu Dashboard:
    // Botón 0 = Todas, Botón 1 = Exitosas, Botón 2 = En Proceso, Botón 3 = Fallidas
    if (botonesFiltro.length >= 4) {
        botonesFiltro[0].onclick = () => filtrar("todas");
        botonesFiltro[1].onclick = () => filtrar("exito");
        botonesFiltro[2].onclick = () => filtrar("proceso");
        botonesFiltro[3].onclick = () => filtrar("falli");
        console.log("🎯 Filtros vinculados con éxito por posición.");
    } else {
        // Plan B: Si no los encuentra por posición, los busca por el texto que tengan escrito
        botonesFiltro.forEach(btn => {
            const txt = btn.textContent.trim().toLowerCase();
            if (txt.includes("todas")) btn.onclick = () => filtrar("todas");
            if (txt.includes("exito")) btn.onclick = () => filtrar("exito");
            if (txt.includes("proceso")) btn.onclick = () => filtrar("proceso");
            if (txt.includes("falli") || txt.includes("error")) btn.onclick = () => filtrar("falli");
        });
        console.log("🎯 Filtros vinculados por texto alternativo.");
    }
}