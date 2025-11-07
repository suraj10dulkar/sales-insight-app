import React from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
export default function ProductBar({ data }){
if (!data || !data.length) return <div className="text-sm text-gray-500">Upload data to see products</div>
const chartData = data.map(d=>({ name:d.product, sales:d.sales }))
return (
<ResponsiveContainer width="100%" height={300}>
<BarChart data={chartData}>
<CartesianGrid strokeDasharray="3 3" />
<XAxis dataKey="name" />
<YAxis />
<Tooltip />
<Bar dataKey="sales" />
</BarChart>
</ResponsiveContainer>
)
}