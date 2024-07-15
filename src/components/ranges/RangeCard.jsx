import React from 'react'
import photoError from '../../assets/defaultRange.png'
import { Link } from 'react-router-dom';
import { ModalEditRange } from './ModalEditRange';
import Swal from 'sweetalert2';
import axios from 'axios';

export const RangeCard = ({ id, name, initExp, limitExp, photo }) => {
    const handleImageError = (e) => {
        e.target.src = photoError;
    };

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
    }

    const delRange = async () => {
        try {
            Swal.fire({
                title: 'Are you sure to delet this range?',
                icon: 'question',
                showConfirmButton: true,
                showDenyButton: true,
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const { data } = await axios.delete(`http://localhost:3033/range/delete/${id}`, { headers: headers })
                    .catch((err) => {
                        Swal.fire(err.response.data.message, '', 'error')
                    })
                    Swal.fire(`${data.message}`, '', 'success').then(() => location.reload())
                } else {
                    Swal.fire('No worries', '', 'success')
                }
            })
            
        } catch (err) {
            console.error(err)
            Swal.fire(err.response.data.message, '', 'error')
        }
    }

    return (
        <>
            <div className="col">
                <div className="h-100 transitionY shadow-lg rounded-4">

                    <img
                        src={photo ? `http://localhost:3033/range/getImage/${photo}` : photoError}
                        crossOrigin='anonymous'
                        className="img-fluid rounded-5 shadow rounded-top-4"
                        style={{
                            objectFit: 'cover',
                            width: '100%',
                            height: '33vh'
                        }}
                        onError={handleImageError}
                    />

                    <div className="card-body p-4">
                        <h5 className="card-title">{name}</h5>
                        <p className="card-text">EXP: {`${initExp} - ${limitExp}`}</p>

                    </div>
                    
                    {
                        name === 'ADMIN' ? (
                            <></>
                        ) : (
                            <div className="d-flex justify-content-center mt-1">
                                <button onClick={(e) => { e.preventDefault(); delRange(id) }} className="btn btn-outline-danger rounded-pill border-0 pl-2">
                                    <i className="fa-sharp fa-solid fa-trash "
                                        trigger="hover"
                                        style={{ width: '25px', height: '25px' }}>
                                    </i>
                                </button>
                                <Link
                                    type="button"
                                    className="btn btn-outline-primary rounded-pill border-0 mr-2"
                                    data-bs-toggle="modal" data-bs-target={`#modal${id}`}
                                >
                                    <lord-icon
                                        src="https://cdn.lordicon.com/wloilxuq.json"
                                        trigger="hover"
                                        stroke="100"
                                        colors="primary:black, secondary:black"
                                        style={{ width: '25px', height: '25px' }}>
                                    </lord-icon>
                                </Link>
                            </div>
                        )
                    }
                    
                    <br />
                </div>
            </div>

            <ModalEditRange 
                id={id}
                name={name}
                initExp={initExp}
                limitExp={limitExp}
                photo={photo}
                key={id}
            />
        </>

    )
}
