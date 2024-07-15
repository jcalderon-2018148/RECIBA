import React, { useContext } from 'react'
import c1 from '../../assets/c1.jpg'
import '../../css/UserHomePage.css'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../..'

export const CardRecycler = ({ name, direction, id, email, phone, startHour, endHour, photos, user, butDel }) => {

    const { dataUser } = useContext(AuthContext)

    return (
        <div className='col'>
            <div className="rounded-5 shadow-lg transitionY">
                <div className="row g-0 align-items-center">
                    <div className="col-sm-5">
                        <img
                            src={`http://localhost:3033/recycler/getImage/${photos?.[0]}`}
                            crossOrigin='anonymous'
                            className="img-fluid rounded-5 shadow"
                            style={{
                                objectFit: 'cover',
                                width: '100%',
                                height: '33vh'
                            }}
                        />
                    </div>
                    <div className="col-sm-7 p-4">
                        <div className="card-body">
                            <h5 className="card-title">{name}</h5>
                            <p className="card-subtitle mb-2 text-body-secondary">{direction}</p>
                            <span className="badge bg-success">Info</span>
                            <p className="card-text"><small className="text-body-secondary">Open: {startHour}hrs - {endHour}hrs</small></p>
                            <span className="badge bg-dark">Contact</span>
                            <p className="card-text mb-0"><small className="text-body-secondary">Email: {email}</small></p>
                            <p className="card-text"><small className="text-body-secondary">Phone: {phone}</small></p>

                            <div className="d-grid gap-2">
                                <Link type="button" className="btn btn-outline-success rounded-pill" to={`/${dataUser.role === 'MASTER' ? 'master' : 'home'}/recyclerview/${id}`}>
                                    Visit
                                </Link>
                            </div>

                            {
                                butDel ? (
                                    <div className="d-flex justify-content-center mt-1">
                                        <button onClick={(e) => { butDel(id) }} className="btn btn-outline-danger rounded-pill border-0 pl-2">
                                            <i className="fa-sharp fa-solid fa-trash "
                                                trigger="hover"
                                                style={{ width: '25px', height: '25px' }}>
                                            </i>
                                        </button>
                                        <Link type="button" className="btn btn-outline-primary rounded-pill border-0 mr-2" to={`/master/updateRecycler/${id}`}>
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

                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
