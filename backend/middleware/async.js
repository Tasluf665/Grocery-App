export default function (handler) {
    return async (req, res, next) => {
        try {
            // Execute the provided asynchronous route handler and await its completion.
            await handler(req, res);
        } catch (ex) {
            // If an exception occurs during execution, pass it to the next middleware for error handling.
            next(ex);
        }
    };
};