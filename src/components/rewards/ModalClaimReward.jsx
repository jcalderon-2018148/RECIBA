import axios from 'axios'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

const HOST = Object.freeze({ url: 'http://localhost:3033' })

export const ModalClaimReward = ({ name, desc, partner, range, cantPoints, photo, id }) => {
    const navigate = useNavigate()

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
    }

    const claim = async () => {
        try {
            Swal.fire({
                title: 'Are you sure to claim this reward?',
                icon: 'question',
                showConfirmButton: true,
                showDenyButton: true,
            }).then(async (result) => {

                if (result.isConfirmed) {

                    const { data } = await axios.put(`${HOST.url}/reward/claim/${id}`, {}, { headers: headers })
                        .catch((err) => {
                            Swal.fire(err.response.data.message, '', 'error')
                        })

                        Swal.fire(`${data.message}`, '', 'success')
                        setTimeout(() => {
                            location.reload()
                        }, 1500);

                } else {
                    Swal.fire('No worries!', '', 'success')
                }
            })

        } catch (err) {
            console.error(err)
            Swal.fire(err.response.data.message, '', 'error')
        }
    }

    return (
        <>
            <div className="modal modal-lg modal-dialog-scrollable fade" id={`modal${id}`} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Claim reward</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <img
                                src={`http://localhost:3033/reward/getImage/${photo}`}
                                crossOrigin='anonymous'
                                className="img-fluid rounded-5 shadow"
                                style={{
                                    objectFit: 'cover',
                                    width: '100%',
                                    height: '50vh'
                                }}
                            />

                            <div className='container row align-items-center mt-3 g-1'>
                                <div className='col-sm-6'>
                                    <h3>{name}</h3>
                                    <h4>
                                        <span className="badge bg-warning rounded-pill fs-5">Points</span> {cantPoints} pts
                                    </h4>

                                    <h5 className='text-secondary'>{desc}</h5>
                                </div>

                                <div className='col-sm-5'>
                                    <span className="badge bg-success rounded-pill mb-3">Specifications:</span>
                                    <h5>
                                        <span className="badge bg-dark rounded-pill">Range</span> {range.name}
                                    </h5>
                                    <h5>
                                        <span className="badge bg-dark rounded-pill">Provider</span> <Link onClick={() => { setTimeout(() => { navigate(`/home/partnerview/${partner._id}`) }, 1000) }} className='text-decoration-none text-reset' data-bs-dismiss="modal">{partner.name}</Link>
                                    </h5>
                                </div>

                            </div>

                        </div>
                        <div className="modal-footer justify-content-center">
                            <button type="button" className="btn btn-outline-secondary rounded-pill my-3" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-outline-success rounded-pill my-3" onClick={() => claim()}>Claim</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
