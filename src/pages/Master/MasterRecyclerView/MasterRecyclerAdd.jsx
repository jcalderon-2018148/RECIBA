import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import '../MasterUserView/user.css'
import { Link, useNavigate } from 'react-router-dom'

export const MasterRecyclerAdd = () => {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        name: '',
        direction: '',
        user: '',
        phone: '',
        email: '',
        startHour: '',
        endHour: ''
    })

    const [photo, setPhoto] = useState()
    const [user, setUser] = useState([])
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
    }

    const handleForm = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }


    const handleSelect = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.options[e.target.selectedIndex].value
        })
    }

    const handlePhoto = (e) => {
        let f = new FormData()
        for (let img of e.target.files) {
            f.append('images', img)
        }
        setPhoto(f)
    }



    const getUsers = async () => {
        try {
            const { data } = await axios.get('http://localhost:3033/user/get', { headers: headers });
            if (data) {
                setUser([])
                for (let i = 0; i < data.data?.length; i++) {
                    if (data.data[i].role == 'RECYCLER') {
                        setUser(user => user.concat(data.data[i]))
                    }
                }
            }
        } catch (err) {
            console.log(err);
            Swal.fire(err.response.data.message, '', 'error')
        }

    }


    const add = async (e) => {
        try {
            const { data } = await axios.post('http://localhost:3033/recycler/add', form, { headers: headers })
            if (data.recycler) {
                if (!photo) {
                    Swal.fire({
                        title: 'Recycler added without photo',
                        text: `Recycler "${data.recycler.name}" was successfully added`,
                        icon: 'warning',
                        timer: 2000,
                        showConfirmButton: false
                    })
                    navigate('/master/recyclerview')
                }
                if (photo) await axios.put(`http://localhost:3033/recycler/uploadImage/${data.recycler._id}`, photo, {
                    headers: { 'Content-Type': 'multipart/form-data', 'Authorization': localStorage.getItem('token') }
                })


                Swal.fire({
                    title: 'Recycler added',
                    text: `Recycler "${data.recycler.name}" was successfully added`,
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                })
                navigate('/master/recyclerview')
            }
        } catch (err) {
            console.log(err);
            Swal.fire(err.response?.data.message, '', 'error')
        }
    }

    useEffect(() => {
        getUsers()
    }, [])

    return (
        <div className="main-content">
            <div className="container">

                <div style={{ backgroundColor: '#44AF41', borderRadius: '15px' }} className='sticky-top text-white mb-4'>

                    <h1 className='h1TE text-center'>Add Recycler</h1>

                </div>

                <div className="row justify-content-center">
                    <div className="col-sm-9 col-md-9 col-lg-9">
                        <div className="hotel-card bg-white rounded-lg shadow-lg overflow-hidden  d-lg-flex">
                            <div className="hotel-card_info p-4">
                                <h1 className='text-center'>Recycler Information</h1>

                                <div className=" align-items-center mb-2">

                                    <h5 className="mr-2 mt-3">Name</h5>
                                    <input onChange={handleForm} name='name' type="text" className="form-control" />

                                    <h5 className="mr-2 mt-3">Address</h5>
                                    <input onChange={handleForm} name='direction' type="text" className="form-control" />

                                    <h5 className="mr-2 mt-3">Phone</h5>
                                    <input onChange={handleForm} name='phone' type="text" className="form-control" />

                                    <h5 className="mr-2 mt-3">Email</h5>
                                    <input onChange={handleForm} id='email' name='email' type="text" className="form-control" />

                                    <h5 className="mr-2 mt-3">Open Hour</h5>
                                    <input onChange={handleForm} name='startHour' type="number" className="form-control" />

                                    <h5 className="mr-2 mt-3">Close Hour</h5>
                                    <input onChange={handleForm} name='endHour' type="number" className="form-control" />

                                    <h5 className=" mr-2 mt-3">User</h5>
                                    <select onChange={handleSelect} name='user' className='form-select'>
                                        <option value="Null">Select an user</option>
                                        {
                                            user.map(({ id, name, surname }, i) => {
                                                return (
                                                    <option value={id} key={i}>{name}{' '}{surname}</option>
                                                )
                                            })
                                        }

                                    </select>

                                    <h5 className="mr-2 mt-3">Photo</h5>
                                    <input onChange={handlePhoto} multiple accept='image/png, image/jpg, image/jpeg' name='images' type="file" className="form-control" />




                                </div>
                                <button onClick={(e) => { e.preventDefault(); add() }} className="btn btn-success me-1 mt-4">Add User</button>
                                <Link to={'/master/recyclerview'} >
                                    <button className="btn btn-danger me-1 mt-4">Cancel</button>
                                </Link>

                            </div>
                        </div>
                    </div>
                </div>



            </div>
        </div>
    )
}
