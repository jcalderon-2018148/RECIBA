import axios from 'axios'
import React, { useContext, useState } from 'react'
import Swal from 'sweetalert2'
import { AuthContext } from '../..'
import { useNavigate } from 'react-router-dom'

export const ModalChangePass = ({ user }) => {
    const [form, setForm] = useState({
        password: '',
        newPass: '',
        rewrite: ''
    })
    const navigate = useNavigate()
    const { setLoggedIn } = useContext(AuthContext)

    const handleForm = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
    }

    const checkPass = () => {
        if (form.newPass !== form.rewrite) return Swal.fire('The new password does not coincide, please try again', '', 'warning')

        updatePass()
    }

    const logout = () => {
        localStorage.clear()
        setLoggedIn(false)
        location.reload()
        navigate('/login')
    }

    const updatePass = async () => {
        try {
            const { data } = await axios.put(`http://localhost:3033/user/updatePassword`, form, { headers: headers })

            if (data.message) 
                return Swal.fire('Password updated successfully, please login again to complete the process', '', 'success')
                            .then(() => logout())

        } catch (err) {
            console.error(err)
            Swal.fire(err.response.data.message, '', 'error')
        }
    }
    
    return (
        <>
            <div className="modal modal-lg modal-dialog-scrollable fade" id={`modalChangePass`} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">{`Edit ${user?.username}'s info`}</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                        
                            <div class="mb-3">
                                <label htmlFor="name" class="form-label">Old password</label>
                                <input defaultValue={''} onChange={handleForm} type="password" class="form-control" id="name" name='password' aria-describedby="oldPassHelp"/>
                                <div id="oldPassHelp" class="form-text">Write your old password</div>
                            </div>

                            <div class="mb-3">
                                <label htmlFor="surname" class="form-label">New password</label>
                                <input defaultValue={''} onChange={handleForm} type="password" class="form-control" id="surname" name='newPass' aria-describedby="newPass"/>
                                <div id="newPass" class="form-text">Write your new password</div>
                            </div>

                            <div class="mb-3">
                                <label htmlFor="username" class="form-label">Rewrite</label>
                                <input defaultValue={''} onChange={handleForm} type="password" class="form-control" id="username" name='rewrite' aria-describedby="rewrite"/>
                                <div id="rewrite" class="form-text">Rewrite your new password</div>
                            </div>
                            
                        </div>
                        <div className="modal-footer justify-content-center">
                            <button type="button" className="btn btn-outline-secondary rounded-pill my-3" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-outline-success rounded-pill my-3" onClick={() => checkPass()}>Update</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
