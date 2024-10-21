import React, { useState, useEffect } from 'react'
import { Plus, DollarSign, AlertCircle } from 'lucide-react'
import { collection, addDoc, onSnapshot, query } from 'firebase/firestore'
import { db } from '../firebase'

const Sales: React.FC = () => {
  const [sales, setSales] = useState([])
  const [newSale, setNewSale] = useState({ customer: '', product: '', quantity: '', total: '', date: '' })
  const [error, setError] = useState(null)

  useEffect(() => {
    const q = query(collection(db, 'sales'))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const salesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setSales(salesData)
    }, (error) => {
      console.error("Error fetching sales: ", error)
      setError("Failed to fetch sales. Please try again.")
    })
    return () => unsubscribe()
  }, [])

  const validateSale = () => {
    if (!newSale.customer || !newSale.product || !newSale.quantity || !newSale.total || !newSale.date) {
      setError("All fields are required.")
      return false
    }
    if (isNaN(parseFloat(newSale.total)) || parseFloat(newSale.total) <= 0) {
      setError("Total must be a positive number.")
      return false
    }
    if (isNaN(parseInt(newSale.quantity)) || parseInt(newSale.quantity) <= 0) {
      setError("Quantity must be a positive integer.")
      return false
    }
    return true
  }

  const handleAddSale = async () => {
    if (validateSale()) {
      try {
        await addDoc(collection(db, 'sales'), {
          ...newSale,
          quantity: parseInt(newSale.quantity),
          total: parseFloat(newSale.total),
          date: new Date(newSale.date)
        })
        setNewSale({ customer: '', product: '', quantity: '', total: '', date: '' })
        setError(null)
      } catch (error) {
        console.error("Error adding sale: ", error)
        setError("Failed to add sale. Please try again.")
      }
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Sales</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
          <AlertCircle className="inline-block ml-2" size={20} />
        </div>
      )}
      <form onSubmit={(e) => { e.preventDefault(); handleAddSale(); }} className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Customer"
            className="p-2 border rounded"
            value={newSale.customer}
            onChange={(e) => setNewSale({ ...newSale, customer: e.target.value })}
          />
          <input
            type="text"
            placeholder="Product"
            className="p-2 border rounded"
            value={newSale.product}
            onChange={(e) => setNewSale({ ...newSale, product: e.target.value })}
          />
          <input
            type="number"
            placeholder="Quantity"
            className="p-2 border rounded"
            value={newSale.quantity}
            onChange={(e) => setNewSale({ ...newSale, quantity: e.target.value })}
          />
          <input
            type="number"
            placeholder="Total"
            className="p-2 border rounded"
            value={newSale.total}
            onChange={(e) => setNewSale({ ...newSale, total: e.target.value })}
          />
          <input
            type="date"
            className="p-2 border rounded"
            value={newSale.date}
            onChange={(e) => setNewSale({ ...newSale, date: e.target.value })}
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center justify-center">
            <Plus size={24} className="mr-2" /> Add Sale
          </button>
        </div>
      </form>
      <table className="w-full bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Customer</th>
            <th className="py-3 px-6 text-left">Product</th>
            <th className="py-3 px-6 text-left">Quantity</th>
            <th className="py-3 px-6 text-left">Total</th>
            <th className="py-3 px-6 text-left">Date</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {sales.map((sale) => (
            <tr key={sale.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{sale.customer}</td>
              <td className="py-3 px-6 text-left">{sale.product}</td>
              <td className="py-3 px-6 text-left">{sale.quantity}</td>
              <td className="py-3 px-6 text-left"><DollarSign size={16} className="inline mr-1" />{parseFloat(sale.total).toFixed(2)}</td>
              <td className="py-3 px-6 text-left">{new Date(sale.date.seconds * 1000).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Sales