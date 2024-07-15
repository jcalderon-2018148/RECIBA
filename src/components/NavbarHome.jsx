import React from 'react'
import logo from '../assets/logo.png'
import { Link } from 'react-router-dom'

export const NavbarHome = () => {
    return (
        <>
            <header>
                <div>
                    {/* <h3 className="h3247 float-md-start mb-0">WH24/7 <img src={logo} width='50rem' height='50rem' /></h3> */}
                    <nav className="nav nav-masthead justify-content-center">
                        <Link className="nav-link fw-bold py-1 px-0" to='/'>Home</Link>
                        <Link className="nav-link fw-bold py-1 px-0" to='/about' >About Us</Link>
                        <Link className="nav-link fw-bold py-1 px-0" to='/login'>Login</Link>
                    </nav>
                </div>
            </header>
        </>
    )
}
