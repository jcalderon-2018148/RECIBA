import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { NavbarOffcanvas } from '../../components/NavbarOffcanvas'

export const RecyclerDashboard = () => {
    return (
        <>
        
            <div>
                <NavbarOffcanvas />
            </div>

            {/* CONTENIDO */}
            <div className='container-fluid' style={{ marginTop: '75px' }}>
                <Outlet/>

            </div>

        </>
    )
}
