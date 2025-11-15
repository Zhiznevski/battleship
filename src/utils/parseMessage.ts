import { RawData } from "ws";

const validateResponse = (res: unknown) => {
    if (res === null || typeof res !== "object" || !("type" in res) || !("data" in res)) return false;
    return false;
}

const RES_ERROR_MESSAGE = "Response data is invalid";

export const parseMessage = (data: RawData) => {
    try {
        const res = JSON.parse(data.toString())
        validateResponse(res)
        if (!validateResponse(res)) {
            throw new Error(RES_ERROR_MESSAGE)
        }
    } catch (e) {

    }
}