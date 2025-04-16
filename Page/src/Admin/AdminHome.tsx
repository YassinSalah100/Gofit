import { BarChart3, ShoppingBag, Users, DollarSign, TrendingUp, TrendingDown, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

const AdminHome = () => {
  // Mock data for dashboard
  const stats = [
    {
      name: "Total Revenue",
      value: "$24,567.89",
      icon: DollarSign,
      change: "+12.5%",
      trend: TrendingUp,
      color: "text-green-500",
    },
    { name: "Products", value: "145", icon: ShoppingBag, change: "+4.3%", trend: TrendingUp, color: "text-green-500" },
    { name: "Customers", value: "2,453", icon: Users, change: "+18.2%", trend: TrendingUp, color: "text-green-500" },
    {
      name: "Conversion Rate",
      value: "3.24%",
      icon: BarChart3,
      change: "-0.8%",
      trend: TrendingDown,
      color: "text-red-500",
    },
  ]

  const recentOrders = [
    { id: "ORD-001", customer: "John Smith", date: "2023-06-15", status: "Delivered", amount: "$129.99" },
    { id: "ORD-002", customer: "Sarah Johnson", date: "2023-06-14", status: "Processing", amount: "$89.95" },
    { id: "ORD-003", customer: "Michael Brown", date: "2023-06-14", status: "Shipped", amount: "$245.50" },
    { id: "ORD-004", customer: "Emily Davis", date: "2023-06-13", status: "Delivered", amount: "$75.00" },
    { id: "ORD-005", customer: "Robert Wilson", date: "2023-06-12", status: "Cancelled", amount: "$199.99" },
  ]

  const topProducts = [
    { name: "Premium Running Shoes", sales: 124, revenue: "$12,400" },
    { name: "Fitness Tracker Pro", sales: 98, revenue: "$9,800" },
    { name: "Compression Workout Set", sales: 87, revenue: "$6,525" },
    { name: "Adjustable Dumbbell Set", sales: 65, revenue: "$19,500" },
    { name: "Yoga Mat Premium", sales: 54, revenue: "$2,700" },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Welcome back, Admin User</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="flex items-center">
                <div className="flex items-center text-sm font-medium">
                  <stat.trend className={`h-4 w-4 mr-1 ${stat.color}`} />
                  <span className={stat.color}>{stat.change}</span>
                </div>
                <span className="text-sm text-gray-500 ml-2">from last month</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders & Top Products */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium text-gray-900">Recent Orders</h2>
              <Link
                to="/admin/orders"
                className="text-sm font-medium text-red-600 hover:text-red-500 flex items-center"
              >
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="mt-6 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                order.status === "Delivered"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "Processing"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : order.status === "Shipped"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-red-100 text-red-800"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{order.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium text-gray-900">Top Products</h2>
              <Link
                to="/admin/products"
                className="text-sm font-medium text-red-600 hover:text-red-500 flex items-center"
              >
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="mt-6 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sales
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Revenue
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {topProducts.map((product, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {product.name}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{product.sales}</td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{product.revenue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminHome
