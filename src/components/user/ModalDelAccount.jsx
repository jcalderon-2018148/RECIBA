import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

export const ModalDelAccount = ({ user }) => {
    const [confirm, setConfirm] = useState()
    const [form, setForm] = useState({ confirm: '' })

    const navigate = useNavigate()

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

    const confirmDelete = async () => {
        try {
            if (user.username !== form.confirm) return Swal.fire('The username does not coincide, please try again', '', 'error')

            Swal.fire({
                title: 'Delete account',
                text: 'Your account will be deleted',
                icon: 'info',
                showConfirmButton: true,
                showDenyButton: true,
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const { data } = await axios.delete(`http://localhost:3033/user/delete`, { headers: headers }).catch((err) => {
                        Swal.fire(err.response.data.message, '', 'error')
                    })

                    Swal.fire(`${data.message}`, '', 'success')
                    navigate('/')

                } else {
                    Swal.fire('No worries!', '', 'success').then(() => location.reload())
                }
            })
            
        } catch (err) {
            console.error(err)
            Swal.fire(err.response.data.message, '', 'error')
        }
    }

    return (
        <>
            <div className="modal fade" id="modalDeleteAccount" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalToggleLabel">Delete account</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setTimeout(() => {setConfirm(false)}, 1000)}></button>
                        </div>
                        <div className="modal-body">
                            <h3 className='text-success text-center'>Are you sure about delete your account?</h3>
                            <br />
                            <p className='text-secondary text-center fw-bold'>This action is irreversible, and you will lose all your "ECOINS" without refund</p>
                            <br />

                            {
                                confirm ? (
                                    <>
                                        <label for="exampleInputEmail1" class="form-label">Enter <strong>{`"${user?.username}"`}</strong> to confirm that you agree to delete your account</label>
                                        <input type="email" class="form-control" name='confirm' onChange={handleForm}></input>
                                        <br/>
                                        <button className="btn btn-success" onClick={() => confirmDelete()}>Confirm</button>
                                    </>
                                ) : (
                                    <div class="d-grid gap-2">
                                        <button className="btn btn-danger" onClick={() => setConfirm(true)}>Yes, i want to delete my account</button>
                                    </div>
                                )
                            }


                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal" aria-label="Close" onClick={() => setTimeout(() => {setConfirm(false)}, 1000)}>Close</button>
                    </div>
                </div>
            </div>
        </div >
        </>
    )
}
