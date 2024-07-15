import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../index'
import axios from 'axios'
import Swal from 'sweetalert2'

export const EditReward = () => {
   /*Obtener datos y crear los necesarios */
  const { id } = useParams()
  const { dataUser } = useContext(AuthContext)
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    description: '',
    partner: '',
    range: '',
    cantPoints: ''
  })
  const [reward,setReward] = useState()
  const [range, setRange] = useState([])
  const [photo, setPhoto] = useState()
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
  /*Metodo para obtener la reward */
  const getReward = async () => {
    try {
      const { data } = await axios.get(`http://localhost:3033/reward/getOne/${id}`, { headers: headers })
      setReward(data.reward)
    } catch (err) {
      console.log(err)
      Swal.fire(err.response.data.message, '', 'error')
    }
  }
  /*Metodo para obtener rango */
  const getRanges = async () => {
    try {
      const { data } = await axios.get(`http://localhost:3033/range/get`, { headers: headers })
      setRange(data.range)
    } catch (err) {
      console.log(err)
      Swal.fire(err.response.data.message, '', 'error')
    }
  }
  /*Metodo para editar */
  const editReward = async () => {
    try {
      
      const { data } = await axios.put(`http://localhost:3033/reward/update/${id}`, form, { headers: headers })
      if (data.reward) {
        if (photo) {
          await axios.put(`http://localhost:3033/reward/uploadImage/${data.reward._id}`, photo,
            { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': localStorage.getItem('token') } })
        }
      }
      Swal.fire({
        title: 'Edit',
        text: `Reward was successfully updated`,
        icon: 'success'
      })
      navigate('/partner/viewReward')
    } catch (err) {
      console.error(err);
      Swal.fire(err.response.data?.message, '', 'error')
    }
  }

  useEffect(() => {
    getRanges()
    getReward()
  }, [])
  
  useEffect(()=>{
    document.getElementById('range').value = reward?.range._id
    setForm({
      ...form,
      'name':reward?.name,
      'description':reward?.description,
      'cantPoints':reward?.cantPoints,
      'range':reward?.range._id
    })
  },[reward])

  useEffect(()=>{
    console.log(form);
  },[form])

  return (
    <div className="main-content">
      <div className="container">

        <div style={{ backgroundColor: '#44AF41', borderRadius: '15px' }} className='sticky-top text-white mb-4'>

          <h1 className='h1TE text-center'>Update Reward</h1>

        </div>

        <div className="row justify-content-center">
          <div className="col-sm-9 col-md-9 col-lg-9">
            <div className="hotel-card bg-white rounded-lg shadow-lg overflow-hidden  d-lg-flex">
              <div className="hotel-card_info p-4">
                <h1 className='text-center'>Reward Information</h1>

                <div className=" align-items-center mb-2">

                  <h5 className="mr-2 mt-3">Name</h5>
                  <input onChange={handleForm} name='name' defaultValue={reward?.name} id='name' type="text" className="form-control" />

                  <h5 className="mr-2 mt-3">Description</h5>
                  <input onChange={handleForm} name='description' defaultValue={reward?.description} id='description' type="text" className="form-control" />

                  <h5 className=" mr-2 mt-3">Range</h5>
                  <select onChange={handleSelect} name='range' defaultValue={reward?.range._id} id='range' className='form-select'>
                    {
                      range.map(({ _id, name }, index) => {
                        return (
                          <option value={_id} key={index}>{name}</option>
                        )
                      })
                    }
                  </select>

                  <h5 className="mr-2 mt-3">Number of points</h5>
                  <input onChange={handleForm} name='cantPoints' defaultValue={reward?.cantPoints} id='cantPoints' type="number" className="form-control" />



                  <h5 className="mr-2 mt-3">Photo</h5>
                  <input onChange={handlePhoto} name='photo' type="file" className="form-control" />

                </div>
                <button onClick={() => { editReward() }} className="btn btn-success me-1 mt-4">Save Changes</button>
                <Link to={'/partner/viewReward'} >
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
