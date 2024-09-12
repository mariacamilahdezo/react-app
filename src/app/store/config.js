import { Configuration } from 'eisa-api-client';
import { apiUrl } from 'src/env';
import axios from 'axios';

/**
 * Configuration object for API handler.
 * @typedef {Object} Configuration
 * @property {string} basePath - The base URL for API requests.
 */

/**
 * The configuration object for the API handler.
 * @type {Configuration}
 */

// Get access token from local storage
const accessToken = localStorage.getItem('accessToken');

// Create axios instance for API
const axiosInstance = axios.create({
	headers: {
		'Content-Type': 'application/json',
		Authorization: accessToken ? `Bearer ${accessToken}` : '',
	},
});

const config = new Configuration({ basePath: apiUrl });
export { config, axiosInstance };
