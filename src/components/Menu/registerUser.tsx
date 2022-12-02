import { NavLink as Link, Outlet } from 'react-router-dom';
import { Nav, NavItem, NavLink } from 'reactstrap';

const RegisterUserMenu = () => {
    return (
        <>
            <Nav
                tabs
                className="mb-4"
            >
                <NavItem>
                    <NavLink
                        to="/funcionarios/cadastrar"
                        tag={Link}
                    >
                        Cadastrar funcionário
                    </NavLink>
                </NavItem>

                <NavItem>
                    <NavLink
                        to="/medicos/cadastrar"
                        tag={Link}
                    >
                        Cadastrar médico
                    </NavLink>
                </NavItem>
            </Nav>

            <Outlet />
        </>
    );
}

export default RegisterUserMenu;