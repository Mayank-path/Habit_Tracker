import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Stats = ({ habits }) => {
  if (!Array.isArray(habits)) return <div className="text-center mt-10 text-gray-500">Loading stats...</div>;

  const processData = () => {
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const habitData = habits.map(habit => ({
      name: habit.name,
      data: last7Days.map(day => ({
        date: day,
        completed: habit.dates?.includes(day) ? 1 : 0
      }))
    }));

    return { last7Days, habitData };
  };

  const { last7Days, habitData } = processData();

  const lineData = {
    labels: last7Days.map(date => date.split('-')[2]),
    datasets: [
      {
        label: 'Daily Completions',
        data: last7Days.map(date => 
          habitData.reduce((sum, habit) => 
            sum + (habit.data.find(d => d.date === date)?.completed || 0), 0)
        ),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.1
      }
    ]
  };

  const barData = {
    labels: habitData.map(habit => habit.name),
    datasets: [
      {
        label: 'Completions (Last 7 Days)',
        data: habitData.map(habit => 
          habit.data.reduce((sum, day) => sum + day.completed, 0)
        ),
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1
      }
    ]
  };

  const totalCompletions = habitData.reduce(
    (sum, habit) => sum + habit.data.reduce((s, day) => s + day.completed, 0), 0
  );
  const averagePerDay = totalCompletions > 0 ? (totalCompletions / 7).toFixed(1) : 0;
  const mostConsistent = [...habitData].sort((a, b) => 
    b.data.reduce((s, day) => s + day.completed, 0) - 
    a.data.reduce((s, day) => s + day.completed, 0)
  )[0];

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-5xl mx-auto mt-6 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Weekly Progress</h3>
          <Line data={lineData} />
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Habit Comparison</h3>
          <Bar data={barData} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800">Total Habits</h4>
          <p className="text-3xl font-bold text-blue-600">{habits.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-800">Total Completions</h4>
          <p className="text-3xl font-bold text-green-600">{totalCompletions}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-medium text-purple-800">Most Consistent</h4>
          <p className="text-xl font-bold text-purple-600">
            {mostConsistent?.name || 'None'} (
              {mostConsistent?.data?.reduce((s, d) => s + d.completed, 0) || 0} days
            )
          </p>
        </div>
      </div>
    </div>
  );
};

export default Stats;
