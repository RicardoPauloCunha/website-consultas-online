import { FormHandles, SubmitHandler } from '@unform/core';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import FieldInput from '../../components/Input';
import LoadingButton from '../../components/LoadingButton';
import Warning from '../../components/Warning';
import { useAuth } from '../../contexts/auth';
import { getLoggedUser, handlerSignIn } from '../../localStorages/auth';
import Usuario from '../../services/entities/usuario';
import TipoUsuarioEnum from '../../services/enums/tipoUsuario';
import { getPatientCpfByUserIdHttp } from '../../services/http/patient';
import { getUserByIdHttp, postLoginUserHttp } from '../../services/http/user';
import { Form } from '../../styles/components';
import DocumentTitle from '../../util/documentTitle';
import { WarningTuple } from '../../util/getHttpErrors';
import getValidationErrors from '../../util/getValidationErrors';

type LocationData = {
    from: Location;
    message: string;
}

type LoginFormData = {
    email: string;
    password: string;
}

const Login = () => {
    const loginFormRef = useRef<FormHandles>(null);
    const navigate = useNavigate();

    const { defineLoggedUser } = useAuth();

    const location = useLocation()?.state as LocationData;
    const from = location?.from?.pathname || "/home";
    const message = location?.message || "";

    const [isLoading, setIsLoading] = useState<"form" | "">("");
    const [warning, setWarning] = useState<WarningTuple>(location?.message ? ["warning", message] : ["", ""]);

    useEffect(() => {
        getUser();
        // eslint-disable-next-line
    }, []);

    const getUser = async () => {
        let user = getLoggedUser();

        if (user !== undefined) {
            await getUserByIdHttp(user.userId).then(response => {
                handlerLogin(response);
            });
        }
    }

    const getPacientCpf = async (user: Usuario) => {
        await getPatientCpfByUserIdHttp(user.idUsuario).then(response => {
            handlerLogin(user, response);
        }).catch(() => {
            setWarning(["danger", "Dados do paciente não encontrados."]);
        }).finally(() => { setIsLoading(""); });
    }

    const submitLoginForm: SubmitHandler<LoginFormData> = async (data) => {
        try {
            setIsLoading("form");
            setWarning(["", ""]);
            loginFormRef.current?.setErrors({});

            const shema = Yup.object().shape({
                email: Yup.string().trim()
                    .email("E-mail inválido.")
                    .required("Coloque o email da sua conta."),
                password: Yup.string().trim()
                    .required("Coloque a senha da sua conta.")
            });

            await shema.validate(data, {
                abortEarly: false
            });

            await postLoginUserHttp({
                email: data.email,
                senha: data.password
            }).then(response => {
                if (response.tipoUsuario === TipoUsuarioEnum.Paciente)
                    getPacientCpf(response);
                else
                    handlerLogin(response);
            }).catch(() => {
                setWarning(["danger", "Email ou senha inválida."]);
            }).finally(() => { setIsLoading(""); });
        }
        catch (err) {
            if (err instanceof Yup.ValidationError)
                loginFormRef.current?.setErrors(getValidationErrors(err));
            setWarning(["warning", "Campos inválidos."]);
            setIsLoading("");
        }
    }

    const handlerLogin = (user: Usuario, cpf?: string) => {
        if (!cpf)
            cpf = "";

        let dataToken = handlerSignIn({
            userId: user.idUsuario,
            name: user.nome,
            cpf,
            userType: user.tipoUsuario
        });

        defineLoggedUser(dataToken);
        navigate(from, { replace: true });
    }

    DocumentTitle("Login | CM");

    return (
        <>
            <h1>Login</h1>

            <Form
                ref={loginFormRef}
                onSubmit={submitLoginForm}
                className="form-data"
            >
                <FieldInput
                    name='email'
                    label='E-mail'
                    placeholder='Coloque seu email'
                    type="email"
                />

                <FieldInput
                    name='password'
                    label='Senha'
                    placeholder='Coloque sua senha'
                    type="password"
                />

                <Warning value={warning} />

                <LoadingButton
                    text="Entrar"
                    isLoading={isLoading === "form"}
                    type="submit"
                    color="secondary"
                />
            </Form>
        </>
    );
}

export default Login;