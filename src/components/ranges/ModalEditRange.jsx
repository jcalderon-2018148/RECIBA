import axios from 'axios'
import React, { useState } from 'react'
import Swal from 'sweetalert2'

const HOST = Object.freeze({ url: 'http://localhost:3033' })

export const ModalEditRange = ({ id, name, initExp, limitExp, photo }) => {
    const [form, setForm] = useState({
        name: name,
        initExp: initExp,
        limitExp: limitExp
    })
    const [ePhoto, setEPhoto] = useState()
    const [uPhoto, setUPhoto] = useState()

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
    }

    const headersPhoto = {
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
            setEPhoto(formData)
            console.log(formData);
            setUPhoto(URL.createObjectURL(e.target.files[0]))
        }
    }

    const handleForm = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const updateRange = async () => {
        try {
            const { data } = await axios.put(`${HOST.url}/range/edit/${id}`, form, { headers: headers })

            if (ePhoto) {
               await axios.put(`${HOST.url}/range/uploadImage/${id}`, ePhoto, { headers: headersPhoto })
            }
            
            if (data) {
                Swal.fire('Updated successfully', '', 'success').then(() => location.reload())
            }

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
                            <h1 className="modal-title fs-5" id="exampleModalLabel">{`Edit ${name}'s info`}</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">

                            <div className='d-flex justify-content-center'>
                                <img
                                    src={photo ?  `http://localhost:3033/range/getImage/${photo}` : uPhoto}
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

                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input onChange={handleForm} defaultValue={name} type="email" className="form-control" id="name" name='name' />

                            </div>

                            <div className="mb-3">
                                <label htmlFor="initExp" className="form-label">Initial Exp</label>
                                <input onChange={handleForm} defaultValue={initExp} type="number" className="form-control" id="initExp" name='initExp' />

                            </div>

                            <div className="mb-3">
                                <label htmlFor="limitExp" className="form-label">Limit Exp</label>
                                <input onChange={handleForm} defaultValue={limitExp} type="number" className="form-control" id="limitExp" name='limitExp' />

                            </div>



                        </div>
                        <div className="modal-footer justify-content-center">
                            <button type="button" className="btn btn-outline-secondary rounded-pill my-3" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-outline-success rounded-pill my-3" onClick={() => updateRange()}>Update</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
