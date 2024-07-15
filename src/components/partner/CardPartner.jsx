import React, { useContext } from 'react'
import '../../css/UserHomePage.css'
import { Link } from 'react-router-dom'
import { AuthContext } from '../..'

export const CardPartner = ({ id, name, phone, email, address, photo, admin, butDel }) => {

    const { dataUser } = useContext(AuthContext)
    
    return (
        <div className="col">
            <div className="h-100 transitionY shadow-lg rounded-4">

                <img
                    src={`http://localhost:3033/partner/getImage/${photo}`}
                    crossOrigin='anonymous'
                    className="img-fluid rounded-5 shadow rounded-top-4"
                    style={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '33vh'
                    }}
                />

                <div className="card-body p-4">
                    <h5 className="card-title">{name}</h5>
                    <p className="card-text">{address}</p>

                    <div className="d-grid gap-2">
                        <Link type="button" className="btn btn-outline-success rounded-pill" to={`/${dataUser.role === 'MASTER' ? 'master' : 'home'}/partnerview/${id}`}>
                            Visit
                        </Link>
                    </div>
                </div>

                <div className="card-body px-3">
                    <p className="col-5 text-body-secondary">{phone}</p>
                    <p className="col-7 text-body-secondary">{email}</p>
                </div>
                {
                    butDel ? (
                        <div className="d-flex justify-content-center mt-1">
                            <button onClick={(e) => { e.preventDefault(), butDel(id) }} className="btn btn-outline-danger rounded-pill border-0 pl-2">
                                <i className="fa-sharp fa-solid fa-trash "
                                    trigger="hover"
                                    style={{ width: '25px', height: '25px' }}>
                                </i>
                            </button>
                            <Link type="button" className="btn btn-outline-primary rounded-pill border-0 mr-2" to={`/master/updatePartner/${id}`}>
                                <lord-icon
                                    src="https://cdn.lordicon.com/wloilxuq.json"
                                    trigger="hover"
                                    stroke="100"
                                    colors="primary:black, secondary:black"
                                    style={{ width: '25px', height: '25px' }}>
                                </lord-icon>
                            </Link>
                        </div>
                    ) : (
                        <></>
                    )
                }
                <br />
            </div>
        </div>
    )
}
