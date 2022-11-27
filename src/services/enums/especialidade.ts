enum EspecialidadeEnum {
    ClinicoGeral = 1,
    Cardiologista = 2,
    Ginecologista = 3,
    Urologista = 4,
    Nutricionista = 5,
}

export const getValueEspecialidade = (type: EspecialidadeEnum) => {
    switch (type) {
        case EspecialidadeEnum.ClinicoGeral:
            return "Clínico geral";
        case EspecialidadeEnum.Cardiologista:
            return "Cardiologista";
        case EspecialidadeEnum.Ginecologista:
            return "Ginecologista";
        case EspecialidadeEnum.Urologista:
            return "Urologista";
        case EspecialidadeEnum.Nutricionista:
            return "Nutricionista";
        default:
            return "";
    }
}

export const listEspecialidade = () => {
    let list: string[] = [];

    for (let i = 1; i <= 5; i++)
        list.push(getValueEspecialidade(i));

    return list;
}

export default EspecialidadeEnum;