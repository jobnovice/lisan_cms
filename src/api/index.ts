// Main exports
export * from './types';
export * from './mock';


import { MockApiClient } from './mock';
export const apiService = new MockApiClient();