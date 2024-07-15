import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import axios from 'axios'
import { LineChart } from '../../../components/charts/LineChart'

export const Stats = () => {
    const [userData, setUserData] = useState({
        labels: undefined,
        datasets: [
            {
                label: undefined,
                data: null
            }
        ]
    })
    const [month, setMonth] = useState(`${new Date().toISOString().split('\-')[1]}`)
    const [totalGained, setTotalGained] = useState(0)

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
    }

    const handleSelect = (e) => {
        setMonth(e.target.value)
    }

    const getBills = async () => {
        try {
            const { data } = await axios(`http://localhost:3033/bill/getOwn`, { headers: headers })

            if (data) {
                //Obtener la fecha actual
                let date = new Date().toISOString()

                //Filtrar facturas por su status, metodo de pago, mes y año actual
                const filterBill = data.bills.filter((b) =>
                    b.date.split('\-')[1].includes(month) && 
                    b.date.split('\-')[0].includes(date.split('\-')[0]) && 
                    b.status?.includes('COMPLETED') &&
                    b.payMethod?.includes('ECOINS')
                )

                //Obtener puntos ganados en total ese mes
                let pts = 0

                filterBill.forEach(b => {
                    pts = pts + b.total
                })

                setTotalGained(pts)

                setUserData({
                    labels: filterBill.map((data) => data.date.split('\-')[2].split('\T')[0]),
                    datasets: [
                        {
                            label: 'Ecoins Gained',
                            data: filterBill.map((data) => data.total)
                        }
                    ]
                })
            }

        } catch (err) {
            console.error(err)
            Swal.fire(err.response.data.message, '', 'error')
        }
    }

    useEffect(() => {
      getBills()
    }, [])
    
    
    useEffect(() => {
        getBills()
    }, [month])


    return (
        <div className='container mt-5' style={{ height: '100vh' }}>
            <div className='row align-items-center'>
                <h1 className='col py-1 px-4 text-success'>
                    Ecoins earned
                </h1>

                <div className='col-auto text-center text-light'>
                    <select defaultValue={month} onChange={handleSelect} id='selectOption' name="state" className='form-select'>
                        <option value='01'>January</option>
                        <option value='02'>February</option>
                        <option value='03'>March</option>
                        <option value='04'>April</option>
                        <option value='05'>May</option>
                        <option value='06'>June</option>
                        <option value='07'>July</option>
                        <option value='08'>August</option>
                        <option value='09'>September</option>
                        <option value='10'>October</option>
                        <option value='11'>November</option>
                        <option value='12'>December</option>
                    </select>
                </div>
            </div>


            <hr className='mb-5' />

            <h3>Total Gained: {totalGained}</h3>

            <div>
                <LineChart chartData={userData} />
            </div>
        </div>
    )
}
