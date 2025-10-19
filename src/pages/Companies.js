import React, { useState, useEffect, useCallback } from 'react';
import { Container, Button, Table, Alert, Spinner, Modal, Form, Pagination } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { companyService } from '../services/companyService';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', address: '', website: '' });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  // Wrap fetchCompanies in useCallback to memoize it
  const fetchCompanies = useCallback(async (pageNum = pagination.page) => {
    try {
      setLoading(true);
      const response = await companyService.getAll(pageNum, pagination.limit);
      setCompanies(response.data.data);
      setPagination(prev => ({ ...prev, page: pageNum, ...response.data.pagination }));
      setError('');
    } catch (err) {
      setError('Failed to fetch companies');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [pagination.limit]);

  // Now safely include fetchCompanies in dependency array
  useEffect(() => {
    fetchCompanies(pagination.page);
  }, [fetchCompanies, pagination.page]);

  const handleShowModal = (company = null) => {
    if (company) {
      setEditingCompany(company);
      setFormData(company);
    } else {
      setEditingCompany(null);
      setFormData({ name: '', email: '', address: '', website: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCompany(null);
    setFormData({ name: '', email: '', address: '', website: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCompany) {
        await companyService.update(editingCompany.id, formData);
      } else {
        await companyService.create(formData);
      }
      // Reset to page 1 after create/update to see changes
      setPagination(prev => ({ ...prev, page: 1 }));
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save company');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await companyService.delete(id);
        
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
        fetchCompanies(Math.min(pagination.page, newTotalPages));
      } catch (err) {
        setError('Failed to delete company');
        console.error(err);
      }
    }
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  if (loading && companies.length === 0) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Companies</h2>
        <Button variant="primary" onClick={() => handleShowModal()}>
          <FaPlus className="me-2" />
          Add Company
        </Button>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Website</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">No companies found</td>
            </tr>
          ) : (
            companies.map((company) => (
              <tr key={company.id}>
                <td>{company.id}</td>
                <td>{company.name}</td>
                <td>{company.email || 'N/A'}</td>
                <td>{company.website || 'N/A'}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleShowModal(company)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(company.id)}
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
          <Modal.Title>{editingCompany ? 'Edit Company' : 'Add Company'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name *</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
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
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Website</Form.Label>
              <Form.Control
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingCompany ? 'Update' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Companies;