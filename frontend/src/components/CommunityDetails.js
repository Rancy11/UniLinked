import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';

const CommunityDetails = () => {
  const { id } = useParams();
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [postText, setPostText] = useState('');
  const [joining, setJoining] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.get(`/community/${id}`);
      setCommunity(res.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load community');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  const toggleJoin = async () => {
    if (!community) return;
    setJoining(true);
    try {
      const res = await API.put(`/community/join/${community._id}`);
      const joined = res.data.joined;
      let members = community.members || [];
      if (joined) {
        // optimistic: push placeholder id length++
        members = [...members, 'me'];
      } else {
        members = members.slice(0, Math.max(0, members.length - 1));
      }
      setCommunity({ ...community, members });
      await load();
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to update membership');
    } finally {
      setJoining(false);
    }
  };

  const addPost = async (e) => {
    e.preventDefault();
    if (!postText.trim()) return;
    try {
      await API.post(`/community/${community._id}/post`, { content: postText.trim() });
      setPostText('');
      await load();
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to post');
    }
  };

  if (loading) return <div className="auth-card"><p>Loading...</p></div>;
  if (error) return <div className="auth-card"><p>{error}</p></div>;
  if (!community) return null;

  const memberCount = (community.members || []).length;

  return (
    <div>
      <div className="auth-card">
        <h2 className="auth-title" style={{ color: '#222', marginBottom: 4 }}>{community.name}</h2>
        <p className="auth-subtitle" style={{ color: '#555', margin: 0 }}>{community.description}</p>
        <p className="auth-subtitle" style={{ color: '#777', margin: '6px 0 12px' }}>Members: {memberCount}</p>
        <button className="submit-btn" onClick={toggleJoin} disabled={joining}>
          {joining ? 'Updating...' : 'Join / Leave'}
        </button>
      </div>

      <div className="auth-card" style={{ marginTop: 12, overflow: 'hidden' }}>
        <h3 className="auth-title" style={{ color: '#222', marginBottom: 8 }}>Posts</h3>
        <form className="auth-form" onSubmit={addPost}>
          <div className="form-group">
            <textarea className="form-textarea" rows="3" value={postText} onChange={(e) => setPostText(e.target.value)} placeholder="Share an update..." style={{ color: '#000', background: '#fff', border: '1px solid #000' }} />
          </div>
          <button type="submit" className="submit-btn">Post</button>
        </form>
        <div style={{ marginTop: 12, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {(community.posts || []).slice().reverse().map((p, idx) => (
            <div key={idx} className="auth-card" style={{ margin: 0, flex: '0 0 320px', maxWidth: 320 }}>
              <p style={{ margin: 0, color: '#222' }}>{p.content}</p>
              <p className="auth-subtitle" style={{ color: '#777', margin: 0 }}>by {p.user?.name || 'Member'} on {new Date(p.date).toLocaleString()}</p>
            </div>
          ))}
          {(!community.posts || community.posts.length === 0) && (
            <p className="auth-subtitle" style={{ color: '#555' }}>No posts yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityDetails;
