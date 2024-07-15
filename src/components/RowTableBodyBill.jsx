import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import axios from 'axios'

export const RowTableBodyBill = ({ number, materialid, amountWeight, subtotal }) => {

    const [materialData, setMaterialData] = useState(null);

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
    }

    // Buscar cada material para mostrarlo en la tabla.
    const getMaterial = async () => {
        try {
            const { data } = await axios(`http://localhost:3033/material/getOne/${materialid}`, { headers: headers })

            setMaterialData(data.material)

        } catch (err) {
            Swal.fire(err.response.data.message, '', 'error')
            console.error(err)
        }
    }

    useEffect(() => {
        getMaterial()
    }, [])

    return (
        <>
            <tr className='align-middle'>
                <td scope="col">{number+1} </td>
                <td scope="col">{materialData?.type} </td>
                <td>{materialData?.price.quantity} x {materialData?.price.amount}</td>
                <td >{amountWeight}</td>
                <td >Q. {parseFloat(subtotal).toFixed(2)}</td>
            </tr>
        </>
    )
}
