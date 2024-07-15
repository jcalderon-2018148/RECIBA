import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../css/Dashboard.css'
import { RowTableBodyBill2 } from '../../components/RowTableBodyBill2';

export const ViewBills = () => {

    const [bills, setBills] = useState([{}]);

    const [searchTerm, setSearchTerm] = useState('')
    const [select, setSelect] = useState('')

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
    };

    // Obtener todas las facturas para la tabla
    const getBills = async () => {
        try {

            //Datos del usuario logueado (TRABAJADOR DE LA RECICLADORA)
            const userData = JSON.parse(localStorage.getItem('user'))
            const recycler = await axios(`http://localhost:3033/recycler/getByUser/${userData.id}`, { headers: headers })

            const { data } = await axios(`http://localhost:3033/bill/getByRecycler/${recycler.data.recycler._id}`, { headers: headers })
            setBills(data.data);

        } catch (err) {
            Swal.fire(err.response.data.message, '', 'error');
            console.error(err);
        }
    };

    const handleSelect = (e) => {
        setSelect(e.target.value)
    }

    const filteredBills = bills.filter((b) =>

        select === 'user' ? (
            b.user?.username?.toLowerCase().includes(searchTerm.toLowerCase())
        ) : select === 'recycler' ? (
            b.recycler?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        ) : select === 'paymethod' ? (
            b.payMethod?.toLowerCase().includes(searchTerm.toLowerCase())
        ) : (
            b.user?.username?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )


    useEffect(() => {
        getBills()

    }, [])

    return (
        <>
            <div className="card mb-4">
                <div className="card-body">

                    <div className='row'>

                        <div className='col-md-8'>
                            <div className="input-group mb-8">
                                <span className="bi bi-search input-group-text" id="basic-addon1"></span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className='col-md-4'>
                            <div className="input-group mb-4">
                                <span className="bi bi-funnel input-group-text" id="basic-addon1"></span>
                                <select className="form-select" id="selectOption" onChange={handleSelect}>
                                    <option value={null}>FILTER</option>
                                    <option value="user">User</option>
                                    <option value="recycler">Recycler</option>
                                    <option value="paymethod">Pay Method</option>
                                </select>
                            </div>
                        </div>

                    </div>

                    <div className='table-responsive'>

                        <table className="table table-striped">

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>User</th>
                                    <th>Recycler </th>
                                    <th>Pay Method</th>
                                    <th>Total</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Materials</th>
                                </tr>
                            </thead>

                            <tbody>

                                {
                                    filteredBills.map(({ _id, user, recycler, cantMaterials, payMethod, total, date, status }, index) => (

                                        <RowTableBodyBill2
                                            key={index}
                                            id={_id}
                                            user={user.username}
                                            recycler={recycler.name}
                                            cantMaterials={cantMaterials}
                                            payMethod={payMethod}
                                            total={total}
                                            date={date}
                                            status={status}
                                            butCheck={`/recycler/viewBillMaterials/${_id}`}
                                            butDisable={()=> deleteMaterial(_id)}
                                        />

                                    ))
                                }


                            </tbody>

                        </table>

                    </div>



                </div>
            </div>


        </>
    )
}
