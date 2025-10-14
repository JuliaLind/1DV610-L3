/**
 * Converts errors to JSON responses.
 *
 * Client errors (4xx) are returned as-is.
 * Server errors (5xx) are returned as a generic message in production,
 * but include the stack trace in development.
 *
 * @author Julia Lind
 */
export class ErrorHandler {
  /**
   * Handles errors that occur during request processing.
   *
   * @param {Error} err - The error object.
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - The next middleware function.
   * @returns {void}
   */
  handleError = (err, req, res, next) => {
    if (this.#isClientError(err)) {
      return this.#handleClientError(err, req, res, next)
    }

    return this.#handleServerError(err, req, res, next)
  }

  /**
   * Checks if the error is a client error (4xx).
   *
   * @param {Error} err - The error object.
   */
  #isClientError = (err) => {
    return err?.status < 500
  }

  /**
   * Handles client errors (4xx).
   *
   * @param {Error} err - The error object.
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - The next middleware function.
   */
  #handleClientError = (err, req, res, next) => {
    return res
      .status(err.status)
      .json({
        status_code: err.status,
        message: err.message
      })
  }

  /**
   * Handles server errors (5xx).
   *
   * @param {Error} err - The error object.
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - The next middleware function.
   */
  #handleServerError = (err, req, res, next) => {
    let details = {
      message: 'An unexpected condition was encountered.'
    }

    if (req.app.get('env') === 'development') {
      details = this.#getErrorDetails(err)
    }

    return res
      .status(500)
      .json({ ...details, status_code: 500 })
  }

  /**
   * Returns an object with error message and stack trace.
   *
   * @param {Error} error - the error that has been caught
   * @returns {Object} - the error details
   */
  #getErrorDetails(error) {
    return {
      message: error.message,
      details: error.stack
    }
  }
}
