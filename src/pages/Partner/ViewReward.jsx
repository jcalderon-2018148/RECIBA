import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { AuthContext } from '../../index'
import { useNavigate } from 'react-router-dom'
import { CardRewardOnly } from '../../components/rewards/CardRewardOnly'

export const ViewReward = () => {
   /*Obtener datos y crear los necesarios */
  const [rewards, setRewards] = useState()
  const navigate = useNavigate()
  const { dataUser } = useContext(AuthContext)
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('token')
  }
  /*obtener las rewards*/
  const getRewards = async () => {
    try {
      const idUserPartner = dataUser.id
      const findPartner = await axios(`http://localhost:3033/partner/getByUser/${idUserPartner}`, {headers: headers})
      const { data } = await axios.get(`http://localhost:3033/reward/getByPartner/${findPartner?.data.partner._id}`, { headers: headers })
      console.log(data.rewards);
      if (data) {
        setRewards(data.rewards)
      }
    } catch (err) {
      console.error(err);
      Swal.fire(err.response.data.message, '', 'error')
      /* navigate('/partner/addReward') */
    }
  }
  /*Eliminar reward */
  const delRewats = async (id) => {
    try {
      const { data } = await axios.delete(`http://localhost:3033/reward/delete/${id}`, { headers: headers })
      getRewards()
      Swal.fire({
        title: 'Deleted',
        text: `Reward "${data?.deleteReward.name}" was successfully deleted`,
        icon: 'success'
      })
    } catch (err) {
      console.error(err);
      Swal.fire(err.response.data.message, '', 'error')
    }
  }

  useEffect(() => {
    getRewards()
  }, [])

  return (
    <>
      <div className='container'>
        <div className='mt-5'>
          <h1 className='text-success'>Rewards</h1>
        </div>

        <hr className='mb-5' />

        <div className='row row-cols-1 row-cols-md-2 g-4 text-center mb-5'>
          {
            rewards?.map(({ name, description, range, cantPoints, partner, photo, _id }, index) => {
              return (
                <CardRewardOnly
                  id={_id}
                  name={name}
                  desc={description}
                  range={range.name}
                  cantPoints={cantPoints}
                  partner={partner}
                  photo={photo}
                  key={index}
                  reload={() => delRewats(_id)}
                />
              )
            })
          }
        </div>
      </div>
    </>
  )
}
