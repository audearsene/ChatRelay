import { useContext } from "react";
import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const NavBar = () => {
    const { user, logoutUser } = useContext(AuthContext);

    return (
        <Navbar bg="secondary" variant="dark" className="mb-4" style={{ height: '3.75rem' }}>
            <Container>
                <Navbar.Brand>
                    <Link to="/" className="link-light text-decoration-none">
                        Chat42
                    </Link>
                </Navbar.Brand>
                {user && (
                    <span className="text-white">
            Vous êtes connecté en tant que {user?.name}
          </span>
                )}
                <Nav className="ml-auto">
                    <Stack direction="horizontal" gap={3}>
                        {user ? (
                            <>
                                <Link
                                    onClick={() => logoutUser()}
                                    to="/login"
                                    className="link-light text-decoration-none"
                                >
                                    Se déconnecter
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="link-light text-decoration-none">
                                    Connexion
                                </Link>
                                <Link to="/register" className="link-light text-decoration-none">
                                    Inscription
                                </Link>
                            </>
                        )}
                    </Stack>
                </Nav>
            </Container>
        </Navbar>
    );
};

export default NavBar;