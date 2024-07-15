import axios from 'axios'
import React, { useState } from 'react'
import Swal from 'sweetalert2'

export const ModalEditImg = ({ user }) => {
    const [photo, setPhoto] = useState()
    const [uPhoto, setUPhoto] = useState()
    const [isUp, setIsUp] = useState(false)

    const headers = {
        'Content-Type': 'multipart/form-data',
        'Authorization': localStorage.getItem('token')
    }

    const handlePhoto = (e) => {
        const allowedExtensions = /(.jpg|.jpeg|.png)$/i

        if (!allowedExtensions.exec(e.target.value)) {
            Swal.fire({
                title: 'Invalid extension (only .png | .jpg | .jpeg)',
                icon: 'error',
                showConfirmButton: true
            }).then(() => {
                e.target.value = ''
            })

        } else {
            let formData = new FormData()
            formData.append('image', e.target.files[0])
            setPhoto(formData)
            console.log(formData)
            setUPhoto(URL.createObjectURL(e.target.files[0]))

            setTimeout(() => {
                setIsUp(true)
            }, 500);
        }
    }

    const updateImg = async () => {
        try {
            if (!isUp) return Swal.fire('You have no selected an image', '', 'warning')

            const { data } = await axios.put(`http://localhost:3033/user/uploadImg/${user.id}`, photo, { headers: headers })

            if (data) {
                Swal.fire({
                    title: 'Perfect!!',
                    text: 'You look great, lets refresh to see the changes!!',
                    icon: 'success',
                    showConfirmButton: false
                }).then(() => {
                    location.reload()
                })
            }

        } catch (err) {
            console.error(err)
            Swal.fire(err.response.data.message, '', 'error')
        }
    }

    return (
        <>
            <div className="modal modal-lg modal-dialog-scrollable fade" id={`modal${user?.id}`} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                {
                    isUp ? (
                        <div className="position-absolute w-75 bottom-0 start-50 translate-middle-x alert alert-success alert-dismissible fade show text-success" role="alert">
                            You look nice!! Press the button save to update your avatar
                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setIsUp(false)}></button>
                        </div>
                    ) : (
                        <></>
                    )
                }
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Avatar</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className='d-flex justify-content-center'>
                                <img
                                    src={uPhoto ? uPhoto : `http://localhost:3033/user/getImg/${user?.photo}`}
                                    crossOrigin='anonymous'
                                    className="img-fluid rounded-circle shadow"
                                    style={{
                                        objectFit: 'cover',
                                        width: '30vh',
                                        height: '30vh'
                                    }}
                                />
                            </div>


                            <div className='container row align-items-center mt-3 g-1'>
                                <div className="mb-3">
                                    <input onChange={handlePhoto} className="form-control" type="file" id="formFile" name='photo' />
                                </div>
                            </div>

                        </div>
                        <div className="modal-footer justify-content-center">
                            <button type="button" className="btn btn-outline-secondary rounded-pill my-3" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-outline-success rounded-pill my-3" onClick={() => updateImg()}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
