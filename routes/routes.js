const express = require('express');
const router = express.Router();
const routesController = require('./routesController')
const middleware = require('../public/js/middlewares/middleware')


//Routes

router.get('/',routesController.index_GET);
router.get('/login/:id', middleware.loginVerify, routesController.login);
router.get('/acceso_denegado',routesController.accesoDenegado_GET);
router.get('/mainMenu',middleware.verifyToken, routesController.mainMenu_GET);
router.post('/userAccess', routesController.userAccess_POST);
router.get('/salida_material', middleware.verifyToken,  routesController.salida_material_GET);
router.post('/revisarMaterial', routesController.revisarMaterial_POST);
router.post('/getAreas',  routesController.getAreas_POST);
router.post('/requisitor',  routesController.requisitor_POST);
router.post('/insertSalida',  routesController.insertSalida_POST);
router.get('/entrada_material',middleware.verifyToken,  routesController.entrada_material_GET);
router.post('/insertEntrada',  routesController.insertEntrada_POST);
router.get('/inventario',middleware.sspi, routesController.inventario_GET);
router.post('/getMaterialTable',  routesController.getMaterialTable_POST);
router.get('/material', middleware.sspi,  routesController.material_GET);
router.get('/getConfig',  routesController.getConfig_GET);
router.post('/insertMaterial',  routesController.insertMaterial_POST);
router.post('/deleteMaterial',  routesController.deleteMaterial_POST);
router.post('/getHistorialMaterial',  routesController.getHistorialMaterial_POST);
router.get('/notificar',middleware.sspi, routesController.notificar_GET);
router.post('/getCorreosTable',  routesController.getCorreosTable_POST);
router.post('/getAllCorreos',  routesController.getAllCorreos_POST);
router.post('/insertCorreo',  routesController.insertCorreo_POST);
router.post('/deleteCorreo',  routesController.deleteCorreo_POST);
router.get('/reporte_entrada',  routesController.reporte_entrada_GET);
router.post('/tablaEntradas',  routesController.tablaEntradas_POST);
router.get('/reporte_salida',  routesController.reporte_salida_GET);
router.post('/tablaSalidas',  routesController.tablaSalidas_POST);

module.exports = router;