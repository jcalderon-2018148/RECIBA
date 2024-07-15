import React, { useEffect, useState } from 'react'
import { TableUsers } from '../../../components/master/user/TableUsers'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import Swal from 'sweetalert2'

export const UserPage = () => {
    const [user, setUser] = useState([{}])
    const [searchTerm, setSearchTerm] = useState('')
    const [select, setSelect] = useState('')
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
    }
    const navigate = useNavigate()

    const handleSelect = (e) => {
        setSelect(e.target.value)
    }

    const getUsers = async () => {
        try {
            const { data } = await axios('http://localhost:3033/user/get', { headers: headers })

            if (data) {
                for (let i = 0; i < data.data.length; i++) {
                    if (data.data[i].photo) {
                        let img = await axios(`http://localhost:3033/user/getImg/${data.data[i].photo}`, { headers: headers })
                        data.data[i].photo = img.request.responseURL
                    }
                    continue
                }
            }
            setUser(data.data)

        } catch (err) {
            Swal.fire(err.response.data.message, '', 'error')
            console.error(err)
        }
    }

    const del = async (id) => {
        try {
            Swal.fire({
                title: 'Are you sure to delete this user?',
                icon: 'question',
                showConfirmButton: true,
                showDenyButton: true,
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const { data } = await axios.delete(`http://localhost:3033/user/delete/${id}`, { headers: headers }).catch((err) => {
                        Swal.fire(err.response.data.message, '', 'error')
                    })
                    getUsers()
                    Swal.fire(`${data.message}`, '', 'success')
                } else {
                    Swal.fire('No worries!', '', 'success')
                }
            })
        } catch (err) {
            Swal.fire(err.response.data.message, '', 'error')
        }
    }



    useEffect(() => {
        getUsers()
    }, [])

    const filteredUsers = user.filter((u) =>
        select === 'name' ? (
            u.name?.toLowerCase().includes(searchTerm.toLowerCase())
        ) : (
            select === 'role' ? (
                u.role?.toUpperCase().includes(searchTerm.toUpperCase())
            ) : (
                u.surname?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
    )

    return (
        <div className="main-content">
            <div className="container">

                <div style={{ backgroundColor: '#44AF41', borderRadius: '15px' }} className='sticky-top text-white'>

                    <h1 className='h1TE text-center'>Users</h1>

                </div>

                <div className='row justify-content-start mb-4 mt-3'>

                    <div className='col-md-5'>

                        <select onChange={handleSelect} id='selectOption' name="state" className='form-select'>

                            <option value={null}>FILTER</option>
                            <option value='role'>ROLE</option>
                            <option value='name'>NAME</option>

                        </select>

                    </div>

                    <div className='col-md-7'>
                        <input type="text"
                            placeholder='Search'
                            className='form-control'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>


                </div>
                <div className="row  mt-2">
                    <div className="col d-flex justify-content-center  col-md-8">
                        <div className="w-75">
                            <table className="table table-hover table-light table-responsive-xxl ">
                                <thead className="table-active">
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Username</th>
                                        <th scope="col">Phone</th>
                                        <th scope="col">Role</th>
                                        <th scope="col">Options</th>
                                    </tr>
                                </thead>

                                {
                                    filteredUsers.map(({ name, surname, phone, username, photo, id, role }, index) => {

                                        return (
                                            <TableUsers
                                                key={index}
                                                name={name}
                                                surname={surname}
                                                phone={phone}
                                                username={username}
                                                photo={photo}
                                                id={id}
                                                role={role}
                                                butDel={() => del(id)}
                                            />
                                        )

                                    })
                                }
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
