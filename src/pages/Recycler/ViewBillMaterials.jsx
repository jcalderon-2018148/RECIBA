import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import axios from 'axios'
import { Link } from 'react-router-dom'

export const ViewBillMaterials = () => {

    const { id } = useParams()
    const [bill, setBill] = useState({})
    const [bills, setBills] = useState([])
    const navigate = useNavigate();

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
    };

    const formatDateTime = (timestamp) => {

        const date = new Date(timestamp);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        const formattedDate = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;

        return formattedDate;
    }

    const getBill = async () => {
        try {
            const { data } = await axios(`http://localhost:3033/bill/get/${id}`, { headers: headers })
            setBill(data.data)
        } catch (err) {
            Swal.fire(err.response.data.message, '', 'error');
            console.error(err);
        }
    }

    const deleteMaterial = async (id) => {
        try {
            Swal.fire({
                title: 'Are you sure to disable this bill?',
                icon: 'question',
                showConfirmButton: true,
                showDenyButton: true,
            }).then(async (result) => {
                if (result.isConfirmed) {

                    // Están en segundos
                    const billTime = parseInt((new Date(bill.date).getTime() / 1000).toFixed(0))
                    const currentTime = parseInt((new Date(Date.now()).getTime() / 1000).toFixed(0))
                    const difference = currentTime - billTime
                    console.log(difference);


                    /* ***********CAMBIAR A 300 DESPUES DE PRUEBAS************  */
                    if (difference >= 300) {
                        return (
                            Swal.fire({
                                title: 'The invoice cannot be disabled after 5 minutes of being created.',
                                icon: 'error',
                                timer: 2000,
                                showConfirmButton: false
                            })
                        )
                    }

                    if (!(bill.payMethod == 'ECOINS')) {

                        const { data } = await axios.put(`http://localhost:3033/bill/disableBill/${id}`, '', { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': localStorage.getItem('token') } }).catch((err) => {
                            Swal.fire(err.response.data.message, '', 'error')
                        })
                        Swal.fire(`${data.message}`, '', 'success')
                        navigate('/recycler/viewBills');

                    } else {

                        const aBills = await axios(`http://localhost:3033/bill/getByUser/${bill.user._id}`, { headers: headers })
                        const allBills = aBills.data.data

                        const filterBills = []

                        console.log(allBills);

                        const dataUser = await axios(`http://localhost:3033/user/get/${bill.user._id}`, { headers: headers })

                        //Deshabilitar la factura
                        const { data } = await axios.put(`http://localhost:3033/bill/disableBill/${id}`, '', { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': localStorage.getItem('token') } }).catch((err) => {
                            Swal.fire(err.response.data.message, '', 'error')
                        })

                        for (const bill of allBills) {
                            let billDate = parseInt((new Date(bill.date).getTime() / 1000).toFixed(0))
                            let diff = currentTime - billDate
                            console.log(billDate);
                            console.log(diff);

                            // Si las ultimas facturas creadas son de hace menos de 24 horas
                            if (diff <= 86400) {
                                filterBills.push(bill)
                            }
                        }

                        if (dataUser.data.data.streakMaterial != 0) {
                            if (filterBills.length == 1) { //Si esta vacío o sea igual a uno porque no se cuenta la misma factura
                                console.log('RESTAR -1 A STREAK Y QUITAR PUNTOS Y EXP');

                                const minusStreak = {
                                    number: -1
                                }

                                const streak = await axios.put(
                                    `http://localhost:3033/bill/addStreak/${data.data.user}`,
                                    minusStreak,
                                    { headers: headers }
                                )

                            }else{
                                console.log('SOLAMENTE QUITAR PUNTOS Y EXP');
                            }
                        }else{
                            console.log('SI LA RACHA ES CERO QUE SIMPLEMENTE SE QUITEN LOS PUNTOS Y EXP');
                        }

                        const minusExpPts = {
                            points: -data.data.points,
                            exp: -(parseInt(data.data.points * 0.40))
                        }

                        const updExpPts = await axios.put(`http://localhost:3033/bill//expPts/${data.data.user}`, minusExpPts, { headers: headers })

                        navigate('/recycler/viewBills');
                        Swal.fire(`${data.message}`, '', 'success')

                    }


                } else {
                    Swal.fire('No worries!', '', 'success')
                }
            })
        } catch (err) {
            Swal.fire(err.response.data.message, '', 'error');
            console.error(err);
        }
    }

    useEffect(() => {
        getBill()
    }, [])


    return (
        <>

            <div className="card">
                <div className="card-body">
                    <div className="container mb-5 mt-3">
                        <div className="row d-flex align-items-baseline">
                            <div className="col-xl-9">
                                <p className='fontBarcode fs-1'>{bill._id}</p>
                            </div>
                            <div className="col-xl-3 float-end mb-2">

                                {
                                    bill.status == 'COMPLETED' ? (

                                        <button onClick={() => deleteMaterial(id)} className="btn btn-outline-danger bi bi-x-square-fill fs-4 me-2"></button>

                                    ) : (null)
                                }

                                <Link to='/recycler/viewBills'>
                                    <button type="button" className="btn btn-outline-secondary bi bi-arrow-left-square-fill fs-4"></button>
                                </Link>

                            </div>
                            <hr />
                        </div>

                        <div className="container">

                            <div className="row mt-3">
                                <div className="col-xl-8">
                                    <ul className="list-unstyled">
                                        <li className="text-muted fw-bold">To: <span style={{ color: 'green' }}>{bill.user?.name} {bill.user?.surname}</span></li>
                                        <li className="text-muted">{bill.user?.email}</li>
                                        <li className="text-muted">Guatemala</li>
                                        <li className="text-muted"><i className="fas fa-phone"></i> {bill.user?.phone}</li>
                                    </ul>
                                </div>
                                <div className="col-xl-4">
                                    <p className="text-muted">Bill info.</p>
                                    <ul className="list-unstyled">

                                        <li className="text-muted">
                                            <i className="fas fa-circle" style={{ color: '#84B0CA' }}></i>
                                            <span className="fw-bold"> Creation Date:</span>
                                            <span> {formatDateTime(bill.date)}</span>

                                        </li>
                                        <li className="text-muted">
                                            <i className="fas fa-circle" style={{ color: '#84B0CA' }}></i>
                                            <span className="fw-bold"> Pay Method:</span>
                                            <span> {bill.payMethod}</span>

                                        </li>
                                        <li className="text-muted">
                                            <i className="fas fa-circle" style={{ color: '#84B0CA' }}></i>
                                            <span className="me-1 fw-bold"> Status:</span>
                                            <span className={`badge text-white fw-bold ${bill.status == 'COMPLETED' ? 'bg-success' : 'bg-danger'}`}>{bill.status}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="row my-2 mx-1 justify-content-center">
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

                                        {bill.cantMaterials?.map(({ material, amountWeight, subtotal }, index) => (
                                            <tr className='align-middle' key={index}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{material.type}</td>
                                                <td>{material.price.quantity} x {material.price.amount}</td>
                                                <td>{amountWeight}</td>
                                                <td>Q. {parseFloat(subtotal).toFixed(2)}</td>
                                            </tr>
                                        ))}

                                    </tbody>

                                </table>
                            </div>
                            <div className="row">
                                <div className="col-xl-8">
                                    <p className="ms-3">The bill cannot be changed.</p>

                                </div>
                                <div className="col-xl-3">
                                    {
                                        bill.payMethod == 'ECOINS' ? (
                                            <>
                                                <ul className="list-unstyled">
                                                    <li className="text-muted ms-3"><span className="text-black me-4">Total</span>Q. {parseFloat(bill.total).toFixed(2)}</li>
                                                    <li className="text-muted ms-3 mt-2"><span className="text-black me-4">Points</span>{parseInt(bill.total * 110)}  (+10%)</li>
                                                    <li className="text-muted ms-3 mt-2"><span className="text-black me-4">Bonus</span>{bill.bonus} %</li>
                                                </ul>
                                                <p className="text-black float-start"><span className="text-black me-3"> Total Points</span><span
                                                    style={{ fontSize: '25px', color: 'green' }}>{bill.points}</span>
                                                </p>
                                            </>


                                        ) : (
                                            <>
                                                <p className="text-black float-start"><span className="text-black me-3"> Total Amount:</span><span
                                                    style={{ fontSize: '25px' }}>Q. {parseFloat(bill.total).toFixed(2)}</span>
                                                </p>
                                            </>

                                        )
                                    }

                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-xl-10">
                                    <p>Thank you for a change for a better world.</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}