const funcion = {};

const dbE = require('../../db/conn_empleados');
const db = require('../../db/conn_toolcrib');
const dbA = require('../../db/conn_areas');
const dbEA = require('../../db/conn_empleadosAll');


funcion.getUsers = (user) => {
    return new Promise((resolve, reject) => {
        dbE(`
        SELECT 
            emp_name
        FROM
            empleados
        WHERE
            emp_num = ${user}
       
        `)
            .then((result) => { resolve(result) })
            .catch((error) => { reject(error) })
    })
}


funcion.getAreas = () => {
    return new Promise((resolve, reject) => {
        dbA(`
        SELECT 
            *
        FROM
            areas
       
        `)
            .then((result) => { resolve(result) })
            .catch((error) => { reject(error) })
    })
}


funcion.getMaterial = (id) => {
    return new Promise((resolve, reject) => {
        db(`
        SELECT 
            *
        FROM
            materiales
        WHERE
            clave_material = '${id}' AND status='Activo'
       
        `)
            .then((result) => { resolve(result) })
            .catch((error) => { reject(error) })
    })
}


funcion.getMaterialById = (id) => {
    return new Promise((resolve, reject) => {
        db(`
        SELECT 
            *
        FROM
            materiales
        WHERE
            id_material = '${id}' AND status='Activo'
       
        `)
            .then((result) => { resolve(result) })
            .catch((error) => { reject(error) })
    })
}


funcion.getMaterialTable = () => {
    return new Promise((resolve, reject) => {
        db(`
        SELECT 
            *
        FROM
            materiales
            WHERE status='Activo'
       
        `)
            .then((result) => { resolve(result) })
            .catch((error) => { reject(error) })
    })
}


funcion.requisitor = (id) => {
    return new Promise((resolve, reject) => {
        dbEA(`
        SELECT 
            *
        FROM
            del_empleados
        WHERE
            emp_id = '${id}'
       
        `)
            .then((result) => { resolve(result) })
            .catch((error) => { reject(error) })
    })
}


funcion.insertSalida = (data) => {

    return new Promise((resolve, reject) => {
        db(`
        INSERT INTO 
            salidas (id_material,cantidad,departamento,entrego, recibio, fecha)
        VALUES
            ('${data.material}','${data.cantidad}','${data.departamento}','${data.usuario}','${data.requisitor}', NOW())
            `)
            .then((result) => { resolve(result) })
            .catch((error) => { reject(error) })
    })
}


funcion.updateStockSalida = (data) => {

    return new Promise((resolve, reject) => {

            db(`
            UPDATE 
                materiales
            SET
                stock = stock-${data.cantidad},
                ultima_salida = ${data.cantidad},
                fecha_ultima_salida = NOW()
            WHERE
                id_material= '${data.material}'
            
            `)
                .then((result) => { resolve(result) })
                .catch((error) => { reject(error) })
        
    })
}


funcion.insertEntrada = (data) => {

    return new Promise((resolve, reject) => {
        db(`
        INSERT INTO 
            entradas (id_material,cantidad,recibio, fecha)
        VALUES
            ('${data.material}','${data.cantidad}','${data.usuario}', NOW())
            `)
            .then((result) => { resolve(result) })
            .catch((error) => { reject(error) })
    })
}

funcion.updateStockEntrada = (data) => {

    return new Promise((resolve, reject) => {

            db(`
            UPDATE 
                materiales
            SET
                stock = stock+${data.cantidad},
                ultima_entrada = ${data.cantidad},
                fecha_ultima_entrada= NOW()
            WHERE
                id_material= '${data.material}'
            
            `)
                .then((result) => { resolve(result) })
                .catch((error) => { reject(error) })
        
    })
}


funcion.getCat = () => {
    return new Promise((resolve, reject) => {
        db(`
        SELECT 
            *
        FROM
            categoria
       
        `)
            .then((result) => { resolve(result) })
            .catch((error) => { reject(error) })
    })
}


funcion.getCon = () => {
    return new Promise((resolve, reject) => {
        db(`
        SELECT 
            *
        FROM
            concepto
       
        `)
            .then((result) => { resolve(result) })
            .catch((error) => { reject(error) })
    })
}


funcion.getArea = () => {
    return new Promise((resolve, reject) => {
        db(`
        SELECT 
            *
        FROM
            area
       
        `)
            .then((result) => { resolve(result) })
            .catch((error) => { reject(error) })
    })
}



