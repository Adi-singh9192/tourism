import React from 'react'
import { FaSearch } from 'react-icons/fa'

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="relative">
      <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Search place or city..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-input pl-12"
      />
    </div>
  )
}

export default SearchBar
