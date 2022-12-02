import { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { NavLink as Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { useAuth } from '../../contexts/auth';
import { getLoggedUser, handlerLogout } from '../../localStorages/auth';
import TipoUsuarioEnum from '../../services/enums/tipoUsuario';
import { NavbarProfile } from './styles';

const Menu = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { loggedUser, defineLoggedUser } = useAuth();

    const [isOpen, setIsOpen] = useState(false);
    const [menuItems, setMenuItems] = useState<[string, string][]>([]);

    useEffect(() => {
        defineLoggedUser(getLoggedUser());
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        let items: [string, string][] = [];

        if (loggedUser === undefined) {
            items.push(["/pacientes/cadastrar", "Criar conta"]);
        } else {
            switch (loggedUser.userType) {
                case TipoUsuarioEnum.Gerente:
                    items.push(["/usuarios/listar", "Usuários"]);
                    items.push(["/funcionarios/cadastrar", "Cadastrar usuário"]);
                    break;
                case TipoUsuarioEnum.Recepcionista:
                    items.push(["/agendamentos/listar", "Agendamentos"]);
                    items.push(["/pacientes/cadastrar", "Cadastrar paciente"]);
                    break;
                case TipoUsuarioEnum.Medico:
                    items.push(["/consultas/listar", "Agendamentos"]);
                    break;
                case TipoUsuarioEnum.Paciente:
                    items.push(["/agendamentos/listar", "Agendamentos"]);
                    items.push(["/pacientes/editar", "Editar perfil"]);
                    break;
            }
        }

        setMenuItems([...items]);
    }, [loggedUser]);

    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname])

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
                <NavbarBrand
                    to="/"
                    tag={Link}
                >
                    Clínica Médica
                </NavbarBrand>

                <NavbarToggler
                    onClick={() => toggleIsOpen()}
                />

                <Collapse
                    navbar
                    isOpen={isOpen}
                >
                    <Nav
                        className="me-auto"
                        navbar
                    >
                        {menuItems.map((x, index) => (
                            <NavItem key={index}>
                                <NavLink
                                    to={x[0]}
                                    tag={Link}
                                >
                                    {x[1]}
                                </NavLink>
                            </NavItem>
                        ))}
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