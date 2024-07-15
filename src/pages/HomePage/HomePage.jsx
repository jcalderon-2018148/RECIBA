import React from 'react'
import './homeStyle.css'
import { Link } from 'react-router-dom'
import { NavbarHome } from '../../components/NavbarHome'


export const HomePage = () => {

    return (
        <div className='body text-center text-bg-dark'>
            <div className="d-flex p-3 mx-auto flex-column"> {/* mx-auto */}
                
                <NavbarHome/>

                <main className="px-3 mt-auto">
                    <h1 className='h1247'>RECIBA</h1>
                    <p className="p247 lead">
                        Find a perfect <strong>RECYCLER</strong> to say goodbye to your trash and hello to RECEIVE good rewards.
                    </p>
                    <p className="lead">
                        <Link to={'/about'} className="btn btn-lg btn-light fw-bold border-white bg-white">More info</Link>
                    </p>
                </main>

                <footer className="mt-auto text-white-50">
                    <p>RECIBA®</p>
                </footer>
            </div>
        </div>

    )
}