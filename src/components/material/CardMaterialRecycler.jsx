import React, { useContext } from 'react'
import '../../css/UserHomePage.css'
import { AuthContext } from '../..'
import { Link } from "react-router-dom"

export const CartMaterialRecycler = ({ _id, type, price, unit, photo, recycle, butDel }) => {
    const { dataUser } = useContext(AuthContext)

    return (

        <div className="col">
            <div className="p-4 rounded-4 h-100 shadow transitionY">
                <div className="row g-0 align-items-center justify-content-center">
                    <div className="col-sm-5">
                        <img
                            src={`http://localhost:3033/material/getImage/${photo}`}
                            crossOrigin='anonymous'
                            className="card-img-top rounded-4 img-fluid"
                            style={{
                                objectFit: 'cover',
                                width: '100%',
                                height: '35vh'
                            }}
                        />
                    </div>

                    <div className="col-sm-7 p-4">
                        <div className="card-body text-center my-3">
                            <h1 className="card-title">{type}</h1>
                            <p className="card-text mt-3"><span className="badge bg-secondary">{price?.quantity} {unit}</span> - <span className="badge bg-success">Q{price?.amount}</span></p>
                        </div>

                        {
                            dataUser.role === 'CLIENT' || dataUser.role === 'PARTNER' ? (
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