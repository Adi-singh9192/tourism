import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-white/80 border-t border-gray-200 mt-12">
      <div className="container mx-auto px-4 py-6 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} Rajasthan Tourism Intelligence System • Government of Rajasthan
      </div>
    </footer>
  )
}

export default Footer
