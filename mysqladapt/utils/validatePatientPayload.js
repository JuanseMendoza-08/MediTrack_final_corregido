const REQUIRED_FIELDS = ['firstName', 'lastName', 'identification', 'birthDate', 'gender'];

module.exports = (payload = {}) => {
  for (const field of REQUIRED_FIELDS) {
    const value = payload[field];

    if (typeof value !== 'string' || value.trim() === '') {
      const error = new Error(`Missing required field: ${field}`);
      error.statusCode = 400;
      throw error;
    }
  }
};
