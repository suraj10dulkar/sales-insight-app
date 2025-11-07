import React from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'
const palette = ['#8884d8','#82ca9d','#ffc658','#ff7f50','#a4de6c','#d0ed57','#8dd1e1']
export default function RegionPie({ data }){
if (!data || !data.length) return <div className="text-sm text-gray-500">Upload data to see region split</div>
return (
<ResponsiveContainer width="100%" height={300}>
<PieChart>
<Pie data={data} dataKey="sales" nameKey="region" outerRadius={90} label>
{data.map((d,i)=>(<Cell key={i} fill={palette[i%palette.length]} />))}
</Pie>
<Legend />
<Tooltip />
</PieChart>
</ResponsiveContainer>
)
}