import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import '../MasterUserView/user.css'
import axios from 'axios'
import Swal from 'sweetalert2'

export const UpdatePartner = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [user, setUser] = useState([])
  const [partner, setPartner] = useState({})
  const [photo, setPhoto] = useState()
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('token')
  }


  const handlePhoto = (e) => {
    let formData = new FormData()
    for (let img of e.target.files) {
      formData.append('image', img)
    }
    setPhoto(formData)
  }


  const getPartner = async () => {
    try {
      const { data } = await axios.get(`http://localhost:3033/partner/get/${id}`, { headers: headers })
      let dU = data
      if (dU.partner) {
        setPartner(dU.partner)
        const { data } = await axios.get(`http://localhost:3033/user/get/${dU.partner.admin}`, { headers: headers });
        setUser(`${data.data[0].name} ${data.data[0].surname}`)
      }

    } catch (err) {
      console.log(err)
    }
  }


  const update = async () => {
    try {
      let form = {
        name: document.getElementById('name').value,
        address: document.getElementById('address').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value
      }

      const { data } = await axios.put(`http://localhost:3033/partner/update/${id}`, form, { headers: headers })

      if (data.partner) {
        if (!photo) {
          Swal.fire({
              title: 'Partner added without photo',
              text: `Recycler "${data.partner.name}" was successfully added`,
              icon: 'warning',
              timer: 2000,
              showConfirmButton: false
          })
          navigate('/master/partnerView')
      }
      if (photo) await axios.put(`http://localhost:3033/partner/uploadImage/${id}`, photo, {
          headers: { 'Content-Type': 'multipart/form-data', 'Authorization': localStorage.getItem('token') }
      })
        Swal.fire({
          title: 'Partner updated!',
          text: `Partner "${data.partner.name}" was updated!`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })
        navigate('/master/partnerView')
      }
    } catch (err) {
      Swal.fire(err.response?.data.message, '', 'error')
      console.error(err)
    }
  }

  useEffect(() => {
    getPartner()
  }, [])
  return (
    <div className="main-content">
      <div className="container">

        <div style={{ backgroundColor: '#44AF41', borderRadius: '15px' }} className='sticky-top text-white mb-4'>

          <h1 className='h1TE text-center'>Update Partner</h1>

        </div>

        <div className="row justify-content-center">
          <div className="col-sm-9 col-md-9 col-lg-9">
            <div className="hotel-card bg-white rounded-lg shadow-lg overflow-hidden d-block d-lg-flex">
              <div className="hotel-card_info p-4">
                <h1 className='text-center'>Partner Information</h1>

                <div className=" align-items-center mb-2">

                  <h5 className="mr-2 mt-3">Name</h5>
                  <input defaultValue={partner.name} name='name' id='name' type="text" className="form-control" />

                  <h5 className="mr-2 mt-3">Address</h5>
                  <input defaultValue={partner.address} name='address' id='address' type="text" className="form-control" />

                  <h5 className="mr-2 mt-3">Phone</h5>
                  <input defaultValue={partner.phone} name='phone' id='phone' type="text" className="form-control" />

                  <h5 className="mr-2 mt-3">Email</h5>
                  <input defaultValue={partner.email} name='email' id='email' type="text" className="form-control" />

                  
                  <h5 className="mr-2 mt-3">User</h5>
                  <input defaultValue={user} name='user' id='user' type="text" className="form-control" disabled readOnly />


                  <h5 className="mr-2 mt-3">Photo</h5>
                  <input onChange={(e) => handlePhoto(e)} name='image' type="file" className="form-control" multiple accept='image/png, image/jpg, image/jpeg' />




                </div>

                <button onClick={update} className="btn btn-primary me-1 mt-4">Save Changes</button>
                <button onClick={() => { navigate('/master/partnerView') }} className="btn btn-danger me-1 mt-4">Cancel</button>

              </div>
            </div>
          </div>
        </div>



      </div>
    </div>
  )
}
