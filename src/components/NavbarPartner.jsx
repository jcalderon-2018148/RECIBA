import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../css/Dashboard.css'
import photoError from '../assets/userDefault.png'
import axios from 'axios'
import Swal from 'sweetalert2'
import { AuthContext } from '../index'

const HOST = Object.freeze({ url: 'http://localhost:3033' })

export const NavbarPartner = () => {

    const { dataUser, setLoggedIn } = useContext(AuthContext)
    const [user, setUser] = useState()

    const [photo, setPhoto] = useState()
    const handleImageError = (e) => {
        e.target.src = photoError;
    };
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
    }

    const navigate = useNavigate()

    const getOwn = async () => {
        try {
            const { data } = await axios(`${HOST.url}/user/getOwn`, { headers: headers })

            if (data) {
                setPhoto(`${HOST.url}/user/getImg/${data.data[0].photo}`)
                let user = data.data[0]
                return setUser(user)
            }

        } catch (err) {
            console.error(err)
            Swal.fire(err.response?.data.message, '', 'error')
        }
    }

    const logout = () => {
        localStorage.clear()
        setLoggedIn(false)

        navigate('/login')
        Swal.fire({
            icon: 'success',
            timer: 1000,
            showConfirmButton: false
        })
    }

    useEffect(() => {
        getOwn()
    }, [])

    return (
        <>
            <nav className="navbar navbar-dark bgGreen fixed-top" aria-label="Dark offcanvas navbar">
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#staticBackdrop" aria-controls="staticBackdrop">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <a className="navbar-brand fontReciba" href="#">RECIBA</a>
                    <div className="offcanvas offcanvas-start" data-bs-backdrop="static" tabIndex="-1" id="staticBackdrop" aria-labelledby="staticBackdropLabel">
                        <div className="offcanvas-header">
                            <h2 className="offcanvas-title fontReciba fw-bold fs-1" id="staticBackdropLabel" style={{ color: '#086c3c' }}><u>RECIBA</u></h2>
                            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body fontTextReciba">
                            <div>

                                <h3 className='fw-bold' style={{ color: '#086c3c' }}>My Rewards</h3>


                                <Link to='addReward' className='optionSidebar'>
                                    <h6>Create Rewards</h6>
                                </Link>

                                <Link to='viewReward' className='optionSidebar'>
                                    <h6>View Rewards</h6>
                                </Link>

                                <h3 className='fw-bold mt-3' style={{ color: '#086c3c' }}>Statistics</h3>
                                <Link to='rewardStats' className='optionSidebar'>
                                    <h6>Watch my rewards stats</h6>
                                </Link>

                            </div>
                        </div>

                        <div className="dropup pb-4 px-4">

                            <div className="dropdown d-grip gap-2">
                                <a className="btn btn-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <img src={photo || photoError} onError={handleImageError} crossOrigin='anonymous' alt="userFoto" style={{ objectFit: 'cover', width: '4vh', height: '4vh' }} className="rounded-circle me-1" />
                                    <span className="d-none d-sm-inline mx-1 fs-5">{dataUser.username}</span>
                                </a>
                                <ul className="dropdown-menu dropdown-menu-dark text-lg shadow">
                                    <li><Link className="dropdown-item" to='settings'>Settings</Link></li>
                                    <li><Link className="dropdown-item disabled" href="#">Role: {dataUser.role}</Link></li>

                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>
                                    <li><Link className="dropdown-item" href="#" onClick={logout}>Log Out</Link></li>
                                </ul>
                            </div>

                        </div>
                    </div>
                </div>
            </nav>
            <section id=''>

            </section>
        </>

    )
}
