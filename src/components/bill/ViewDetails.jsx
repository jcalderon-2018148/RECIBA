import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import axios from 'axios'
import { Link } from 'react-router-dom'

export const ViewDetails = () => {

    const { id } = useParams()
    const [bill, setBill] = useState({})

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

                                <Link to='/home/bills'>
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
                                                <td>{subtotal}</td>
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