// Auth routes
export const login = () => '/login';
export const register = () => '/register';
export const logout = () => '/logout';
export const forgotPassword = () => '/forgot-password';
export const resetPassword = (token: string) => `/reset-password/${token}`;

// Dashboard routes
export const dashboard = () => '/dashboard';
export const home = () => '/';


// User routes
export const createComplaint = () => 'complaints/create';
export const userComplaints = () => 'complaints';
export const viewComplaint = (id: string | number) => `complaints/${id}`;

// Officer routes
export const officerComplaints = () => '/officer/complaints';
export const officerCategories = () => '/officer/categories';

// Admin routes
export const adminUsers = () => '/admin/users';
export const adminCategories = () => '/admin/categories';
export const adminComplaints = () => '/admin/complaints';

// Settings routes
export const profile = () => '/user/profile';
