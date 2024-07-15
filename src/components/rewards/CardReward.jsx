import React, { useContext } from 'react'
import '../../css/UserHomePage.css'
import { ModalClaimReward } from './ModalClaimReward'
import { AuthContext } from '../../index'
import { Link } from 'react-router-dom'

export const CardReward = ({ name, desc, partner, range, cantPoints, photo, id, claims, butDel }) => {
    
    const { dataUser } = useContext(AuthContext)

    

    return (
        <>
            <div className='col'>
                <div className="rounded-5 shadow-lg transitionY">
                    <div className="row g-0 align-items-center">
                        <div className="col-sm-5">
                            <img
                                src={`http://localhost:3033/reward/getImage/${photo}`}
                                crossOrigin='anonymous'
                                className="img-fluid rounded-5 shadow"
                                style={{
                                    objectFit: 'cover',
                                    width: '100%',
                                    height: '30vh'
                                }}
                            />
                        </div>
                        <div className="col-sm-7 p-4">
                            <div className="card-body">
                                <h5 className="card-title">{name}</h5>
                                <p className="card-subtitle mb-2 text-body-secondary">{partner.name}</p>
                                <span className="badge bg-warning">Points</span>
                                <h5 className="card-text">{cantPoints} pts</h5>
                                <span className="badge bg-dark">Description</span>
                                <p className="card-text mb-0"><small className="text-body-secondary">{desc}</small></p>
                                <p className="card-text"><small className="text-body-secondary"></small></p>

                                {
                                    claims ? (
                                        <div className="row align-items-center">
                                            <div className='col-sm-6'>
                                                <span className="badge bg-success">Claimed</span>
                                                <h4>{claims}</h4>
                                            </div>

                                            <div className='col-sm-6'>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-success rounded-pill"
                                                    data-bs-toggle="modal" data-bs-target={`#modal${id}`}
                                                >
                                                    Claim again
                                                </button>
                                            </div>

                                        </div>
                                    ) : dataUser.role == 'MASTER' ? (
                                        <>
                                            <div className="d-flex justify-content-center mt-1">
                                                <button onClick={(e) => { e.preventDefault(), butDel(id) }} className="btn btn-outline-danger rounded-pill border-0 pl-2">
                                                    <i className="fa-sharp fa-solid fa-trash "
                                                        trigger="hover"
                                                        style={{ width: '25px', height: '25px' }}>
                                                    </i>
                                                </button>
                                                <Link type="button" className="btn btn-outline-primary rounded-pill border-0 mr-2" to={`/master/updateReward/${id}`}>
                                                    <lord-icon
                                                        src="https://cdn.lordicon.com/wloilxuq.json"
                                                        trigger="hover"
                                                        stroke="100"
                                                        colors="primary:black, secondary:black"
                                                        style={{ width: '25px', height: '25px' }}>
                                                    </lord-icon>
                                                </Link>
                                            </div>
                                        </>) :
                                        (<>
                                            <div className="d-grid gap-2">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-warning rounded-pill"
                                                    data-bs-toggle="modal" data-bs-target={`#modal${id}`}
                                                >
                                                    Claim
                                                </button>
                                            </div>
                                        </>)

                                }

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ModalClaimReward
                id={id}
                name={name}
                desc={desc}
                range={range}
                cantPoints={cantPoints}
                photo={photo}
                partner={partner}
                key={id}
            />
        </>

    )
}
