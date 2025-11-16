// import { RawData } from "ws";
// import { Message, MessageType } from "../types/message";

// const validateResponse = (res: unknown): Message | undefined => {
//     if (res === null || typeof res !== "object" || !("type" in res) || !("data" in res) || !("id" in res)) return undefined;
//     return {
//         data: res.data,
//         id: 0,
//         type: res.type as MessageType,
//     };
// }

// const RES_ERROR_MESSAGE = "Response data is invalid";

// export const parseMessage = (data: RawData): Message | undefined => {
//     try {
//         const res = JSON.parse(data.toString())
//         const message = validateResponse(res)
//         if (!message) {
//             throw new Error(RES_ERROR_MESSAGE)
//         }
//         return JSON.parse(res.data)
//     } catch (e) {
//         console.error(e)
//     }
// }
