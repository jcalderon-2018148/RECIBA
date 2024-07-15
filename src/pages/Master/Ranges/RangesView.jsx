import React, { useEffect, useState } from 'react'
import { RangeCard } from '../../../components/ranges/RangeCard'
import Swal from 'sweetalert2'
import axios from 'axios'
import { ModalAddRange } from '../../../components/ranges/ModalAddRange'

const HOST = Object.freeze({ url: 'http://localhost:3033' })

export const RangesView = () => {
    const [ranges, setRanges] = useState()

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
    }

    const getRanges = async () => {
        try {
            const { data } = await axios(`${HOST.url}/range/get`, { headers: headers })

            if (data) {
                setRanges(data.range)
            }

        } catch (err) {
            console.error(err)
            Swal.fire(err.response.data.message, '', 'error')
        }
    }

    useEffect(() => {
        getRanges()
    }, [])


    return (
        <>
            <div className='container mx-auto my-5'>
                <div className='row align-items-center'>
                    <h1 className='col py-1 px-4 text-success'>
                        Ranges
                    </h1>

                    <div className='col-auto text-center'>
                        <button
                            type='button'
                            className='btn btn-outline-success'
                            data-bs-toggle="modal" data-bs-target={`#modalAddRange`}
                        >
                            Create a range
                        </button>
                    </div>

                </div>


                <hr className='mb-5' />

                <div className="row row-cols-1 row-cols-md-3 g-4 text-center">
                    {
                        ranges?.map(({ _id, name, initExp, limitExp, photo }, index) => {
                            return (
                                <RangeCard
                                    id={_id}
                                    name={name}
                                    initExp={initExp}
                                    limitExp={limitExp}
                                    photo={photo}
                                    key={index}
                                />
                            )
                        })
                    }

                </div>
            </div>

            <ModalAddRange />

        </>
    )
}
