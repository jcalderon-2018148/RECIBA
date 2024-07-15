import React, { useEffect, useState, useContext, useRef } from 'react';
import Select from "react-select";
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/Dashboard.css'
import exampleImage from '../../assets/exampleimage.png'
import { useParams } from 'react-router-dom';

export const UpdateMaterial = () => {

    const { id } = useParams()
    const navigate = useNavigate()

    const [oldPhoto, setOldPhoto] = useState()
    const [newPhoto, setNewPhoto] = useState()
    const [selectedImage, setSelectedImage] = useState(null);
    const imageInputRef = useRef(null);

    const units = [
        { value: 'pound', label: 'Pound' },
        { value: 'ounce', label: 'Ounce' },
        { value: 'kilogram', label: 'Kilogram' },
        { value: 'gram', label: 'Gram' },
        { value: 'unit', label: 'Unit' }
    ]

    const [material, setMaterial] = useState({
        type: '',
        unit: '',
        quantity: '',
        amount: ''
    })

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
    }

    const getMaterial = async () => {
        try {
            const { data } = await axios.get(`http://localhost:3033/material/getOne/${id}`, { headers: headers })

            setMaterial({
                type: data.material.type,
                unit: data.material.unit,
                quantity: data.material.price.quantity,
                amount: data.material.price.amount
            })

            setOldPhoto(data.material.photo)

            console.log(material);

        } catch (err) {
            Swal.fire(err.response.data.message, '', 'error');
            console.error(err);
        }
    }

    const updateMaterial = async () => {
        try {
            const newMaterial = {
                type: material.type,
                unit: material.unit,
                price: {
                    quantity: parseInt(material.quantity, 10),
                    amount: parseFloat(material.amount).toFixed(2)
                }
            }
            console.log(newMaterial);
            const { data } = await axios.put(`http://localhost:3033/material/set/${id}`, newMaterial, { headers: headers })

            if (selectedImage) {
                await axios.put(
                    `http://localhost:3033/material/uploadImage/${id}`,
                    newPhoto,
                    { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': localStorage.getItem('token') } }
                )
            }

            Swal.fire({
                title: 'Material updated succesfully.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            })

            navigate('/recycler/viewMaterials')

        } catch (err) {
            Swal.fire(err.response.data.message, '', 'error');
            console.error(err);
        }
    }

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

    //Obtener la foto en caso de que se suba algo
    const handlePhoto = (e) => {
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
        setNewPhoto(formData)
    }

    useEffect(() => {
        getMaterial()
    }, [])


    return (
        <>
            <div className="card shadow">
                <div className="card-body">
                    <div className="container mb-2 mt-3">
                        <div className='text-center mb-2'>
                            <h1 className='fontReciba fw-bold fs-1'>Update Material</h1>
                        </div>
                        <div className="row d-flex align-items-baseline">

                            <div className='col-md-6 mt-2'>
                                <input defaultValue={material.type} onChange={handleForm} name='type' type="text" className="form-control" placeholder='Enter the name of the material.' />
                            </div>
                            <div className="col-md-2 mb-2">
                                <Select
                                    options={units}
                                    placeholder="Select Unit"
                                    onChange={handleFormUnit}
                                    isSearchable={true}
                                    value={{ value: material.unit, label: material.unit.charAt(0).toUpperCase() + material.unit.slice(1) }}
                                    name='unit'
                                />
                            </div>
                            <div className='col-md-4 mt-2'>
                                <input onChange={handlePhoto} name='photo' accept="image/png,image/jpeg" type="file" className="form-control" placeholder='Send a photo.' />
                            </div>

                        </div>
                        <div className="row d-flex align-items-baseline">

                            <div className="col-md-1 mb-2">
                                <h3>Price: </h3>
                            </div>
                            <div className='col-md-3 mt-2'>
                                <input defaultValue={material.quantity} onChange={handleForm} name='quantity' type="number" className="form-control" placeholder='Enter the amount of the material.' />
                            </div>
                            x
                            <div className='col-md-4 mt-2'>
                                <input defaultValue={material.amount} onChange={handleForm} name='amount' type="number" className="form-control" placeholder='Enter how much you will pay for that amount.' />
                            </div>

                            <hr className='mb-2' />

                        </div>

                        <div className="col-md-7 mx-auto">
                            <div className="p-4 rounded-4 h-50 shadow ">
                                <div className="row g-0 align-items-center">
                                    <div className="col-sm-5">

                                        <img
                                            src={selectedImage ? (selectedImage) : (`http://localhost:3033/material/getImage/${oldPhoto}`)}
                                            crossOrigin="anonymous"
                                            className="card-img-top rounded-4 img-fluid img-thumbnail"
                                            style={{
                                                objectFit: 'cover',
                                                width: '100%',
                                                height: '35vh'
                                            }}
                                        />

                                    </div>

                                    <div className="col-sm-7 p-4">
                                        <div className="card-body text-center my-3">
                                            <h1 className="card-title">{material.type || '<Material Name>'}</h1>
                                            <p className="card-text mt-3">
                                                <span className="badge bg-secondary">{parseInt(material.quantity, 10) || '<Quantity>'} {material.unit || '<Unit>'}</span> - <span className="badge bg-success">Q {material.amount ? (parseFloat(material.amount).toFixed(2)) : (' <Price>')}</span>
                                            </p>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>

                        <div className="container text-center mt-4">

                            <button onClick={updateMaterial} className='btn btn-warning fs-5 rounded'>Update</button>
                            <Link to='/recycler/viewMaterials'>
                                <button className='btn btn-danger fs-5 ms-2 rounded'>Cancel</button>
                            </Link>
                            
                        </div>

                    </div>
                </div>

            </div>
        </>
    )
}
