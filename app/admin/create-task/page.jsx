"use client"

import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '@/app/components/navbar'
import { useState } from 'react';

const CreateTask = () => {
   const [formData, setFormData] = useState({
    title: '',
    taskType: '',
    location: '',
    date: '',
  });

  const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/task/create-task', formData);

      if (res.status === 201) {
        const { task } = res.data;
        if (task.status === 'Warning') {
          toast.warn(`⚠️ ${task.suggestion}`);
        } else {
          toast.success('✅ Task created and weather is good!');
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to create task or fetch weather data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar title={'Create Task'}/>
      <div>Create Task</div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          onChange={handleChange}
          value={formData.title}
          className="w-full px-4 py-2 border rounded-xl"
          required
        />

        <input
          type="text"
          name="taskType"
          placeholder="e.g. Mix Concrete, Paint Wall"
          onChange={handleChange}
          value={formData.taskType}
          className="w-full px-4 py-2 border rounded-xl"
          required
        />

        <input
          type="text"
          name="location"
          placeholder="City or Location"
          onChange={handleChange}
          value={formData.location}
          className="w-full px-4 py-2 border rounded-xl"
          required
        />

        <input
          type="date"
          name="date"
          onChange={handleChange}
          value={formData.date}
          className="w-full px-4 py-2 border rounded-xl"
          required
        />

        <button
          type="submit"
          className="w-full bg-[#443227] hover:bg-[#574235] text-white font-semibold py-3 rounded-xl transition"
          disabled={loading}
        >
          {loading ? 'Checking Weather...' : 'Create Task'}
        </button>
      </form>

      {/* Toast container is here, so it works inside this page */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
    </div>
  )
}

export default CreateTask