import React, { useEffect, useState } from 'react'
import photoError from '../../../assets/userDefault.png'
import axios from 'axios';
import Swal from 'sweetalert2'

export const ModalUsers = ({ id }) => {
    const [user, setUser] = useState([{}])
    const handleImageError = (e) => {
        e.target.src = photoError;
    };

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
    }

    const getUser = async () => {
        try {
            const { data } = await axios(`http://localhost:3033/user/get/${id}`, { headers: headers })

            if (data.data[0].photo) {
                let img = await axios(`http://localhost:3033/user/getImg/${data.data[0].photo}`)
                data.data[0].photo = img.request.responseURL
            }

            if (data.data[0].range) {
                let range = await axios(`http://localhost:3033/range/get/${data.data[0].range}`)
                data.data[0].range = range.data.range.name
            }

            setUser(data.data[0])
        } catch (err) {
            console.error(err);
        }
    }



    const del = async (id) => {
        try {
            Swal.fire({
                title: 'Are you sure to delete this user?',
                icon: 'question',
                showConfirmButton: true,
                showDenyButton: true,
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const { data } = await axios.delete(`http://localhost:3033/user/delete/${id}`, { headers: headers }).catch((err) => {
                        Swal.fire(err.response.data.message, '', 'error')
                    })
                    getUsers()
                    Swal.fire(`${data.message}`, '', 'success')
                } else {
                    Swal.fire('No worries!', '', 'success')
                }
            })
        } catch (err) {
            Swal.fire(err.response.data.message, '', 'error')
        }
    }

    useEffect(() => {
        getUser()
    }, [])

    /*useEffect(() => {
        getUser()
    
      return () => {
        getRange()
      }
    }, [])*/


    /*useEffect(() => {
      getRange()
    }, [])*/

    return (

        <>
            <div className="modal fade pt-5 " id={`modalUs${id}`} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            {/*<h1 className="modal-title fs-3" id="exampleModalLabel">User</h1>
                            <button type="button" className="btn-close " style={{ marginTop: '-100px' }}data-bs-dismiss="modal" aria-label="Close">X</button>
                            */}
                        </div>
                        <div className="modal-body ">
                            <div className='d-flex justify-content-center ' style={{ marginTop: '-100px' }}>
                                <img src={user.photo || photoError}
                                    crossOrigin="anonymous"
                                    style={{ height: "10rem", maxWidth: '10rem' }}
                                    className="d-block w-50 rounded-circle me-1 border border-success shadow"
                                    alt="User Image"
                                    onError={handleImageError}
                                />
                            </div>
                            <hr />
                            <div className='mx-0 '>
                                <div className='d-flex flex-row justify-content-evenly'>
                                    <div className="mb-3">
                                        <span className="text-success fs-5">Full Name: </span>
                                        <span className=" fs-5">{user.name}{" "}{user.surname}</span>
                                    </div>
                                    <div className="mb-3 ">
                                        <span className="text-success fs-5">Username: </span>
                                        <span className=" fs-5">{user.username}</span>
                                    </div>
                                </div>
                                <div className='d-flex flex-row justify-content-evenly'>
                                    <div className="mb-3 ">
                                        <span className="text-success fs-5">Email: </span>
                                        <span className=" fs-5">{user.email}</span>
                                    </div>
                                    <div className="mb-3 ">
                                        <span className="text-success fs-5">Phone: </span>
                                        <span className=" fs-5">{user.phone}</span>
                                    </div>
                                </div>
                                {
                                    user.range != 'ADMIN' ? (
                                        <div className='d-flex flex-row justify-content-evenly'>
                                            <div className="mb-3 ">
                                                <span className="text-success fs-5">Exp: </span>
                                                <span className=" fs-5">{user.exp}</span>
                                            </div>
                                            <div className="mb-3 ">
                                                <span className="text-success fs-5">Range: </span>
                                                <span className=" fs-5">{user.range}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <></>
                                    )
                                }
                                <div className="d-flex justify-content-center mb-3">
                                    <span className="text-success fs-5">Role:{" "}</span>
                                    <span className=" fs-5"> {user.role}</span>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            {/*<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={addAnimal} data-bs-dismiss="modal">Save changes</button>*/}

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
