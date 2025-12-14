import React from 'react'
import ChartComponent from '../common/ChartComponent'

const VisitorChart = ({ data }) => {
  return <ChartComponent data={data} dataKey="tourists" />
}

export default VisitorChart
