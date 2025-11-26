
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api';

function EditEmployeePage() {
  const { id } = useParams();  
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    position: '',
    salary: '',
    date_of_joining: '',
    department: '',
  });

  const [profilePic, setProfilePic] = useState(null);
  const [currentPicUrl, setCurrentPicUrl] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await API.get(`/emp/employees/${id}`);
        const emp = res.data;

        setForm({
          first_name: emp.first_name || '',
          last_name: emp.last_name || '',
          email: emp.email || '',
          position: emp.position || '',
          salary: emp.salary || '',
          date_of_joining: emp.date_of_joining
            ? new Date(emp.date_of_joining).toISOString().split('T')[0]
            : '',
          department: emp.department || '',
        });

        setCurrentPicUrl(emp.profile_pic_url || null);
      } catch (err) {
        console.error('Fetch employee error:', err);
        setError(
          err.response?.data?.message || 'Failed to load employee details'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccessMsg('');

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (profilePic) {
        formData.append('profile_pic', profilePic);
      }

      await API.put(`/emp/employees/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccessMsg('Employee details updated successfully.');

      setTimeout(() => {
        navigate('/employees');
      }, 1200);
    } catch (err) {
      console.error('Update employee error:', err);
      setError(
        err.response?.data?.message || 'Failed to update employee details'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading employee...</p>;

  if (error && !successMsg)
    return (
      <div>
        <p style={{ color: 'red' }}>{error}</p>
        <Link to="/employees">Back to Employees</Link>
      </div>
    );

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <h2>Edit Employee</h2>

      {successMsg && (
        <p style={{ color: 'green', marginBottom: '10px' }}>{successMsg}</p>
      )}
      {error && (
        <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>
      )}

      {currentPicUrl && (
        <div style={{ marginBottom: '10px' }}>
          <p>Current Profile Picture:</p>
          <img
            src={currentPicUrl}
            alt="Current Profile"
            style={{
              width: 120,
              height: 120,
              objectFit: 'cover',
              borderRadius: '8px',
              border: '1px solid #ccc',
            }}
          />
        </div>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={form.first_name}
          onChange={handleChange}
          required
        /><br/><br/>

        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={form.last_name}
          onChange={handleChange}
          required
        /><br/><br/>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        /><br/><br/>

        <input
          type="text"
          name="position"
          placeholder="Position"
          value={form.position}
          onChange={handleChange}
          required
        /><br/><br/>

        <input
          type="text"
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
          required
        /><br/><br/>

        <input
          type="number"
          name="salary"
          placeholder="Salary"
          value={form.salary}
          onChange={handleChange}
          required
        /><br/><br/>

        <input
          type="date"
          name="date_of_joining"
          value={form.date_of_joining}
          onChange={handleChange}
          required
        /><br/><br/>

        <label>Change Profile Picture (optional):</label><br/>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfilePic(e.target.files[0])}
        /><br/><br/>

        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      <div style={{ marginTop: '16px' }}>
        <Link to="/employees">Back to Employees</Link>
      </div>
    </div>
  );
}

export default EditEmployeePage;
