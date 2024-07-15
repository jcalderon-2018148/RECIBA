import React, { useContext } from 'react'
import '../../css/UserHomePage.css'
import { AuthContext } from '../..'
import { Link } from "react-router-dom"

export const CadMaterial = ({ _id, type, price, unit, photo, recycle, butDel }) => {
    const { dataUser } = useContext(AuthContext)

    return (

        <div className="col">
            <div className="p-4 rounded-4 h-100 shadow transitionY">
                <div className="row g-0 align-items-center justify-content-center">
                    <div>
                        <img
                            src={`http://localhost:3033/material/getImage/${photo}`}
                            crossOrigin='anonymous'
                            className="card-img-top rounded-4 img-fluid"
                            style={{
                                objectFit: 'cover',
                                width: '100%',
                                height: '25vh'
                            }}
                        />
                    </div>

                    <div className="col-sm-7 p-4">
                        <div className="card-body text-center my-3">
                            <h1 className="card-title">{type}</h1>
                            <p className="card-text mt-3"><span className="badge bg-secondary">{price?.quantity} {unit}</span> - <span className="badge bg-success">Q{price?.amount}</span></p>
                        </div>

                        {
                            dataUser.role === 'CLIENT' || dataUser.role === 'PARTNER' || dataUser.role === 'MASTER' ? (
                                <></>
                            ) : (
                                <>
                                    <button onClick={(e) => { e.preventDefault(), butDel() }} className="btn btn-outline-danger me-1 ms-1 mt-4">Delete Material</button>
                                    <Link to={`/recycler/updateMaterial/${_id}`}>
                                        <button className="btn btn-outline-warning me-1 ms-1 mt-4">Update Material</button>
                                    </Link>
                                </>
                            )
                        }

                    </div>

                </div>
            </div>
        </div>

    )
}

{/* <div className='col'>
            <div className="rounded-3 shadow-lg transitionY">
                <div className="row g-0 align-items-center">
                    <div className="col-sm-5">
                        <img
                            src={`http://localhost:3033/material/getImage/${photo}`}
                            crossOrigin='anonymous'
                            className="img-fluid rounded-start"
                            style={{
                                objectFit: 'cover',
                                width: '100%',
                                height: '30vh'
                            }}
                        />
                    </div>
                    <div className="col-sm-7 p-4">
                        <div className="card-body">
                            <h5 className="card-title">{}</h5>
                            <p className="card-subtitle mb-2 text-body-secondary">{}</p>
                            <span className="badge bg-warning">Points</span>
                            <h5 className="card-text">{} pts</h5>
                            <span className="badge bg-dark"></span>
                            <p className="card-text mb-0"><small className="text-body-secondary">{}</small></p>
                            <p className="card-text"><small className="text-body-secondary"></small></p>

                            <div className="d-grid gap-2">
                                <button type="button" className="btn btn-outline-warning">Claim</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div> */}
