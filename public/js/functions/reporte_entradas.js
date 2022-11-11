let fileDate = new Date()
let fechaDesde
let fechaHasta
let btnExcel = document.getElementById("btnExcel")
//let Search_All = document.getElementById("Search_All")
// let serialesAxios
// let planesAxios
// let chart
// let count = 0
// let barChartEntrada = document.getElementById("bar-chart-grouped")


let tableEntradas = $('#tableEntradas').DataTable({
    dom: 'Blfrtip',
    searching: true,
    paging: true,
    info: true,
    buttons: [
        {
            extend: 'excelHtml5',
            title: `Reporte Entradas ${fileDate.toLocaleString()}`,
            filename: `Reporte Entradas ${fileDate.toLocaleString()}`,
            className: "d-none"
        }
    ],

 });
// let tablePlan = $('#tablePlan').DataTable({
//     dom: 'Blfrtip',
//     searching: true,
//     paging: true,
//     info: true,
//     buttons: [
//         {
//             extend: 'excelHtml5',
//             title: `Reporte Entrada/Salida ${fileDate.toLocaleString()}`,
//             filename: `Reporte Entrada/Salida ${fileDate.toLocaleString()}`,
//             className: "d-none"
//         }
//     ]
// });



// Search_All.addEventListener("keyup", () => {
//     tableSerials.search(Search_All.value).draw()
//     tablePlan.search(Search_All.value).draw()
// })
btnExcel.addEventListener("click", () => {
    tableEntradas.button('0').trigger()
    //tablePlan.button('0').trigger()

    // btnExcelMultiple.setAttribute('download', 'Grafico.png');
    // btnExcelMultiple.setAttribute('href', barChartEntrada.toDataURL("image/png").replace("image/png", "image/octet-stream"));
   
})



const desde = datepicker('#selectDesde', {
    id: 1,
    customDays: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
    overlayPlaceholder: 'Seleccionar Mes',
    customMonths: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    disabled: true,
    //minDate: new Date(2021, 3, 1),
    formatter: (input, date, instance) => {

        let mm = date.getMonth() + 1;
        let dd = date.getDate();
        let yy = date.getFullYear();
        if (mm <= 9) mm = '0' + mm;
        if (dd <= 9) dd = '0' + dd;
        fechaDesde = yy + '-' + mm + '-' + dd;
        input.value = fechaDesde
        tableEntradas.clear().draw();
        //tablePlan.clear().draw();
        fillTableEntradas()
       // fillTableSalidas()
       // grafica()
     
    }
})

const hasta = datepicker('#selectHasta', {
    id: 1,
    customDays: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
    overlayPlaceholder: 'Seleccionar Mes',
    customMonths: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    disabled: false,
    //minDate: new Date(2021, 3, 1),
    formatter: (input, date, instance) => {

        let mm = date.getMonth() + 1;
        let dd = date.getDate();
        let yy = date.getFullYear();
        if (mm <= 9) mm = '0' + mm;
        if (dd <= 9) dd = '0' + dd;
        fechaHasta = yy + '-' + mm + '-' + dd;
        input.value = fechaHasta
         tableEntradas.clear().draw();
        //tablePlan.clear().draw();
        fillTableEntradas()
       // fillTableSalidas()
       // grafica()

    }
})





function fillTableEntradas() {

    let data 

    if (fechaHasta == undefined){
        data = { "desde": `${fechaDesde}`, "hasta": `${fechaDesde}` }
    }else{
        data = { "desde": `${fechaDesde}`, "hasta": `${fechaHasta}` }
    }
    axios({
        method: 'post',
        url: `/tablaEntradas`,
        data: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    }).then(result => {

        

        for (let i = 0; i < result.data.length; i++) {
            new Date().toLocaleString
            console.log( result.data[i]);
            tableEntradas.row.add([
                result.data[i].clave_material,
                result.data[i].descripcion,
                result.data[i].recibio,
                result.data[i].cantidad,
                new Date(result.data[i].fecha).toLocaleString(),
            ]).draw(false);

        }
    })
        .catch((err) => { console.error(err) })
} 


