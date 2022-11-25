import { FormHandles, SubmitHandler } from "@unform/core";
import { useEffect, useRef, useState } from "react";
import { Col, Row } from "reactstrap";
import * as Yup from "yup";
import PatientCollapseCard from "../../components/CollapseCard/patient";
import FieldInput from "../../components/Input";
import MaskInput from "../../components/Input/mask";
import SelectInput from "../../components/Input/select";
import LoadingButton from "../../components/LoadingButton";
import Warning from "../../components/Warning";
import { useAuth } from "../../contexts/auth";
import Medico from "../../services/entities/medico";
import Paciente from "../../services/entities/paciente";
import StatusAgendamentoEnum from "../../services/enums/statusAgendamento";
import { listTipoEspecialidade } from "../../services/enums/tipoEspecialidade";
import TipoUsuarioEnum from "../../services/enums/tipoUsuario";
import { listDoctorByParamsHttp } from "../../services/http/doctor";
import { getPatientByCpfHttp } from "../../services/http/patient";
import { postSchedulingHttp } from "../../services/http/scheduling";
import { Form } from "../../styles/components";
import DocumentTitle from "../../util/documentTitle";
import { normalizeString } from "../../util/formatString";
import { WarningTuple } from "../../util/getHttpErrors";
import getValidationErrors from "../../util/getValidationErrors";

type SchedulingFormData = {
    patientCpf: string;
    specialtyType: number;
    doctorId: number;
    time: string;
    date: string;
}

const RegisterScheduling = () => {
    const schedulingFormRef = useRef<FormHandles>(null);

    const { loggedUser } = useAuth();

    const _specialtyTypes = listTipoEspecialidade();
    const minDate = new Date().toISOString().substring(0, 10);

    const [isLoading, setIsLoading] = useState<"schedulingForm" | "getPatient" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(["", ""]);
    const [isReceptionist, setIsReceptionist] = useState(false);

    const [doctors, setDoctors] = useState<Medico[]>([]);
    const [patient, setPatient] = useState<Paciente | undefined>(undefined);

    useEffect(() => {
        let receptionist = loggedUser?.userType === TipoUsuarioEnum.Recepcionista;
        setIsReceptionist(receptionist);

        if (!receptionist)
            searchPatient(loggedUser?.cpf);
        // eslint-disable-next-line
    }, []);

    const getDoctors = (specialtyId: number | undefined) => {
        listDoctorByParamsHttp({
            idEspecialidade: specialtyId
        }).then(response => {
            setDoctors([...response]);
        });
    }

    const searchPatient = (cpf?: string) => {
        setWarning(["", ""]);
        schedulingFormRef.current?.setFieldError("patientCpf", "");

        if (isReceptionist)
            cpf = normalizeString(schedulingFormRef.current?.getFieldValue("patientCpf"));

        if (!cpf || cpf.length !== 11) {
            schedulingFormRef.current?.setFieldError("patientCpf", "O CPF do paciente está incompleto.");
            return;
        }

        setIsLoading("getPatient");
        getPatientByCpfHttp(cpf).then(response => {
            setPatient(response);
            setWarning(["success", "Paciente encontrado."]);
        }).catch(() => {
            setWarning(["danger", "Paciente não encontrado. Adicione o paciente para prosseguir o agendamento."]);
        }).finally(() => setIsLoading(""));
    }

    const submitSchedulingForm: SubmitHandler<SchedulingFormData> = async (data, { reset }) => {
        try {
            if (loggedUser === undefined)
                return;

            setIsLoading("schedulingForm");
            setWarning(["", ""]);
            schedulingFormRef.current?.setErrors({});

            const shema = Yup.object().shape({
                patientCpf: Yup.string()
                    .required("Coloque o CPF do paciente."),
                specialtyType: Yup.string().trim()
                    .required("Selecione a especialidade da consulta."),
                doctorId: Yup.string().trim()
                    .required("Selecione o médico que realizará a consulta."),
                time: Yup.string().trim()
                    .required("Coloque o hórario."),
                date: Yup.string()
                    .required("Coloque a data."),
            });

            await shema.validate(data, {
                abortEarly: false
            });

            data.patientCpf = normalizeString(data.patientCpf);

            if (patient === undefined || patient.cpf !== data.patientCpf) {
                setIsLoading("");
                setWarning(["warning", "Campos do agendamento inválidos."]);
                schedulingFormRef.current?.setFieldError("patientCpf", "Busque o paciente pelo CPF para prosseguir.");
                return;
            }

            data.doctorId = Number(data.doctorId);
            data.specialtyType = Number(data.specialtyType);

            postSchedulingHttp({
                userId: loggedUser.userId,
                pacienteCpf: data.patientCpf,
                medicoId: data.doctorId,
                dataAgendada: data.date,
                horaAgendada: data.time,
                tipoEspecialidade: data.specialtyType,
                status: StatusAgendamentoEnum.Scheduled
            }).then(() => {
                setWarning(["success", "Agendamento cadastrado com sucesso."]);
                reset();
                setPatient(undefined);
            }).catch(() => {
                setWarning(["danger", "Não foi possível cadastrar o agendamento."]);
            }).finally(() => { setIsLoading(""); });
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                schedulingFormRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos do agendamento inválidos."]);
            setIsLoading("");
        }
    }

    const handlerChangeSpecialtyType = (optionValue: string) => {
        let specialtyType = Number(optionValue);

        getDoctors(specialtyType);
    }

    DocumentTitle("Cadastrar agendamento | CM");

    return (
        <>
            <h1>Cadastro de agendamento</h1>

            <Form
                ref={schedulingFormRef}
                onSubmit={submitSchedulingForm}
                className="form-data"
            >
                <Row>
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
                        <LoadingButton
                            text="Buscar"
                            isLoading={isLoading === "getPatient"}
                            type="button"
                            color="secondary"
                            outline
                            onClick={() => searchPatient()}
                        />
                    </Col>
                </Row>

                {patient && <>
                    <PatientCollapseCard
                        cpf={patient.cpf}
                        name={patient.nome}
                        contact={patient.contato}
                        address={patient.endereco}
                    />

                    <SelectInput
                        name='specialtyType'
                        label='Especialidade'
                        placeholder='Selecione a especialidade'
                        options={_specialtyTypes.map((x, index) => ({
                            value: `${index + 1}`,
                            label: x
                        }))}
                        handlerChange={handlerChangeSpecialtyType}
                    />

                    <SelectInput
                        name='doctorId'
                        label='Médico'
                        placeholder='Selecione o médico'
                        options={doctors.map(x => ({
                            value: x.idUsuario.toString(),
                            label: x.nome
                        }))}
                    />

                    <Row>
                        <Col md={6}>
                            <FieldInput
                                name='date'
                                label='Data'
                                placeholder='Selecione a data'
                                type="date"
                                min={minDate}
                            />
                        </Col>

                        <Col md={6}>
                            <FieldInput
                                name='time'
                                label='Horário'
                                placeholder='Selecione o horário'
                                type="time"
                                min="08:00"
                                max="16:00"
                            />
                        </Col>
                    </Row>
                </>}

                <Warning value={warning} />

                <LoadingButton
                    text="Cadastrar"
                    isLoading={isLoading === "schedulingForm"}
                    type="submit"
                    color="secondary"
                />
            </Form>
        </>
    );
}

export default RegisterScheduling;