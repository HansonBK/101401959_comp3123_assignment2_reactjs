
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';

function ViewEmployeePage() {
  const { id } = useParams(); 
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await API.get(`/emp/employees/${id}`);
        console.log('ViewEmployee data:', res.data); 
        setEmployee(res.data);
      } catch (err) {
        console.error('Fetch employee error (view):', err);
        setError(
          err.response?.data?.message || 'Failed to load employee details'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading) return <p>Loading employee...</p>;

  if (error)
    return (
      <div>
        <p style={{ color: 'red' }}>{error}</p>
        <Link to="/employees">Back to Employees</Link>
      </div>
    );

  if (!employee)
    return (
      <div>
        <p>Employee not found.</p>
        <Link to="/employees">Back to Employees</Link>
      </div>
    );

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <h2>Employee Details</h2>

      {}
      {employee.profile_pic_url && (
        <div style={{ marginBottom: '16px' }}>
          <img
            src={employee.profile_pic_url}
            alt="Profile"
            style={{
              width: 150,
              height: 150,
              objectFit: 'cover',
              borderRadius: '8px',
              border: '1px solid #ccc',
            }}
          />
        </div>
      )}

      <p>
        <strong>First Name: </strong>
        {employee.first_name}
      </p>
      <p>
        <strong>Last Name: </strong>
        {employee.last_name}
      </p>
      <p>
        <strong>Email: </strong>
        {employee.email}
      </p>
      <p>
        <strong>Position: </strong>
        {employee.position}
      </p>
      <p>
        <strong>Department: </strong>
        {employee.department}
      </p>
      <p>
        <strong>Salary: </strong>
        {employee.salary}
      </p>
      <p>
        <strong>Date of Joining: </strong>
        {employee.date_of_joining
          ? new Date(employee.date_of_joining).toLocaleDateString()
          : ''}
      </p>

      <div style={{ marginTop: '16px' }}>
        <Link
          to={`/employees/${employee.employee_id}/edit`}
          style={{ marginRight: '12px' }}
        >
          Edit Employee
        </Link>
        <Link to="/employees">Back to Employees</Link>
      </div>
    </div>
  );
}

export default ViewEmployeePage;