// function fillTableSalidas() {
//     let data 

//     if (fechaHasta == undefined){
//         data = { "desde": `${fechaDesde}`, "hasta": `${fechaDesde}` }
//     }else{
//         data = { "desde": `${fechaDesde}`, "hasta": `${fechaHasta}` }
//     }
   
//     axios({
//         method: 'post',
//         url: `/tablaSalidas`,
//         data: JSON.stringify(data),
//         headers: { 'content-type': 'application/json' }
//     }).then(result => {

//         for (let i = 0; i < result.data.length; i++) {
//             new Date().toLocaleString

//             tableSerials.row.add([
//                 result.data[i].equipo_id,
//                 result.data[i].accion,
//                 result.data[i].emp_req,
//                 result.data[i].emp_aut,
//                 new Date(result.data[i].fecha).toLocaleString(),
//             ]).draw(false);

//         }
//     })
//         .catch((err) => { console.error(err) })
// }


// function grafica() {

//     let data 

//     if (fechaHasta == undefined){
//         data = { "desde": `${fechaDesde}`, "hasta": `${fechaDesde}` }
//     }else{
//         data = { "desde": `${fechaDesde}`, "hasta": `${fechaHasta}` }
//     }
//     axios({
//         method: 'post',
//         url: `/reporteGrafico`,
//         data: JSON.stringify(data),
//         headers: { 'content-type': 'application/json' }
//     })
//         .then(result => {

            
//             let valores = result.data

//             let emp = []
//             let entrada = []
//             let salida =[]

//             emp = []
//             entrada = []
//             salida = []

//             for (let i = 0; i < valores.length; i++) {
//                 if(valores[i].accion=="Entrada" && i< valores.length-1 && valores[i].emp_aut=== valores[i+1].emp_aut){
                   
//                     emp.push(valores[i].emp_aut)
//                     entrada.push(valores[i].cantidad)
//                     salida.push(valores[i+1].cantidad)

//                 }else if(valores[i].accion=="Salida" && valores[i].emp_aut != valores[i-1].emp_aut){

//                     emp.push(valores[i].emp_aut)
//                     entrada.push(0)
//                     salida.push(valores[i].cantidad)

//                 }else if(valores[i].accion=="Entrada"&& i< valores.length-1  && valores[i+1].accion == "Entrada"){

//                     emp.push(valores[i].emp_aut)
//                     entrada.push(valores[i].cantidad)
//                     salida.push(0)

//                 }else if(valores[i].accion=="Entrada"&& i== valores.length-1){
//                     emp.push(valores[i].emp_aut)
//                     entrada.push(valores[i].cantidad)
//                     salida.push(0)
//                 }
                
//             }


//             if (count != 0) chart.destroy()

//             chart = new Chart(barChartEntrada, {

//                 type: 'bar',
//                 data: {
//                     labels: emp,
//                     datasets: [
//                         {
//                             label: "Entradas",
//                             backgroundColor: 'rgb(92, 184, 92, 0.5)',
//                             borderColor: "	rgb(92, 184, 92)",
//                             borderWidth: 2,
//                             data: entrada
//                         },{
//                             label: "Salidas",
                       
//                             backgroundColor: "rgb(2, 117, 216, 0.5)",
//                             borderColor: "rgb(2, 117, 216)",
//                             borderWidth: 2,
//                             data: salida
//                         }
//                     ]
//                 },
//                 options: {
//                     plugins: {
//                         zoom: {
//                             limits: {
//                                 x: { min: 0, max: 200, minRange: 50 },
//                                 y: { min: 0, max: 200, minRange: 50 }
//                             },
//                             pan: {
//                                 enabled: true,
//                                 mode: 'x',
//                                 sensitivity: 3,
//                                 speed: 1,
                                
//                             },
//                             zoom: {
//                                 enabled: true,
//                                 mode: 'x',

//                             }
//                         }
//                     },

//                     scales: {
//                         yAxes: [{
//                             ticks: {
//                                 beginAtZero: true
//                             }
//                         }]
//                     }
//                 }
//             });
//             count++
//         })

//         .catch(err => { console.error(err) })


      

// }


