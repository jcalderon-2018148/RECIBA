import React from 'react'
import { NavbarHome } from '../../components/NavbarHome.jsx'
import './homeStyle.css'
import about from '../../assets/about.jpg'

export const AboutUsPage = () => {
    return (
        
            <div className='body text-center text-bg-dark'>
                <div className="d-flex p-3 flex-column"> {/* mx-auto */}
                    <NavbarHome />
                    <main className="px-3">
                        <div className="row">
                            <div className="offset-lg-3 col-lg-6 text-center">
                                <h2 className="h1247 fw-bold pb-3 pt-5">WHO WE ARE
                                </h2>
                            </div>

                            <div className="row align-items-center">
                                <div className="col-lg-3 col-md-4 pt-5 pb-5 ms-auto ">
                                    <img className='aboutimg rounded' src={about} width='600ww' height='350vh' />
                                </div>
                                <div className="col-lg-5 offset-lg-3 col-md-8 me-auto">
                                    <h3 className="h2247 text-white fs-1 text-decoration-underline pb-3 pt-3">About Us</h3>
                                    <p className="p247 fs-5 text-white">
                                        In RECIBA, we are committed to protecting the planet and promoting sustainable practices. 
                                        We believe that recycling is a vital part of the solution to address the environmental challenges 
                                        we face today. For this reason, we have proposed to promote a culture of recycling through an 
                                        innovative and rewarding initiative.
                                        <br/>
                                        
                                    </p>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        
    )
}
