import { Router } from 'express';
import { buscar, resumen } from '../controllers/funciones.controller.js';

const rutas = Router();

rutas.get('/buscar', buscar);
rutas.get('/resumen', resumen);

export default rutas;
