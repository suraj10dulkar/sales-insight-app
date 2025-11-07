import dayjs from 'dayjs'


export function normalizeRows(row, idx) {
const map = {}
Object.keys(row).forEach((k) => (map[k.toLowerCase().trim()] = k))


const get = (name) => {
if (map[name.toLowerCase()]) return row[map[name.toLowerCase()]]
// fallback fuzzy
const key = Object.keys(map).find((k) => k.includes(name.toLowerCase().slice(0,3)))
return key ? row[map[key]] : undefined
}


let date = get('date') ?? get('sales date')
if (typeof date === 'number') date = dayjs('1899-12-30').add(Math.round(date), 'day').format('YYYY-MM-DD')
if (date) { const d = dayjs(date); date = d.isValid() ? d.format('YYYY-MM-DD') : null }


const product = get('product') ?? '(Unknown)'
const region = get('region') ?? '(Unknown)'
const sales = parseFloat(get('sales') ?? get('revenue') ?? 0) || 0
const qty = parseFloat(get('quantity') ?? get('qty') ?? 0) || 0


if (!date && !product && sales === 0 && qty === 0) return null


return { _rowIndex: idx + 1, Date: date, Product: String(product), Region: String(region), Sales: sales, Quantity: qty }
}