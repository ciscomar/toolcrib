//Conexion a base de datos
const controller = {};
var amqp = require('amqplib/callback_api');
const jwt = require('jsonwebtoken');
//Require Redis
const redis = require('redis');
//Require Funciones
const funcion = require('../public/js/functions/controllerFunctions');

const ejs = require("ejs");
const path = require('path');
const nodeMailer = require('../public/mail/conn')

async function sendMail(to, material) {

    const data = await ejs.renderFile(path.join(__dirname, `../public/mail/mail.ejs`), { clave: material.clave_material, stock: material.stock, reorden: material.punto_reorden, descripcion: material.descripcion  });
    let mailOptions = {
        from: "noreply@tristone.com",
        to: `${to}`,
        subject: `ToolCrib Punto de Reorden #${material.clave_material} `,
        text: "",
        html: data,
    };


    nodeMailer.transport.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
        } else {
            console.info(info);
        }
    })
}


controller.index_GET = (req, res) => {
    user = req.connection.user
    res.render('index.ejs', {
        user
    });
}

controller.login = (req, res) => {
    res.render('login.ejs', {
    });
}

controller.accesoDenegado_GET = (req, res) => {
    user = req.connection.user
    res.render('acceso_denegado.ejs', {
        user
    });
}

function acceso(req) {
    let acceso = []
    let userGroups = req.connection.userGroups

    return new Promise((resolve, reject) => {
        userGroups.forEach(element => {
            if (element.toString() === 'TFT\\TFT.DEL.PAGES_Toolcrib') {
                acceso.push(element.toString())
            }
        });
        let response = acceso.length == 0 ? reject("noAccess") : resolve(acceso)
    })

}



controller.mainMenu_GET = (req, res) => {
    
    let user_id = req.res.locals.authData.id.id
    let user_name = req.res.locals.authData.id.username
    res.render('main_menu.ejs', {
        user_id,
        user_name
    })
}


controller.inventario_GET = (req, res) => {
    
    let access = ""
    acceso(req)
        .then((result) => {

            result.forEach(element => {
                
                if (element === "TFT\\TFT.DEL.PAGES_Toolcrib") access = "ok"
            });
            if (access == "ok") {
                res.render("inventario.ejs")
            } else {
                res.redirect("/acceso_denegado")
            }
        })
        .catch((err) => { res.redirect("/acceso_denegado") })


}

controller.userAccess_POST = (req, res) => {
    let user_id = req.body.user
    funcion.getUsers(user_id)
        .then((result) => {
            if (result.length == 1) {
                emp_nombre = result[0].emp_name

                accessToken(user_id, emp_nombre)
                    .then((result) => {
                        cookieSet(req, res, result)
                    })
                    .catch((err) => { res.json(err); })

            } else {
                res.json("unathorized")
            }
        })
        .catch((err) => {
            console.error(err);
            res.json(err)
        })
}

function accessToken(user_id, user_name) {
    return new Promise((resolve, reject) => {
        const id = { id: `${user_id}`, username: `${user_name}` }
        jwt.sign({ id }, `tristone`, {/*expiresIn: '1h'*/}, (err, token) => {
            resolve(token)
            reject(err)
        })
    })
}


function cookieSet(req, res, result) {

    let minutes = 15;
    const time = minutes * 60 * 1000;
    res.cookie('accessToken', result,
        {
            maxAge: time,
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production' ? true : false
        })
    res.json(result)

}


controller.salida_material_GET = (req, res) => {
    let user_id = req.res.locals.authData.id.id
    let user_name = req.res.locals.authData.id.username
    res.render('salida_material.ejs', {
        user_id,
        user_name
    });
}


controller.entrada_material_GET = (req, res) => {
    let user_id = req.res.locals.authData.id.id
    let user_name = req.res.locals.authData.id.username
    res.render('entrada_material.ejs', {
        user_id,
        user_name
    });
}


controller.material_GET = (req, res) => {

    let access = ""
    acceso(req)
        .then((result) => {
         
            result.forEach(element => {
                
                if (element === "TFT\\TFT.DEL.PAGES_Toolcrib") access = "ok"
            });
            if (access == "ok") {
                res.render("material.ejs")
            } else {
                res.redirect("/acceso_denegado")
            }
        })
        .catch((err) => { res.redirect("/acceso_denegado") })


}

