let material = document.getElementById("material")
let descripcion = document.getElementById("descripcion")
let cantidad = document.getElementById("cantidad")
let alerta_prefijo = document.getElementById("alerta_prefijo")
let btnCapturar = document.getElementById("btnCapturar")
let user_id = document.getElementById("user_id")
let user_name = document.getElementById("user_name")

let materialID
let departamentoReq

let usuario = user_id.innerText+" - "+user_name.innerText

$(document).ready(function () {

    material.focus()
 

})



material.addEventListener('change', function (evt) {

    materialFunction()

});




btnCapturar.addEventListener('click', function (evt) {

    if ( material.value != "" && descripcion.value != "" && cantidad.value != "") {

        btnCapturar.disabled = true

        data = { "material": `${materialID}`, "cantidad": `${cantidad.value}`, "departamento": `${departamentoReq}`, "usuario": `${usuario}`}
        axios({
            method: 'post',
            url: `/insertEntrada`,
            data: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
            .then((result) => {

                material.value=""
                descripcion.value=""
                cantidad.value=""
                btnCapturar.disabled = false
                successMessage("Entrada Guardada")
                material.focus()

            })
            .catch((err) => { console.error(err) })
    }

});

function materialFunction() {

    data = { "id": `${material.value}` }
    axios({
        method: 'post',
        url: `/revisarMaterial`,
        data: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
        .then((result) => {

            let data = result.data

            if (data.length === 1) {

                materialID=data[0].id_material
                descripcion.value = data[0].descripcion
                cantidad.focus()
                soundOk()

            } else {

                material.value = ""
                descripcion.value = ""

                errorMessage("Material Incorrecto")
            }




        })
        .catch((err) => { console.error(err) })


}



// function areasFunction() {

//     data = { "id": `${""}` }
//     axios({
//         method: 'post',
//         url: `/getAreas`,
//         data: JSON.stringify(data),
//         headers: { 'content-type': 'application/json' }
//     })
//         .then((result) => {

//             let data = result.data

//             option = document.createElement('option')
//             //option.text = "Seleccionar"
//             departamento.add(option)
//             data.forEach(element => {
//                 dep = element.area
//                 option = document.createElement('option')
//                 option.text = dep
//                 option.value = element.area
//                 departamento.add(option)
//             });


//         })
//         .catch((err) => { console.error(err) })


// }



function errorMessage(message) {

    soundWrong()
    alerta_prefijo.innerHTML = "Error: " + message
    alerta_prefijo.classList.remove("animate__flipOutX", "animate__animated")
    alerta_prefijo.classList.add("animate__flipInX", "animate__animated")


    setTimeout(() => {
        alerta_prefijo.classList.remove("animate__flipInX", "animate__animated")
        alerta_prefijo.classList.add("animate__flipOutX", "animate__animated")
    }, 2000);

}


function successMessage(message) {

    soundOk()
    alerta_prefijo.classList.remove("alert-danger");
    alerta_prefijo.classList.add("alert-success");

    alerta_prefijo.innerHTML =  message
    alerta_prefijo.classList.remove("animate__flipOutX", "animate__animated")
    alerta_prefijo.classList.add("animate__flipInX", "animate__animated")


    setTimeout(() => {
        
        alerta_prefijo.classList.remove("animate__flipInX", "animate__animated")
        alerta_prefijo.classList.add("animate__flipOutX", "animate__animated")
        setTimeout(() => {
            alerta_prefijo.classList.remove("alert-success");
            alerta_prefijo.classList.add("alert-danger");
        }, 2000);

    }, 2000);

}

