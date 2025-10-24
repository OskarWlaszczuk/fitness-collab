export const validatePassword = async (password, password_hash) => {
    try {
        const isValidPassword = await bcrypt.compare(password, password_hash);
        return isValidPassword;
    } catch {
        const error = new CustomError("error occured on password validating ", 409);
        throw error;
    }
};