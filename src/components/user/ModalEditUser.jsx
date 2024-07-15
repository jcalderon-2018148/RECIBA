import axios from 'axios'
import React, { useState } from 'react'
import Swal from 'sweetalert2'

export const ModalEditUser = ({ user }) => {
    const [form, setForm] = useState({
        name: user?.name,
        surname: user?.surname,
        username: user?.username,
        email: user?.email,
        phone: user?.phone
    })

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
    }

    const handleForm = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const updateUser = async () => {
        try {
            const { data } = await axios.put(`http://localhost:3033/user/update`, form, { headers: headers })

            if (data.user) {
                Swal.fire('Updated successfully', '', 'success').then(() => location.reload())
            }
            
        } catch (err) {
            console.error(err)
            Swal.fire(err.response.data.message, '', 'error')
        }
    }

    return (
        <>
            <div className="modal modal-lg modal-dialog-scrollable fade" id={`modalEditAccount`} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">{`Edit ${user?.username}'s info`}</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">

                            <div class="mb-3">
                                <label htmlFor="name" class="form-label">Name</label>
                                <input onChange={handleForm} defaultValue={user?.name} type="email" class="form-control" id="name" name='name' />

                            </div>

                            <div class="mb-3">
                                <label htmlFor="surname" class="form-label">Surname</label>
                                <input onChange={handleForm} defaultValue={user?.surname} type="email" class="form-control" id="surname" name='surname' />

                            </div>

                            <div class="mb-3">
                                <label htmlFor="username" class="form-label">Username</label>
                                <input onChange={handleForm} defaultValue={user?.username} type="email" class="form-control" id="username" name='username' />

                            </div>

                            <div class="mb-3">
                                <label htmlFor="username" class="form-label">Email</label>
                                <input onChange={handleForm} defaultValue={user?.email} type="email" class="form-control" id="email" name='email' aria-describedby="emailHelp" />

                            </div>

                            <div class="mb-3">
                                <label htmlFor="username" class="form-label">Phone</label>
                                <input onChange={handleForm} defaultValue={user?.phone} type="email" class="form-control" name='phone' id="phone" maxLength={8} />

                            </div>
                        </div>
                        <div className="modal-footer justify-content-center">
                            <button type="button" className="btn btn-outline-secondary rounded-pill my-3" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-outline-success rounded-pill my-3" onClick={() => updateUser()}>Update</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
