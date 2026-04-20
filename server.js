const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middlewares para procesar JSON y permitir conexiones
app.use(cors());
app.use(express.json());

// Servir la carpeta 'public' estáticamente (tu web)
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para recibir los correos (El Embudo)
app.post('/api/leads', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'El correo es obligatorio' });
    }

    const newLead = {
        email,
        fecha: new Date().toISOString()
    };

    const filePath = path.join(__dirname, 'leads.json');

    // Leer el archivo existente o crear uno nuevo si no existe
    fs.readFile(filePath, 'utf8', (err, data) => {
        let leads = [];
        if (!err && data) {
            leads = JSON.parse(data);
        }

        // Verificar si el correo ya existe para no duplicar
        const existe = leads.find(lead => lead.email === email);
        if (existe) {
            return res.status(400).json({ error: 'Este correo ya está en la lista de espera.' });
        }

        leads.push(newLead);

        // Guardar el nuevo usuario en el archivo JSON
        fs.writeFile(filePath, JSON.stringify(leads, null, 2), (err) => {
            if (err) {
                console.error('Error al guardar el lead:', err);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }
            console.log(`Nuevo acceso solicitado por: ${email}`);
            res.status(200).json({ message: 'Acceso solicitado con éxito. Bienvenido a Vanguardia.' });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor de Vanguardia activo en http://localhost:${PORT}`);
});