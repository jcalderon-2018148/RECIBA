import React from 'react'
import { Link } from 'react-router-dom'
import '../../css/UserHomePage.css'

export const CardBill = ({ cantMaterials, date, payMethod, recycler, status, total, user, id, points }) => {
  return (
    <>
      <div className="container p-5 rounded-5 shadow-lg transitionY">
        <div className="card-header">
          <div className='row align-items-center'>
            <h1 className='col fontBarcode fs-3'>{id}</h1>
            <h5 className={`col-auto text-${status === 'COMPLETED' ? 'success' : 'secondary'}`}>{status}</h5>
          </div>

        </div>
        <div className="card-body">
          <div className='d-flex'>
            <h1 className={`text-${payMethod === 'ECOINS' ? 'success' : 'primary'} d-flex justify-content-start`}>{payMethod}</h1>
            <h2 className={`card-title d-flex justify-content-end text-${payMethod === 'ECOINS' ? 'success' : 'primary'}`}>{payMethod === 'ECOINS' ? `${points}pts` : `GTQ${parseFloat(total).toFixed(2)}`}</h2>
          </div>
          
          <h2 className="card-title">{date.split('\T')[0]}</h2>
          
          <p className='mb-0'><strong className='text-primary'>Extended by:</strong> {recycler.name}</p>
          <p><strong className='text-primary'>To:</strong> {user.username}</p>
          <Link to={`/home/viewDetails/${id}`} className="btn btn-outline-dark rounded-pill">View details</Link>
        </div>
      </div>
    </>
  )
}
