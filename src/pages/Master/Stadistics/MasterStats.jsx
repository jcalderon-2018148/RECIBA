import React, { useEffect, useState } from 'react'
import { BarChart } from '../../../components/charts/BarChart'
import Swal from 'sweetalert2'
import axios from 'axios'

export const MasterStats = () => {
  const [recyclerData, setRecyclerData] = useState({
    labels: undefined,
    datasets: [
      {
        label: undefined,
        data: null
      }
    ]
  })
  const [rewardData, setRewardData] = useState({
    labels: undefined,
    datasets: [
      {
        label: undefined,
        data: null
      }
    ]
  })
  const [popRewards, setPopRewards] = useState({
    labels: undefined,
    datasets: [
      {
        label: undefined,
        data: null
      }
    ]
  })
  const [cantPopRewards, setCantPopRewards] = useState(0)
  const [claims, setClaims] = useState(0)
  const [month, setMonth] = useState(`${new Date().getMonth() + 1}`)
  const [cantOfBills, setCantOfBills] = useState(0)
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('token')
  }
  const handleSelect = (e) => {
    setMonth(e.target.value)
  }

  const getRecyclers = async () => {
    try {
      const { data } = await axios(`http://localhost:3033/bill/get`, { headers: headers })
      const { data: recyclers } = await axios(`http://localhost:3033/recycler/get`, { headers: headers })
      const { data: partners } = await axios(`http://localhost:3033/partner/get`, { headers: headers })
      const { data: rewards } = await axios(`http://localhost:3033/reward/get`, { headers: headers })

      if (data) {
        //Obtener fecha actual
        let date = new Date()

        //Filtrar facturas por su status, metodo de pago, mes y año actual
        const filterBills = data.data.filter((b) =>
          b.date.split('\-')[1].includes(month) &&
          b.date.split('\-')[0].includes(date.getFullYear()) &&
          b.status?.includes('COMPLETED')
        )

        setCantOfBills(filterBills.length)
        let filterRecycler = []

        //Contar cuantas facturas ha hecho cada recicladora
        for (let item of recyclers.recyclers) {

          //Obtener todas las facturas que se hayan hecho en la recicladora en ciclo
          const f = filterBills.filter((b) =>
            b.recycler._id.includes(item._id)
          )

          //Ingresar los datos
          filterRecycler.push({
            name: item.name,
            bills: f.length
          })
        }

        setRecyclerData({
          labels: filterRecycler.map((data) => data.name),
          datasets: [
            {
              label: 'Cant of bills',
              data: filterRecycler.map((data) => data.bills)
            }
          ]
        })


        //Grafica por partners con recompensas mas reclamadas
        let filterRewards = []
        let totalClaims = 0

        //Contar las recompensas que hizo cada partner
        for (let item of partners.partners) {
          //Filtrar las recompensas por el partner que esta en ciclo
          const f = rewards.rewards.filter((b) =>
            b.partner._id.includes(item._id)
          )

          var cantOfClaims = 0

          //Por cada recompensa del partner en ciclo, sumar los reclamos que ha tenido
          for (let r of f) {
            cantOfClaims = cantOfClaims + r.claims
            totalClaims = totalClaims + r.claims
          }

          //Pushear un objeto con la informacion del reward
          filterRewards.push({
            name: item.name,
            cantOfClaims: cantOfClaims
          })
        }

        //Setear todas las claims hechas de todos los tiempos
        setClaims(totalClaims)

        setRewardData({
          labels: filterRewards.map((data) => data.name),
          datasets: [
            {
              label: 'Rewards Claimed',
              data: filterRewards.map((data) => data.cantOfClaims)
            }
          ]
        })


        //Grafica de rewards mas populares
        //Filtrar las recompensas por el numero de reclamos, empezando desde 10 para que sean populares
        const filteredRewards = rewards.rewards.filter((b) =>
          b.claims > 10
        )

        let mostPopRewards = []

        //Por cada recompensa pushearla con un modelo de datos
        for (let item of filteredRewards) {
          mostPopRewards.push({
            name: item.name,
            cantOfClaims: item.claims
          })
        }

        //Setear cantidad total de rewards que son populares
        setCantPopRewards(mostPopRewards.length)

        setPopRewards({
          labels: mostPopRewards.map((data) => data.name),
          datasets: [
            {
              label: 'Rewards Claimed',
              data: mostPopRewards.map((data) => data.cantOfClaims)
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
    getRecyclers()
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
        Most popular recyclers
      </h1>

      <h3 className='d-flex justify-content-end'>Total of bills this month: {cantOfBills}</h3>

      <div className='container mb-5'>
        <BarChart chartData={recyclerData} />
      </div>


      <h1 className='py-1 text-secondary'>
        Most popular partners
      </h1>

      <h3 className='d-flex justify-content-end'>Total claims of all time: {claims}</h3>

      <div className='container mb-5'>
        <BarChart chartData={rewardData} />
      </div>

      <h1 className='py-1 text-secondary'>
        Most popular rewards
      </h1>

      <h3 className='d-flex justify-content-end'>Popular rewards: {cantPopRewards}</h3>

      <div className='container mb-5'>
        <BarChart chartData={popRewards} />
      </div>

    </div>
  )
}
