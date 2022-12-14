import { FormHandles, SubmitHandler } from "@unform/core";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import * as Yup from "yup";
import SchedulingCard from "../../components/DataCard/scheduling";
import DataText from "../../components/DataText";
import FieldInput from "../../components/Input";
import SelectInput from "../../components/Input/select";
import LoadingButton from "../../components/LoadingButton";
import SpinnerBlock from "../../components/SpinnerBlock";
import StatusBadge from "../../components/StatusBadge";
import Warning from "../../components/Warning";
import { useAuth } from "../../contexts/auth";
import Agendamento from "../../services/entities/agendamento";
import { getValueEspecialidade } from "../../services/enums/especialidade";
import StatusAgendamentoEnum, { defineColorStatusAgendamento, getValueStatusAgendamento, listStatusAgendamento } from "../../services/enums/statusAgendamento";
import { postAttendanceHttp } from "../../services/http/attendance";
import { listDoctorSchedulingByParamsHttp, patchSchedulingHttp } from "../../services/http/scheduling";
import { DataModal, Form, TextGroupGrid } from "../../styles/components";
import DocumentTitle from "../../util/documentTitle";
import { normalizeDate, normalizeString } from "../../util/formatString";
import { WarningTuple } from "../../util/getHttpErrors";
import getValidationErrors from "../../util/getValidationErrors";

type AttendanceFormData = {
    description: string;
}

type ModalString = "schedule" | "attendace" | "";

