module.exports = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = Number(err.statusCode) || 500;

  if (statusCode >= 500) {
    console.error('UNHANDLED ERROR:', err);
  }

  return res.status(statusCode).json({
    error: err.message || 'Internal Server Error'
  });
};
