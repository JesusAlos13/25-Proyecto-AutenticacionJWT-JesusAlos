import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Login = () => {
	const { dispatch } = useGlobalReducer();
	const [inputs, setInputs] = useState({});
	const navigate = useNavigate();

	function handleInput(event) {
		const { name, value } = event.target;
		setInputs({ ...inputs, [name]: value });
	}

	const loginUser = async (event) => {
		event.preventDefault();
		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL;

			const response = await fetch(`${backendUrl}/api/token`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(inputs),
			});

			const data = await response.json();

			if (response.ok) {
				localStorage.setItem("token", data.token);
				dispatch({ type: "login", payload: true });
				navigate("/private");
			} else {
				throw new Error(data.msg || "Login failed");
			}
		} catch (error) {
			alert("Error: " + error.message);
		}
	};

	return (
		<div className="container d-flex justify-content-center align-items-center vh-100">
			<div className="border p-5 rounded shadow bg-white" style={{ maxWidth: "400px", width: "100%" }}>
				<h2 className="text-center mb-4 text-primary">Iniciar sesión</h2>
				<form onSubmit={loginUser}>
					<div className="mb-3">
						<label htmlFor="email" className="form-label fw-semibold">Correo electrónico</label>
						<input
							type="email"
							className="form-control"
							id="email"
							name="email"
							placeholder="ejemplo@email.com"
							onChange={handleInput}
							required
						/>
					</div>

					<div className="mb-3">
						<label htmlFor="password" className="form-label fw-semibold">Contraseña</label>
						<input
							type="password"
							className="form-control"
							id="password"
							name="password"
							placeholder="Tu contraseña"
							onChange={handleInput}
							required
						/>
					</div>

					<div className="mb-3 text-end">
						<small>
							¿No tienes cuenta? <Link to="/signup">Regístrate</Link>
						</small>
					</div>

					<button type="submit" className="btn btn-primary w-100">
						Ingresar
					</button>
				</form>
			</div>
		</div>
	);
};
