import { Link } from "react-router-dom";

export const Navbar = () => {
	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
			<div className="container">
				<Link className="navbar-brand fw-bold text-primary" to="/">
					JWT JesusAlos13
				</Link>

				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarContent"
					aria-controls="navbarContent"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>

				<div className="collapse navbar-collapse justify-content-end" id="navbarContent">
					<ul className="navbar-nav mb-2 mb-lg-0 d-flex gap-3">
						<li className="nav-item">
							<Link className="nav-link text-dark fw-medium" to="/signup">
								Registrarse
							</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link text-dark fw-medium" to="/login">
								Iniciar sesión
							</Link>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
};
