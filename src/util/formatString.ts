const format = (value: string | number, pattern: string) => {
    let i = 0;
    let v = value.toString();
    return pattern.replace(/#/g, _ => v[i++]);
}

export const formatCpf = (value: string | undefined) => {
    if (value)
        return format(value, "###.###.###-##");

    return "";
}

export const formatCellphone = (value: string | undefined) => {
    if (value)
        return format(value, "(##) #####-####");

    return "";
}

export const normalizeString = (value: string | undefined) => {
    if (value)
        return value.replace(/[^0-9]/g, '');

    return "";
}

export const normalizeDate = (value: string | undefined) => {
    if (value) {
        if (value.includes("/")) {
            let dates = value.split("/");
            return `${dates[2]}-${dates[1]}-${dates[0]}T00:00:00`;
        }
        else if (!value.includes("T")) {
            return `${value}T00:00:00`;
        }

        return value;
    }


    return "";
}