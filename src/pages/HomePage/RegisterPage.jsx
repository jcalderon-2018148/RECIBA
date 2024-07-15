import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../../index'
import './loginStyle.css'
import { NavbarHome } from '../../components/NavbarHome'
import Swal from 'sweetalert2'

export const RegisterPage = () => {
    const { loggedIn, setLoggedIn, setDataUser } = useContext(AuthContext)
    const navigate = useNavigate()
    const [form, setForm] = useState({
        name: '',
        surname: '',
        phone: '',
        email: '',
        username: '',
        password: ''
    })
    const [photo, setPhoto] = useState()
    const [uPhoto, setUPhoto] = useState()
    const [isUp, setIsUp] = useState(false)
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
    }

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handlePhoto = (e) => {
        const allowedExtensions = /(.jpg|.jpeg|.png)$/i

        if (!allowedExtensions.exec(e.target.value)) {
            Swal.fire({
                title: 'Invalid extension (only .png | .jpg | .jpeg)',
                icon: 'error',
                showConfirmButton: true
            }).then(() => {
                e.target.value = ''
            })

        } else {
            let formData = new FormData()
            formData.append('image', e.target.files[0])
            setPhoto(formData)
            console.log(formData)
            setUPhoto(URL.createObjectURL(e.target.files[0]))

            setTimeout(() => {
                setIsUp(true)
            }, 500);
        }


    }

    const add = async (e) => {
        try {
            const { data } = await axios.post('http://localhost:3033/user/register', form)

            if (data.user) {
                if (photo) await axios.put(`http://localhost:3033/user/registerImg/${data.user._id}`, photo, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })

                Swal.fire({
                    title: 'Perfect!!',
                    text: 'Just login to get started into RECIBA ;)',
                    icon: 'success',
                    showConfirmButton: false
                })
                navigate('/login')
            }

        } catch (err) {
            Swal.fire(err.response.data.message, '', 'error')
            console.error(err)
            throw new Error('Login error')
        }
    }

    return (
        <div className="bodyLogin conLogin text-center text-bg-dark" >
            <div className='d-flex p-3 flex-column'>

                <NavbarHome />

                {
                    isUp ? (
                        <div className="position-absolute w-75 bottom-0 start-50 translate-middle-x alert alert-success alert-dismissible fade show text-success" role="alert">
                            You look nice!! Complete your register to see more
                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={()=>setIsUp(false)}></button>
                        </div>
                    ) : (
                        <></>
                    )
                }

                <div className="card-body py-5 px-md-5">
                    <div className="row d-flex justify-content-center">
                        <div className="col-lg-8">
                            <h2 className="fw-bold mb-5" style={{ color: '#fffFFF' }}><i className="fa-solid fa-address-card fa-3x" ></i></h2>
                            <h2 className="fw-bold mb-5">Register</h2>
                            <form >
                                <div className='form-group d-flex justify-content-center'>
                                    <div className="form__group field ms-3">
                                        <input onChange={handleChange} type="text" className="form__field" placeholder="Name" name="name" maxLength='100' required />
                                        <label htmlFor="name" className="form__label">Name</label>
                                    </div>

                                    <div className="form__group field ms-3">
                                        <input onChange={handleChange} type="text" className="form__field" placeholder="Surname" name="surname" maxLength='100' required />
                                        <label htmlFor="name" className="form__label">Surname</label>
                                    </div>
                                </div>
                                <div className='form-group d-flex justify-content-center'>
                                    <div className="form__group field ms-3">
                                        <input onChange={handleChange} type="text" className="form__field" placeholder="Phone" name="phone" maxLength='8' required />
                                        <label htmlFor="name" className="form__label">Phone</label>
                                    </div>

                                    <div className="form__group field ms-3">
                                        <input onChange={handleChange} type="email" className="form__field" placeholder="Email" name="email" maxLength='100' required />
                                        <label htmlFor="name" className="form__label">Email</label>
                                    </div>
                                </div>
                                <div className='form-group d-flex justify-content-center'>
                                    <div className="form__group field ms-3">
                                        <input onChange={handleChange} type="password" className="form__field" placeholder="Password" name="password" maxLength='100' required />
                                        <label htmlFor="name" className="form__label">Password</label>
                                    </div>
                                    <div className="form__group field ms-3">
                                        <input onChange={handleChange} type="text" className="form__field" placeholder="Username" name="username" maxLength='100' required />
                                        <label htmlFor="name" className="form__label">Username</label>
                                    </div>
                                </div>
                                <br />
                                <div className='form-group d-flex justify-content-center'>
                                    <div className="mb-3">
                                        <input onChange={handlePhoto} className="form-control" type="file" id="formFile" name='photo' />
                                    </div>
                                </div>
                                <br />
                                <button className="btnLogin draw-border rounded mx-3" onClick={(e) => { add(e), e.preventDefault() }}>Register</button>

                                <br />
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
