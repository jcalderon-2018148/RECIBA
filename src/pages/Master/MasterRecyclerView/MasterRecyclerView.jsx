import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { CardRecycler } from '../../../components/recycler/CardRecycler'

export const MasterRecyclerView = () => {
    const [recycler, setRecycler] = useState([{}])
    


    const headers = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
    }

    
    const getRecyclers = async () => {
        try {
            const { data } = await axios(`http://localhost:3033/recycler/get`, { headers: headers })
                
            setRecycler(data.recyclers)
        } catch (err) {
            console.log(err);
            Swal.fire(err.response.data.message, '', 'error')
        }
    }

    const del = async (id) => {
        try {
            Swal.fire({
                title: 'Are you sure to delet this recycler?',
                icon: 'question',
                showConfirmButton: true,
                showDenyButton: true,
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const { data } = await axios.delete(`http://localhost:3033/recycler/delete/${id}`, { headers: headers })
                        .catch((err) => {
                            Swal.fire(err.response.data.message, '', 'error')
                        })
                    getRecyclers()
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
        getRecyclers()
    }, [])


    return (
        <>
            <div className="main-content">
                <div className="container">

                    <div style={{ backgroundColor: '#44AF41', borderRadius: '15px' }} className='sticky-top text-white'>
                        <h1 className='h1TE text-center'>Recyclers</h1>
                    </div>
                    <div className="mb-3 mt-3 mx-3 row row-cols-1 row-cols-md-2 g-4">
                        {
                            recycler.map(({ _id, name, direction, email, phone, startHour, endHour, photos, user }, index) => {
                                return (
                                    <CardRecycler
                                        key={index}
                                        id={_id}
                                        name={name}
                                        direction={direction}
                                        email={email}
                                        phone={phone}
                                        photos={photos}
                                        startHour={startHour}
                                        endHour={endHour}
                                        user={user}
                                        butDel={del}
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
