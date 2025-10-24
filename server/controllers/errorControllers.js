import { config } from "dotenv";
import { CustomError } from "../utils/CustomError.js"
config();

// const castErrorHandler = (error) => {
//     const message = `Invalid value ${error.value} for filed ${error.path}`

//     return new CustomError(message, 400);
// };

const devErrors = (error, response) => {
    response.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        stack: error.stack,
        error,
    });
};

const prodErrors = (error, response) => {
    error.isOperational ?
        response.status(error.statusCode).json({
            status: error.status,
            message: error.message,
        }) :
        response.status(500).json({
            status: "error",
            message: "Internal server error occurred. Please try again later.",
        });
};

export const globalErrorHandler = (error, request, response, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";

    const nodeEnv = process.env.NODE_ENV;

    switch (nodeEnv) {
        case "development":
            console.log("Error caught in globalErrorHandler:", error);
            devErrors(error, response);
            break;

        case "production":
            // let productionError = { ...error };
            // console.log("Error caught in globalErrorHandler:", error);

            // if (error.name = "CastError") {
            //     productionError = castErrorHandler(error);
            // }

            prodErrors(error, response);
            break;

        default:
            break;
    }
};