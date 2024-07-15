import React from 'react'
import '../../css/UserHomePage.css'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import axios from 'axios'

export const CardRewardOnly = ({ name, desc, range, cantPoints, partner, photo, id, reload }) => {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      }

    const delReward = async() => {
        try {
            Swal.fire({
                title:'Delete',
                text:'Are you sure to delete this reward',
                icon:'question',
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Yes',
                denyButtonText: 'No'
            }).then(async(result)=>{
                if(result.isConfirmed){
                    reload()
                }else if(result.isDenied){
                    Swal.fire({
                        title:'Delete caneled',
                        icon:'error'
                    })
                }
            })
        } catch (err) {
            console.error(err);
            Swal.fire(err.response.data?.message, '', 'error')
        }
    }

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
                                    height: '25vh'
                                }}
                            />
                        </div>
                        <div className="col-sm-7 p-4">
                            <div className="card-body">
                                <span className="badge bg-warning">Name</span>
                                <h5 className="card-text">{name}</h5>
                                <span className="badge bg-dark">Description</span>
                                <p className="card-text mb-0"><small className="text-body-secondary">{desc}</small></p>
                                <p className="card-text"><small className="text-body-secondary"></small></p>
                                <span className="badge bg-warning">Range</span>
                                <h5 className="card-text">{range}</h5>
                                <span className="badge bg-warning">Partner</span>
                                <h5 className="card-text">{partner?.name}</h5>
                                <span className="badge bg-warning">Points</span>
                                <h5 className="card-text">{cantPoints} pts</h5>
                                <span className="card-text"></span>
                                <Link className="btn btn-outline-primary rounded-pill border-0 mr-2" to={`/partner/editReward/${id}`}>
                                    <lord-icon
                                                src="https://cdn.lordicon.com/wloilxuq.json"
                                                trigger="hover"
                                                stroke="100"
                                                colors="primary:black, secondary:black"
                                                style={{ width: '25px', height: '25px' }}>
                                            </lord-icon>
                                </Link>
                                    <button className="btn btn-outline-danger rounded-pill border-0 pl-2" onClick={()=>{delReward()}}>
                                    <i className="fa-sharp fa-solid fa-trash "
                                                trigger="hover"
                                                style={{ width: '25px', height: '25px' }}>
                                            </i>
                                    </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}
