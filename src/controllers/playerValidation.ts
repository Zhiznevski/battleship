import { PlayerDTO } from "../model/player";

type ValidationResult = {
    isValid: boolean,
    message?: string,

}

const ERROR_MESSAGES = {
    REQUIRED: "Name and password fields are required",
    DATA_TYPES: "Name and password must be strings",
    NAME: "Name must be at least 5 symbols",
    PASSWORD: "Password must be at least 4 symbols"


}
export const validatePlayerCredentials = (data: unknown): ValidationResult => {
    if (data === null || typeof data !== "object" || !("name" in data) || !("password" in data)) return { isValid: false, message: ERROR_MESSAGES.REQUIRED };
    const { name, password } = data;
    if (typeof name !== "string" || typeof password !== "string") return { isValid: false, message: ERROR_MESSAGES.DATA_TYPES };
    if (name.length < 5) return { isValid: false, message: ERROR_MESSAGES.NAME };
    if (password.length < 6) return { isValid: false, message: ERROR_MESSAGES.PASSWORD };
    return {
        isValid: true,
    }
}