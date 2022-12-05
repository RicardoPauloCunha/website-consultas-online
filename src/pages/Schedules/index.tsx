import { FormHandles } from "@unform/core";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, Col, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import SchedulingCard from "../../components/DataCard/scheduling";
import DataText from "../../components/DataText";
import MaskInput from "../../components/Input/mask";
import SelectInput from "../../components/Input/select";
import LoadingButton from "../../components/LoadingButton";
import SpinnerBlock from "../../components/SpinnerBlock";
import StatusBadge from "../../components/StatusBadge";
import Warning from "../../components/Warning";
import { useAuth } from "../../contexts/auth";
import Agendamento from "../../services/entities/agendamento";
import EspecialidadeEnum, { getValueEspecialidade, listEspecialidade } from "../../services/enums/especialidade";
import StatusAgendamentoEnum, { defineColorStatusAgendamento, getValueStatusAgendamento, listStatusAgendamento } from "../../services/enums/statusAgendamento";
import TipoUsuarioEnum from "../../services/enums/tipoUsuario";
import { listSchedulingByParamsHttp, listSchedulingBySpecialtyHttp, patchSchedulingHttp } from "../../services/http/scheduling";
import { DataModal, Form, TextGroupGrid } from "../../styles/components";
import DocumentTitle from "../../util/documentTitle";
import { formatCellphone, formatCpf, normalizeDate, normalizeString } from "../../util/formatString";
import { WarningTuple } from "../../util/getHttpErrors";

type ModalString = "update" | "schedule" | "";

