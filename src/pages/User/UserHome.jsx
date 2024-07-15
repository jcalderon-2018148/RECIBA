import React, { useEffect, useState } from 'react'
import c1 from '../../assets/c1.jpg'
import c2 from '../../assets/c2.jpg'
import c3 from '../../assets/c3.jpg'
import '../../css/UserHomePage.css'
import axios from 'axios'
import { CardRecycler } from '../../components/recycler/CardRecycler'
import Swal from 'sweetalert2'
import { CardReward } from '../../components/rewards/CardReward'
import { CardPartner } from '../../components/partner/CardPartner'

const HOST = Object.freeze({ url: 'http://localhost:3033' })

export const UserHome = () => {
    const [recyclers, setRecyclers] = useState()
    const [rewards, setRewards] = useState()
    const [partners, setPartners] = useState()
    const [user, setUser] = useState()

    const [exp, setExp] = useState()
    const [limitExp, setLimitExp] = useState()

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
    }

    const getRecyclers = async () => {
        try {
            const { data } = await axios(`${HOST.url}/recycler/get`, { headers: headers })

            if (data) {
                return setRecyclers(data.recyclers)
            }

        } catch (err) {
            console.error(err)
            Swal.fire(err.response.data.message, '', 'error')
        }
    }

    const getRewards = async () => {
        try {
            const { data } = await axios(`${HOST.url}/reward/get`, { headers: headers })

            if (data) {
                return setRewards(data.rewards)
            }

        } catch (err) {
            console.error(err)
            Swal.fire(err.response.data.message, '', 'error')
        }
    }

    const getPartners = async () => {
        try {
            const { data } = await axios(`${HOST.url}/partner/get`, { headers: headers })

            if (data) {
                return setPartners(data.partners)
            }

        } catch (err) {
            console.error(err)
            Swal.fire(err.response.data.message, '', 'error')
        }
    }

    const getOwn = async () => {
        try {
            const { data } = await axios(`${HOST.url}/user/getOwn`, { headers: headers })

            if (data) {
                let user = data.data[0]
                let perc = 0

                //Establecer el rango total de exp del range
                let limit = user.range.limitExp - user.range.initExp
                setLimitExp(limit)

                //Obtener la exp actual del usuario
                let actual = user.exp

                //Ecuacion para conocer el porcentaje del usuario sobre el range que tiene
                perc = ((actual - user.range.initExp) * 100) / (limit)

                setExp(perc)
                return setUser(user)
            }

        } catch (err) {
            console.error(err)
            Swal.fire(err.response.data.message, '', 'error')
        }
    }

    //Funcion para checkear si el usuario puede ser promovido de rango
    const checkRange = async () => {
        try {
            const { data } = await axios(`${HOST.url}/user/checkRange`, { headers: headers })

            if (data) {
                console.log(data.promoted);
                if (data.promoted) Swal.fire('You have been promoted', '', 'info')
            }

            return

        } catch (err) {
            console.error(err)
            Swal.fire(err.response.data.message, '', 'error')
        }
    }

    useEffect(() => {
        getRecyclers()
        getRewards()
        getPartners()
        getOwn()
        checkRange()
    }, [])


    return (
        <>
        <br />
            {user?.role != 'CLIENT' ?
                (<div style={{ backgroundColor: '#44AF41', borderRadius: '15px' }} className='sticky-top text-white mb-4'>

                    <h1 className='h1TE text-center'>Client View</h1>

                </div>)
                :
                (<></>)}

            {/* Carousel */}
            <div id="carruselImagenes" className="carousel container slide mt-4 p-0" data-bs-ride="carousel" style={{ height: '65vh', width: '100%' }}>
                <div className="carousel-inner rounded-4">
                    <div id="uno" className="carousel-item active">
                        <img src={c1} className="d-block" style={{ objectFit: 'cover', width: '100%', height: '65vh' }} />
                    </div>

                    <div id="dos" className="carousel-item">
                        <img src={c2} className="d-block" style={{ objectFit: 'cover', width: '100%', height: '65vh' }} />
                    </div>

                    <div id="tres" className="carousel-item">
                        <img src={c3} className="d-block" style={{ objectFit: 'cover', width: '100%', height: '65vh' }} />
                    </div>
                </div>

                <button className="carousel-control-prev rounded-4" type="button" data-bs-target="#carruselImagenes" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon"></span>
                </button>
                <button className="carousel-control-next rounded-4" type="button" data-bs-target="#carruselImagenes" data-bs-slide="next">
                    <span className="carousel-control-next-icon"></span>
                </button>
            </div>

            {/* Carousel buttons */}
            <div className='container text-center mt-4 mb-5'>
                <div className='row row-cols-3 row-cols-md-3 g-4'>
                    <a className="col img-carousel" data-bs-target="#carruselImagenes" data-bs-slide-to="0" href='#'>
                        <img className=' rounded-4 shadow-lg transitionY' src={c1} width="100%" style={{ objectFit: 'cover', width: '100%', height: '20vh' }} />
                    </a>

                    <a className="col img-carousel" data-bs-target="#carruselImagenes" data-bs-slide-to="1" href='#'>
                        <img className=' rounded-4 shadow-lg transitionY' src={c2} width="100%" style={{ objectFit: 'cover', width: '100%', height: '20vh' }} />
                    </a>

                    <a className="col img-carousel" data-bs-target="#carruselImagenes" data-bs-slide-to="2" href='#'>
                        <img className=' rounded-4 shadow-lg transitionY' src={c3} width="100%" style={{ objectFit: 'cover', width: '100%', height: '20vh' }} />
                    </a>
                </div>
            </div>

            <br />

            {/* EXP & ECOINS */}
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


            {/* Recyclers */}
            <div className='container mx-auto mt-5'>
                <div className='row align-items-center'>
                    <h1 className='col py-1 px-4 text-success'>
                        Recyclers
                    </h1>

                    <div className='col-auto text-center text-light'>
                        <h6 className='bg-danger rounded-pill py-1 px-3'>
                            {recyclers?.length} on FIRE!
                        </h6>
                    </div>
                </div>

                <hr className='mb-5' />

                <div className="row row-cols-1 row-cols-md-2 g-4">
                    {
                        recyclers?.length != 0 ? (
                            recyclers?.map(({ name, direction, _id, email, phone, startHour, endHour, photos }, index) => {
                                return (
                                    <CardRecycler
                                        key={index}
                                        name={name}
                                        direction={direction}
                                        email={email}
                                        id={_id}
                                        phone={phone}
                                        startHour={startHour}
                                        endHour={endHour}
                                        photos={photos}
                                    />
                                )
                            })
                        ) : (
                            null
                        )



                    }
                </div>
            </div>

            {/* Rewards */}
            <div className='container mx-auto my-5'>
                <div className='row align-items-center'>

                    <h1 className='col py-1 px-4 text-success'>
                        Rewards
                    </h1>

                    <div className='col-auto text-center text-light'>
                        <h6 className='bg-danger rounded-pill py-1 px-3'>
                            {rewards?.length} on FIRE!
                        </h6>
                    </div>
                </div>

                <hr className='mb-5' />

                <div className='row row-cols-1 row-cols-md-2 g-4 text-center'>
                    {
                        recyclers?.length != 0 ? (
                            rewards?.map(({ name, description, partner, range, cantPoints, photo, _id }, index) => {
                                return (
                                    <>
                                        <CardReward
                                            id={_id}
                                            name={name}
                                            desc={description}
                                            range={range}
                                            cantPoints={cantPoints}
                                            photo={photo}
                                            partner={partner}
                                            key={index}
                                        />
                                    </>

                                )
                            })
                        ) : (
                            null
                        )

                    }
                </div>
            </div>

            {/* PARTNERS */}
            <div className='container mx-auto my-5'>
                <h1 className='py-1 px-4 text-success'>
                    Our Partners
                </h1>

                <hr className='mb-5' />

                <div className="row row-cols-1 row-cols-md-3 g-4 text-center">
                    {
                        partners?.map(({ _id, name, phone, email, address, photo }, index) => {
                            return (
                                <CardPartner
                                    id={_id}
                                    name={name}
                                    phone={phone}
                                    email={email}
                                    address={address}
                                    photo={photo}
                                    key={index}
                                />
                            )
                        })
                    }

                </div>
            </div>

        </>
    )
}
