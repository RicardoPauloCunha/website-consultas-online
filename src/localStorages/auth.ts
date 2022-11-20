import TipoUsuarioEnum from '../services/enums/tipoUsuario';
import { decryptData, encryptData } from '../util/cryptography';

export type TokenData = {
    userId: number;
    name: string;
    cpf: string;
    userType: TipoUsuarioEnum;
}

const LOGGED_USER_KEY = "@Template:logged-user";

export const handlerSignIn = (dataUser: TokenData) => {
    localStorage.setItem(LOGGED_USER_KEY, encryptData(dataUser));

    return dataUser;
}

export const handlerLogout = () => {
    localStorage.clear();
}

export const getLoggedUser = () => {
    let dataHash = localStorage.getItem(LOGGED_USER_KEY);

    if (dataHash === null)
        return undefined;

    try {
        return decryptData(dataHash) as TokenData;
    } catch (error) {
        return undefined;
    }
}

export const userIsAuth = () => {
    let user = getLoggedUser();

    return user !== null;
}
