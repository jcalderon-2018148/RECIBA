import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import c1 from '../../../assets/c1.jpg'
import c2 from '../../../assets/c2.jpg'
import c3 from '../../../assets/c3.jpg'
import { CadMaterial } from '../../../components/material/CadMaterial'

export const RecyclerView = () => {
  const { id } = useParams()
  const [recycler, setRecycler] = useState()
  const [materials, setMaterials] = useState()

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('token')
  }

  const getRecycler = async () => {
    try {
      const { data } = await axios(`http://localhost:3033/recycler/getOne/${id}`, { headers: headers })

      if (data) {
        return setRecycler(data.recycler)
      }

    } catch (err) {
      console.error(err)
      Swal.fire(err.response.data.message, '', 'error')
    }
  }

  const getMaterials = async () => {
    try {
      const { data } = await axios(`http://localhost:3033/material/getRecMaterials/${id}`, { headers: headers })

      if (data) {
        return setMaterials(data.materials)
      }

    } catch (err) {
      console.error(err)
      Swal.fire(err.response.data.message, '', 'error')
    }
  }

  useEffect(() => {
    getRecycler()
    getMaterials()
  }, [])


  return (
    <>
      {/* Carousel */}
      <div id="carruselImagenes" className="carousel container slide mt-4 p-0" data-bs-ride="carousel" style={{ height: '60vh', width: '100%' }}>
        <div className="carousel-inner rounded-4">
          {
            recycler?.photos.map((p, index) => {
              return (
                <div id={index} className="carousel-item active">
                  <img 
                    src={`http://localhost:3033/recycler/getImage/${p}`} 
                    crossOrigin='anonymous' 
                    className="d-block" 
                    style={{ objectFit: 'cover', width: '100%', height: '60vh' }} />
                </div>
              )
            })
          }

        </div>

        <button className="carousel-control-prev rounded-4" type="button" data-bs-target="#carruselImagenes" data-bs-slide="prev">
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button className="carousel-control-next rounded-4" type="button" data-bs-target="#carruselImagenes" data-bs-slide="next">
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>

      {/* Info recycler */}
      <div className='container mt-4'>

        <div className='container mx-auto'>
          <div className='row'>
            <div className='col py-1 pe-4 text-success'>
              <h1>{recycler?.name}'s View</h1>
            </div>

            <div className='col-auto text-center text-light'>
              <h6 className='bg-success rounded-pill py-1 px-3'>
                {recycler?.phone}
              </h6>
            </div>
          </div>

          <h5>{recycler?.direction}</h5>
          <h5 className='text-body-secondary'>Open: {recycler?.startHour}hrs - {recycler?.endHour}hrs</h5>
        </div>

        <div className='container mt-5'>
          <h1 className=''>Materials</h1>
        </div>

      </div>


      {/* Materials */}

      <div className='container mb-5 mt-4'>

        <div class="row row-cols-1 row-cols-md-3 g-4">
          {
            materials?.map(({ _id, type, unit, price, photo, recycle }, index) => {
              return (
                <CadMaterial
                  key={index}
                  id={_id}
                  type={type}
                  unit={unit}
                  price={price}
                  photo={photo}
                  recycler={recycle}
                />
              )
            })
          }
        </div>

      </div>

    </>
  )
}
