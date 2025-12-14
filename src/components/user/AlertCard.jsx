import React from 'react'

const AlertCard = ({ alert }) => {
  const color =
    alert.priority === 'high' ? 'danger' :
    alert.priority === 'medium' ? 'warning' : 'info'

  return (
    <div className={`alert alert-${color}`}>
      <p className="font-medium">{alert.message}</p>
      <p className="text-sm mt-1">{alert.suggestion}</p>
    </div>
  )
}

export default AlertCard
