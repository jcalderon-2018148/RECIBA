import { useEffect, useState } from 'react'
import { ModalUsers } from './ModalUsers';
import React from 'react'
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'

export const TableUsers = ({ name, surname, username, photo, phone, id, role, butDel }) => {


    return (
        <>
            <tbody>
                <tr>
                    <th>{name}{" "}{surname}</th>
                    <th>{username}</th>
                    <td>{phone}</td>
                    <td>{role}</td>
                    <td>
                        <div className='justify-content-center position-static'>
                            <button type="button" className='btn' data-bs-toggle="modal" data-bs-target={`#modalUs${id}`}>
                                <lord-icon
                                    src={"https://cdn.lordicon.com/bhfjfgqz.json"}
                                    trigger="hover"
                                    colors="primary:#2C712A"
                                    style={{ width: '25px', height: '25px' }}>
                                </lord-icon>

                            </button>
                            <Link to={`/master/updateUser/${id}`}>
                                <button className='btn border-0 '>
                                    <lord-icon
                                        src="https://cdn.lordicon.com/wloilxuq.json"
                                        trigger="hover"
                                        stroke="100"
                                        colors="primary:#2C712A,secondary:#2C712A"
                                        style={{ width: '25px', height: '25px', color: '#2C712A' }}>
                                    </lord-icon>
                                </button>
                            </Link>
                            {
                                role == 'MASTER' ? (
                                    <></>
                                ) : (

                                    <button onClick={(e) => { e.preventDefault(), butDel(id) }} className='btn border-0 '>
                                        <i className="fa-sharp fa-solid fa-trash "
                                            trigger="hover"
                                            style={{ width: '25px', height: '25px', color: '#2C712A' }}>
                                        </i>
                                    </button>
                                )
                            }
                        </div>

                        <ModalUsers
                            photo={photo}
                            id={id}
                        />
                        {/*
                            user.map((user, index) => {
                                console.log({user})
                                return(
                                )
                            })
                        */}

                    </td>
                </tr>

            </tbody>

        </>
    )
}