const DoctorSchedules = () => {
    const navigate = useNavigate();
    const filterFormRef = useRef<FormHandles>(null);
    const attendanceFormRef = useRef<FormHandles>(null);

    const { loggedUser } = useAuth();

    const _scheduleStatuses = listStatusAgendamento();

    const [isLoading, setIsLoading] = useState<"get" | "attendance" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);
    const [modal, setModal] = useState<ModalString>("");
    const [periods] = useState<[string, string][]>([
        ["-30", "??ltimo m??s"],
        ["-7", "??ltima semana"],
        ["-1", "Ontem"],
        ["0", "Hoje"],
        ["1", "Amanh??"],
        ["7", "Pr??xima semana"],
        ["30", "Pr??ximo m??s"],
    ]);

    const [schedules, setSchedules] = useState<Agendamento[]>([]);
    const [scheduleIndex, setScheduleIndex] = useState(-1);

    useEffect(() => {
        getSchedules(undefined, undefined);
        // eslint-disable-next-line
    }, [loggedUser]);

    const getSchedules = (period: number | undefined, status: StatusAgendamentoEnum | undefined) => {
        setWarning(["", ""]);

        if (loggedUser) {
            setIsLoading("get");
            listDoctorSchedulingByParamsHttp({
                idMedico: loggedUser.userId,
                dias: period,
                status
            }).then(response => {
                setSchedules([...response]);

                if (response.length === 0)
                    setWarning(["warning", "Nenhum agendamento foi encontrado."]);

                setIsLoading("");
            });
        }
        else {
            setWarning(["warning", "Nenhum agendamento foi encontrado."]);
        }
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

    const sendChangeSchedulingStatus = async (index: number) => {
        schedules[index].status = StatusAgendamentoEnum.Concluido;

        await patchSchedulingHttp(schedules[index].id, schedules[index]).catch(() => {
            setWarning(["danger", "N??o foi poss??vel atualizar o status do agendamento."]);
            setIsLoading("");
        });
    }

    const submitAttendanceForm: SubmitHandler<AttendanceFormData> = async (data, { reset }) => {
        try {
            setIsLoading("attendance");
            setWarning(["", ""]);
            attendanceFormRef.current?.setErrors({});

            const shema = Yup.object().shape({
                description: Yup.string().trim()
                    .required("Coloque a descri????o do atendimento.")
            });

            await shema.validate(data, {
                abortEarly: false
            });

            await postAttendanceHttp({
                idAgendamento: schedules[scheduleIndex].id,
                descricao: data.description
            }).then(() => {
                sendChangeSchedulingStatus(scheduleIndex).then(() => {
                    setWarning(["success", "Atendimento cadastrado com sucesso."]);
                    toggleModal();
                    reset();
                });
            }).catch(() => {
                setWarning(["danger", "N??o foi poss??vel cadastrar o atendimento."]);
            }).finally(() => { setIsLoading(""); });
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                attendanceFormRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos do atendimento inv??lidos."]);
            setIsLoading("");
        }
    }

    const handlerChangeScheduleStatus = (optionValue: string) => {
        let scheduleStatus = optionValue as StatusAgendamentoEnum;
        let period: number | undefined = Number(filterFormRef.current?.getFieldValue("period"));

        if (isNaN(period) || period === 0)
            period = undefined;

        getSchedules(period, scheduleStatus);
    }

    const handlerChangePeriod = (optionValue: string) => {
        let period = Number(optionValue);
        let status = filterFormRef.current?.getFieldValue("scheduleStatus");
        let scheduleStatus = status ? status as StatusAgendamentoEnum : undefined;

        getSchedules(period, scheduleStatus);
    }

    const onClickOpenSchedule = (scheduleId: number) => {
        let index = schedules.findIndex(x => x.id === scheduleId);

        setScheduleIndex(index);
        toggleModal("schedule");
    }

    const onClickFinalizeAttendance = () => {
        toggleModal("attendace");
    }

    const onClickPatientAttendances = () => {
        navigate("/pacientes/" + normalizeString(schedules[scheduleIndex].pacienteCpf) + "/atendimentos");
    }

    DocumentTitle("Agendamentos m??dicos | CM");

    return (
        <>
            <h1>Lista de agendamentos do m??dico</h1>

            <Form
                ref={filterFormRef}
                onSubmit={() => { }}
                className="form-search"
            >
                <SelectInput
                    name='scheduleStatus'
                    label='Status do agendamento'
                    placeholder='Filtrar pelo status do agendamento'
                    options={_scheduleStatuses.map(x => ({
                        value: x,
                        label: getValueStatusAgendamento(x)
                    }))}
                    handlerChange={handlerChangeScheduleStatus}
                />

                <SelectInput
                    name='period'
                    label='Filtro de per??odo'
                    placeholder='Filtrar pela data de agendamento'
                    options={periods.map(x => ({
                        value: x[0],
                        label: x[1]
                    }))}
                    handlerChange={handlerChangePeriod}
                />

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
                            value={schedules[scheduleIndex].pacienteNome}
                            isFullRow={true}
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
                            label="Status"
                            status={schedules[scheduleIndex].status}
                            value={getValueStatusAgendamento(schedules[scheduleIndex].status)}
                            defineColor={defineColorStatusAgendamento}
                        />

                        <DataText
                            label="Servi??o"
                            value={getValueEspecialidade(schedules[scheduleIndex].especialidade)}
                            isFullRow={true}
                        />
                    </TextGroupGrid>}
                </ModalBody>

                <ModalFooter>
                    {schedules[scheduleIndex]?.status === StatusAgendamentoEnum.Andamento && <Button
                        color="secondary"
                        onClick={() => onClickFinalizeAttendance()}
                    >
                        Finalizar atendimento
                    </Button>}

                    {(schedules[scheduleIndex]?.status === StatusAgendamentoEnum.Andamento
                        || schedules[scheduleIndex]?.status === StatusAgendamentoEnum.Concluido) && <Button
                            color="info"
                            outline
                            onClick={() => onClickPatientAttendances()}
                        >
                            Hist??rico
                        </Button>}
                </ModalFooter>
            </DataModal>

            <DataModal
                isOpen={modal === "attendace"}
                toggle={toggleModal}
                centered
            >
                <ModalHeader
                    toggle={() => toggleModal()}
                >
                    Finalizar atendimento
                </ModalHeader>

                <ModalBody>
                    <Form
                        ref={attendanceFormRef}
                        onSubmit={submitAttendanceForm}
                        className="form-modal"
                    >
                        <FieldInput
                            name='description'
                            label='Descri????o do atendimento'
                            placeholder='Coloque a descri????o do atendimento'
                            type="textarea"
                            rows="4"
                        />

                        <Warning value={warning} />
                    </Form>
                </ModalBody>

                <ModalFooter>
                    <LoadingButton
                        text="Finalizar"
                        isLoading={isLoading === "attendance"}
                        type="button"
                        color="secondary"
                        onClick={() => attendanceFormRef.current?.submitForm()}
                    />
                </ModalFooter>
            </DataModal>
        </>
    );
}

export default DoctorSchedules;