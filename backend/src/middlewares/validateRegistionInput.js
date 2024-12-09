/** Validate User Registration Middleware */

export const validateRegistionInput = (req, res, next) => {
  const errors = [];

  const { email, fullName, password } = req.body;

  // Validate email
  if (!fullName || fullName.trim().length < 3) {
    errors.push('FullName is required');
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('Invalid email address');
  }

  // Validate password
  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

 
  if (errors.length > 0) {
    return res.status(400).json({ 
      success: false,
      message: 'An error occur when registering user',
      errors
    });
  }

  next();
}