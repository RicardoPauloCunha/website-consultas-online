enum TipoUsuarioEnum {
    Gerente = 1,
    Recepcionista = 2,
    Medico = 3,
    Paciente = 4
}

export const getValueTipoUsuario = (type: TipoUsuarioEnum) => {
    switch (type) {
        case TipoUsuarioEnum.Gerente:
            return "Administrador";
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

export const listTipoUsuarioToManage = () => {
    let list: string[] = [];

    for (let i = 1; i <= 3; i++)
        list.push(getValueTipoUsuario(i));

    return list;
}

export default TipoUsuarioEnum;