const Schedules = () => {
    const location = useLocation();
    const formRef = useRef<FormHandles>(null);

    const { loggedUser } = useAuth();

    const _specialties = listEspecialidade();
    const _scheduleStatus = listStatusAgendamento();

    const [isLoading, setIsLoading] = useState<"get" | "update" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);
    const [modal, setModal] = useState<ModalString>("");
    const [isReceptionist, setIsReceptionist] = useState(false);
    const [isReport, setIsReport] = useState(false);

    const [schedules, setSchedules] = useState<Agendamento[]>([]);
    const [scheduleIndex, setScheduleIndex] = useState(-1);

    useEffect(() => {
        let receptionist = loggedUser?.userType === TipoUsuarioEnum.Recepcionista;
        setIsReceptionist(receptionist);

        let report = location.pathname.split("/")[1] === "relatorios-consultas";
        setIsReport(report);

        setIsLoading("get");

        if (report) {
            let specialty = EspecialidadeEnum.ClinicoGeral;

            getSchedulesReport(specialty);

            setTimeout(() => {
                formRef.current?.setFieldValue("specialty", specialty);
            }, 200);
        }
        else {
            if (receptionist)
                getSchedules(undefined, undefined);
            else if (loggedUser)
                getSchedules(undefined, loggedUser.cpf);
        }
        // eslint-disable-next-line
    }, [location.pathname]);

    const getSchedules = (scheduleStatus: StatusAgendamentoEnum | undefined, cpf: string | undefined) => {
        setWarning(["", ""]);

        setIsLoading("get");
        listSchedulingByParamsHttp({
            cpf: cpf,
            status: scheduleStatus
        }).then(response => {
            defineSchedules(response);
        });
    }

    const getSchedulesReport = (specialty: EspecialidadeEnum) => {
        setWarning(["", ""]);

        setIsLoading("get");
        listSchedulingBySpecialtyHttp(specialty).then(response => {
            defineSchedules(response);
        });
    }

    const toggleModal = (modalName?: ModalString) => {
        if (typeof (modalName) === "string") {
            setModal(modalName);
            setWarning(["", ""]);
        }
        else {
            setModal("");
        }
    }

    const defineSchedules = (schedules: Agendamento[]) => {
        setSchedules([...schedules]);

        if (schedules.length === 0)
            setWarning(["warning", "Nenhum agendamento foi encontrado."]);

        setIsLoading("");
    }

    const sendChangeStatus = (statusAgendamento: StatusAgendamentoEnum) => {
        setIsLoading("update");

        schedules[scheduleIndex].status = statusAgendamento;

        patchSchedulingHttp(schedules[scheduleIndex].id, schedules[scheduleIndex]).then(() => {
            setWarning(["success", "Status do agendamento editado com sucesso."]);
            toggleModal();
        }).catch(() => {
            setWarning(["danger", "Não foi possível editar o status do agendamento."]);
        }).finally(() => { setIsLoading(""); })
    }

    const handlerChangeScheduleStatus = (optionValue: string) => {
        let scheduleStatus = optionValue as StatusAgendamentoEnum;
        let cpf: string | undefined = undefined;

        if (isReceptionist) {
            cpf = normalizeString(formRef.current?.getFieldValue("patientCpf"));

            if (cpf?.length !== 11)
                cpf = undefined;
        }
        else if (loggedUser) {
            cpf = loggedUser.cpf;
        }
        else {
            setIsLoading("get");
        }

        getSchedules(scheduleStatus, cpf);
    }

    const handlerSearchScheduleByCpf = () => {
        setWarning(["", ""]);
        formRef.current?.setFieldError("patientCpf", "");

        let cpf = normalizeString(formRef.current?.getFieldValue("patientCpf"));

        if (cpf?.length !== 11) {
            formRef.current?.setFieldError("patientCpf", "O CPF do paciente está incompleto.");
            return;
        }

        let status = formRef.current?.getFieldValue("scheduleStatus");
        let scheduleStatus = status ? status as StatusAgendamentoEnum : undefined;

        getSchedules(scheduleStatus, cpf);
    }

    const handlerChangeSpecialty = (optionValue: string) => {
        let specialty = optionValue as EspecialidadeEnum;

        getSchedulesReport(specialty);
    }

    const onClickOpenSchedule = (scheduleId: number) => {
        let index = schedules.findIndex(x => x.id === scheduleId);

        setScheduleIndex(index);
        toggleModal("schedule");
    }

    const onClickChangeStatus = () => {
        toggleModal("update");
    }

    DocumentTitle("Agendamentos | CM");

    return (
        <>
            <h1>Lista de agendamentos</h1>

            <Form
                ref={formRef}
                onSubmit={() => { }}
                className="form-search"
            >
                {isReport
                    ? <>
                        <SelectInput
                            name='specialty'
                            label='Especialidade'
                            placeholder='Selecione a especialidade'
                            options={_specialties.map(x => ({
                                value: x,
                                label: getValueEspecialidade(x)
                            }))}
                            handlerChange={handlerChangeSpecialty}
                        />
                    </>
                    : <>
                        <SelectInput
                            name='scheduleStatus'
                            label='Status do agendamento'
                            placeholder='Filtrar pelo status do agendamento'
                            options={_scheduleStatus.map(x => ({
                                value: x,
                                label: getValueStatusAgendamento(x)
                            }))}
                            handlerChange={handlerChangeScheduleStatus}
                        />

                        {isReceptionist && <Row>
                            <Col md={10}>
                                <MaskInput
                                    name='patientCpf'
                                    label='CPF do paciente'
                                    placeholder='000.000.000-00'
                                    mask="999.999.999-99"
                                    maskChar=""
                                />
                            </Col>

                            <Col md={2}>
                                <Button
                                    type="button"
                                    color="secondary"
                                    outline
                                    onClick={() => handlerSearchScheduleByCpf()}
                                >
                                    Buscar
                                </Button>
                            </Col>
                        </Row>}
                    </>
                }

                {modal === "" && <Warning value={warning} />}
            </Form>

            {isLoading === "get" && <SpinnerBlock />}

            {schedules.map(x => (
                <SchedulingCard
                    key={x.id}
                    id={x.id}
                    patientName={x.pacienteNome}
                    time={x.horaAgendada}
                    date={x.dataAgendada}
                    status={x.status}
                    specialty={x.especialidade}
                    doctorName={x.medicoNome}
                    onClickOpenSchedule={onClickOpenSchedule}
                />
            ))}

            <DataModal
                isOpen={modal === "schedule"}
                toggle={toggleModal}
                centered
            >
                <ModalHeader
                    toggle={() => toggleModal()}
                >
                    Dados do agendamento
                </ModalHeader>

                <ModalBody>
                    {schedules[scheduleIndex] && <TextGroupGrid
                        className="text-group-grid-modal"
                    >
                        {(isReceptionist || isReport) && <>
                            <DataText
                                label="Paciente"
                                value={schedules[scheduleIndex].pacienteNome}
                                isFullRow={true}
                            />

                            <DataText
                                label="CPF"
                                value={formatCpf(schedules[scheduleIndex].pacienteCpf)}
                            />

                            <DataText
                                label="Contato"
                                value={formatCellphone(schedules[scheduleIndex].pacienteContato)}
                            />
                        </>}

                        <DataText
                            label="Data"
                            value={new Date(normalizeDate(schedules[scheduleIndex].dataCriacao)).toLocaleDateString()}
                        />

                        <DataText
                            label="Data agendada"
                            value={new Date(schedules[scheduleIndex].dataAgendada + "T" + schedules[scheduleIndex].horaAgendada).toLocaleString()}
                        />

                        <StatusBadge
                            label="Status"
                            status={schedules[scheduleIndex].status}
                            value={getValueStatusAgendamento(schedules[scheduleIndex].status)}
                            defineColor={defineColorStatusAgendamento}
                        />

                        <DataText
                            label="Especialidade"
                            value={getValueEspecialidade(schedules[scheduleIndex].especialidade)}
                            isFullRow={true}
                        />

                        <DataText
                            label="Médico"
                            value={schedules[scheduleIndex].medicoNome}
                        />
                    </TextGroupGrid>}
                </ModalBody>

                <ModalFooter>
                    {!isReport && schedules[scheduleIndex]?.status === StatusAgendamentoEnum.Agendado && <>
                        {isReceptionist && <LoadingButton
                            text="Confirmar comparecimento"
                            isLoading={isLoading === "update"}
                            color="secondary"
                            onClick={() => sendChangeStatus(StatusAgendamentoEnum.Andamento)}
                        />}

                        <Button
                            color="danger"
                            outline
                            onClick={() => onClickChangeStatus()}
                        >
                            Desmarcar
                        </Button>
                    </>}
                </ModalFooter>
            </DataModal>

            <DataModal
                isOpen={modal === "update"}
                toggle={toggleModal}
                centered
            >
                <ModalHeader
                    toggle={() => toggleModal()}
                >
                    Desmarcar agendamento
                </ModalHeader>

                {schedules[scheduleIndex] && <ModalBody>
                    <p>
                        Tem certeza que deseja desmarcar o agendamento {isReceptionist && <>do paciente <b>{schedules[scheduleIndex].pacienteNome}</b></>} para o dia <b>{new Date(schedules[scheduleIndex].dataAgendada + "T" + schedules[scheduleIndex].horaAgendada).toLocaleString()}</b>?
                    </p>

                    <Warning value={warning} />
                </ModalBody>}

                <ModalFooter>
                    <LoadingButton
                        text="Desmarcar"
                        isLoading={isLoading === "update"}
                        color="danger"
                        onClick={() => sendChangeStatus(StatusAgendamentoEnum.Desmarcado)}
                    />
                </ModalFooter>
            </DataModal>
        </>
    );
}

export default Schedules;