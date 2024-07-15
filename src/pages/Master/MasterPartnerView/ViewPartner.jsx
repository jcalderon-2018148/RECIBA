import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { CardPartner } from '../../../components/partner/CardPartner'

export const ViewPartner = () => {
    const [partner, setPartner] = useState([{}])

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
    }


    const getPartner = async () => {
        try {
            const { data } = await axios(`http://localhost:3033/partner/get`, { headers: headers })
            setPartner(data.partners)
        } catch (err) {
            console.log(err);
            Swal.fire(err.response.data.message, '', 'error')
        }
    }

    const del = async (id) => {
        try {
            Swal.fire({
                title: 'Are you sure to delet this partner?',
                icon: 'question',
                showConfirmButton: true,
                showDenyButton: true,
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const { data } = await axios.delete(`http://localhost:3033/partner/delete/${id}`, { headers: headers })
                        .catch((err) => {
                            Swal.fire(err.response.data.message, '', 'error')
                        })
                    location.reload()
                    getPartner()
                    Swal.fire(`${data.message}`, '', 'success')
                } else {
                    Swal.fire('No worries', '', 'success')
                }
            })
        } catch (err) {
            console.log(err);
            Swal.fire(err.response.data.message, '', 'error')
        }
    }

    useEffect(() => {
        getPartner()
    }, [])


    return (
        <>
            <div className="main-content">
                <div className="container">

                    <div style={{ backgroundColor: '#44AF41', borderRadius: '15px' }} className='sticky-top text-white'>
                        <h1 className='h1TE text-center'>Partners</h1>
                    </div>
                    <div className="mb-3 mt-3 mx-3 row row-cols-1 row-cols-md-2 g-4">
                        {
                            partner.map(({ _id, name, address, email, phone, photo, admin }, index) => {
                                return (
                                    <CardPartner
                                        key={index}
                                        id={_id}
                                        name={name}
                                        address={address}
                                        email={email}
                                        admin={admin}
                                        phone={phone}
                                        photo={photo}
                                        butDel={() => del(_id)}
                                    />
                                )
                            })
                        }
                    </div>

                </div>
            </div>
        </>
    )
}
