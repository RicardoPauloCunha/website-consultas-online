import EspecialidadeEnum from "../enums/especialidade";
import Funcionario from "./funcionario";

interface Medico extends Funcionario {
    crm: string;
    especialidade: EspecialidadeEnum;
}

export default Medico;