import { NavLink as Link, Outlet } from 'react-router-dom';
import { Nav, NavItem, NavLink } from 'reactstrap';

const EmployeeMenu = () => {
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
            </Nav>

            <Outlet />
        </>
    );
}

export default EmployeeMenu; 