// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    email: ''
  });

  useEffect(() => {
    // Fetch users when the component mounts
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/users', formData);
      // Refetch users after adding a new one
      const response = await axios.get('http://localhost:5000/users');
      setUsers(response.data);
      setFormData({ name: '', dateOfBirth: '', email: '' }); // Reset form
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Error adding user');
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" onChange={handleChange} value={formData.name} required />
        <input type="date" name="dateOfBirth" onChange={handleChange} value={formData.dateOfBirth} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} value={formData.email} required />
        <button type="submit">Add User</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date of Birth</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{new Date(user.dateOfBirth).toLocaleDateString()}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
