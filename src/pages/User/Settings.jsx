import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import photoError from '../../assets/userDefault.png'
import rangePhotoError from '../../assets/defaultRange.png'
import { AuthContext } from '../..'
import { ModalEditImg } from '../../components/user/ModalEditImg'
import { ModalDelAccount } from '../../components/user/ModalDelAccount'
import { ModalEditUser } from '../../components/user/ModalEditUser'
import { ModalChangePass } from '../../components/user/ModalChangePass'

const HOST = Object.freeze({ url: 'http://localhost:3033' })

export const Settings = () => {
    const [user, setUser] = useState()
    const [photo, setPhoto] = useState(false)
    const [limitExp, setLimitExp] = useState()
    const [exp, setExp] = useState()

    const navigate = useNavigate()
    const { setLoggedIn } = useContext(AuthContext)

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
    }

    const getOwn = async () => {
        try {
            const { data } = await axios(`${HOST.url}/user/getOwn`, { headers: headers })

            if (data) {
                if (data.data[0].photo) setPhoto(true)
                
                //Si el usuario no es cliente no tiene que mostrarle su rango porque no lo maneja
                if (data.data[0].role !== 'CLIENT') return setUser(data.data[0])

                let user = data.data[0]
                let perc = 0

                //Establecer rango de exp del range de user
                let limit = user.range.limitExp - user.range.initExp
                setLimitExp(limit)

                let actual = user.exp
                //Obtener el porcentaje de exp que el user tiene sobre el rango 
                perc = ((actual - user.range.initExp) * 100) / (limit)

                setExp(perc)

                return setUser(data.data[0])
            }

        } catch (err) {
            console.error(err)
            Swal.fire(err.response.data.message, '', 'error')
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

    const handleImageError = (e) => {
        e.target.src = photoError
    }

    const handleRangeImageError = (e) => {
        e.target.src = rangePhotoError
    }

    useEffect(() => {
        getOwn()
    }, [])

    return (
        <>
            <div className='container mt-5'>

                <div className='row align-items-center'>
                    <h1 className='col'>{user?.name}'s account</h1>

                    <div className='col-auto text-center'>
                        <Link className='btn btn-outline-dark' onClick={logout}>Log out</Link>
                    </div>
                </div>

                <hr />
                {
                    user?.role === 'CLIENT' ? (
                        <div className='row container'>
                            <div className='col-auto'>
                                <button
                                    type='button'
                                    className='btn btn-outline-warning'
                                    data-bs-toggle="modal" data-bs-target={`#modalEditAccount`}
                                >
                                    Edit
                                </button>
                            </div>
                            <div className='col-auto'>
                                <button
                                    type='button'
                                    className='btn btn-outline-danger'
                                    data-bs-toggle="modal" data-bs-target={`#modalDeleteAccount`}
                                >
                                    Delete your account
                                </button>
                            </div>
                        </div>
                    ) : (
                        <></>
                    )
                }
                


                <div className='row g-0 align-items-center mb-5 my-4 rounded-4 shadow-lg p-5 bg-dark text-light'>
                    <div className='col-sm-5 text-center'>
                        <div>
                            <img
                                src={photo ? `${HOST.url}/user/getImg/${user?.photo}` : photoError}
                                onError={handleImageError}
                                crossOrigin='anonymous'
                                className='img-fluid rounded-circle shadow'
                                style={{
                                    objectFit: 'cover',
                                    width: '30vh',
                                    height: '30vh'
                                }}
                            />
                        </div>

                        <br /><br />

                        {/* Edit img */}
                        <Link
                            className='fs-3 text-decoration-none text-success fw-bold'
                            data-bs-toggle="modal" data-bs-target={`#modal${user?.id}`}
                        >Edit
                        </Link>

                    </div>
                    <div className='col-sm-7 p-4'>
                        <h2 className='fw-bold'>{user?.name} {user?.surname}</h2>
                        <span class="badge rounded-pill text-bg-success text-light">E-mail</span>
                        <h6 className=''>{user?.email}</h6>
                        <span class="badge rounded-pill text-bg-success text-light">Username</span>
                        <h6 className=''>{user?.username}</h6>
                        <span class="badge rounded-pill text-bg-success text-light">Phone</span>
                        <h6 className=''>{user?.phone}</h6>
                        <hr />
                        {
                            user?.role === 'CLIENT' ? (
                                <>
                                    <h5>
                                        <Link to={'/home/bills'} className='text-warning text-decoration-none'>Bills</Link>
                                    </h5>
                                    <h5>
                                        <Link to={'/home/claimers'} className='text-warning text-decoration-none'>Rewards history</Link>
                                    </h5>
                                </>
                                
                            ) : (

                                user?.role === 'MASTER' ? (
                                    <>
                                        <h5>
                                            <Link to={`/master/stats`} className='text-warning text-decoration-none'>View Stats</Link>
                                        </h5>
                                    </>
                                ) : (
                                    user?.role === 'PARTNER' ? (
                                        <>
                                            <h5>
                                                <Link to={`/partner/rewardStats`} className='text-warning text-decoration-none'>View Stats</Link>
                                            </h5>
                                        </>
                                    ) : (
                                        <>
                                            <h5>
                                                <Link to={`/recycler/stats`} className='text-warning text-decoration-none'>View Stats</Link>
                                            </h5>
                                        </>
                                    )
                                )
                                
                            )
                        }

                        <Link data-bs-toggle="modal" data-bs-target={`#modalChangePass`} className='text-warning text-decoration-none fs-5'>Change password</Link>
                    </div>
                </div>
            </div>

            <div className='container mt-3'>
                <div className='container row'>
                    <div className='col-6'>
                        <div className="progress" role="progressbar" aria-label="Animated striped example" aria-valuenow={`${user?.exp}`} aria-valuemin='0' aria-valuemax={`${limitExp}`}>
                            <div className="progress-bar progress-bar-striped progress-bar-animated bg-success" style={{ width: `${user?.role === 'CLIENT' ? exp : '100'}%` }}>{user?.role === 'CLIENT' ? exp : 'Infinite '}%</div>
                        </div>
                        {
                            user?.role === 'CLIENT' ? (
                                <h6>{user?.exp} - {user?.range.limitExp} exp</h6>
                            ) : (
                                <h6>Infinite - Infinite exp</h6>
                            )
                        }
                    </div>

                    <div className='col-6 p-0 text-end'>
                        {
                            user?.role === 'CLIENT' ? (
                                <h4>Ecoins: {user?.points}</h4>
                            ) : (
                                <h4>Ecoins: Infinite</h4>
                            )
                        }
                        
                    </div>
                </div>
            </div>

            <div className='container'>
                <div className='d-flex flex-column my-5'>
                    <h1 className='align-self-center mb-3'>Range</h1>
                    <h1 className='align-self-center mb-3'>{user?.range?.name}</h1>
                    <img
                        src={user?.range?.photo ? `${HOST.url}/range/getImage/${user?.range?.photo}` : rangePhotoError}
                        crossOrigin='anonymous'
                        className='img-fluid rounded-circle align-self-center'
                        style={{
                            objectFit: 'cover',
                            width: '20%',
                        }}
                        onError={handleRangeImageError}
                    />
                    <br />
                    {
                        user?.role === 'CLIENT' ? (
                            <h6 className='text-center'>{user?.exp} - {user?.range.limitExp} exp</h6>
                        ) : (
                            <h6 className='text-center'>Infinite - Infinite</h6>
                        )
                    }
                    <h5 className='text-center'>EXP</h5>
                </div>
            </div>

            <ModalEditImg
                user={user}
            />

            <ModalDelAccount
                user={user}
            />

            <ModalEditUser
                user={user}
            />

            <ModalChangePass
                user={user}
            />
        </>
    )
}
