import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

const Communities = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ department: '', batch: '', interest: '' });
  const [form, setForm] = useState({ 
    name: '', 
    description: '', 
    department: '', 
    batch: '', 
    interest: '' 
  });

  const fetchCommunities = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filters.department) params.department = filters.department;
      if (filters.batch) params.batch = filters.batch;
      if (filters.interest) params.interest = filters.interest;
      const res = await API.get('/community', { params });
      setCommunities(res.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load communities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchCommunities(); 
  }, [filters]);

  const createCommunity = async (e) => {
    e.preventDefault();
    try {
      const payload = { 
        name: form.name, 
        description: form.description, 
        department: form.department, 
        batch: form.batch, 
        interest: form.interest 
      };
      await API.post('/community/create', payload);
      setForm({ name: '', description: '', department: '', batch: '', interest: '' });
      await fetchCommunities();
      alert('Community created successfully!');
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to create community');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#e74c3c', margin: 0 }}>Communities</h1>
        <button 
          onClick={() => document.getElementById('create-community').scrollIntoView({ behavior: 'smooth' })}
          style={{
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s',
            ':hover': {
              backgroundColor: '#c0392b',
              transform: 'translateY(-1px)'
            }
          }}
        >
          <span style={{ fontSize: '18px' }}>+</span> Create Community
        </button>
      </div>

      {/* Search and Filters */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        padding: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '24px'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '16px', color: '#333' }}>Find Communities</h3>
        <form onSubmit={(e) => { e.preventDefault(); fetchCommunities(); }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <input 
                type="text" 
                placeholder="Department" 
                value={filters.department}
                onChange={(e) => setFilters({...filters, department: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  transition: 'all 0.2s',
                  ':focus': {
                    borderColor: '#e74c3c',
                    outline: 'none',
                    boxShadow: '0 0 0 2px rgba(231, 76, 60, 0.2)'
                  }
                }}
              />
            </div>
            <div>
              <input 
                type="text" 
                placeholder="Batch" 
                value={filters.batch}
                onChange={(e) => setFilters({...filters, batch: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  transition: 'all 0.2s',
                  ':focus': {
                    borderColor: '#e74c3c',
                    outline: 'none',
                    boxShadow: '0 0 0 2px rgba(231, 76, 60, 0.2)'
                  }
                }}
              />
            </div>
            <div>
              <input 
                type="text" 
                placeholder="Interest" 
                value={filters.interest}
                onChange={(e) => setFilters({...filters, interest: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  transition: 'all 0.2s',
                  ':focus': {
                    borderColor: '#e74c3c',
                    outline: 'none',
                    boxShadow: '0 0 0 2px rgba(231, 76, 60, 0.2)'
                  }
                }}
              />
            </div>
            <div>
              <button 
                type="submit"
                style={{
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  width: '100%',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s',
                  ':hover': {
                    backgroundColor: '#c0392b',
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Create Community Form */}
      <div id="create-community" style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '24px'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '20px', color: '#1a1a1a' }}>Create New Community</h2>
        <form onSubmit={createCommunity}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333', fontWeight: '500' }}>Community Name</label>
            <input 
              type="text" 
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                transition: 'all 0.2s',
                ':focus': {
                  borderColor: '#e74c3c',
                  outline: 'none',
                  boxShadow: '0 0 0 2px rgba(231, 76, 60, 0.2)'
                }
              }}
            />
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333', fontWeight: '500' }}>Description</label>
            <textarea
              rows="3"
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                resize: 'vertical',
                minHeight: '100px',
                transition: 'all 0.2s',
                ':focus': {
                  borderColor: '#e74c3c',
                  outline: 'none',
                  boxShadow: '0 0 0 2px rgba(231, 76, 60, 0.2)'
                }
              }}
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333', fontWeight: '500' }}>Department</label>
              <input 
                type="text" 
                placeholder="e.g. Computer Science"
                value={form.department}
                onChange={(e) => setForm({...form, department: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  transition: 'all 0.2s',
                  ':focus': {
                    borderColor: '#e74c3c',
                    outline: 'none',
                    boxShadow: '0 0 0 2px rgba(231, 76, 60, 0.2)'
                  }
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333', fontWeight: '500' }}>Batch</label>
              <input 
                type="text" 
                placeholder="e.g. 2023"
                value={form.batch}
                onChange={(e) => setForm({...form, batch: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  transition: 'all 0.2s',
                  ':focus': {
                    borderColor: '#e74c3c',
                    outline: 'none',
                    boxShadow: '0 0 0 2px rgba(231, 76, 60, 0.2)'
                  }
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#333', fontWeight: '500' }}>Interest</label>
              <input 
                type="text" 
                placeholder="e.g. Web Development"
                value={form.interest}
                onChange={(e) => setForm({...form, interest: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  transition: 'all 0.2s',
                  ':focus': {
                    borderColor: '#e74c3c',
                    outline: 'none',
                    boxShadow: '0 0 0 2px rgba(231, 76, 60, 0.2)'
                  }
                }}
              />
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button 
              type="button"
              onClick={() => setForm({ name: '', description: '', department: '', batch: '', interest: '' })}
              style={{
                backgroundColor: 'transparent',
                color: '#666',
                border: '1px solid #ddd',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s',
                ':hover': {
                  backgroundColor: '#f5f5f5',
                  borderColor: '#ccc'
                }
              }}
            >
              Clear
            </button>
            <button 
              type="submit"
              style={{
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s',
                ':hover': {
                  backgroundColor: '#c0392b',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              Create Community
            </button>
          </div>
        </form>
      </div>

      {/* Communities Grid */}
      {loading ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '200px' 
        }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #f3f3f3', 
            borderTop: '4px solid #e74c3c', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite' 
          }}></div>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '24px' 
        }}>
          {communities.map(community => (
            <div 
              key={community._id}
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                ':hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.12)'
                }
              }}
            >
              <div style={{ 
                height: '120px',
                backgroundColor: '#ffebee',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#e74c3c',
                fontSize: '48px',
                fontWeight: 'bold',
                borderBottom: '1px solid #ffcdd2'
              }}>
                {community.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px'
                }}>
                  <h3 style={{ 
                    margin: 0, 
                    fontSize: '18px', 
                    color: '#1a1a1a',
                    fontWeight: '600',
                    lineHeight: '1.4'
                  }}>
                    {community.name}
                  </h3>
                  <span style={{
                    backgroundColor: '#ffebee',
                    color: '#e74c3c',
                    fontSize: '12px',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontWeight: '500',
                    border: '1px solid #ffcdd2',
                    whiteSpace: 'nowrap',
                    marginLeft: '12px'
                  }}>
                    {community.memberCount || 0} {community.memberCount === 1 ? 'Member' : 'Members'}
                  </span>
                </div>
                
                <p style={{ 
                  color: '#555', 
                  fontSize: '14px',
                  margin: '0 0 16px',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  lineHeight: '1.6',
                  minHeight: '68px'
                }}>
                  {community.description || 'No description provided.'}
                </p>
                
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap',
                  gap: '8px',
                  marginBottom: '16px',
                  minHeight: '28px'
                }}>
                  {community.department && (
                    <span style={{
                      backgroundColor: '#e3f2fd',
                      color: '#1565c0',
                      fontSize: '12px',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontWeight: '500'
                    }}>
                      {community.department}
                    </span>
                  )}
                  {community.interest && (
                    <span style={{
                      backgroundColor: '#f3e5f5',
                      color: '#7b1fa2',
                      fontSize: '12px',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontWeight: '500'
                    }}>
                      {community.interest}
                    </span>
                  )}
                </div>
                
                <Link 
                  to={`/communities/${community._id}`}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s',
                    ':hover': {
                      backgroundColor: '#c0392b',
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  View Community
                </Link>
              </div>
            </div>
          ))}
          
          {communities.length === 0 && !loading && (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '16px', color: '#ffcdd2' }}>👥</div>
              <h3 style={{ margin: '0 0 8px', color: '#e74c3c', fontSize: '18px', fontWeight: '500' }}>No communities found</h3>
              <p style={{ color: '#666', marginBottom: '24px', fontSize: '15px' }}>Try adjusting your filters or create a new community</p>
              <button 
                onClick={() => document.getElementById('create-community').scrollIntoView({ behavior: 'smooth' })}
                style={{
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s',
                  ':hover': {
                    backgroundColor: '#c0392b',
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                Create Community
              </button>
            </div>
          )}
        </div>
      )}
      
      {error && (
        <div style={{
          backgroundColor: '#ffebee',
          color: '#c62828',
          padding: '12px 16px',
          borderRadius: '6px',
          marginTop: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}
      
      {/* Add CSS animation for the spinner */}
      <style>{
        `@keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }`
      }</style>
    </div>
  );
};

export default Communities;
