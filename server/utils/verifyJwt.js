import util from "util";
import jwt from "jsonwebtoken";

export const verifyJwt = util.promisify(jwt.verify);