import { FormHandles } from "@unform/core";
import { useEffect, useRef, useState } from "react";
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
import StatusAgendamentoEnum, { defineColorStatusAgendamento, getValueStatusAgendamento, listStatusAgendamento } from "../../services/enums/statusAgendamento";
import { getValueTipoEspecialidade } from "../../services/enums/tipoEspecialidade";
import TipoUsuarioEnum from "../../services/enums/tipoUsuario";
import { listReceptionistSchedulingByParamsHttp, putSchedulingHttp } from "../../services/http/scheduling";
import { DataModal, Form, TextGroupGrid } from "../../styles/components";
import DocumentTitle from "../../util/documentTitle";
import { formatCellphone, formatCpf, normalizeDate, normalizeString } from "../../util/formatString";
import { WarningTuple } from "../../util/getHttpErrors";

type ModalString = "update" | "schedule" | "";

const Schedules = () => {
    const filterFormRef = useRef<FormHandles>(null);

    const { loggedUser } = useAuth();

    const _scheduleStatus = listStatusAgendamento();

    const [isLoading, setIsLoading] = useState<"get" | "update" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);
    const [modal, setModal] = useState<ModalString>("");
    const [isReceptionist, setIsReceptionist] = useState(false);

    const [schedules, setSchedules] = useState<Agendamento[]>([]);
    const [scheduleIndex, setScheduleIndex] = useState(-1);

    useEffect(() => {
        let receptionist = loggedUser?.userType === TipoUsuarioEnum.Recepcionista;
        setIsReceptionist(receptionist);

        if (receptionist)
            getSchedules(undefined, undefined);
        else if (loggedUser)
            getSchedules(undefined, loggedUser.cpf);
        else
            setIsLoading("get");
        // eslint-disable-next-line
    }, []);

    const getSchedules = (scheduleStatus: number | undefined, cpf: string | undefined) => {
        setWarning(["", ""]);

        scheduleStatus = scheduleStatus === 0 ? undefined : scheduleStatus;

        setIsLoading("get");
        listReceptionistSchedulingByParamsHttp({
            cpf: cpf,
            status: scheduleStatus
        }).then(response => {
            setSchedules([...response]);

            if (response.length === 0)
                setWarning(["warning", "Nenhum agendamento foi encontrado."]);

            setIsLoading("");
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

    const sendChangeStatus = (statusAgendamento: StatusAgendamentoEnum) => {
        setIsLoading("update");

        schedules[scheduleIndex].status = statusAgendamento;

        putSchedulingHttp(schedules[scheduleIndex]).then(() => {
            setWarning(["success", "Status do agendamento editado com sucesso."]);
            toggleModal();
        }).catch(() => {
            setWarning(["danger", "Não foi possível editar o status do agendamento."]);
        }).finally(() => { setIsLoading(""); })
    }

    const handlerChangeScheduleStatus = (optionValue: string) => {
        let scheduleStatus = Number(optionValue);
        let cpf: string | undefined = undefined;

        if (isReceptionist) {
            cpf = normalizeString(filterFormRef.current?.getFieldValue("patientCpf"));

            if (cpf.length !== 11)
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

        filterFormRef.current?.setFieldError("patientCpf", "");
        let cpf = normalizeString(filterFormRef.current?.getFieldValue("patientCpf"));

        if (cpf.length !== 11) {
            filterFormRef.current?.setFieldError("patientCpf", "O CPF do paciente está incompleto.");
            return;
        }

        let scheduleStatus: number | null = Number(filterFormRef.current?.getFieldValue("scheduleStatus"));

        getSchedules(scheduleStatus, cpf);
    }

    const onClickOpenSchedule = (scheduleId: number) => {
        let index = schedules.findIndex(x => x.idAgendamento === scheduleId);
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
                ref={filterFormRef}
                onSubmit={() => { }}
                className="form-search"
            >
                <SelectInput
                    name='scheduleStatus'
                    label='Status do agendamento'
                    placeholder='Filtrar pelo status do agendamento'
                    options={_scheduleStatus.map((x, index) => ({
                        value: `${index + 1}`,
                        label: x
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

                {modal === "" && <Warning value={warning} />}
            </Form>

            {isLoading === "get" && <SpinnerBlock />}

            {schedules.map(x => (
                <SchedulingCard
                    key={x.idAgendamento}
                    id={x.idAgendamento}
                    patientName={x.paciente.nome}
                    time={x.horaAgendada}
                    date={x.dataAgendada}
                    status={x.status}
                    specialty={x.tipoEspecialidade}
                    doctorName={x.medico.nome}
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
                        <DataText
                            label="Paciente"
                            value={schedules[scheduleIndex].paciente.nome}
                            isFullRow={true}
                        />

                        <DataText
                            label="CPF"
                            value={formatCpf(schedules[scheduleIndex].paciente.cpf)}
                        />

                        <DataText
                            label="Contato"
                            value={formatCellphone(schedules[scheduleIndex].paciente.contato)}
                        />

                        <DataText
                            label="Data"
                            value={new Date(normalizeDate(schedules[scheduleIndex].dataCriacao)).toLocaleDateString()}
                        />

                        <DataText
                            label="Data agendada"
                            value={new Date(schedules[scheduleIndex].dataAgendada + "T" + schedules[scheduleIndex].horaAgendada).toLocaleString()}
                        />

                        <StatusBadge
                            label="update"
                            status={schedules[scheduleIndex].status}
                            value={getValueStatusAgendamento(schedules[scheduleIndex].status)}
                            defineColor={defineColorStatusAgendamento}
                        />

                        <DataText
                            label="Especialidade"
                            value={getValueTipoEspecialidade(schedules[scheduleIndex].tipoEspecialidade)}
                            isFullRow={true}
                        />

                        <DataText
                            label="Médico"
                            value={schedules[scheduleIndex].medico.nome}
                        />
                    </TextGroupGrid>}
                </ModalBody>

                <ModalFooter>
                    {schedules[scheduleIndex]?.status === StatusAgendamentoEnum.Scheduled && <>
                        <LoadingButton
                            text="Confirmar comparecimento"
                            isLoading={isLoading === "update"}
                            color="secondary"
                            onClick={() => sendChangeStatus(StatusAgendamentoEnum.Progress)}
                        />

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
                        Tem certeza que deseja desmarcar o agendamento do paciente <b>{schedules[scheduleIndex].paciente.nome}</b> para o dia <b>{new Date(schedules[scheduleIndex].dataAgendada + "T" + schedules[scheduleIndex].horaAgendada).toLocaleString()}</b>?
                    </p>

                    <Warning value={warning} />
                </ModalBody>}

                <ModalFooter>
                    <LoadingButton
                        text="Desmarcar"
                        isLoading={isLoading === "update"}
                        color="danger"
                        onClick={() => sendChangeStatus(StatusAgendamentoEnum.Unchecked)}
                    />
                </ModalFooter>
            </DataModal>
        </>
    );
}

export default Schedules;