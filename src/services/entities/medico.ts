import Usuario from "./usuario";

import TipoEspecialidadeEnum from "../enums/tipoEspecialidade";

interface Medico extends Usuario {
    crm: string;
    tipoEspecialidade: TipoEspecialidadeEnum;
}

export default Medico;