controller.revisarMaterial_POST = (req, res) => {

    let id= req.body.id

    funcion.getMaterial(id)
    .then((result) => { res.json(result) })
    .catch((err) => { console.error(err) })

}



controller.getAreas_POST = (req, res) => {

    funcion.getAreas()
    .then((result) => { res.json(result) })
    .catch((err) => { console.error(err) })
}


controller.requisitor_POST = (req, res) => {

    id= req.body.id

    funcion.requisitor(id)
    .then((result) => { res.json(result) })
    .catch((err) => { console.error(err) })

}


controller.insertSalida_POST = (req, res) => {

    let data = req.body
    let material = req.body.material


    console.log(material);
    async function waitForPromise() {
        let insertSalida = await funcion.insertSalida(data);
        let updateStock = await funcion.updateStockSalida(data);
        let getMaterial = await funcion.getMaterialById(material);
        let getCorreos = await funcion.getCorreos();
        Promise.all([insertSalida, updateStock, getMaterial, getCorreos])
            .then(result => {

                console.log(getCorreos);

                if(getMaterial[0].stock <= getMaterial[0].punto_reorden){

                    for (let i = 0; i < getCorreos.length; i++) {
                        sendMail(getCorreos[i].correo, getMaterial[0])
                    }
                }

                 res.json(result) 


                })
            .catch(err => { console.error(err) })
    }
    waitForPromise()

}



controller.insertEntrada_POST = (req, res) => {

    let data = req.body


    async function waitForPromise() {
        let insertEntrada = await funcion.insertEntrada(data);
        let updateStock = await funcion.updateStockEntrada(data);
        Promise.all([insertEntrada, updateStock])
            .then(result => { res.json(result) })
            .catch(err => { console.error(err) })
    }
    waitForPromise()

}


controller.getMaterialTable_POST = (req, res) => {

    funcion.getMaterialTable()
    .then((result) => { res.json(result) })
    .catch((err) => { console.error(err) })
}



controller.getConfig_GET = (req, res) => {

    async function waitForPromise() {
        let getCat = await funcion.getCat();
        let getCon = await funcion.getCon();
        let getArea = await funcion.getArea();
        
        Promise.all([getCat, getCon, getArea])
            .then(result => { res.json(result) })
            .catch(err => { console.error(err) })
    }
    waitForPromise()

}


controller.insertMaterial_POST = (req, res) => {

    let data = req.body

    funcion.insertMaterial(data)
    .then((result) => { res.json(result) })
    .catch((err) => { console.error(err) })
}


controller.deleteMaterial_POST = (req, res) => {

    let data = req.body

    funcion.deleteMaterial(data)
    .then((result) => { res.json(result) })
    .catch((err) => { console.error(err) })
}


controller.getHistorialMaterial_POST = (req, res) => {

    let id = req.body.id


    async function waitForPromise() {
        let entradas = await funcion.getEntradas(id);
        let salidas = await funcion.getSalidas(id);
        Promise.all([entradas, salidas])
            .then(result => { res.json(result) })
            .catch(err => { console.error(err) })
    }
    waitForPromise()

}



controller.notificar_GET = (req, res) => {
    
    let access = ""
    acceso(req)
        .then((result) => {

            result.forEach(element => {
                
                if (element === "TFT\\TFT.DEL.PAGES_Toolcrib") access = "ok"
            });
            if (access == "ok") {
                res.render("notificar.ejs")
            } else {
                res.redirect("/acceso_denegado")
            }
        })
        .catch((err) => { res.redirect("/acceso_denegado") })


}



controller.getCorreosTable_POST = (req, res) => {

    funcion.getCorreos()
    .then((result) => { res.json(result) })
    .catch((err) => { console.error(err) })
}



controller.getAllCorreos_POST = (req, res) => {

    funcion.getAllCorreos()
    .then((result) => { res.json(result) })
    .catch((err) => { console.error(err) })
}

controller.insertCorreo_POST = (req, res) => {

    let correo = req.body.correo

    funcion.insertCorreo(correo)
    .then((result) => { res.json(result) })
    .catch((err) => { console.error(err) })
}


controller.deleteCorreo_POST = (req, res) => {

    let id = req.body.id

    funcion.deleteCorreo(id)
    .then((result) => { res.json(result) })
    .catch((err) => { console.error(err) })
}
module.exports = controller;