import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3000/api' });

export const getProjects = () => api.get('/projects');
export const createProject = (project) => api.post('/projects', project);
export const updateProject = (id, project) => api.patch(`/projects/${id}`, project);
export const deleteProject = (id) => api.delete(`/projects/${id}`);
