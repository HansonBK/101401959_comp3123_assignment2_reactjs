import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const [searchDept, setSearchDept] = useState('');
  const [searchPosition, setSearchPosition] = useState('');

  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await API.get('/emp/employees');
      setEmployees(response.data || []);
    } catch (err) {
      console.error('Fetch employees error:', err);
      const msg =
        err.response?.data?.message || 'Failed to load employees.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter((emp) => {
    const matchesDept = searchDept
      ? emp.department.toLowerCase().includes(searchDept.toLowerCase())
      : true;

    const matchesPosition = searchPosition
      ? emp.position.toLowerCase().includes(searchPosition.toLowerCase())
      : true;

    return matchesDept && matchesPosition;
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    try {
      setDeletingId(id);
      setError('');
      await API.delete('/emp/employees', {
        params: { eid: id },
      });

      setEmployees((prev) => prev.filter((emp) => emp.employee_id !== id));
    } catch (err) {
      console.error('Delete employee error:', err);
      const msg =
        err.response?.data?.message || 'Failed to delete employee.';
      setError(msg);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <h2>Employees</h2>

      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>
      )}

      <button
        style={{ padding: '8px 12px', marginBottom: '10px' }}
        onClick={() => navigate('/employees/add')}
      >
        Add Employee
      </button>

      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Search by Department"
          value={searchDept}
          onChange={(e) => setSearchDept(e.target.value)}
          style={{ padding: '6px', marginRight: '10px' }}
        />

        <input
          type="text"
          placeholder="Search by Position"
          value={searchPosition}
          onChange={(e) => setSearchPosition(e.target.value)}
          style={{ padding: '6px' }}
        />
      </div>

      {loading ? (
        <p>Loading employees...</p>
      ) : filteredEmployees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '10px',
          }}
        >
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>First Name</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Last Name</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Email</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Position</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Department</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Salary</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp) => (
              <tr key={emp.employee_id}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{emp.first_name}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{emp.last_name}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{emp.email}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{emp.position}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{emp.department}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{emp.salary}</td>

                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  <button
                    style={{ marginRight: '6px' }}
                    onClick={() => navigate(`/employees/${emp.employee_id}/view`)}
                  >
                    View
                  </button>
                  <button
                    style={{ marginRight: '6px' }}
                    onClick={() => navigate(`/employees/${emp.employee_id}/edit`)}
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(emp.employee_id)}
                    disabled={deletingId === emp.employee_id}
                  >
                    {deletingId === emp.employee_id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default EmployeesPage;
