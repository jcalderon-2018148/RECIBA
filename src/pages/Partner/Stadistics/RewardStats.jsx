import React, { useContext, useEffect, useState } from 'react'
import { BarChart } from '../../../components/charts/BarChart'
import Swal from 'sweetalert2'
import axios from 'axios'
import { AuthContext } from '../../../index'

export const RewardStats = () => {
    /*Obtener el usuario logueado, crear headers y variable de datos*/
    const { dataUser } = useContext(AuthContext)
    const [rewardsData, setRewardsData] = useState({
        labels: undefined,
        datasets: [
            {
                label: undefined,
                data: null
            }
        ]
    })
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
    }
    /*Metodo para obtener el partner y las rewards */
    const getByPartner = async () => {
        try {
            const { data } = await axios(`http://localhost:3033/partner/getByUser/${dataUser.sub}`, { headers: headers })
            const partnerId = data.partner._id
            if (data) {
                const { data } = await axios(`http://localhost:3033/reward/getByPartner/${partnerId}`, { headers: headers })
                const rewardsArray = data.rewards
                if (data) {
                    let filterRecycler = []
                    //Contar cuantas facturas ha hecho cada recicladora
                    for (let item of rewardsArray) {

                        //Ingresar los datos
                        filterRecycler.push({
                            name: item.name,
                            claims: item.claims
                        })
                    }

                    setRewardsData({
                        labels: filterRecycler.map((data) => data.name),
                        datasets: [
                            {
                                label: 'Claims',
                                data: filterRecycler.map((data) => data.claims)
                            }
                        ]
                    })

                }
            }
        } catch (err) {
            console.error(err);
            Swal.fire(err.response.data?.message, '', 'error')
            navigate('/partner')
        }
    }

    useEffect(()=>{
        getByPartner()
    },[])

    return (
        <div className='container my-5'>

            <div className='row align-items-center'>
                <h1 className='col py-1 px-4 text-success'>
                    Stats
                </h1>

            </div>

            <hr className='mb-5' />

            {/*<h1 className='py-1 text-secondary'>
                Most popular recyclers
            </h1>

    <h3 className='d-flex justify-content-end'>Total of bills: {cantOfBills}</h3>*/}

            <div className='container mb-5'>
                <BarChart chartData={rewardsData} />
            </div>

        </div>
    )
}
