import React, { useEffect, useState, useContext, useRef } from 'react';
import Select from "react-select";
import axios from 'axios';
import Swal from 'sweetalert2';
import { RowTableBodyBill } from '../../components/RowTableBodyBill';
import { AuthContext } from '../../index';
import { useNavigate } from 'react-router-dom';
import '../../css/Dashboard.css'

export const CreateBill = () => {

    // ----- START VARIABLES GENERALES -----
    const [optionListUser, setOptionListUser] = useState([]);
    const [optionListMaterial, setOptionListMaterial] = useState([]);

    const [form, setForm] = useState({
        material: '',
        amountWeight: '',
        subtotal: ''
    });
    const [listCart, setListCart] = useState([]);
    const [total, setTotal] = useState(0.00)

    const methPayment = [
        { value: 'ECOINS', label: 'ECOINS' },
        { value: 'CREDIT CARD', label: 'CREDIT CARD' },
        { value: 'DEBIT CARD', label: 'DEBIT CARD' },
        { value: 'PAYPAL', label: 'PAYPAL' },
        { value: 'BANK TRANSFER', label: 'BANK TRANSFER' },
        { value: 'CASH', label: 'CASH' },
    ]

    const localUser = JSON.parse(localStorage.getItem('user'))
    const navigate = useNavigate()

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
    };

    // ----- END VARIABLES GENERALES -----


    // Obtener todos los usuarios para mostrarlos en el select
    const getUsers = async () => {
        try {
            const { data } = await axios('http://localhost:3033/user/getClients', { headers: headers });

            const newList = data.data.map(user => ({
                value: user.id,
                label: user.username
            }));

            setOptionListUser(newList);
        } catch (err) {
            Swal.fire(err.response.data.message, '', 'error');
            console.error(err);
        }
    };

    // Obtener todos los materiales para mostrarlos en el select
    const getMaterials = async () => {
        try {

            const userData = await axios(`http://localhost:3033/user/getByUsername/${localUser.username}`, { headers: headers })
            const recyclerData = await axios(`http://localhost:3033/recycler/getByUser/${userData.data.data[0].id}`, { headers: headers })
            const { data } = await axios(`http://localhost:3033/material/getRecMaterials/${recyclerData.data.recycler._id}`, { headers: headers })

            const newList = data.materials.map(material => ({
                value: material._id,
                label: material.type
            }));

            setOptionListMaterial(newList);
        } catch (err) {
            Swal.fire(err.response.data.message, '', 'error');
            console.error(err);
        }
    };

    //Agregar materiales a la lista de la factura
    const addMaterialCart = async () => {
        try {

            if (!(form?.material)) {
                return Swal.fire({title: 'You need to select a material', icon: 'error', timer: 1000, showConfirmButton: false});
            }

            if (!(form.amountWeight || form.amountWeight == undefined)) {
                return Swal.fire({title: 'You need to put a valid number', icon: 'error', timer: 1000, showConfirmButton: false});
            }

            const { data } = await axios(`http://localhost:3033/material/getOne/${form?.material}`, { headers: headers })
            const { quantity, amount } = data.material.price

            const newAmountWeight = Math.abs(form.amountWeight)

            // Buscar si el material ya existe en el array
            const existingMaterial = listCart.find(item => item.material === form.material)

            if (existingMaterial) {
                // Si el material ya existe, sumar el amountWeight y recalcular el subtotal
                existingMaterial.amountWeight += newAmountWeight
                existingMaterial.subtotal = parseFloat((existingMaterial.amountWeight / quantity) * amount).toFixed(2)
                setListCart([...listCart])  // Actualizar el estado
            } else {
                //Si no existe que simplemente agregue uno nuevo al array.
                const newCartItem = {
                    material: form.material,
                    amountWeight: Math.abs(form.amountWeight),
                    subtotal: parseFloat((Math.abs(form.amountWeight) / quantity) * amount).toFixed(2)
                };

                setListCart(prevListCart => [...prevListCart, newCartItem]);
            }

        } catch (err) {
            Swal.fire(err.message, '', 'error');
            console.error(err);
        }
    };

    //Remover materiales a la lista de la factura
    const removeMaterialCart = async () => {
        try {

            if (!(form?.material)) {
                return Swal.fire({title: 'You need to select a material', icon: 'error', timer: 1000, showConfirmButton: false});
            }

            if (!(form.amountWeight || form.amountWeight == undefined)) {
                return Swal.fire({title: 'You need to put a valid number', icon: 'error', timer: 1000, showConfirmButton: false});
            }

            const { data } = await axios(`http://localhost:3033/material/getOne/${form?.material}`, { headers: headers });
            const { quantity, amount } = data.material.price;

            const existingMaterial = listCart.find(item => item.material === form.material);

            if (existingMaterial) {
                if (existingMaterial.amountWeight > Math.abs(form.amountWeight)) {
                    // Si la cantidad a eliminar es menor o igual a la cantidad existente, se reduce la cantidad y recalcula el subtotal
                    existingMaterial.amountWeight -= Math.abs(form.amountWeight);
                    existingMaterial.subtotal = parseFloat((existingMaterial.amountWeight / quantity) * amount).toFixed(2);
                    setListCart([...listCart]);  // Actualizar el estado
                } else {
                    // Si la cantidad a eliminar es mayor a la cantidad existente, se elimina el material de la lista
                    const updatedList = listCart.filter(item => item.material !== form.material);
                    setListCart(updatedList);  // Actualizar el estado
                }
            }

        } catch (err) {
            Swal.fire(err.response.data.message, '', 'error');
            console.error(err);
        }
    };

    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    //Crear factura con la lista de materiales
    const addBill = async () => {
        try {

            //Datos del usuario logueado (TRABAJADOR DE LA RECICLADORA)
            const userData = JSON.parse(localStorage.getItem('user'))

            // Información del usuario al que se creará la factura
            const dataU = await axios(`http://localhost:3033/user/get/${form.user}`, { headers: headers });

            // Informacion de la recicladora que está haciendo la factura
            const dataR = await axios(`http://localhost:3033/recycler/getByUser/${userData.id}`, { headers: headers });

            // Datos que se pondrán en la factura
            const newBill = {
                user: form.user,
                recycler: dataR.data.recycler._id,
                cantMaterials: listCart,
                payMethod: form.payMethod,
                total: total,
                date: Date.now()
            }

            //Si el metodo de pago es de tipo ECOINS
            if (newBill.payMethod == 'ECOINS') {
                // Si el total no es cero o menor es porque no esta vacia y se puede crear.
                if (!(newBill.total <= 0)) {

                    //Se obtienen las facturas por usuario en orden de la mas reciente a las mas antigua.
                    const bByUser = await axios.get(`http://localhost:3033/bill/getByUser/${form.user}`, { headers: headers })

                    if (!(bByUser.data.data.length === 0)) {

                        const billsByUser = bByUser.data.data

                        // Fecha y hora de ahora (Formato UNIX)
                        const dateNow = Math.floor(new Date(Date.now()).getTime() / 1000)

                        // Fecha de la ultima factura creada (Formato UNIX)
                        const billDate = Math.floor(new Date(billsByUser[0].date).getTime() / 1000)

                        // Diferencia de tiempo entre ultima factura y ahora
                        const hoursElapsed = (dateNow - billDate)

                        if (hoursElapsed >= 172800) {
                            // Si ha pasado más de 48 horas desde la última factura, se pierde la racha

                            const deleteStreak = {
                                number: Math.abs(parseInt(dataU.data.data[0].streakMaterial)) * -1
                            }

                            const bill = await axios.put(
                                `http://localhost:3033/bill/addStreak/${form.user}`,
                                deleteStreak,
                                { headers: headers }
                            )

                        }

                        // Si ha pasado entre 24 y 48 horas desde la última factura, se suma 1% a la racha
                        if (hoursElapsed >= 86400 && hoursElapsed <= 172800) {

                            // Si no es mayor o igual a 7 (racha máxima) que aumente un 1% al porcentaje.
                            if (!(dataU.data.data[0].streakMaterial >= 7)) {

                                const plusStreak = {
                                    number: 1
                                }

                                const bill = await axios.put(
                                    `http://localhost:3033/bill/addStreak/${form.user}`,
                                    plusStreak,
                                    { headers: headers }
                                )

                            }

                        }

                    }

                    // Se crea la factura.
                    const createdbill = await axios.post(`http://localhost:3033/bill/create`, newBill, { headers: headers })

                    /* 
                        Si ninguna se cumple, es primera vez que agrega material sin racha 
                        o porque ha entregado varias veces material en el día.
                    */

                    // Información del usuario al que se creará la factura
                    const dataU2 = await axios(`http://localhost:3033/user/get/${form.user}`, { headers: headers });

                    const porcentStreak = dataU2.data.data[0].streakMaterial / 100

                    const pts = parseInt(( newBill.total * 110 ) + ((newBill.total * 110) * porcentStreak))
                    const exp = parseInt(pts * 0.40)

                    const addExpPts = {
                        points: pts,
                        exp: exp
                    }

                    const addBonusPts = {
                        bonus: (porcentStreak*100),
                        points: pts
                    }

                    // Agregar los puntos y el bonus a la factura
                    await axios.put(
                        `http://localhost:3033/bill/bonusPoints/${createdbill?.data.bill._id}`,
                        addBonusPts,
                        {headers: headers}
                    )

                    // Agregar los puntos y la experiencia al usuario
                    await axios.put(
                        `http://localhost:3033/bill/expPts/${form.user}`,
                        addExpPts,
                        { headers: headers }
                    )

                    Swal.fire({
                        icon: 'success',
                        title: 'Bill Created successfully',
                        text: 'POINTS: ' + pts + ' EXP: ' + exp + ' STREAK: ' + dataU2.data.data[0].streakMaterial
                    })

                    navigate('/recycler')
                    await delay(10)
                    navigate('/recycler/createBill')


                } else {

                    Swal.fire({
                        icon: 'error',
                        title: 'The bill cannot be empty!'
                    })

                }
            } else {
                // Cuando la factura es de otro tipo de pago que no sea ECOINS.
                if (!(newBill.total <= 0)) {

                    const createdbill = await axios.post(`http://localhost:3033/bill/create`, newBill, { headers: headers })
                    Swal.fire({
                        icon: 'success',
                        title: 'Bill Created successfully',
                    })

                } else {

                    Swal.fire({
                        icon: 'error',
                        title: 'The bill cannot be empty!'
                    })

                }
            }

        } catch (err) {
            Swal.fire(err.response.data.message, '', 'error');
            console.error(err);
        }
    }

    //Obtener el valor del user del Select
    const handleFormUser = (value, action) => {
        setForm({
            ...form,
            user: value.value
        });
    };

    //Obtener el valor del material del Select
    const handleFormMaterial = (value, action) => {
        setForm({
            ...form,
            material: value.value
        });
    };

    //Obtener el valor del input
    const handleForm = (e) => {
        setForm({
            ...form,
            [e.target.name]: parseInt(e.target.value, 10)
        });
    };

    //Obtener el valor del select metodo de pago
    const handleFormPayment = (value, action) => {
        setForm({
            ...form,
            payMethod: value.value
        });
    };

    useEffect(() => {
        getUsers();
        getMaterials();
    }, []);

    useEffect(() => {
        // Calcular el total sumando los subtotales
        let sum = 0;
        for (const { subtotal } of listCart) {
            sum += parseFloat(subtotal);
        }
        setTotal(sum);
    }, [listCart]);

    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            color: state.data.value === 'ECOINS' ? 'green' : provided.color,

        }),
        singleValue: (provided, state) => ({
            ...provided,
            color: state.data.value === 'ECOINS' ? 'green' : provided.color,
        }),
    };

    return (
        <>



            <div className="card shadow">
                <div className="card-body">
                    <div className="container mb-5 mt-3">
                        <div className='text-center mb-2'>
                            <h1 className='fontReciba fw-bold fs-1'>Create Bill</h1>
                        </div>
                        <div className="row d-flex align-items-baseline">
                            <div className="col-md-6 mb-2">
                                <Select
                                    options={optionListMaterial}
                                    placeholder="Select Material"
                                    onChange={handleFormMaterial}
                                    isSearchable={true}
                                    name='material'
                                />
                            </div>

                            <div className='col-md-4 mt-2'>
                                <input onChange={handleForm} name='amountWeight' type="number" className="form-control" placeholder='Enter the amount of material.' />
                            </div>

                            <div className='col-md-2 mt-2 mb-2'>

                                <button className='btn btn-success bi bi-plus-circle ms-5 fs-5 rounded' onClick={addMaterialCart}></button>
                                <button className='btn btn-danger bi bi-dash-circle ms-5 fs-5 ms-3 rounded' onClick={removeMaterialCart}></button>

                            </div>

                            <hr />
                        </div>

                        <div className="container">

                            <div className="table-responsive row my-2 mx-1 justify-content-center">
                                <table className="table table-striped table-borderless">
                                    <thead style={{ backgroundColor: '#84B0CA' }} className="text-white">
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Material</th>
                                            <th scope="col">Price</th>
                                            <th scope="col">Amount</th>
                                            <th scope="col">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listCart.map(({ material, amountWeight, subtotal }, index) => (
                                            <RowTableBodyBill
                                                key={index}
                                                number={index}
                                                materialid={material}
                                                amountWeight={amountWeight}
                                                subtotal={subtotal}
                                            />
                                        ))}
                                    </tbody>

                                </table>
                            </div>
                            <div className="row">
                                <div className="col-xl-8">
                                    <p className="ms-3">The bill cannot be changed upon issuance.</p>

                                </div>
                                <div className="col-xl-3">
                                    {/* <ul className="list-unstyled">
                                        <li className="text-muted ms-3"><span className="text-black me-4">SubTotal</span>$1110</li>
                                        <li className="text-muted ms-3 mt-2"><span className="text-black me-4">Tax(15%)</span>$111</li>
                                    </ul> */}
                                    <p className="text-black float-start"><span className="text-black me-3"> Total Amount</span><span
                                        style={{ fontSize: '25px' }}>Q. {parseFloat(total).toFixed(2)}</span></p>
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-xl-10">
                                    <p>Thank you for a change for a better world.</p>
                                </div>
                                <div className="col-xl-2">
                                    <button className="btn btn-success" type="button" data-bs-toggle="modal" data-bs-target="#modalBill">Create Bill</button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="modal fade" id="modalBill" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">

                            <div className="modal-header">
                                <h3 className="modal-title" id="exampleModalLabel">Create Bill</h3>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>

                            <div className="modal-body mt-2">

                                <div className='row'>
                                    <div className='col-md-12'>

                                        <h4 className='text-center'>Payment Method</h4>
                                        <Select
                                            className='mt-3'
                                            options={methPayment}
                                            placeholder="Select Payment"
                                            onChange={handleFormPayment}
                                            isSearchable={true}
                                            name='material'
                                            styles={customStyles}
                                        />

                                    </div>

                                </div>


                                <div className='row mt-5'>

                                    <div className='col-md-12'>

                                        <h4 className='text-center'>Select User</h4>
                                        <Select
                                            className='mt-3 mb-4'
                                            options={optionListUser}
                                            placeholder="Select User"
                                            onChange={handleFormUser}
                                            isSearchable={true}
                                            name='material'
                                        />

                                    </div>

                                </div>

                            </div>

                            <div className="modal-footer">

                                <button onClick={addBill} type="button" className="btn btn-success" data-bs-dismiss="modal">Confirm</button>
                                <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Cancel</button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </>
    );
};