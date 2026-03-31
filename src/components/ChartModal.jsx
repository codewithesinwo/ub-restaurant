  import Modal from './Modal';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useState } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { Calendar, DollarSign, TrendingUp } from 'lucide-react';
import Button from './Button';

const ChartModal = ({ isOpen, onClose }) => {
  const { orders } = useAdmin();
  const [activeChart, setActiveChart] = useState('orders');

// Real data from orders (group by month)
  const getChartData = () => {
    const monthlyData = {};
    orders.forEach(order => {
      const month = new Date(order.date).toLocaleDateString('en-US', { month: 'short' });
      if (!monthlyData[month]) {
        monthlyData[month] = { month, orders: 0, revenue: 0 };
      }
      monthlyData[month].orders += 1;
      monthlyData[month].revenue += order.total;
    });
    return Object.values(monthlyData);
  };

  const chartData = getChartData();

  const renderChart = () => {
    if (activeChart === 'orders') {
      return (
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tickMargin={20} tick={{ fontSize: 14, fill: '#6b7280' }} />
          <YAxis axisLine={false} tickLine={false} tickMargin={20} tick={{ fontSize: 14, fill: '#6b7280' }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="orders" stroke="#f59e0b" strokeWidth={4} dot={{ fill: '#f59e0b', strokeWidth: 2 }} />
        </LineChart>
      );
    }
    if (activeChart === 'revenue') {
      return (
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tickMargin={20} tick={{ fontSize: 14, fill: '#6b7280' }} />
          <YAxis axisLine={false} tickLine={false} tickMargin={20} tick={{ fontSize: 14, fill: '#6b7280' }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sales Analytics" size="xl">
      <div className="space-y-8">
        <div className="flex flex-wrap gap-3 mb-8">
          <Button
            variant={activeChart === 'orders' ? 'primary' : 'outline'}
            onClick={() => setActiveChart('orders')}
            className="flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Orders Over Time
          </Button>
          <Button
            variant={activeChart === 'revenue' ? 'primary' : 'outline'}
            onClick={() => setActiveChart('revenue')}
            className="flex items-center gap-2"
          >
            <DollarSign className="w-4 h-4" />
            Revenue
          </Button>
          <Button
            variant={activeChart === 'trending' ? 'primary' : 'outline'}
            onClick={() => setActiveChart('trending')}
            className="flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Trends
          </Button>
        </div>
        <div className="h-96 bg-gray-50/50 rounded-2xl p-6">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
        <div className="grid md:grid-cols-3 gap-6 pt-4">
          <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
            <div className="text-3xl font-bold text-emerald-600 mb-1">35</div>
            <div className="text-sm text-gray-600">Total Orders This Month</div>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
            <div className="text-3xl font-bold text-amber-600 mb-1">$3,800</div>
            <div className="text-sm text-gray-600">Monthly Revenue</div>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
            <div className="text-3xl font-bold text-blue-600 mb-1">12%</div>
            <div className="text-sm text-gray-600">Growth vs Last Month</div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ChartModal;
