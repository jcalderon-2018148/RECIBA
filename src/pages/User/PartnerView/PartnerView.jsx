import axios from 'axios'
import React, { useEffect, useState, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import { CardReward } from '../../../components/rewards/CardReward'
import { AuthContext } from '../../../index'

export const PartnerView = () => {
  const { dataUser } = useContext(AuthContext)
  const { id } = useParams()
  const [partner, setPartner] = useState()
  const [rewards, setRewards] = useState()
  const [user, setUser] = useState()

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('token')
  }



  const getPartner = async () => {
    try {
      const { data } = await axios(`http://localhost:3033/partner/get/${id}`, { headers: headers })

      if (data) return setPartner(data.partner)

    } catch (err) {
      console.error(err)
      Swal.fire(err.response.data.message, '', 'error')
    }
  }

  const getRewards = async () => {
    try {
      const { data } = await axios(`http://localhost:3033/reward/getByPartner/${id}`, { headers: headers })
      if (data) return setRewards(data.rewards)

    } catch (err) {
      console.error(err)
      Swal.fire(err.response.data.message, '', 'error')
    }
  }

  const del= async(id) =>{
    try {
        Swal.fire({
            title: 'Are you sure to delet this reward?',
            icon: 'question',
            showConfirmButton: true,
            showDenyButton: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { data } = await axios.delete(`http://localhost:3033/reward/delete/${id}`, { headers: headers })
                    .catch((err) => {
                        Swal.fire(err.response.data.message, '', 'error')
                    })
                getRewards()
                Swal.fire(`${data.message}`, '', 'success')
            } else {
                Swal.fire('No worries', '', 'success')
            }
        })
    } catch (err) {
        console.log(err);
        Swal.fire(err.response.data.message, '', 'error')
    }
}

  useEffect(() => {
    getPartner()
    getRewards()
  }, [])


  return (
    <>
      <div className='container mt-3'>
        <div className='row align-items-center shadow rounded-5'>
          <div className='col-sm-6 p-0'>
            <img
              src={`http://localhost:3033/partner/getImage/${partner?.photo}`}
              crossOrigin='anonymous'
              className='img-fluid rounded-5 shadow-lg'
              style={{ objectFit: 'cover', width: '100%', height: '50vh' }}
            />
          </div>

          <div className='col-sm-6 p-5'>
            <h1>{partner?.name}</h1>
            <h2><span className="badge bg-success rounded-pill">Info</span></h2>
            <h3>Address</h3>
            <h6>{partner?.address}</h6>
            <br />
            <h3>Email</h3>
            <h6>{partner?.email}</h6>
            <br />
            <h3>Phone</h3>
            <h6>{partner?.phone}</h6>
          </div>
        </div>
      </div>

      {/* Rewards */}
      <div className='container my-5'>
        <div className='row align-items-center'>

          <h1 className='mb-5 col py-1 px-4 text-success'>
            Rewards available
          </h1>

          <div className='mb-5 col-auto text-center text-light'>

            <br />
            <h6 className='bg-danger rounded-pill py-1 px-3'>
              {rewards?.length}{' '}Available
            </h6>
          </div>
        </div>

        <div className='row row-cols-1 row-cols-md-2 g-4 text-center'>
          {
            rewards?.map(({ name, description, partner, range, cantPoints, photo, _id }, index) => {
              return (
                <CardReward
                  id={_id}
                  name={name}
                  desc={description}
                  range={range}
                  cantPoints={cantPoints}
                  photo={photo}
                  partner={partner}
                  key={index}
                  butDel={() => del(_id)}
                />
              )
            })
          }
        </div>
      </div>
    </>
  )
}
