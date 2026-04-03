import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from './config';

const documentAPI = axios.create({
  baseURL: `${API_URL}/documents`,
});

// Add token to requests
documentAPI.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error('Error adding token to request:', error);
    return config;
  }
});

/**
 * Get all documents with filters
 * @param {Object} params - Query parameters (type, year, category)
 * @returns {Promise<Object>} - Documents data
 */
export const getDocuments = async (params = {}) => {
  try {
    const response = await documentAPI.get('/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get single document by ID
 * @param {string|number} id - Document ID
 * @returns {Promise<Object>} - Document data
 */
export const getDocument = async (id) => {
  try {
    const response = await documentAPI.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching document ${id}:`, error);
    throw error.response?.data || error;
  }
};

/**
 * Upload new document
 * @param {FormData} formData - Document file and metadata
 * @returns {Promise<Object>} - Uploaded document data
 */
export const uploadDocument = async (formData) => {
  try {
    const response = await documentAPI.post('/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error.response?.data || error;
  }
};

/**
 * Update document metadata
 * @param {string|number} id - Document ID
 * @param {Object} data - Updated document data
 * @returns {Promise<Object>} - Updated document
 */
export const updateDocument = async (id, data) => {
  try {
    const response = await documentAPI.put(`/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating document ${id}:`, error);
    throw error.response?.data || error;
  }
};

/**
 * Delete document
 * @param {string|number} id - Document ID
 * @returns {Promise<Object>} - Deletion response
 */
export const deleteDocument = async (id) => {
  try {
    const response = await documentAPI.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting document ${id}:`, error);
    throw error.response?.data || error;
  }
};

/**
 * Get document categories
 * @returns {Promise<Array>} - List of categories
 */
export const getDocumentCategories = async () => {
  try {
    const response = await documentAPI.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get document statistics
 * @param {Object} params - Query parameters (year)
 * @returns {Promise<Object>} - Statistics data
 */
export const getDocumentStats = async (params = {}) => {
  try {
    const response = await documentAPI.get('/stats', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching document stats:', error);
    throw error.response?.data || error;
  }
};

export default {
  getDocuments,
  getDocument,
  uploadDocument,
  updateDocument,
  deleteDocument,
  getDocumentCategories,
  getDocumentStats,
};



