import React, { useState, useEffect } from 'react'
import { BarChart, Calendar, Download } from 'lucide-react'
import { useTenant } from '../contexts/TenantContext'
import { db } from '../firebase'
import { collection, query, getDocs, where, Timestamp } from 'firebase/firestore'

const Reports: React.FC = () => {
  const { tenant } = useTenant()
  const [reportType, setReportType] = useState<'sales' | 'inventory'>('sales')
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week')
  const [reportData, setReportData] = useState<any[]>([])

  useEffect(() => {
    const fetchReportData = async () => {
      if (!tenant) return

      const now = new Date()
      let startDate = new Date()

      switch (timeRange) {
        case 'week':
          startDate.setDate(now.getDate() - 7)
          break
        case 'month':
          startDate.setMonth(now.getMonth() - 1)
          break
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1)
          break
      }

      const collectionName = reportType === 'sales' ? 'sales' : 'inventory'
      const reportsQuery = query(
        collection(db, `tenants/${tenant.id}/${collectionName}`),
        where('date', '>=', Timestamp.fromDate(startDate)),
        where('date', '<=', Timestamp.fromDate(now))
      )

      const reportsSnapshot = await getDocs(reportsQuery)
      const reportsData = reportsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      setReportData(reportsData)
    }

    fetchReportData()
  }, [tenant, reportType, timeRange])

  const handleExport = () => {
    // Implement CSV export logic here without react-csv
    const csvContent = reportData.map(item => {
      if (reportType === 'sales') {
        return `${new Date(item.date.seconds * 1000).toLocaleDateString()},${item.total},${item.customer},${item.product}`
      } else {
        return `${item.name},${item.quantity},${new Date(item.date.seconds * 1000).toLocaleDateString()}`
      }
    }).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `${reportType}_report.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Reports</h2>
      <div className="mb-4 flex space-x-4">
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value as 'sales' | 'inventory')}
          className="p-2 border rounded"
        >
          <option value="sales">Sales Report</option>
          <option value="inventory">Inventory Report</option>
        </select>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'year')}
          className="p-2 border rounded"
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="year">Last Year</option>
        </select>
        <button
          onClick={handleExport}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
        >
          <Download className="mr-2" size={18} />
          Export
        </button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              {reportType === 'sales' ? (
                <>
                  <th className="py-3 px-6 text-left">Date</th>
                  <th className="py-3 px-6 text-left">Total</th>
                  <th className="py-3 px-6 text-left">Customer</th>
                  <th className="py-3 px-6 text-left">Product</th>
                </>
              ) : (
                <>
                  <th className="py-3 px-6 text-left">Name</th>
                  <th className="py-3 px-6 text-left">Quantity</th>
                  <th className="py-3 px-6 text-left">Last Updated</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {reportData.map((item) => (
              <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-100">
                {reportType === 'sales' ? (
                  <>
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      {new Date(item.date.seconds * 1000).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-6 text-left">${item.total.toFixed(2)}</td>
                    <td className="py-3 px-6 text-left">{item.customer}</td>
                    <td className="py-3 px-6 text-left">{item.product}</td>
                  </>
                ) : (
                  <>
                    <td className="py-3 px-6 text-left whitespace-nowrap">{item.name}</td>
                    <td className="py-3 px-6 text-left">{item.quantity}</td>
                    <td className="py-3 px-6 text-left">
                      {new Date(item.date.seconds * 1000).toLocaleDateString()}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Reports