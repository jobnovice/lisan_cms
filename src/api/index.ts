// Main exports
export * from './types';
export * from './mock';

// Default service instance
import { MockApiClient } from './mock';
export const apiService = new MockApiClient();