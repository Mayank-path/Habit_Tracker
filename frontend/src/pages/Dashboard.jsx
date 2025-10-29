import React, { useEffect, useState, useCallback } from 'react';
import Manage from '../components/manage';
import Stat from '../components/stat';
import dayjs from 'dayjs';
import Calendar from '../components/calendar';
import { useAuth } from '../auth/AuthContext';
import axios from '../api/axios';

const Card = () => {
    const { user, logout , token } = useAuth(); 
    const [activeSection, setActiveSection] = useState('calendar'); 
    const [habit ,SetHabits] = useState([])

    const [nofhabit, Setnoofhabit] = useState(0) 
    const[complete ,setComplete] = useState(0)
    
    const fetchHabits = useCallback(async () => {
      try {
        const {data} = await axios.get("/habits/showHabit",{headers : {Authorization : `Bearer ${token}`}});
        SetHabits(data)
        Setnoofhabit(data.length)
        
       
      } catch (err) {
        console.error('Fetch error:', err);
      }
    },[token]);

    const fetchCompletedToday = useCallback(async () => {
      try {
        const { data } = await axios.get("/habits/completeHabit", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setComplete(data.count); 
      } catch (err) {
        console.error("Error fetching today's completed habits:", err);
      }
    }, [token]);

    useEffect(() => {
      fetchHabits()
      fetchCompletedToday()
    },[fetchHabits,fetchCompletedToday])
     
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        {/* Header */}
        <div className="text-center mb-6 relative"> {/* Added relative for absolute positioning */}
          {/* User Button with Logout */}
          <button
            onClick={logout} // Call logout function on click
            className="absolute top-0 right-0 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
          >
            {user ? user.username : 'User'} <span className="ml-2">🚪</span> {/* Display username if available */}
          </button>
          <h1 className="text-3xl font-bold text-blue-700 flex items-center justify-center gap-2">
            <span role="img" aria-label="calendar">📅</span> Habit Tracker
          </h1>
          <p className="text-gray-600 mt-2 text-sm">
            Your personalized Habit Tracker to never miss a single day
          </p>
        </div>
  
        {/* Navigation Buttons */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-4 border border-gray-300 rounded-md bg-white px-4 py-2">
            <button
              onClick={() => setActiveSection('calendar')}
              className={`px-4 py-2 rounded-md transition ${
                activeSection === 'calendar' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-blue-100'
              }`}
            >
              📅 Calendar
            </button>
            <button
              onClick={() => setActiveSection('manage')}
              className={`px-4 py-2 rounded-md transition ${
                activeSection === 'manage' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-blue-100'
              }`}
            >
              🔧 Manage Habits
            </button>
            <button
              onClick={() => setActiveSection('stat')}
              className={`px-4 py-2 rounded-md transition ${
                activeSection === 'stat' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-blue-100'
              }`}
            >
              📊 Statistics
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4  mb-8 ml-126">
          <div className="bg-white shadow rounded-lg p-4 flex items-center gap-4">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-full">🎯</div>
            <div>
              <p className="text-lg font-semibold">{nofhabit}</p>
              <p className="text-sm text-gray-500">Total Habits</p>
            </div>
          </div>
  
          <div className="bg-white shadow rounded-lg p-4 flex items-center gap-4">
            <div className="bg-green-100 text-green-600 p-2 rounded-full">📈</div>
            <div>
              <p className="text-lg font-semibold">{complete}</p>
              <p className="text-sm text-gray-500">Completed Today</p>
            </div>
          </div>
  
        </div>
  
        {/* Conditional Components */}
        {activeSection === 'calendar' && <Calendar/>}
        {activeSection === 'manage' && <Manage />}
        {activeSection === 'stat' && <Stat />}
      </div>
    );
  };
  

export default Card;