funcion.insertMaterial= (values) => {


    return new Promise((resolve, reject) => {
            db(`
        INSERT INTO materiales (
            id_material,
            clave_material, 
            descripcion, 
            categoria, 
            concepto, 
            area, 
            rack,
            nivel_rack, 
            stock_minimo, 
            stock_maximo, 
            stock, 
            punto_reorden, 
            unidad_medida, 
            precio, 
            critico,
            status)
    VALUES( 
    '${values.materialID}',
    '${values.material}', 
    '${values.descripcion}', 
    '${values.categoria}',
    '${values.concepto}',
    '${values.area}', 
    '${values.rack}',
    '${values.nivel}',  
    '${values.stockmin}',
    '${values.stockmax}', 
    '${values.stock}',
    '${values.reorden}', 
    '${values.unidad}', 
    '${values.precio}',
    '${values.critico}',
    'Activo')
       ON DUPLICATE KEY UPDATE 
            descripcion='${values.descripcion}', 
            categoria='${values.categoria}', 
            concepto='${values.concepto}', 
            area='${values.area}', 
            rack='${values.rack}',
            nivel_rack='${values.nivel}', 
            stock_minimo= '${values.stockmin}', 
            stock_maximo='${values.stockmax}',  
            stock='${values.stock}',
            punto_reorden='${values.reorden}',  
            unidad_medida='${values.unidad}', 
            precio='${values.precio}', 
            critico='${values.critico}',
            status='Activo'
            `)
                .then((result) => { resolve(result) })
                .catch((error) => { reject(error) })

    })

}





funcion.insertMaterialNew= (values) => {


    return new Promise((resolve, reject) => {
            db(`
        INSERT INTO materiales (
            clave_material, 
            descripcion, 
            categoria, 
            concepto, 
            area, 
            rack,
            nivel_rack, 
            stock_minimo, 
            stock_maximo, 
            stock, 
            punto_reorden, 
            unidad_medida, 
            precio, 
            critico,
            status)
    VALUES( 
    '${values.material}', 
    '${values.descripcion}', 
    '${values.categoria}',
    '${values.concepto}',
    '${values.area}', 
    '${values.rack}',
    '${values.nivel}',  
    '${values.stockmin}',
    '${values.stockmax}', 
    '${values.stock}',
    '${values.reorden}', 
    '${values.unidad}', 
    '${values.precio}',
    '${values.critico}',
    'Activo')
            `)
                .then((result) => { resolve(result) })
                .catch((error) => { reject(error) })

    })

}


funcion.deleteMaterial = (data) => {

    return new Promise((resolve, reject) => {

            db(`
            UPDATE 
                materiales
            SET
                status = 'Obsoleto'
            WHERE
                id_material= '${data.materialID}' AND  clave_material= '${data.material}'
            
            `)
                .then((result) => { resolve(result) })
                .catch((error) => { reject(error) })
        
    })
}



funcion.getEntradas = (id) => {
    return new Promise((resolve, reject) => {
        db(`
        SELECT 
            *
        FROM
            entradas
        WHERE
            id_material = '${id}'
       
        `)
            .then((result) => { resolve(result) })
            .catch((error) => { reject(error) })
    })
}



funcion.getSalidas = (id) => {
    return new Promise((resolve, reject) => {
        db(`
        SELECT 
            *
        FROM
            salidas
        WHERE
            id_material = '${id}'
       
        `)
            .then((result) => { resolve(result) })
            .catch((error) => { reject(error) })
    })
}



funcion.getCorreos = (id) => {
    return new Promise((resolve, reject) => {
        db(`
        SELECT 
            *
        FROM
            correo
       
        `)
            .then((result) => { resolve(result) })
            .catch((error) => { reject(error) })
    })
}


funcion.getAllCorreos= () => {
    return new Promise((resolve, reject) => {
        dbEA(`
        SELECT 
            emp_correo
        FROM
            del_empleados
        WHERE
            emp_correo != ""
       
        `)
            .then((result) => { resolve(result) })
            .catch((error) => { reject(error) })
    })
}


funcion.insertCorreo = (correo) => {

    return new Promise((resolve, reject) => {
        db(`
        INSERT INTO 
            correo (correo)
        VALUES
            ('${correo}')
            `)
            .then((result) => { resolve(result) })
            .catch((error) => { reject(error) })
    })
}



funcion.deleteCorreo = (id) => {

    return new Promise((resolve, reject) => {
        db(`
        DELETE 
            FROM 
                correo 
            WHERE
                id = '${id}'
            `)
            .then((result) => { resolve(result) })
            .catch((error) => { reject(error) })
    })
}


module.exports = funcion;