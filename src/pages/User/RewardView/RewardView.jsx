import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { CardReward } from '../../../components/rewards/CardReward'

const HOST = Object.freeze({ url: 'http://localhost:3033' })

export const RewardView = () => {
    const [rewards, setRewards] = useState()
    
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
    }

    const getOwn = async () => {
        try {
            const { data } = await axios(`${HOST.url}/user/getOwn`, { headers: headers })

            if (data) {
                return setRewards(data.data[0].historyRewards)
            }

        } catch (err) {
            console.error(err)
            Swal.fire(err.response.data.message, '', 'error')
        }
    }

    useEffect(() => {
        getOwn()
    }, [])
    
    
  return (
    <>
        <div className='container'>
            <div className='mt-5'>
                <h1 className='text-success'>Rewards claimed</h1>
            </div>

            <hr className='mb-5'/>

            <div className='row row-cols-1 row-cols-md-2 g-4 text-center mb-5'>
                {
                    rewards?.map(({ name, description, partner, range, cantPoints, photo, _id, claims }, index) => {
                        return (
                            <>
                                <CardReward
                                    id={_id}
                                    name={name}
                                    desc={description}
                                    range={range}
                                    cantPoints={cantPoints}
                                    photo={photo}
                                    partner={partner}
                                    claims={claims}
                                    key={index}
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
