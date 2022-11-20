import { useEffect, useState } from 'react';
import { NavLink as Link, useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';

import { useAuth } from '../../contexts/auth';
import { getLoggedUser, handlerLogout } from '../../localStorages/auth';
import TipoUsuarioEnum from '../../services/enums/tipoUsuario';

import { Button, Collapse, NavLink, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem } from 'reactstrap';
import { NavbarProfile } from './styles';

const Menu = () => {
    const navigate = useNavigate();
    const { loggedUser, defineLoggedUser } = useAuth();

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        defineLoggedUser(getLoggedUser());
        // eslint-disable-next-line
    }, []);

    const toggleIsOpen = () => {
        setIsOpen(!isOpen);
    }

    const logout = () => {
        defineLoggedUser(undefined);
        handlerLogout();
        navigate("/");
    }

    return (
        <>
            <Navbar
                color="primary"
                dark
                expand="md"
                fixed="top"
            >
                {loggedUser
                    ? <>
                        <NavbarBrand
                            to="/home"
                            tag={Link}
                        >
                            Clínica Médica
                        </NavbarBrand>

                        <NavbarToggler
                            onClick={() => toggleIsOpen()}
                        />
                    </>
                    : <NavbarBrand
                        to="/login"
                        tag={Link}
                    >
                        Clínica Médica
                    </NavbarBrand>
                }

                <Collapse
                    navbar
                    isOpen={isOpen}
                >
                    <Nav
                        className="me-auto"
                        navbar
                    >
                        {loggedUser?.userType === TipoUsuarioEnum.Gerente && <>
                            <NavItem>
                                <NavLink
                                    to="/funcionarios/listar"
                                    tag={Link}
                                >
                                    Funcionários
                                </NavLink>
                            </NavItem>
                        </>}

                        {(loggedUser?.userType === TipoUsuarioEnum.Recepcionista
                            || loggedUser?.userType === TipoUsuarioEnum.Paciente) && <>
                                <NavItem>
                                    <NavLink
                                        to="/agendamentos/listar"
                                        tag={Link}
                                    >
                                        Agendamentos
                                    </NavLink>
                                </NavItem>
                            </>}

                        {loggedUser?.userType === TipoUsuarioEnum.Medico && <>
                            <NavItem>
                                <NavLink
                                    to="/consultas/listar"
                                    tag={Link}
                                >
                                    Agendamentos
                                </NavLink>
                            </NavItem>
                        </>}
                    </Nav>

                    <NavbarProfile>
                        {loggedUser && <>
                            <div>
                                <span>
                                    <FaUser />
                                </span>
                                <span>
                                    {loggedUser.name}
                                </span>
                            </div>

                            <Button
                                color="secondary"
                                outline
                                onClick={() => logout()}
                            >
                                Sair
                            </Button>
                        </>}
                    </NavbarProfile>
                </Collapse>
            </Navbar>
        </>
    );
}

export default Menu;