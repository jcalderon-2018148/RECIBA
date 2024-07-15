import React, { useContext, useEffect, useState } from 'react'
import '../Master/MasterUserView/user.css'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../index'
import Swal from 'sweetalert2'
import axios from 'axios'

export const AddReward = () => {
  /*Obtener datos y crear los necesarios */
  const { id } = useParams()
  const { dataUser } = useContext(AuthContext)
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    description: '',
    partner: id,
    range: '',
    cantPoints: ''
  })
  const [range, setRange] = useState([])
  const [photo, setPhoto] = useState()
  const [partner, setPartner] = useState()
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('token')
  }
  /*metodo para cambiar escritura del form*/
  const handleForm = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }
  /*metodo para cambiar select del form*/
  const handleSelect = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.options[e.target.selectedIndex].value
    })
  }
  /*metodo para cambiar foto del form*/
  const handlePhoto = (e) => {
    let formData = new FormData()
    formData.append('image', e.target.files[0])
    setPhoto(formData)
  }
  /*metodo para obtener rango y cambiarlo*/
  const getRanges = async () => {
    try {
      const { data } = await axios.get(`http://localhost:3033/range/get`, { headers: headers })
      setRange(data.range)
    } catch (err) {
      console.log(err)
      Swal.fire(err.response.data.message, '', 'error')
    }
  }
  /*Metodo para agregar reward */
  const addReward = async () => {
    try {
      const idUserPartner = dataUser.id
      const findPartner = await axios(`http://localhost:3033/partner/getByUser/${idUserPartner}`, {headers: headers})
      console.log(findPartner.data.partner._id);
      setForm({
        ...form,
        'partner': findPartner?.data.partner._id
      })
      console.log(form);

      const { data } = await axios.post('http://localhost:3033/reward/add', form, { headers: headers })
      if (data.reward) {
        if (photo) {
          await axios.put(`http://localhost:3033/reward/uploadImage/${data.reward._id}`, photo,
            { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': localStorage.getItem('token') } })
        }
        Swal.fire({
          title: 'Added',
          text: `Reward "${data.reward.name}" was successfully added`,
          icon: 'success'
        })
        navigate(`/${id? `master/partnerView/${id}` : '/partner/viewReward'}`)
      }
    } catch (err) {
      console.error(err);
      Swal.fire(err.response.data?.message, '', 'error')
    }
  }

  useEffect(() => {
    getRanges()
  }, [])

  useEffect(() => {
    setForm({
      ...form,
      'range': range[0]?._id,
    })
  }, [range])

  return (
    <div className="main-content">
      <div className="container">

        <div style={{ backgroundColor: '#44AF41', borderRadius: '15px' }} className='sticky-top text-white mb-4'>

          <h1 className='h1TE text-center'>Add Reward</h1>

        </div>

        <div className="row justify-content-center">
          <div className="col-sm-9 col-md-9 col-lg-9">
            <div className="hotel-card bg-white rounded-lg shadow-lg overflow-hidden  d-lg-flex">
              <div className="hotel-card_info p-4">
                <h1 className='text-center'>Reward Information</h1>

                <div className=" align-items-center mb-2">

                  <h5 className="mr-2 mt-3">Name</h5>
                  <input onChange={handleForm} name='name' type="text" className="form-control" />

                  <h5 className="mr-2 mt-3">Description</h5>
                  <input onChange={handleForm} name='description' type="text" className="form-control" />
                  {
                    id ?
                      (<>
                        <h5 className="mr-2 mt-3">Partner</h5>
                        <input onChange={handleForm} defaultValue={id} name='partner' type="text" className="form-control" disabled readOnly/>
                      </>) :
                      (<></>)
                  }
                  <h5 className=" mr-2 mt-3">Range</h5>
                  <select onChange={handleSelect} name='range' className='form-select'>
                    {
                      range.map(({ _id, name }, index) => {
                        return (
                          <option value={_id} key={index}>{name}</option>
                        )
                      })
                    }
                  </select>

                  <h5 className="mr-2 mt-3">Number of points</h5>
                  <input onChange={handleForm} name='cantPoints' type="number" className="form-control" />



                  <h5 className="mr-2 mt-3">Photo</h5>
                  <input onChange={handlePhoto} name='photo' type="file" className="form-control" />

                </div>
                <button onClick={(e) => { addReward() }} className="btn btn-success me-1 mt-4">Add Reward</button>
                <Link to={`/${id? `master/partnerView/${id}` : 'partner/viewReward' }`} >
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
