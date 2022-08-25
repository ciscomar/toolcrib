let btnCerrarHistorial = document.getElementById("btnCerrarHistorial")

let table = $('#table').DataTable(
    {
        bFilter: true,
        bInfo: true,
        paging: true,
        pageLength: 15,  
        
    }
);



let tableHist = $('#tableHistorial').DataTable(
    {
        bFilter: true,
        bInfo: true,
        paging: true,
        pageLength: 15, 

        
    }
);



$(document).ready(function () {

    materialTable()


})


btnCerrarHistorial.addEventListener("click", () => {
    tableHist.clear().draw();

})

function materialTable() {

    data = { "id": `` }
    axios({
        method: 'post',
        url: `/getMaterialTable`,
        data: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
        .then((result) => {

            let data = result.data

            data.forEach(element => {
                let status=""
                if(element.stock == 0){status=`<span class="icoSidebar fas fa-times text-danger"><span hidden>B</span></span>`}
               else if(element.stock >= element.punto_reorden){status=`<span class="icoSidebar fas fa-check text-success"><span hidden>C</span></span>`}
               else if(element.stock < element.punto_reorden){status=`<span class="icoSidebar fas fa-shopping-cart text-secondary"><span hidden>A</span></span>`}
                
                

                table.row.add([
                    `<button type="submit" class="btn" id="btnHist${ element.id_material}" onClick="modalHistorial('${element.id_material}')"> <span class="icoSidebar fas fa-folder-open text-secondary""></span>`,
                    element.clave_material,
                    element.descripcion,
                    element.categoria,
                    element.rack,
                    element.nivel_rack,
                    element.stock,
                    element.stock_minimo,
                    element.punto_reorden,
                    element.critico,
                    status



                ]).draw(false);


            });




        })
        .catch((err) => { console.error(err) })


}



function modalHistorial(material) {

    $('#modalImpresion').modal({ backdrop: 'static', keyboard: false })

    

    data = { "id": `${material}` }
    axios({
        method: 'post',
        url: `/getHistorialMaterial`,
        data: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
        .then((result) => {

            let entradas = result.data[0]
            let salidas = result.data[1]

            entradas.forEach(element => {
console.log(element);
                tableHist.row.add([
                   

                    element.id_entrada,
                    "Entrada",
                    element.entrego,
                    element.recibio,
                    "MANTENIMIENTO",
                    element.cantidad,
                    element.fecha.substring(0, element.fecha.indexOf("T"))

                ]).draw(false);

            });


            salidas.forEach(element2 => {
                console.log(element2);
              
                tableHist.row.add([
                   
                    element2.id_salida,
                    "Salida",
                    element2.entrego,
                    element2.recibio,
                    element2.departamento,
                    element2.cantidad,
                    element2.fecha.substring(0, element2.fecha.indexOf("T"))

                ]).draw(false);

            });

        })
        .catch((err) => { console.error(err) })


}