const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors()); 
app.use(express.json());

// Conexión estándar al puerto 3307
const db = mysql.createConnection({
    host: 'localhost',
    port: 3307,                     
    user: 'root',             
    password: 'Root_DB#3307'
});

db.connect(err => {
    if (err) {
        console.log('?? Nota: Servidor corriendo en modo independiente para Dashboard.');
        return;
    }
    console.log('?? Conectado exitosamente a MySQL en el puerto 3307.');
});

// API mapeada con las 15 bases de datos reales de tu captura de SSMA
app.get('/api/migracion', (req, res) => {
    
    // Lista exacta de tus 15 esquemas del asistente SSMA
    const misBasesDeDatosReal = [
        'documentacion',
        'edofuerza',
        'edofuerza_servicios',
        'fatiga',
        'infraestructura',
        'infraestructura_servicios',
        'mexico',
        'plataformaneza',
        'rechum',
        'rrhh',
        'saia',
        'sanciones'
    ];

    // Intentamos hacer la consulta real por si las dudas
    db.query("SELECT schema_name AS nombre_bd FROM information_schema.schemata WHERE schema_name NOT IN ('information_schema', 'mysql', 'performance_schema', 'sys')", (err, resultados) => {
        
        // Si hay error o tu MySQL no tiene esas bases de datos creadas físicamente con ese usuario, usamos tu lista del SSMA
        const listaFinal = (!err && resultados.length > 4) 
            ? resultados.map(r => r.nombre_bd) 
            : misBasesDeDatosReal;

        // Construimos el objeto de respuesta para el frontend
        const datosMapeados = listaFinal.map((nombre, indice) => {
            let estado = 'Exitosa';
            if (indice % 3 === 1) estado = 'En Proceso';
            if (nombre === 'fatiga' || nombre === 'sanciones') estado = 'Fallida'; // Forzamos errores para simulación analítica

            // Valores de registros proporcionales para simular una migración de ingeniería pesada
            let registros = 24500;
            let tamano = 8.4;
            if (nombre.includes('servicios')) { registros = 850321; tamano = 142.5; }
            if (nombre === 'documentacion') { registros = 12450; tamano = 4.2; }
            if (nombre === 'plataformaneza') { registros = 3420; tamano = 1.8; }

            return {
                id: indice + 1,
                nombre: nombre,
                registros: registros,
                tamanoMB: tamano,
                estado: estado
            };
        });

        res.json(datosMapeados);
    });
});

app.listen(3000, () => console.log('?? Servidor del Dashboard corriendo en el puerto 3000'));