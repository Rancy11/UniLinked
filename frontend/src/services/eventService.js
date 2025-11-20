import API from '../api';

export const eventService = {
  // Get all events
  getAllEvents: async (params = {}) => {
    const response = await API.get('/events', { params });
    return response.data;
  },

  // Get past events
  getPastEvents: async () => {
    const response = await API.get('/events/past/all');
    return response.data;
  },

  // Register for event
  registerForEvent: async (eventId, registrationData) => {
    const response = await API.post(`/events/${eventId}/register`, registrationData);
    return response.data;
  },

  // Get event participants (for alumni/admin/teacher)
  getEventParticipants: async (eventId) => {
    const response = await API.get(`/events/${eventId}/participants`);
    return response.data;
  },

  // Get event registrations (detailed format)
  getEventRegistrations: async (eventId) => {
    const response = await API.get(`/events/${eventId}/registrations`);
    return response.data;
  },

  // Like event
  likeEvent: async (eventId) => {
    const response = await API.post(`/events/${eventId}/like`);
    return response.data;
  },

  // Create event
  createEvent: async (eventData) => {
    const response = await API.post('/events', eventData);
    return response.data;
  },

  // Update event
  updateEvent: async (eventId, eventData) => {
    const response = await API.put(`/events/${eventId}`, eventData);
    return response.data;
  },

  // Delete event
  deleteEvent: async (eventId) => {
    const response = await API.delete(`/events/${eventId}`);
    return response.data;
  }
};

export default eventService;
