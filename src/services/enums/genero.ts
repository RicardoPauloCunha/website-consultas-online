enum GeneroEnum {
    Masculino = 1,
    Feminino = 2
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
    let list: string[] = [];

    for (let i = 1; i <= 2; i++)
        list.push(getValueGenero(i));

    return list;
}

export default GeneroEnum;