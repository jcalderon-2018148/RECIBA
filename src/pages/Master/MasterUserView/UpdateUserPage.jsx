import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import '../MasterUserView/user.css'
import axios from 'axios'
import Swal from 'sweetalert2'

export const UpdateUserPage = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [user, setUser] = useState({})
    const [range, setRange] = useState([])
    const [selectRole, setSelectRole] = useState()
    const [selectRange, setSelectRange] = useState()
    const [photo, setPhoto] = useState()
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
    }

    const handleSelect = (e) => {
        setSelectRole(e.target.options[e.target.selectedIndex].value)
    }

    const handleSelectRange = (e) => {
        setSelectRange(e.target.options[e.target.selectedIndex].value)

    }
    const handlePhoto = (e) => {
        let formData = new FormData()
        formData.append('image', e.target.files[0])
        setPhoto(formData)
    }

    const getUser = async () => {
        try {
            const { data } = await axios.get(`http://localhost:3033/user/get/${id}`, { headers: headers })
            if (data.data) {
                setUser(data.data[0])
                setSelectRole(data.data[0].role)
                document.getElementById('role').value = data.data[0].role
                if (data.data[0].range) {
                    setSelectRange(data.data[0].range)
                    const r = data.data[0].range
                    document.getElementById('range').value = r
                }
            }

        } catch (err) {
            console.log(err)
        }
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

    const update = async () => {
        try {
            let form = {
                name: document.getElementById('name').value,
                surname: document.getElementById('surname').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                username: document.getElementById('username').value,
                role: selectRole,
                range: selectRange
            }
        
            const { data } = await axios.put(`http://localhost:3033/user/update/${id}`, form, { headers: headers })

            if (data.user) {
                if (photo) await axios.put(`http://localhost:3033/user/uploadImg/${id}`, photo, {
                    headers: { 'Content-type': 'multipart/form-data', 'Authorization': localStorage.getItem('token') }
                })
                Swal.fire({
                    title: 'User updated!',
                    text: `User "${data.user.username}" was updated!`,
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
        getUser()
    }, [])




    return (
        <div className="main-content">
            <div className="container">

                <div style={{ backgroundColor: '#44AF41', borderRadius: '15px' }} className='sticky-top text-white mb-4'>

                    <h1 className='h1TE text-center'>Update User</h1>

                </div>

                <div className="row justify-content-center">
                    <div className="col-sm-9 col-md-9 col-lg-9">
                        <div className="hotel-card bg-white rounded-lg shadow-lg overflow-hidden d-block d-lg-flex">
                            <div className="hotel-card_info p-4">
                                <h1 className='text-center'>User Information</h1>

                                <div className=" align-items-center mb-2">

                                    <h5 className="mr-2 mt-3">Name</h5>
                                    <input defaultValue={user.name} name='name' id='name' type="text" className="form-control" />

                                    <h5 className="mr-2 mt-3">Surname</h5>
                                    <input defaultValue={user.surname} name='surname' id='surname' type="text" className="form-control" />

                                    <h5 className="mr-2 mt-3">Phone</h5>
                                    <input defaultValue={user.phone} name='phone' id='phone' type="text" className="form-control" />

                                    <h5 className="mr-2 mt-3">Email</h5>
                                    <input defaultValue={user.email} name='email' id='email' type="text" className="form-control" />

                                    <h5 className="mr-2 mt-3">Username</h5>
                                    <input defaultValue={user.username} name='username' id='username' type="text" className="form-control" />

                                    <h5 className="mr-2 mt-3">Role</h5>
                                    {
                                        user.role == 'MASTER' ? (
                                            <></>
                                        ) : (
                                            <>
                                                <select onChange={handleSelect} defaultValue={user.role} name='role' id='role' className='form-select'>

                                                    <option value={'MASTER'}>MASTER</option>
                                                    <option value={'PARTNER'}>PARTNER</option>
                                                    <option value={'RECYCLER'}>RECYCLER</option>
                                                    <option value={'CLIENT'}>CLIENT</option>

                                                </select>
                                            </>
                                        )
                                    }

                                    {
                                        selectRole == 'CLIENT' ? (
                                            <>

                                                <h5 className="mr-2 mt-3">Range</h5>
                                                <select onChange={handleSelectRange} defaultValue={user.range} name='range' id='range' className='form-select'>
                                                    <option value='NULL'>{'CHANGE THE RANGE'}</option>
                                                    {
                                                        range.map(({ _id, name }, i) => {
                                                            return (
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
                                    <input onChange={handlePhoto} type="file" className="form-control" />




                                </div>

                                <button onClick={update} className="btn btn-primary me-1 mt-4">Save Changes</button>
                                <button onClick={() => { navigate('/master/users') }} className="btn btn-danger me-1 mt-4">Cancel</button>

                            </div>
                        </div>
                    </div>
                </div>



            </div>
        </div>
    )
}
