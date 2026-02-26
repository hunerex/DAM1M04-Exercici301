const express = require('express');
const fs = require('fs');
const path = require('path');
const hbs = require('hbs');

const app = express();
const port = 3000;

// Deshabilitar caché (només per a desenvolupament)
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});

// Fitxers estàtics (CSS)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Configurar Handlebars
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Registrar partials
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

// Registrar helpers
hbs.registerHelper('lte', (a, b) => a <= b); // Helper menor o igual

// --- RUTA / ---
app.get('/', (req, res) => {
  const sitePath = path.join(__dirname, 'data', 'site.json');
  const siteData = JSON.parse(fs.readFileSync(sitePath, 'utf8'));
  res.render('index', siteData);
});

// --- RUTA /informe ---
app.get('/informe', (req, res) => {
  // Llegir els tres fitxers JSON
  const sitePath = path.join(__dirname, 'data', 'site.json');
  const citiesPath = path.join(__dirname, 'data', 'cities.json');
  const countriesPath = path.join(__dirname, 'data', 'countries.json');

  const siteData = JSON.parse(fs.readFileSync(sitePath, 'utf8'));
  const citiesData = JSON.parse(fs.readFileSync(citiesPath, 'utf8'));
  const countriesData = JSON.parse(fs.readFileSync(countriesPath, 'utf8'));

  // Combinar tot en un sol objecte
  const viewData = {
    ...siteData,
    cities: citiesData.cities,
    countries: countriesData.countries
  };

  res.render('informe', viewData);
});

// Inici del servidor
const httpServer = app.listen(port, () => {
  console.log(`Servidor actiu a http://localhost:${port}`);
  console.log(`http://localhost:${port}/`);
  console.log(`http://localhost:${port}/informe`);
});

// Aturada controlada
process.on('SIGINT', () => {
  httpServer.close();
  process.exit(0);
});