/**
 * Input validation utilities
 */

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUsername = (username) => {
  // 3-20 alphanumeric characters, underscores allowed
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 number
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

export const validatePin = (pin) => {
  // Exactly 4 digits
  return /^\d{4}$/.test(pin);
};

export const validateTaskTitle = (title) => {
  return title && title.trim().length >= 5 && title.trim().length <= 100;
};

export const validateTaskDescription = (description) => {
  return description && description.trim().length >= 20 && description.trim().length <= 2000;
};

export const validateBudget = (budget) => {
  const num = typeof budget === 'string' ? parseFloat(budget) : budget;
  return !isNaN(num) && num > 0 && num <= 10000;
};

export const validateDeadline = (deadline) => {
  const d = new Date(deadline);
  const now = new Date();
  // Must be at least 1 hour in the future
  return d > new Date(now.getTime() + 60 * 60 * 1000);
};

export const validateWalletAddress = (address) => {
  // Pi Network wallet address format
  return address && address.length > 10 && /^[a-zA-Z0-9]+$/.test(address);
};

export const getValidationError = (field, value) => {
  switch (field) {
    case 'email':
      return validateEmail(value) ? null : 'Invalid email address';
    case 'username':
      return validateUsername(value) ? null : 'Username must be 3-20 characters (letters, numbers, underscores)';
    case 'password':
      return validatePassword(value) ? null : 'Password must be at least 8 characters with 1 uppercase letter and 1 number';
    case 'pin':
      return validatePin(value) ? null : 'PIN must be exactly 4 digits';
    case 'taskTitle':
      return validateTaskTitle(value) ? null : 'Title must be 5-100 characters';
    case 'taskDescription':
      return validateTaskDescription(value) ? null : 'Description must be 20-2000 characters';
    case 'budget':
      return validateBudget(value) ? null : 'Budget must be between 0 and 10000 Pi';
    case 'deadline':
      return validateDeadline(value) ? null : 'Deadline must be at least 1 hour in the future';
    default:
      return null;
  }
};
