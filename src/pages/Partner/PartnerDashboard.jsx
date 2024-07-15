import React from 'react'
import { NavbarPartner } from '../../components/NavbarPartner'
import { Outlet } from 'react-router-dom'

export const PartnerDashboard = () => {
  return (
    <>
      <div>
        <NavbarPartner/>
      </div>
      
      <div className='container-fluid' style={{ marginTop: '75px' }}>
        <Outlet/>
      </div>
    </>
  )
}
