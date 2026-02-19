// lib/auth.js
export const users = [
  {
    id: 1,
    email: 'admin@mahapolice.gov.in',
    password: 'admin123', // In production, use hashed passwords!
    role: 'admin',
    name: 'System Administrator',
    badgeNumber: 'ADMIN-001',
    station: 'Headquarters'
  },
  {
    id: 2,
    email: 'sharma@mahapolice.gov.in',
    password: 'officer123',
    role: 'officer',
    name: 'PI Rajesh Sharma',
    badgeNumber: 'MH-4587',
    station: 'Pune Central PS'
  },
  {
    id: 3,
    email: 'patil@mahapolice.gov.in',
    password: 'officer123',
    role: 'officer', 
    name: 'SI Priya Patil',
    badgeNumber: 'MH-5623',
    station: 'Mumbai South PS'
  }
];

export function authenticateUser(email, password) {
  return users.find(user => user.email === email && user.password === password);
}

export function getUserRole(email) {
  const user = users.find(user => user.email === email);
  return user ? user.role : null;
}