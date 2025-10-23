export const globalErrorHandler = (error, request, response, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";

    console.log("Error caught in globalErrorHandler:", error);

    response
        .status(error.statusCode)
        .json({ message: error.message, status: error.statusCode });
};