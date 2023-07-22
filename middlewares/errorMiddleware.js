export const errorMiddleWare = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  err.message = err.message || "Internal Server Error";

  res.status(err.statusCode).json({
    success: true,
    message: err.message,
  });
};

export const asyncError = (passedFunction) => (req, res, next) => {
  Promise.resolve(passedFunction(req, res, next)).catch(next); //now this catch next call's the next middleware that it Error.js file
};
