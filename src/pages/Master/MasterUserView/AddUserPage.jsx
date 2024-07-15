import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import '../MasterUserView/user.css'
import { Link, useNavigate } from 'react-router-dom'

export const AddUserPage = () => {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        name: '',
        surname: '',
        phone: '',
        email: '',
        username: '',
        password: '',
        role: '',
        range: ''
    })
    const [range, setRange] = useState([])
    const [photo, setPhoto] = useState()
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
        let formData = new FormData()
        formData.append('image', e.target.files[0])
        setPhoto(formData)
    }

    const getRanges = async () =>{
        try {
            const { data } = await axios.get(`http://localhost:3033/range/get`, {headers: headers})
            setRange([])
            for(let i=0; i< data.range?.length;i++){
                if(data.range[i].name != 'ADMIN')
                setRange(range =>range.concat([data.range[i]]))
            }
        } catch (err) {
            console.log(err)
            Swal.fire(err.response.data.message, '', 'error')
        }
    }

    const add = async (e) => {
        try {
            const { data } = await axios.post('http://localhost:3033/user/save', form, { headers: headers })
            

            if (data.user) {
                if (photo) await axios.put(`http://localhost:3033/user/uploadImg/${data.user._id}`, photo, {
                    headers: { 'Content-Type': 'multipart/form-data', 'Authorization': localStorage.getItem('token') }
                })
                Swal.fire({
                    title: 'User added',
                    text: `User "${data.user.username}" was successfully added`,
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                })
                navigate('/master/users')
            }

        } catch (err) {
            Swal.fire(err.response.data.message, '', 'error')
            console.error(err)
        }
    }

    useEffect(() => {
      getRanges()
    }, [])
    

    return (
        <div className="main-content">
            <div className="container">

                <div style={{ backgroundColor: '#44AF41', borderRadius: '15px' }} className='sticky-top text-white mb-4'>

                    <h1 className='h1TE text-center'>Add User</h1>

                </div>

                <div className="row justify-content-center">
                    <div className="col-sm-9 col-md-9 col-lg-9">
                        <div className="hotel-card bg-white rounded-lg shadow-lg overflow-hidden  d-lg-flex">
                            <div className="hotel-card_info p-4">
                                <h1 className='text-center'>User Information</h1>

                                <div className=" align-items-center mb-2">

                                    <h5 className="mr-2 mt-3">Name</h5>
                                    <input onChange={handleForm} name='name' type="text" className="form-control" />

                                    <h5 className="mr-2 mt-3">Surname</h5>
                                    <input onChange={handleForm} name='surname' type="text" className="form-control" />

                                    <h5 className="mr-2 mt-3">Phone</h5>
                                    <input onChange={handleForm} name='phone' type="text" className="form-control" />

                                    <h5 className="mr-2 mt-3">Email</h5>
                                    <input onChange={handleForm} name='email' type="text" className="form-control" />

                                    <h5 className="mr-2 mt-3">Username</h5>
                                    <input onChange={handleForm} name='username' type="text" className="form-control" />

                                    <h5 className="mr-2 mt-3">Password</h5>
                                    <input onChange={handleForm} name='password' type="password" className="form-control" />

                                    <h5 className=" mr-2 mt-3">Role</h5>
                                    <select onChange={handleSelect} name='role' className='form-select'>
                                        <option value={'MASTER'}>MASTER</option>
                                        <option value={'PARTNER'}>PARTNER</option>
                                        <option value={'RECYCLER'}>RECYCLER</option>
                                        <option value={'CLIENT'}>CLIENT</option>

                                    </select>
                                    {
                                        form.role == 'CLIENT' ? (
                                            <>
                                                <h5 className=" mr-2 mt-3">Range</h5>
                                                <select onChange={handleSelect} name='range' className='form-select'>
                                                <option value='NULL'>{'CHANGE THE RANGE'}</option>
                                                {
                                                        range.map(({_id, name}, i)=>{
                                                            return(
                                                                <option value={_id} key={i}>{name}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </>
                                        ) : (
                                            <></>
                                        )
                                    }

                                    <h5 className="mr-2 mt-3">Photo</h5>
                                    <input onChange={handlePhoto} name='photo' type="file" className="form-control" />




                                </div>
                                <button onClick={(e) => { e.preventDefault(); add() }} className="btn btn-success me-1 mt-4">Add User</button>
                                <Link to={'/master/users'} >
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
