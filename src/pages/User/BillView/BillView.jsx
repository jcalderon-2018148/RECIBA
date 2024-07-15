import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../..'
import Swal from 'sweetalert2'
import axios from 'axios'
import { CardBill } from '../../../components/bill/CardBill'

const HOST = Object.freeze({ url: 'http://localhost:3033' })

export const BillView = () => {
  const [bills, setBills] = useState()

  const { dataUser } = useContext(AuthContext)

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('token')
  }

  const getBills = async () => {
    try {
      const { data } = await axios(`${HOST.url}/bill/getOwn`, { headers: headers })

      if (data) {
        console.log(data);
        return setBills(data.bills)
      }
      
    } catch (err) {
      console.error(err)
      Swal.fire(err.response.data.message, '', 'error')
    }
  }

  useEffect(() => {
    getBills()
  }, [])
  

  return (
    <>
      <div className='container w-100 h-100'>
        <div className='mt-5'>
          <h1 className='text-success'>Bills history</h1>
        </div>

        <hr className='mb-5' />

        <div className='container mb-5'>
          {
            bills?.map(({ cantMaterials, date, payMethod, recycler, status, total, user, _id, points }, index) => {
              return (
                <>
                  <CardBill
                    cantMaterials={cantMaterials}
                    date={date}
                    payMethod={payMethod}
                    recycler={recycler}
                    status={status}
                    total={total}
                    user={user}
                    id={_id}
                    points={points}
                    key={_id}
                  />
                </>
              )
            })
          }
        </div>
      </div>
    </>
  )
}
