import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import photoError from '../assets/userDefault.png'
import { AuthContext } from '../index'
import '../css/Dashboard.css'
import axios from 'axios'
import Swal from 'sweetalert2'

const HOST = Object.freeze({ url: 'http://localhost:3033' })

export const NavbarUser = () => {

    const { dataUser, setLoggedIn } = useContext(AuthContext)
    const [user, setUser] = useState()

    const [exp, setExp] = useState()
    const [limitExp, setLimitExp] = useState()

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
                let perc = 0

                if (!(user.role === 'CLIENT')) return setUser(user)

                let limit = user.range.limitExp - user.range.initExp
                setLimitExp(limit)

                let actual = user.exp

                perc = ((actual - user.range.initExp) * 100) / (limit)

                setExp(perc)
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
        <nav className="navbar bg-light navbar-light border-bottom" aria-label="Dark offcanvas navbar">
            <div className="container-fluid">
                <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#staticBackdrop" aria-controls="staticBackdrop">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <Link className="navbar-brand fontReciba" to={`/${dataUser.role === 'CLIENT' ? 'home' : 'master'}/page`}>RECIBA</Link>

                <div className="offcanvas offcanvas-start" data-bs-backdrop="static" tabIndex="-1" id="staticBackdrop" aria-labelledby="staticBackdropLabel">
                    <div className="offcanvas-header">
                        <h2 className="offcanvas-title fontReciba fw-bold fs-1" id="staticBackdropLabel" style={{ color: '#086c3c' }}><u>RECIBA</u></h2>
                        <button type="button" className="btn-close me-2" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body fontTextReciba">
                        <div>
                            <h3 className='fw-bold' style={{ color: '#086c3c' }}>Actions</h3>
                            {
                                user?.role === "MASTER" ? (
                                    <>
                                        <Link to={'/master/page'} className='optionSidebar'>
                                            <h6>Client View</h6>
                                        </Link>
                                        <h3 className='fw-bold mt-3' style={{ color: '#086c3c' }}>User{' '}<i className="fa-sharp fa-solid fa-user"></i></h3>
                                        <Link className='optionSidebar'></Link>
                                        <Link to={'/master/users'} className='optionSidebar'>
                                            <h6><i className="fa-solid fa-list"></i>{' '}Users</h6>
                                        </Link>
                                        <Link to={'/master/addUser'} className='optionSidebar'>
                                            <h6><i className="fa-solid fa-plus"></i>{' '}Add User</h6>
                                        </Link>
                                        <h3 className='fw-bold mt-3' style={{ color: '#086c3c' }}>Recycler{' '}<i className="fa-solid fa-recycle"></i></h3>
                                        <Link className='optionSidebar'></Link>
                                        <Link to={'/master/recyclerview'} className='optionSidebar'>
                                            <h6><i className="fa-solid fa-list"></i>{' '}Recyclers</h6>
                                        </Link>
                                        <Link to={'/master/addRecycler'} className='optionSidebar'>
                                            <h6><i className="fa-solid fa-plus"></i>{' '}Add Recycler</h6>
                                        </Link>

                                        <h3 className='fw-bold mt-3' style={{ color: '#086c3c' }}>Ranges</h3>
                                        <Link to={'/master/rangeView'} className='optionSidebar'>
                                            <h6>Ranges view</h6>
                                        </Link>
                                        
                                        <h3 className='fw-bold mt-3' style={{ color: '#086c3c' }}>Partner{' '}<i className="fa-solid fa-users-rectangle"></i></h3>
                                        <Link className='optionSidebar'></Link>
                                        <Link to={'/master/partnerView'} className='optionSidebar'>
                                            <h6><i className="fa-solid fa-list"></i>{' '}Partner</h6>
                                        </Link>
                                        <Link to={'/master/addPartner'} className='optionSidebar'>
                                            <h6><i className="fa-solid fa-plus"></i>{' '}Add Partner</h6>
                                        </Link>
                                        
                                        <h3 className='fw-bold mt-3' style={{ color: '#086c3c' }}>Statistics</h3>
                                        <Link to={'/master/stats'} className='optionSidebar'>
                                            <h6>Watch my stats</h6>
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <h6>Range: {user?.range.name}</h6>
                                        <div className="progress" role="progressbar" aria-label="Animated striped example" aria-valuenow={`${user?.exp}`} aria-valuemin='0' aria-valuemax={`${limitExp}`}>
                                            <div className="progress-bar progress-bar-striped progress-bar-animated bg-success" style={{ width: `${exp}%` }}>{exp}%</div>
                                        </div>
                                        <h6>{user?.exp} - {user?.range.limitExp} exp</h6>
                                        <br />

                                        <h3 className='fw-bold' style={{ color: '#086c3c' }}>Actions</h3>

                                        <h3 className='fw-bold mt-3' style={{ color: '#086c3c' }}>Bill</h3>
                                        <Link to={'/home/bills'} className='optionSidebar'>
                                            <h6>Bills</h6>
                                        </Link>

                                        <h3 className='fw-bold mt-3' style={{ color: '#086c3c' }}>Rewards</h3>
                                        <Link to={'/home/claimers'} className='optionSidebar'>
                                            <h6>Rewards history</h6>
                                        </Link>

                                        <h3 className='fw-bold mt-3' style={{ color: '#086c3c' }}>Statistics</h3>
                                        <Link to={'/home/stats'} className='optionSidebar'>
                                            <h6>Watch my stats</h6>
                                        </Link>
                                    </>
                                )
                            }
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
    )
}
