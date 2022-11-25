import TipoEspecialidadeEnum from "../enums/tipoEspecialidade";
import Usuario from "./usuario";

interface Medico extends Usuario {
    crm: string;
    tipoEspecialidade: TipoEspecialidadeEnum;
}

export default Medico;