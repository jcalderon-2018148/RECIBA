import React from 'react'
import { NavbarUser } from '../../components/NavbarUser'
import '../../css/UserHomePage.css'
import { Outlet } from 'react-router-dom'
import { Footer } from '../../components/Footer'

export const UserHomePage = () => {

  return (
    <>
      <div>
        <NavbarUser />
      </div>

      <div>
        <Outlet/>
      </div>

      <div>
        <Footer/>
      </div>
    </>
  )
}
