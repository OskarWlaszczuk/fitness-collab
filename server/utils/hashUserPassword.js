import bcrypt from "bcrypt";

export const hashUserPassword = async (userPassword) => {
    try {
        const hashedPassword = await bcrypt.hash(userPassword, 10);
        return hashedPassword
    } catch (error) {
        throw error
    }
};