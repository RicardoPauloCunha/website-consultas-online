enum EspecialidadeEnum {
    ClinicoGeral = "CLINICO_GERAL",
    Cardiologista = "CARDIOLOGISTA",
    Ginecologista = "GINECOLOGISTA",
    Urologista = "UROLOGISTA",
    Nutricionista = "NUTRICIONISTA",
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
    let list: EspecialidadeEnum[] = [
        EspecialidadeEnum.ClinicoGeral,
        EspecialidadeEnum.Cardiologista,
        EspecialidadeEnum.Ginecologista,
        EspecialidadeEnum.Urologista,
        EspecialidadeEnum.Nutricionista,
    ];

    return list;
}

export default EspecialidadeEnum;