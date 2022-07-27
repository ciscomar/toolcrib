

let material = document.getElementById("material")
let descripcion = document.getElementById("descripcion")
let scategoria = document.getElementById("categoria")
let sconcepto = document.getElementById("concepto")
let sarea = document.getElementById("area")
let btnCapturar = document.getElementById("btnCapturar")
let btnEliminar = document.getElementById("btnEliminar")
let sunidad = document.getElementById("unidad")
let scritico = document.getElementById("critico")

$(document).ready(function () {

    material.focus()
    getSelectInputs()

    critico.value = ""
    unidad.value = ""
   // sunidad.innerHTML = ""
   // scritico.innerHTML = ""

})


material.addEventListener('change', function (evt) {

    materialFunction()

});

let materialID=""

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
            materialID=""

            console.log(data[0]);
            if (data.length === 1) {

                descripcion.value = data[0].descripcion
                scategoria.value = data[0].categoria
                sconcepto.value = data[0].concepto
                sarea.value = data[0].area
                rack.value = data[0].rack
                nivel.value = data[0].nivel_rack
                stockmin.value = data[0].stock_minimo
                stockmax.value = data[0].stock_maximo
                stock.value = data[0].stock
                sunidad.value = data[0].unidad_medida
                precio.value = data[0].precio
                reorden.value = data[0].punto_reorden
                scritico.value = data[0].critico

                materialID = data[0].id_material

                btnEliminar.removeAttribute("hidden"); 

            }else{

                descripcion.value = ""
                scategoria.value = ""
                sconcepto.value = ""
                sarea.value =""
                rack.value = ""
                nivel.value = ""
                stockmin.value = ""
                stockmax.value = ""
                stock.value = ""
                unidad.value = ""
                precio.value = ""
                reorden.value = ""
                critico.value = ""
                btnEliminar.setAttribute("hidden",true); 
                //categoria.focus()
            }


        })
        .catch((err) => { console.error(err) })


}



function getSelectInputs() {

    axios({
        method: 'get',
        url: `/getConfig`,
        headers: { 'content-type': 'application/json' }
    }).then((response) => {

        data= response.data
        categoria = data[0]
        concepto = data[1]
        area = data[2]

        scategoria.innerHTML = ""
        option = document.createElement('option')
        scategoria.add(option)
        categoria.forEach(element => {
            cat = element.categoria
            option = document.createElement('option')
            option.text = cat
            option.value = element.categoria
            scategoria.add(option)
        });


        sconcepto.innerHTML = ""
        option = document.createElement('option')
        sconcepto.add(option)
        concepto.forEach(element => {
            cat = element.concepto
            option = document.createElement('option')
            option.text = cat
            option.value = element.concepto
            sconcepto.add(option)
        });


        sarea.innerHTML = ""
        option = document.createElement('option')
        sarea.add(option)
        area.forEach(element => {
            cat = element.area
            option = document.createElement('option')
            option.text = cat
            option.value = element.area
            sarea.add(option)
        });

        })
        .catch((err) => { console.error(err) })


}



btnCapturar.addEventListener('click', function (evt) {



    if(material.value != "" && descripcion.value != "" && scategoria.innerHTML != "" && sconcepto.innerHTML != "" && sarea.innerHTML != "" && rack.value != "" &&
    nivel.value != "" && stockmin.value != "" && stockmax.value != "" && stock.value != "" && unidad.value != "" && precio.value != "" && reorden.value != "" && critico.value != "")

    {
        btnCapturar.disabled = true
        data = { "material": `${material.value}`,"materialID": `${materialID}`, "categoria": `${scategoria.value}`, "concepto": `${sconcepto.value}`, "descripcion": `${descripcion.value}`,
        "area": `${sarea.value}`, "rack": `${rack.value}`,"nivel": `${nivel.value}`, "stockmin": `${stockmin.value}`, "stockmax": `${stockmax.value}`,
        "stock": `${stock.value}`, "reorden": `${reorden.value}`, "unidad": `${unidad.value}`, "precio": `${precio.value}`, "critico": `${critico.value}`,
    }
        axios({
            method: 'post',
            url: `/insertMaterial`,
            data: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
            .then((result) => {

               
                material.value = ""
                descripcion.value = ""
                scategoria.value = ""
                sconcepto.value = ""
                sarea.value = ""
                rack.value = ""
                nivel.value = ""
                stockmin.value = ""
                stockmax.value = ""
                stock.value = ""
                unidad.value = ""
                precio.value = ""
                reorden.value = ""
                critico.value = ""

                btnCapturar.disabled = false
                btnEliminar.setAttribute("hidden", true); 
                successMessage("Material Guardado")

            })
            .catch((err) => { console.error(err) })
    

    }else{
        errorMessage("Informacion Incompleta")
    }



});



btnEliminar.addEventListener('click', function (evt) {


    data = { "material": `${material.value}`,"materialID": `${materialID}`}


    axios({
        method: 'post',
        url: `/deleteMaterial`,
        data: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
        .then((result) => {

           
            material.value = ""
            descripcion.value = ""
            scategoria.value = ""
            sconcepto.value = ""
            sarea.value = ""
            rack.value = ""
            nivel.value = ""
            stockmin.value = ""
            stockmax.value = ""
            stock.value = ""
            unidad.value = ""
            precio.value = ""
            reorden.value = ""
            critico.value = ""

            btnCapturar.disabled = false
            btnEliminar.setAttribute("hidden", true); 
            successMessage("Material Eliminado")

        })
        .catch((err) => { console.error(err) })

});



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