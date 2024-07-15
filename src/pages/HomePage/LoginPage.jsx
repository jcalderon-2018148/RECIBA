import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './loginStyle.css'
import { AuthContext } from '../../index'
import axios from 'axios'
import Swal from 'sweetalert2'
import { NavbarHome } from '../../components/NavbarHome'

export const LoginPage = () => {
    const { loggedIn, setLoggedIn, setDataUser, dataUser } = useContext(AuthContext)
    const navigate = useNavigate()
    const [form, setForm] = useState({
        username: '',
        password: ''
    })

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const login = async (e) => {
        try {
            const { data } = await axios.post('http://localhost:3033/user/login', form)

            if (data.token) {
                Swal.fire({
                    title: data.message,
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                })
                localStorage.setItem('token', data.token)
                localStorage.setItem('user', JSON.stringify(data.user))
                setDataUser(data.user)
                setLoggedIn(true)

                switch (data.user.role) {
                    case 'CLIENT':
                        navigate(`/home/page`)
                        break;

                    case 'MASTER':
                        navigate(`/master/page`)
                        break;

                    case 'RECYCLER':
                        navigate(`/recycler`)
                        break;

                    case 'PARTNER':
                        navigate(`/partner/viewReward`)
                        break;
                    default:
                        break;
                }
            }

        } catch (err) {
            Swal.fire(err.response.data.message, '', 'error')
            throw new Error('Login error')
        }
    }

    return (
        <div className='bodyLogin conLogin text-center text-bg-dark'>
            <div className="d-flex p-3 flex-column"> {/* mx-auto */}

                <NavbarHome />



                <main className="px-3" style={{ margin: 'auto' }}>




                    <h2 className="h2247 fs-1">Enter your credentials to continue.</h2>



                    <div className='form-group d-flex justify-content-center'>
                        <div className="form__group field me-3">
                            <input onChange={handleChange} type="text" className="form__field" placeholder="Username" name="username" maxLength='100' required />
                            <label htmlFor="name" className="form__label">Username</label>
                        </div>
                        <div className="form__group field ms-3">
                            <input onChange={handleChange} type="password" className="form__field" placeholder="Password" name="password" maxLength='100' required />
                            <label htmlFor="name" className="form__label">Password</label>
                        </div>
                    </div>

                    <div className="form-group mt-3">

                        <button className="btnLogin draw-border" onClick={login}>Login</button>
                    </div>

                    <div className='form-group mt-5'>
                        <p className='h2247 fs-6'>You have no account? <Link className='text-decoration-none text-success' to={'/register'}>Register</Link></p>
                    </div>
                </main>
            </div>
        </div>
    )
}
