export class ErrorHandler {
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