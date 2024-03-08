let dateFormat = 'YYYY-MM-DD HH:mm:ss'
$.fn.dataTable.ext.errMode = 'none';

let dt_rag = new codeRagSdk('/', 'api/')

let sanitize = function (obj) {
    let saveData = {}
    for (let [key, val] of Object.entries(obj)) {
        if (val != '') {
            saveData[key] = val
        }
    }
    return saveData
}
let validateFull = async function (columns, formValues) {
    let needed = []
    let complete = true
    if (formValues) {
        for (let item of columns) {

            if (item.type != '_ACTIONS_' && item.type != 'boolean') {
                console.log(item)
                if (item.required && (!formValues[item.name] || formValues[item.name] == '')) {
                    complete = false
                    needed.push(item.name)

                }
            }
        }
    }
    return {complete, needed}
}

let columnsDatatableProccess = function (columns) {
    let newcolumns = []
    for (let item of columns) {
        if (item.type == 'objectid') {
            newcolumns.push({
                data: item.name,
                render: function (data, v, row) {
                    return '<a href="#" class="datatable_object_id_cp">' + data + '</a>'

                }
            })
        } else if (item.type == 'string' || item.type == 'number') {
            newcolumns.push({
                data: item.name,
                render: function (data, v, row) {
                    if (String(data).length > 50) {
                        return '<p>' + String(data).substring(0, 50) + '...</p>'
                    }
                    return '<p>' + data + '</p>'
                }
            })
        } else if (item.type == 'date') {
            newcolumns.push({
                data: item.name,
                render: function (data, v, row) {
                    return '<p>' + moment(data).format(dateFormat) + '</p>'
                }
            })
        } else if (item.type == 'boolean') {
            newcolumns.push({
                data: item.name,
                render: function (data, v, row) {
                    let id = row?._id || row?.id || row?.uuid

                    if (data) {
                        return '<p>  <input reference="' + item.name + '" value="' + id + '" class="datatable_check_id" checked type="checkbox"> <br><span class="badge badge-success">' + data + '</span></p>'
                    }
                    return '<p> <input reference="' + item.name + '"  value="' + id + '" class="datatable_check_id"  type="checkbox"><br> <span class="badge badge-danger">' + data + '</span></p>'
                }
            })
        } else if (item.type == '_ACTIONS_') {
            newcolumns.push({
                data: item.name,
                render: function (data, v, row) {
                    let id = row?._id || row?.id || row?.uuid
                    let buttons = []
                    if (item.default.includes('update')) {
                        buttons.push('<button value="' + id + '" class="btn btn-warning btn-block datatable_edit_button"> <i class="fas fa-pen"></i> </button>')
                    }
                    if (item.default.includes('read')) {
                        buttons.push('<button value="' + id + '" class="btn btn-success btn-block datatable_view_button"> <i class="fas fa-eye"></i> </button>')
                    }
                    if (item.default.includes('delete')) {
                        buttons.push('<button value="' + id + '" class="btn btn-danger btn-block datatable_delete_button"><i class="fas fa-trash"></i> </button>')

                    }

                    return buttons.join(' ')
                }
            })
        } else {
            newcolumns.push({
                data: item.name,
                render: function (data, v, row) {

                    if (typeof data == 'object') {
                        return '<p> ' + JSON.stringify(data) + '</p>'
                    } else {
                        return '<p> ' + data + '</p>'
                    }

                }
            })
        }
    }
    console.log('length', newcolumns.length)
    return newcolumns
}
let columnsFormProccess = function (columns) {
    let ObjFunctionVal = {}
    let newcolumns = []
    for (let item of columns) {


        if (item.type == 'objectid') {
            if (item.name == '_id') {
                newcolumns.push('<p align="left">' + (item.customName ? item.customName : item.name) + '</p><input class="form-control" id="new_datatable_' + $n_datatable.name + item.name + '" disabled readonly type="text">')
                ObjFunctionVal[item.name] = {id: "new_datatable_" + $n_datatable.name + item.name, item}
            } else {
                newcolumns.push('<p align="left">' + (item.customName ? item.customName : item.name) + '</p><input class="form-control" id="new_datatable_' + $n_datatable.name + item.name + '"   type="text">')
                ObjFunctionVal[item.name] = {id: "new_datatable_" + $n_datatable.name + item.name, item}
            }

        } else if (item.type == 'string' || item.type == 'number') {
            ObjFunctionVal[item.name] = {id: "new_datatable_" + $n_datatable.name + item.name, item}
            if (item.enum && item.enum.length > 0) {

                newcolumns.push('<p align="left">' + (item.customName ? item.customName : item.name) + '</p><select class="form-control"  id="new_datatable_' + $n_datatable.name + item.name + '" >' +
                    item.enum.map((item) => {
                        return '<option>' + item + '</option>'
                    })
                    + '</select>')

            } else {
                let type = 'text'
                if (item.type == 'number') {
                    type = 'number'
                }
                if (item.isPassword) {
                    type = 'password'
                }
                if (item.isFile) {
                    type = 'file'
                }
                newcolumns.push('<p align="left">' + (item.customName ? item.customName : item.name) + '</p><input class="form-control"  id="new_datatable_' + $n_datatable.name + item.name + '"  type="' + type + '">'
                )

            }

        } else if (item.type == 'date') {
            if (item.name != 'createdAt' && item.name != 'updatedAt') {
                ObjFunctionVal[item.name] = {id: "new_datatable_" + $n_datatable.name + item.name, item}
                newcolumns.push('<p align="left">' + (item.customName ? item.customName : item.name) + '</p><input class="form-control"  id="new_datatable_' + $n_datatable.name + item.name + '"  type="date">')
            } else {
                ObjFunctionVal[item.name] = {id: "new_datatable_" + $n_datatable.name + item.name, item}
                newcolumns.push('<p align="left">' + (item.customName ? item.customName : item.name) + '</p><input class="form-control"  id="new_datatable_' + $n_datatable.name + item.name + '" disabled readonly  type="date">')

            }

        } else if (item.type == 'boolean') {
            ObjFunctionVal[item.name] = {id: "new_datatable_" + $n_datatable.name + item.name, item}
            newcolumns.push('<p align="left">' + (item.customName ? item.customName : item.name) + '</p><br><input   id="new_datatable_' + $n_datatable.name + item.name + '"  type="checkbox"><br>')


        } else if (item.type == '_ACTIONS_') {
            console.log('actions')
        } else {
            newcolumns.push('<p align="left">' + (item.customName ? item.customName : item.name) + '</p><textarea class="form-control"  id="new_datatable_' + $n_datatable.name + item.name + '" rows="5" type="text"> </textarea>')
            ObjFunctionVal[item.name] = {id: "new_datatable_" + $n_datatable.name + item.name, item}
        }
    }

    let functionMapper = function () {
        let obj = {}
        for (let [key, val] of Object.entries(ObjFunctionVal)) {
            if (val.item.type == 'boolean') {
                obj[key] = document.getElementById(val.id).checked
            } else if (val.item.isFile) {
                obj[key] = document.getElementById(val.id)?.files[0] | ''
            } else {
                obj[key] = document.getElementById(val.id).value
            }

        }

        return obj
    }

    const midpoint = Math.ceil(newcolumns.length / 2);

    const [firstHalf, secondHalf] = [newcolumns.slice(0, midpoint), newcolumns.slice(midpoint)];

    return {
        html: '<div class="container-fluid">' +
            '<div class="row">' +
            '   <div class="col-6">' +
            firstHalf.join(' ') +
            '   </div>' +
            '   <div class="col-6">' +
            secondHalf.join(' ') +
            '   </div>' +
            '</div>' +
            '</div>',
        preConfirm: functionMapper,
        mapIDS: ObjFunctionVal
    }
}


