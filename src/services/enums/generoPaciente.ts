enum GeneroPacienteEnum {
    Masculino = 1,
    Feminino = 2
}

export const getValueGeneroPaciente = (type: GeneroPacienteEnum) => {
    switch (type) {
        case GeneroPacienteEnum.Masculino:
            return "Masculino";
        case GeneroPacienteEnum.Feminino:
            return "Feminino";
        default:
            return "";
    }
}

export const listGeneroPaciente = () => {
    let list: string[] = [];

    for (let i = 1; i <= 2; i++)
        list.push(getValueGeneroPaciente(i));

    return list;
}

export default GeneroPacienteEnum;