import React, { useState, useEffect, useCallback } from 'react';
import { Container, Button, Table, Alert, Spinner, Modal, Form, Pagination } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { employeeService } from '../services/employeeService';
import { companyService } from '../services/companyService';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    company_id: '',
    email: '',
    phone: ''
  });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  // Wrap fetchEmployees in useCallback to memoize it
  const fetchEmployees = useCallback(async (pageNum) => {
    try {
      setLoading(true);
      const response = await employeeService.getAll(pageNum, pagination.limit);
      setEmployees(response.data.data);
      setPagination(prev => ({ ...prev, page: pageNum, ...response.data.pagination }));
      setError('');
    } catch (err) {
      setError('Failed to fetch employees');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [pagination.limit]);

  // Wrap fetchCompanies in useCallback to memoize it
  const fetchCompanies = useCallback(async () => {
    try {
      const response = await companyService.getAll(1, 100);
      setCompanies(response.data.data);
    } catch (err) {
      console.error('Failed to fetch companies:', err);
    }
  }, []);

  // Load employees on page change
  useEffect(() => {
    fetchEmployees(pagination.page);
  }, [fetchEmployees, pagination.page]);

  // Load companies on component mount
  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleShowModal = (employee = null) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        first_name: employee.first_name,
        last_name: employee.last_name,
        company_id: employee.company_id,
        email: employee.email || '',
        phone: employee.phone || ''
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        first_name: '',
        last_name: '',
        company_id: '',
        email: '',
        phone: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEmployee(null);
    setFormData({
      first_name: '',
      last_name: '',
      company_id: '',
      email: '',
      phone: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        await employeeService.update(editingEmployee.id, formData);
      } else {
        await employeeService.create(formData);
      }
      // Reset to page 1 after create/update to see changes
      setPagination(prev => ({ ...prev, page: 1 }));
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save employee');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeService.delete(id);
        
        // After deletion, check if we need to adjust the page
        const newTotal = pagination.total - 1;
        const newTotalPages = Math.ceil(newTotal / pagination.limit);
        
        // If current page is now empty, go to previous page
        if (pagination.page > newTotalPages && newTotalPages > 0) {
          setPagination(prev => ({ ...prev, page: newTotalPages, total: newTotal, totalPages: newTotalPages }));
        } else {
          setPagination(prev => ({ ...prev, total: newTotal, totalPages: newTotalPages }));
        }
        
        // Refresh the current page data
        fetchEmployees(Math.min(pagination.page, newTotalPages));
      } catch (err) {
        setError('Failed to delete employee');
        console.error(err);
      }
    }
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  if (loading && employees.length === 0) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Employees</h2>
        <Button variant="primary" onClick={() => handleShowModal()}>
          <FaPlus className="me-2" />
          Add Employee
        </Button>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Company</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">No employees found</td>
            </tr>
          ) : (
            employees.map((employee) => (
              <tr key={employee.id}>
                <td>{(pagination.page - 1) * pagination.limit + employees.indexOf(employee) + 1}</td>
                <td>{employee.first_name}</td>
                <td>{employee.last_name}</td>
                <td>{employee.company_name || 'N/A'}</td>
                <td>{employee.email || 'N/A'}</td>
                <td>{employee.phone || 'N/A'}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleShowModal(employee)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(employee.id)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {pagination.totalPages > 1 && (
        <Pagination className="justify-content-center">
          <Pagination.First onClick={() => handlePageChange(1)} disabled={pagination.page === 1} />
          <Pagination.Prev onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1} />
          {[...Array(pagination.totalPages)].map((_, i) => (
            <Pagination.Item
              key={i + 1}
              active={i + 1 === pagination.page}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page === pagination.totalPages} />
          <Pagination.Last onClick={() => handlePageChange(pagination.totalPages)} disabled={pagination.page === pagination.totalPages} />
        </Pagination>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingEmployee ? 'Edit Employee' : 'Add Employee'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>First Name *</Form.Label>
              <Form.Control
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name *</Form.Label>
              <Form.Control
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Company *</Form.Label>
              <Form.Select
                value={formData.company_id}
                onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
                required
              >
                <option value="">Select a company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingEmployee ? 'Update' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Employees;