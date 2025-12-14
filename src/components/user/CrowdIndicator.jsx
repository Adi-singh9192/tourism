import React from 'react'

const CrowdIndicator = ({ level }) => {
  const color =
    level > 70 ? 'red' :
    level > 40 ? 'yellow' : 'green'

  return (
    <span className={`badge badge-${color}`}>
      {level > 70 ? 'High Crowd' : level > 40 ? 'Normal Crowd' : 'Low Crowd'}
    </span>
  )
}

export default CrowdIndicator
