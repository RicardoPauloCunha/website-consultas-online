enum TipoUsuarioEnum {
    Gerente = "GERENTE",
    Recepcionista = "RECEPCIONISTA",
    Medico = "MEDICO",
    Paciente = "PACIENTE"
}

export const getValueTipoUsuario = (type: TipoUsuarioEnum) => {
    switch (type) {
        case TipoUsuarioEnum.Gerente:
            return "Gerente";
        case TipoUsuarioEnum.Recepcionista:
            return "Recepcionista";
        case TipoUsuarioEnum.Medico:
            return "Médico";
        case TipoUsuarioEnum.Paciente:
            return "Paciente";
        default:
            return "";
    }
}

export const listTipoUsuario = () => {
    let list: TipoUsuarioEnum[] = [
        TipoUsuarioEnum.Recepcionista,
        TipoUsuarioEnum.Medico,
        TipoUsuarioEnum.Paciente
    ];

    return list;
}

export default TipoUsuarioEnum;