enum TipoEspecialidadeEnum {
    ClinicoGeral = 1,
    Cardiologista = 2,
    Ginecologista = 3,
    Urologista = 4,
    Nutricionista = 5,
}

export const getValueTipoEspecialidade = (type: TipoEspecialidadeEnum) => {
    switch (type) {
        case TipoEspecialidadeEnum.ClinicoGeral:
            return "Clínico geral";
        case TipoEspecialidadeEnum.Cardiologista:
            return "Cardiologista";
        case TipoEspecialidadeEnum.Ginecologista:
            return "Ginecologista";
        case TipoEspecialidadeEnum.Urologista:
            return "Urologista";
        case TipoEspecialidadeEnum.Nutricionista:
            return "Nutricionista";
        default:
            return "";
    }
}

export const listTipoEspecialidade = () => {
    let list: string[] = [];

    for (let i = 1; i <= 5; i++)
        list.push(getValueTipoEspecialidade(i));

    return list;
}

export default TipoEspecialidadeEnum;