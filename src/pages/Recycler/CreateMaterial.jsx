import React, { useEffect, useState, useContext, useRef } from 'react';
import Select from "react-select";
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import '../../css/Dashboard.css'
import { CadMaterial } from '../../components/material/CadMaterial';
import exampleImage from '../../assets/exampleimage.png'

export const CreateMaterial = () => {

    const [selectedImage, setSelectedImage] = useState(null);
    const imageInputRef = useRef(null);
    const localUser = JSON.parse(localStorage.getItem('user'))
    const navigate = useNavigate()

    const units = [
        { value: 'pound', label: 'Pound' },
        { value: 'ounce', label: 'Ounce' },
        { value: 'kilogram', label: 'Kilogram' },
        { value: 'gram', label: 'Gram' },
        { value: 'unit', label: 'Unit' }
    ]

    const [photo, setPhoto] = useState()
    const [material, setMaterial] = useState({
        type: '',
        unit: '',
        quantity: '',
        amount: '',
        recycle: ''
    })

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
    };

    const addMaterial = async () => {
        try {

            const userData = await axios(`http://localhost:3033/user/getByUsername/${localUser.username}`, { headers: headers })
            const recyclerData = await axios(`http://localhost:3033/recycler/getByUser/${userData.data.data[0].id}`, { headers: headers })
           
            const newMaterial = {
                type: material.type,
                unit: material.unit,
                price: {
                    quantity: parseInt(material.quantity, 10),
                    amount: parseFloat(material.amount).toFixed(2)
                },
                recycle: recyclerData.data.recycler._id
            }

            const {data} = await axios.post(`http://localhost:3033/material/add`, newMaterial, {headers: headers})

            if (data.material) {
                await axios.put(
                    `http://localhost:3033/material/uploadImage/${data.material._id}`, 
                    photo, 
                    {headers: {'Content-Type': 'multipart/form-data', 'Authorization': localStorage.getItem('token')}}
                )
                Swal.fire({
                    title: 'Material created succesfully.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                })
                navigate('/recycler/viewMaterials')
            }

            console.log(newMaterial);

        } catch (err) {
            Swal.fire(err.response.data.message, '', 'error');
            console.error(err);
        }
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }

        let formData = new FormData()
        formData.append('image', e.target.files[0])
        setPhoto(formData)
    };

    //Obtener el valor del input
    const handleForm = (e) => {
        setMaterial({
            ...material,
            [e.target.name]: e.target.value
        });
    };

    //Obtener el valor del material del Select
    const handleFormUnit = (value, action) => {
        setMaterial({
            ...material,
            unit: value.value
        });
    };
    
    return (
        <>
            <div className="card shadow">
                <div className="card-body">
                    <div className="container mb-2 mt-3">
                        <div className='text-center mb-2'>
                            <h1 className='fontReciba fw-bold fs-1'>Create Material</h1>
                        </div>
                        <div className="row d-flex align-items-baseline">

                            <div className='col-md-6 mt-2'>
                                <input onChange={handleForm} name='type' type="text" className="form-control" placeholder='Enter the name of the material.' />
                            </div>
                            <div className="col-md-2 mb-2">
                                <Select
                                    options={units}
                                    placeholder="Select Unit"
                                    onChange={handleFormUnit}
                                    isSearchable={true}
                                    name='unit'
                                />
                            </div>
                            <div className='col-md-4 mt-2'>
                                <input ref={imageInputRef} onChange={handleImageUpload} name='photo' type="file" className="form-control" placeholder='Send a photo.' />
                            </div>

                        </div>
                        <div className="row d-flex align-items-baseline">

                            <div className="col-md-1 mb-2">
                                <h3>Price: </h3>
                            </div>
                            <div className='col-md-3 mt-2'>
                                <input onChange={handleForm} name='quantity' type="number" className="form-control" placeholder='Enter the amount of the material.' />
                            </div>
                            x
                            <div className='col-md-4 mt-2'>
                                <input onChange={handleForm} name='amount' type="number" className="form-control" placeholder='Enter how much you will pay for that amount.' />
                            </div>

                            <hr className='mb-2' />

                        </div>


                        <div className="col-md-7 mx-auto">
                            <div className="p-4 rounded-4 h-100 shadow">
                                <div className="row g-0 align-items-center">
                                    <div className="col-sm-5">
                                        {selectedImage ? (
                                            <img
                                                src={selectedImage}
                                                crossOrigin="anonymous"
                                                className="card-img-top rounded-4 img-fluid img-thumbnail"
                                                style={{
                                                    objectFit: 'cover',
                                                    width: '100%',
                                                    height: '35vh'
                                                }}
                                            />
                                        ) : (
                                            <img
                                                src={exampleImage}
                                                alt="Example"
                                                className="card-img-top rounded-4 img-fluid img-thumbnail"
                                                style={{
                                                    objectFit: 'cover',
                                                    width: '100%',
                                                    height: '35vh'
                                                }}
                                            />
                                        )}
                                    </div>

                                    <div className="col-sm-7 p-4">
                                        <div className="card-body text-center my-3">
                                            <h1 className="card-title">{material.type || '<Material Name>'}</h1>
                                            <p className="card-text mt-3"><span className="badge bg-secondary">{parseInt(material.quantity, 10) || '<Quantity>'} {material.unit || '<Unit>'}</span> - <span className="badge bg-success">Q{material.amount ? (' '+parseFloat( material.amount).toFixed(2)) : (' <Price>')}</span></p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="container text-center mt-4">

                            <button onClick={(e)=>{e.preventDefault(), addMaterial()}} className='btn btn-success fs-5 rounded'>Create Material</button>

                        </div>

                    </div>
                </div>

            </div>
        </>
    )
}
