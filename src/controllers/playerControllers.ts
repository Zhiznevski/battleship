import { WebSocket } from "ws"
import { playersRepository } from "../db/players"
import { validatePlayerCredentials } from "./playerValidation"
import { PlayerDTO } from "../model/player";
import { prepareMessage } from "../utils/prepareMessage";
import { sendErrorMessage } from "./helpers/sendErrorMessage";
import { MESSAGE_TYPES_MAP } from "../consts/messages";

const addPlayer = (ws: WebSocket, data: unknown) => {
    const { isValid, message } = validatePlayerCredentials(data);
    if (!isValid) {
        sendErrorMessage(ws, MESSAGE_TYPES_MAP.REGISTER, message ?? "") // Check if we need to provide index here
        return;
    }
    const { name, password } = data as PlayerDTO;
    const createdPlayer = playersRepository.addPlayer({ name, password })

    ws.send(prepareMessage(MESSAGE_TYPES_MAP.REGISTER, createdPlayer));
}

export const playerControllers = {
    addPlayer,
}