$(document).ready(function () {

    if ($n_datatable) {
        dt_rag.setResource($n_datatable.name)

        let myDatatable_control = $('#datatable_' + $n_datatable.name).DataTable({
            initComplete: function () {
                $(this.api().table().container()).find('input').parent().wrap('<form>').parent().attr('autocomplete', 'off');
            },
            "data": {},
            dom: 'Bfrtip',
            lengthMenu: [
                [10, 25, 50, 100, 1000],
                ['10 rows', '25 rows', '50 rows', '100 rows', '1000 rows']
            ],
            buttons: [
                'copy', 'csv', 'excel', 'pdf', 'print', 'colvis', 'pageLength',
            ],
            scrollX: true,
            "paging": true,
            "searching": true,
            "ordering": true,
            "info": true,
            "columns": columnsDatatableProccess($n_datatable.columns),
            processing: true,
            serverSide: true,
            ajax: {
                url: '/api/' + $n_datatable.name + '/datatable/?populate=true',
                type: "POST",
                "dataType": 'json',
                //"data": /* custom filter can be here  */,
                "beforeSend": function (xhr) {
                    xhr.setRequestHeader('authorization',
                        "Bearer " + '');
                },
            },

        })

        let prevValues = {}

        /*create new element*/
        $('#datatable_new_button_' + $n_datatable.name).click(async function () {
            let {html, preConfirm, mapIDS} = columnsFormProccess($n_datatable.columns)
            let complete = false
            while (!complete) {
                complete = true
                let info = await Swal.fire({
                    title: 'New ' + $n_datatable.name,
                    html: html,
                    width: '80%',
                    allowOutsideClick: false,
                    showCancelButton: true,
                    confirmButtonText: 'Save',
                    cancelButtonText: 'Cancel',
                    confirmButtonColor: "#3ba805",
                    cancelButtonColor: "#d33",
                    reverseButtons: true,
                    preConfirm: preConfirm,
                    didOpen: function () {
                        console.log('dibujemos', mapIDS, prevValues)
                        for (let [key, val] of Object.entries(mapIDS)) {
                            if (!prevValues[key]) {
                                continue
                            }
                            if (val.item.type == 'boolean') {
                                document.getElementById(val.id).checked = prevValues[key]
                            } else {
                                document.getElementById(val.id).value = prevValues[key]
                            }
                        }
                    }
                });
                prevValues = info.value
                console.log('info', info)
                if (info.isConfirmed) {
                    let valid = await validateFull($n_datatable.columns, info.value)
                    if (!valid.complete) {
                        await Swal.fire({
                            title: 'Fill required values ',
                            text: 'Add value for ' + valid.needed.join(', '),
                            allowOutsideClick: false,
                            confirmButtonText: 'OK',
                            confirmButtonColor: "#3ba805",
                        });
                        complete = false

                    } else {
                        let formValues = sanitize(info.value)
                        let savedUSer = await dt_rag.createOne(formValues)
                        if (savedUSer.success) {
                            await Swal.fire({
                                title: 'Data Saved Correctly',
                                text: 'Text was saved correctly',
                                allowOutsideClick: false,
                                confirmButtonText: 'OK',
                                confirmButtonColor: "#3ba805",
                            });
                            myDatatable_control.clear().draw();

                        }
                    }

                } else {
                    complete = true
                }
            }

        })

        /*Edit element*/
        $(document.body).on('click', '.datatable_edit_button', async function () {
            let id = $(this).val()
            let existsData = await dt_rag.getOneById(id)
            if (!existsData.success) {
                await Swal.fire({
                    title: 'Error',
                    text: 'Element not found',
                    allowOutsideClick: false,
                    confirmButtonText: 'OK',
                    confirmButtonColor: "#3ba805",
                });
                return
            }
            prevValues = existsData.data
            let {html, preConfirm, mapIDS} = columnsFormProccess($n_datatable.columns)
            let complete = false
            while (!complete) {
                complete = true
                let info = await Swal.fire({
                    title: 'Edit ' + $n_datatable.name,
                    html: html,
                    width: '80%',
                    allowOutsideClick: false,
                    showCancelButton: true,
                    confirmButtonText: 'Save',
                    cancelButtonText: 'Cancel',
                    confirmButtonColor: "#3ba805",
                    cancelButtonColor: "#d33",
                    reverseButtons: true,
                    preConfirm: preConfirm,
                    didOpen: function () {
                        console.log('dibujemos', mapIDS, prevValues)
                        for (let [key, val] of Object.entries(mapIDS)) {
                            if (!prevValues[key]) {
                                continue
                            }
                            if (val.item.type == 'boolean') {
                                document.getElementById(val.id).checked = prevValues[key]
                            } else {
                                if (val.item.isPassword) {
                                    continue
                                }
                                if (val.item.isFile) {
                                    continue
                                }
                                document.getElementById(val.id).value = prevValues[key]
                            }
                        }
                    }
                });
                prevValues = info.value
                if (info.isConfirmed) {
                    let valid = await validateFull($n_datatable.columns, info.value)
                    if (!valid.complete) {
                        await Swal.fire({
                            title: 'Fill required values ',
                            text: 'Add value for ' + valid.needed.join(', '),
                            allowOutsideClick: false,
                            confirmButtonText: 'OK',
                            confirmButtonColor: "#3ba805",
                        });
                        complete = false

                    } else {
                        let formValues = sanitize(info.value)
                        let savedUSer = await dt_rag.updateById(formValues._id, formValues)
                        if (savedUSer.success) {
                            await Swal.fire({
                                title: 'Data Saved Correctly',
                                text: 'Text was saved correctly',
                                allowOutsideClick: false,
                                confirmButtonText: 'OK',
                                confirmButtonColor: "#3ba805",
                            });
                            myDatatable_control.clear().draw();

                        }
                    }

                } else {
                    complete = true
                }


            }

        })

        /*Edit element*/
        $(document.body).on('click', '.datatable_view_button', async function () {
            let id = $(this).val()
            let existsData = await dt_rag.getOneById(id)
            if (!existsData.success) {
                await Swal.fire({
                    title: 'Error',
                    text: 'Element not found',
                    allowOutsideClick: false,
                    confirmButtonText: 'OK',
                    confirmButtonColor: "#3ba805",
                });
                return
            }
            prevValues = existsData.data
            let {html, mapIDS} = columnsFormProccess($n_datatable.columns)
            let complete = false
            while (!complete) {
                complete = true
                let info = await Swal.fire({
                    title: 'View ' + $n_datatable.name,
                    html: html,
                    width: '80%',
                    allowOutsideClick: false,
                    confirmButtonText: 'OK',
                    confirmButtonColor: "#3ba805",
                    reverseButtons: true,

                    didOpen: function () {

                        for (let [key, val] of Object.entries(mapIDS)) {
                            if (!prevValues[key]) {
                                continue
                            }
                            if (val.item.type == 'boolean') {
                                document.getElementById(val.id).checked = prevValues[key]
                                document.getElementById(val.id).disabled = true
                            } else {
                                if (val.item.isFile) {
                                    document.getElementById(val.id).disabled = true
                                    continue
                                }

                                document.getElementById(val.id).disabled = true
                                document.getElementById(val.id).value = prevValues[key]
                            }
                        }
                    }
                });

            }

        })

        /*DELETE element*/
        $(document.body).on('click', '.datatable_delete_button', async function () {
            let id = $(this).val()

            let info = await Swal.fire({
                title: 'Delete ' + $n_datatable.name,
                text: 'Are you shure you want to delete Item? This action has not return',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonText: 'Ok',
                cancelButtonText: 'Cancel',
                confirmButtonColor: "#3ba805",
                cancelButtonColor: "#d33",
                reverseButtons: true,
            });
            if (info.isConfirmed) {
                let x = await dt_rag.findIdAndDelete(id)
                if (x.success) {
                    await Swal.fire({
                        title: 'Deleted correctly',
                        text: 'Item deleted correctly',
                        allowOutsideClick: false,
                        confirmButtonText: 'OK',
                        confirmButtonColor: "#3ba805",
                    });
                }
                myDatatable_control.draw()
            }


        })

        /*change checkbox*/
        $(document.body).on('change', '.datatable_check_id', async function () {
            let id = $(this).val()
            let reference = $(this).attr('reference')
            let checked = $(this).prop('checked')

            let body = {}
            body[reference] = checked
            let info = await Swal.fire({
                title: 'Update checkbox in' + $n_datatable.name,
                text: 'Are you shure you want to change value of Item?',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonText: 'Ok',
                cancelButtonText: 'Cancel',
                confirmButtonColor: "#3ba805",
                cancelButtonColor: "#d33",
                reverseButtons: true,
            });
            if (info.isConfirmed) {
                let x = await dt_rag.updateById(id, body)
                if (x.success) {
                    await Swal.fire({
                        title: 'Updated correctly',
                        text: 'Item updated correctly',
                        allowOutsideClick: false,
                        confirmButtonText: 'OK',
                        confirmButtonColor: "#3ba805",
                    });
                }
                myDatatable_control.draw()
            }


        })

        /*copy id*/
        $(document.body).on('click', '.datatable_object_id_cp', async function () {
            let text = $(this).text()

            navigator.clipboard.writeText(text)

            let info = await Swal.fire({
                title: 'Clipboard',
                text: 'ID copied to clipboard correctly',
                allowOutsideClick: false,
                confirmButtonText: 'Ok',
                confirmButtonColor: "#3ba805",
                reverseButtons: true,
            });


        })


    }
})
