enum GeneroEnum {
    Masculino = "MASCULINO",
    Feminino = "FEMININO"
}

export const getValueGenero = (type: GeneroEnum) => {
    switch (type) {
        case GeneroEnum.Masculino:
            return "Masculino";
        case GeneroEnum.Feminino:
            return "Feminino";
        default:
            return "";
    }
}

export const listGenero = () => {
    let list: GeneroEnum[] = [
        GeneroEnum.Masculino,
        GeneroEnum.Feminino
    ];

    return list;
}

export default GeneroEnum;