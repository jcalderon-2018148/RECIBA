import React from 'react'
import './styleNotFound.css'
import { Link } from 'react-router-dom'

export const NotFound = () => {
    return (
        <main className="bodyError bsod containerError px-3 mt-auto">
            <h1 className="h1Error neg title"><span className="bg">Error - 404</span></h1>
            <p className='pError'>An error has occured, to continue:</p>
            <p className='pError'>* Return to our homepage.<br />
                * Or wait for our page to respond in case our server is down.</p>
            <nav className="nav justify-content-center">
                <Link to='/' className="link linkError">Home</Link>&nbsp;|&nbsp;<Link to='/login' className="link linkError">Login</Link>
            </nav>
        </main>
    )
}
