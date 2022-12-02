import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PatientCollapseCard from "../../components/CollapseCard/patient";
import AttendanceCard from "../../components/DataCard/attendance";
import SpinnerBlock from "../../components/SpinnerBlock";
import Warning from "../../components/Warning";
import Atendimento from "../../services/entities/atendimento";
import Paciente from "../../services/entities/paciente";
import { ListAttendanceByParamsHttp } from "../../services/http/attendance";
import { getPatientByParamsHttp } from "../../services/http/patient";
import DocumentTitle from "../../util/documentTitle";
import { WarningTuple } from "../../util/getHttpErrors";

const PatientAttendances = () => {
    const routeParams = useParams();

    const [isLoading, setIsLoading] = useState<"get" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);

    const [patient, setPatient] = useState<Paciente | undefined>(undefined);
    const [attendances, setAttendances] = useState<Atendimento[]>([]);

    useEffect(() => {
        getPatient();
        // eslint-disable-next-line
    }, []);

    const getAttendances = (userId: number) => {
        ListAttendanceByParamsHttp({
            idPaciente: userId
        }).then(response => {
            setAttendances([...response]);

            if (response.length === 0)
                setWarning(["warning", "Nenhum atendimento do paciente foi encontrado."]);

            setIsLoading("");
        });
    }

    const getPatient = () => {
        setWarning(["", ""]);
        setIsLoading("get");

        if (routeParams.patientCpf) {
            getPatientByParamsHttp({
                cpf: routeParams.patientCpf
            }).then(response => {
                setPatient(response);
                getAttendances(response.id);
            }).catch(() => {
                setWarning(["danger", "Paciente inválido."]);
                setIsLoading("");
            });
        }
    }

    DocumentTitle("Atendimentos do paciente | CM");

    return (
        <>
            <h1>Histórico de atendimentos do paciente</h1>

            {isLoading === "get" && <SpinnerBlock />}

            {patient !== undefined && <PatientCollapseCard
                alterColor={true}
                cpf={patient.cpf}
                name={patient.nome}
                contact={patient.contato}
                address={patient.endereco}
            />}

            <Warning value={warning} />

            {attendances.map(x => (
                <AttendanceCard
                    key={x.id}
                    id={x.id}
                    date={x.dataCriacao}
                    specialty={x.agendamentoEspecialidade}
                    doctorName={x.agendamentoMedicoNome}
                    description={x.descricao}
                />
            ))}
        </>
    );
}

export default PatientAttendances;