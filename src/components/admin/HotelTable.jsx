import React from 'react'
import { hotels } from '../../data/mockData'

const HotelTable = () => {
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Hotel</th>
            <th>City</th>
            <th>Price</th>
            <th>Vacancy</th>
          </tr>
        </thead>
        <tbody>
          {hotels.map(hotel => (
            <tr key={hotel.id}>
              <td>{hotel.name}</td>
              <td>{hotel.city}</td>
              <td>₹{hotel.price}</td>
              <td>{hotel.vacancy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default HotelTable
