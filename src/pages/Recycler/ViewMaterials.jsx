import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { CadMaterial } from '../../components/material/CadMaterial'
import { CartMaterialRecycler } from '../../components/material/CardMaterialRecycler';

export const ViewMaterials = () => {

    const [materials, setMaterials] = useState([{}])
    const localUser = JSON.parse(localStorage.getItem('user'))

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
    };

    const getMaterials = async () => {
        try {

            const userData = await axios(`http://localhost:3033/user/getByUsername/${localUser.username}`, { headers: headers })
            const recyclerData = await axios(`http://localhost:3033/recycler/getByUser/${userData.data.data[0].id}`, { headers: headers })
            const { data } = await axios(`http://localhost:3033/material/getRecMaterials/${recyclerData.data.recycler._id}`, { headers: headers })

            /* for(let i = 0; i < data.materials?.length; i++){
                if(data.materials[i].photo) {
                    let img = await axios(`http://localhost:3033/material/getImage/${data.materials[i].photo}`, {headers: headers})
                    data.materials[i].photo = img.request.responseURL
                }
                continue
            } */

            setMaterials(data.materials)

        } catch (err) {
            Swal.fire(err.response.data.message, '', 'error');
            console.error(err);
        }
    }

    const deleteMaterial = async (id) => {
        try {
            Swal.fire({
                title: 'Are you sure to delete this material?',
                icon: 'question',
                showConfirmButton: true,
                showDenyButton: true,
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const { data } = await axios.delete(`http://localhost:3033/material/delete/${id}`, { headers: headers }).catch((err) => {
                        Swal.fire(err.response.data.message, '', 'error')
                    })
                    console.log(data)
                    getMaterials()
                    Swal.fire(`${data.message}`, '', 'success')
                } else {
                    Swal.fire('No worries!', '', 'success')
                }
            })
        } catch (err) {
            Swal.fire(err.response.data.message, '', 'error');
            console.error(err);
        }
    }

    const [searchTerm, setSearchTerm] = useState('')

    const filteredMaterials = materials.filter((m)=>
        m.type?.toLowerCase().includes(searchTerm.toLowerCase())
    )


    useEffect(() => {
        getMaterials()
    }, [])


    return (
        <>
            <div className="card mb-4">
                <div className="card-body">

                    <div className='row'>

                        <div className='col-md-8'>
                            <div className="input-group mb-8">
                                <span className="bi bi-search input-group-text" id="basic-addon1"></span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className='col-md-4'>
                            <div className="input-group mb-4">
                                <span className="bi bi-funnel input-group-text" id="basic-addon1"></span>
                                <select className="form-select" id="selectOption" /* onChange={handleSelect} */>
                                    <option value={null}>FILTER</option>
                                    <option value="user">User</option>
                                    <option value="recycler">Recycler</option>
                                    <option value="paymethod">Pay Method</option>
                                </select>
                            </div>
                        </div>



                    </div>

                    <div className='row row-cols-1 row-cols-md-2 g-4 text-center'>
                        {
                            filteredMaterials?.map(({ _id, type, price, unit, recycle, photo }, index) => (

                                <CartMaterialRecycler
                                    key={index}
                                    _id={_id}
                                    type={type}
                                    price={price}
                                    unit={unit}
                                    photo={photo}
                                    recycle={recycle}
                                    butDel={()=>deleteMaterial(_id)}
                                />

                            ))
                        }
                    </div>


                </div>
            </div>


            {/* <CadMaterial/> */}
        </>
    )
}
