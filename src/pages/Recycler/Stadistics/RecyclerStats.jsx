import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { BarChart } from '../../../components/charts/BarChart'

export const RecyclerStats = () => {
    const [recyclerData, setRecyclerData] = useState({
        labels: undefined,
        datasets: [
            {
                label: undefined,
                data: null
            }
        ]
    })
    const [totalBills, setTotalBills] = useState({
        labels: undefined,
        datasets: [
            {
                label: undefined,
                data: null
            }
        ]
    })
    const [ecoinsData, setEcoinsData] = useState({
        labels: undefined,
        datasets: [
            {
                label: undefined,
                data: null
            }
        ]
    })
    const [billsThisMonth, setBillsThisMonth] = useState(0)
    const [month, setMonth] = useState(`${new Date().getMonth() + 1}`)
    const [totalGained, setTotalGained] = useState(0)
    const [totalCoins, setTotalCoins] = useState(0)
    
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
    }

    const handleSelect = (e) => {
        setMonth(e.target.value)
    }

    const getBills = async () => {
        try {
            const { data } = await axios(`http://localhost:3033/bill/getRecycler`, { headers: headers })

            if (data) {
                // CHART DE FACTURAS PAGADAS CON DINERO
                //Obtener fecha actual
                let date = new Date()

                //Filtrar facturas por su status, metodo de pago, mes y año actual
                let filteredGTQ = []
                for (let item of data.bills) {
                    let dates = new Date(item.date)
                    if (
                        dates.getMonth() + 1 === parseInt(month, 10) &&
                        dates.getFullYear() === date.getFullYear() &&
                        item.status === 'COMPLETED' &&
                        item.payMethod !== 'ECOINS'
                    ) {
                        filteredGTQ.push(item)
                    }
                    continue
                }

                //Obtener cantidad de dinero generado en ese mes
                let gtq = 0

                filteredGTQ.forEach(b => {
                    gtq = gtq + b.total
                })
                setTotalGained(gtq)

                let moneyPerDay = []

                for ( let item of filteredGTQ) {
                    let dates = new Date(item.date)
                    let found = moneyPerDay.findIndex(e => e.day === parseInt(dates.getDate(), 10))
                    
                    if (found === -1) {
                        moneyPerDay.push({
                            day: parseInt(dates.getDate(), 10),
                            total: item.total
                        })
                    } else {
                        moneyPerDay[found] = {
                            day: moneyPerDay[found].day,
                            total: moneyPerDay[found].total + item.total
                        }
                    }
                }

                setRecyclerData({
                    labels: moneyPerDay.map((data) => data.day),
                    datasets: [
                        {
                            label: 'Money paid',
                            data: moneyPerDay.map((data) => data.total)
                        }
                    ]
                })


                // CHART DE FACTURAS PAGADAS CON ECOINS
                //Filtrar facturas por su status, metodo de pago, mes y año actual
                const filterBillByEcoins = data.bills.filter((b) =>
                    b.date.split('\-')[1].includes(month) &&
                    b.date.split('\-')[0].includes(date.getFullYear()) &&
                    b.status?.includes('COMPLETED') &&
                    b.payMethod?.includes('ECOINS')
                )

                
                //Obtener cantidad de dinero generado en ese mes
                let pts = 0

                filterBillByEcoins.forEach(b => {
                    pts = pts + b.total
                })
                setTotalCoins(pts)

                
                let ecoinsPerDay = []

                for ( let item of filterBillByEcoins) {
                    let found = ecoinsPerDay.findIndex(e => e.day === item.date.split('\-')[2].split('\T')[0])
                    
                    if (found === -1) {
                        ecoinsPerDay.push({
                            day: item.date.split('\-')[2].split('\T')[0],
                            total: item.total
                        })
                    } else {
                        ecoinsPerDay[found] = {
                            day: ecoinsPerDay[found].day,
                            total: ecoinsPerDay[found].total + item.total
                        }
                    }
                }

                setEcoinsData({
                    labels: ecoinsPerDay.map((data) => data.day),
                    datasets: [
                        {
                            label: 'Ecoins paid',
                            data: ecoinsPerDay.map((data) => data.total)
                        }
                    ]
                })

                // CHART DE FACTURAS HECHAS CADA DIA DEL MES
                //Filtrar todas las facturas
                const filterBills = data.bills.filter((b) =>
                    b.date.split('\-')[1].includes(month) &&
                    b.date.split('\-')[0].includes(date.getFullYear()) &&
                    b.status?.includes('COMPLETED')
                )
                setBillsThisMonth(filterBills.length)

                let cantOfBills = [
                    {
                        id: 0,
                        name: 'Sunday',
                        cant: 0
                    },
                    {
                        id: 1,
                        name: 'Monday',
                        cant: 0
                    },
                    {
                        id: 2,
                        name: 'Tuesday',
                        cant: 0
                    },
                    {
                        id: 3,
                        name: 'Wednesday',
                        cant: 0
                    },
                    {
                        id: 4,
                        name: 'Thursday',
                        cant: 0
                    },
                    {
                        id: 5,
                        name: 'Friday',
                        cant: 0
                    },
                    {
                        id: 6,
                        name: 'Saturday',
                        cant: 0
                    },
                ]

                for (let bill of filterBills) {
                    var objFecha = new Date(bill.date)

                    for (let i = 0; i < cantOfBills.length; i++) {

                        if (objFecha.getDay() !== cantOfBills[i].id) continue

                        cantOfBills[i] = {
                            id: cantOfBills[i].id,
                            name: cantOfBills[i].name,
                            cant: cantOfBills[i].cant + 1
                        }
                    }
                }

                setTotalBills({
                    labels: cantOfBills.map((data) => data.name),
                    datasets: [
                        {
                            label: 'Bills made per day',
                            data: cantOfBills.map((data) => data.cant)
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
    }, [month])


    return (
        <div className='container my-5'>
            <div className='row align-items-center'>
                <h1 className='col py-1 px-4 text-success'>
                    Stats
                </h1>

                <div className='col-auto text-center text-light'>
                    <select defaultValue={month} onChange={handleSelect} id='selectOption' name="state" className='form-select'>
                        <option value={1}>January</option>
                        <option value={2}>February</option>
                        <option value={3}>March</option>
                        <option value={4}>April</option>
                        <option value={5}>May</option>
                        <option value={6}>June</option>
                        <option value={7}>July</option>
                        <option value={8}>August</option>
                        <option value={9}>September</option>
                        <option value={10}>October</option>
                        <option value={11}>November</option>
                        <option value={12}>December</option>
                    </select>
                </div>
            </div>


            <hr className='mb-5' />

            <h1 className='py-1 text-secondary'>
                Bills paid in cash
            </h1>

            <h3 className='d-flex justify-content-end'>Total: GTQ{parseFloat(totalGained).toFixed(2)}</h3>

            <div className='container mb-5'>
                <BarChart chartData={recyclerData} />
            </div>

            <h1 className='py-1 text-secondary'>
                Bills paid in ecoins
            </h1>

            <h3 className='d-flex justify-content-end'>Total: {totalCoins}pts</h3>

            <div className='container mb-5'>
                <BarChart chartData={ecoinsData} />
            </div>

            <h1 className='py-1 text-secondary'>
                Total of bills
            </h1>

            <h3 className='d-flex justify-content-end'>Total bills: {billsThisMonth}</h3>

            <div>
                <BarChart chartData={totalBills} />
            </div>
        </div>
    )
}
