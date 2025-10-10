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
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     * @returns {void}
     */
    handleError = (err, req, res, next) => {
        if (this.#isClientError(err)) {
            return this.#handleClientError(err, req, res, next)
        }

        return this.#handleServerError(err, req, res, next)
    }

    #isClientError = (err) => {
        return err?.status < 500
    }

    #handleClientError = (err, req, res, next) => {
        return res
            .status(err.status)
            .json({
                status_code: err.status,
                message: err.message
            })
    }

    #handleServerError = (err, req, res, next) => {
        const response = {
            status_code: 500,
            message: 'An unexpected condition was encountered.'
        }

        if (req.app.get('env') !== 'development') {
            response.message = err.message
            response.stack = err.stack
        }

        return res
            .status(500)
            .json(response)
    }
}