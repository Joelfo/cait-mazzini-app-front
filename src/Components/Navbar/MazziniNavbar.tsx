import { Container, Nav, NavDropdown, Stack } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import CaitMazziniLogo from "../../assets/images/cait-mazzini-logo.png";
import { useUserContext } from 'Contexts/useUserContext';
import './styles.css';
import { Link } from 'react-router-dom';
import { useLogout } from 'Hooks/useLogout';

export const MazziniNavbar = () => {
    const user = useUserContext();
    const logout = useLogout();
    return (
        <Navbar variant='dark' className='bg-primary'>
            <Container>
                    <Navbar.Brand style={{color: 'white'}}>
                        <Link to='/home'>
                            <img style={{borderRadius: '2.5px', height: '50px'}} src={CaitMazziniLogo} alt="logo do CAIT Mazzini Bueno" />
                            {'  '}
                            Cait Mazzini Bueno
                        </Link>
                    </Navbar.Brand>
                {/*<Nav className='me-auto' color='white'>
                    <NavDropdown style={{color: 'white'}} title={<span style={{color: 'white'}}>Administrador</span>}>
                        <NavDropdown.Item>
                            <Link to='/userList'>
                                Usuários
                            </Link>
                        </NavDropdown.Item>
                    </NavDropdown>
                </Nav>*/}
                <Navbar.Collapse className="justify-content-end">
                    <Stack direction='horizontal' gap={3}>
                        <Navbar.Text style={{color: 'white'}}>
                            Usuário: {user.name}
                        </Navbar.Text>
                        <Navbar.Text style={{color: 'white', cursor: 'pointer'}} onClick={logout}>
                            <b>Sair</b>
                        </Navbar.Text>
                    </Stack>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}