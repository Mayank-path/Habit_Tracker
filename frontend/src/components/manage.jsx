

import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import axios from '../api/axios';

const Manage = () => {
  const [showInput, setShowInput] = useState(false);
  const [habitName, setHabitName] = useState('');
  const [habits, setHabits] = useState([]);
  const { user,token } = useAuth();

  const handleAddHabitClick = () => setShowInput(true);

  const handleHabitSubmit = async () => {
    if (!habitName.trim()) return alert("Habit name cannot be empty");

    try {
      const {data} = await axios.post(`/habits/addHabit`,{ 
          habit_name : habitName},{
          headers : {Authorization : `Bearer ${token}`}
      })
      alert('habit added succssfully')
      setHabits(prev => [...prev, data.habit]); 
    setHabitName('');
    setShowInput(false);
    } catch (err) {
      console.error(err);
      alert('Server error');
      console.log(token)
    }
  };

  const handleDeleteHabit = async (_id) => {
   

    try {
        await axios.delete(`/habits/deleteHabit/${_id}`,
        
        { headers : {Authorization : `Bearer ${token}` },
        
      })

      alert('habit delted successfully')
      setHabits(prev => prev.filter(h => h._id !== _id));
      
        
      
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  const handleEditHabit = async (id,oldHabitName) => {
    const newHabitName = prompt('Enter new habit name:', oldHabitName);
    if (!newHabitName || newHabitName === oldHabitName) return;

    try {
      const {data} = await axios.put(`/habits/update/${id}`,
        {newHabitName },
        {headers : {Authorization : `Bearer ${token}`}}
      )
      
      alert("habit updated successfully")
      fetchHabits()
      
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  const fetchHabits = async () => {
    try {
      const {data} = await axios.get("/habits/showHabit",{headers : {Authorization : `Bearer ${token}`}});
      setHabits(data)
      
     
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    if (token) fetchHabits();
  }, [token]);

  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Manage Habits</h2>
        <button
          onClick={handleAddHabitClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + Add Habit
        </button>
      </div>

      {showInput && (
        <div className="mb-4 bg-gray-100 p-4 rounded">
          <input
            type="text"
            placeholder="Enter habit name"
            className="w-full border px-3 py-2 rounded mb-2"
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
          />
          <button
            onClick={handleHabitSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save Habit
          </button>
        </div>
      )}

      {habits?.length > 0 ? (
        <div className="grid gap-3">
          {habits.map((habit, index) => (
            <div key={index} className="border rounded p-3 shadow-sm bg-gray-50 flex justify-between items-center">
              <span className="text-lg font-medium">{habit.habit_name}</span>
              <div className="flex gap-4">
                <button


onClick={() => handleEditHabit(habit._id, habit.habit_name)}
                  className="hover:bg-blue-600 hover:text-white rounded px-6 py-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteHabit(habit._id)}
                  className="hover:bg-blue-600 hover:text-white rounded px-4 py-2"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-10">
          No habits created yet. Add your first habit to get started!
        </p>
      )}
    </div>
  );
};

export default Manage;