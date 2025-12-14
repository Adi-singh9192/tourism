import React from 'react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts'

const ChartComponent = ({ data, dataKey }) => {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#2563eb"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ChartComponent
