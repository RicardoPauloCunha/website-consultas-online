import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import DoctorSchedulesMenu from './components/Menu/doctorSchedules';
import PatientSchedulesMenu from './components/Menu/patientSchedules';
import RegisterUserMenu from './components/Menu/registerUser';
import SchedulingMenu from './components/Menu/scheduling';
import UserMenu from './components/Menu/user';
import ScrollToTop from './components/ScrollToTop';
import { useAuth } from './contexts/auth';
import { userIsAuth } from './localStorages/auth';
import DoctorSchedules from './pages/DoctorSchedules';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import PatientAttendances from './pages/PatientAttendances';
import RegisterDoctor from './pages/RegisterDoctor';
import RegisterEmployee from './pages/RegisterEmployee';
import RegisterPatient from './pages/RegisterPatient';
import RegisterScheduling from './pages/RegisterScheduling';
import Schedules from './pages/Schedules';
import Users from './pages/Users';
import TipoUsuarioEnum from './services/enums/tipoUsuario';

type RequireAuthProps = {
    userType: TipoUsuarioEnum;
    children: React.ReactNode;
}

const RequireAuth = ({ userType, children }: RequireAuthProps): JSX.Element => {
    let location = useLocation();

    let { userIsChecked, loggedUser } = useAuth();

    if (loggedUser?.userType === userType || (!userIsChecked && userIsAuth()))
        return <>{children}</>;

    return <Navigate
        to="/login"
        replace
        state={{
            from: location,
            message: "Você não tem autorização para acessar essa página."
        }}
    />;
}

const PagesRoutes = () => {
    return (
        <ScrollToTop>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path=""
                        element={<Login />}
                    />
                    <Route path="login"
                        element={<Login />}
                    />

                    <Route path="usuarios"
                        element={<UserMenu />}
                    >
                        <Route path="listar"
                            element={<RequireAuth
                                userType={TipoUsuarioEnum.Gerente}
                                children={<Users />}
                            />}
                        />
                    </Route>

                    <Route path="funcionarios"
                        element={<RegisterUserMenu />}
                    >
                        <Route path="cadastrar"
                            element={<RequireAuth
                                userType={TipoUsuarioEnum.Gerente}
                                children={<RegisterEmployee />}
                            />}
                        />
                        <Route path=":userId/editar"
                            element={<RequireAuth
                                userType={TipoUsuarioEnum.Gerente}
                                children={<RegisterEmployee />}
                            />}
                        />
                    </Route>

                    <Route path="medicos"
                        element={<RegisterUserMenu />}
                    >
                        <Route path="cadastrar"
                            element={<RequireAuth
                                userType={TipoUsuarioEnum.Gerente}
                                children={<RegisterDoctor />}
                            />}
                        />
                        <Route path=":userId/editar"
                            element={<RequireAuth
                                userType={TipoUsuarioEnum.Gerente}
                                children={<RegisterDoctor />}
                            />}
                        />
                    </Route>

                    <Route path="agendamentos"
                        element={<SchedulingMenu />}
                    >
                        <Route path="listar"
                            element={<RequireAuth
                                userType={TipoUsuarioEnum.Recepcionista}
                                children={<Schedules />}
                            />}
                        />
                        <Route path="cadastrar"
                            element={<RequireAuth
                                userType={TipoUsuarioEnum.Recepcionista}
                                children={<RegisterScheduling />}
                            />}
                        />
                    </Route>

                    <Route path="consultas"
                        element={<DoctorSchedulesMenu />}
                    >
                        <Route path="listar"
                            element={<RequireAuth
                                userType={TipoUsuarioEnum.Medico}
                                children={<DoctorSchedules />}
                            />}
                        />
                    </Route>

                    <Route path="pacientes">
                        <Route path="cadastrar"
                            element={<RegisterPatient />}
                        />
                        <Route path="editar"
                            element={<RequireAuth
                                userType={TipoUsuarioEnum.Paciente}
                                children={<RegisterPatient />}
                            />}
                        />
                        <Route path=":patientCpf/atendimentos"
                            element={<RequireAuth
                                userType={TipoUsuarioEnum.Medico}
                                children={<PatientAttendances />}
                            />}
                        />
                    </Route>

                    <Route path="meus-agendamentos"
                        element={<PatientSchedulesMenu />}
                    >
                        <Route path="listar"
                            element={<RequireAuth
                                userType={TipoUsuarioEnum.Paciente}
                                children={<Schedules />}
                            />}
                        />
                        <Route path="cadastrar"
                            element={<RequireAuth
                                userType={TipoUsuarioEnum.Paciente}
                                children={<RegisterScheduling />}
                            />}
                        />
                    </Route>

                    <Route path="relatorios-consultas"
                        element={<RequireAuth
                            userType={TipoUsuarioEnum.Gerente}
                            children={<Schedules />}
                        />}
                    />

                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </ScrollToTop>
    )
}

export default PagesRoutes;