import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Signup = () => {
	const [inputs, setInputs] = useState({});
	const navigate = useNavigate();

	const handleInput = (event) => {
		const { name, value } = event.target;
		setInputs({ ...inputs, [name]: value });
	};

	const registerUser = async (event) => {
		event.preventDefault();
		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL;
			const response = await fetch(`${backendUrl}/api/signup`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(inputs),
			});

			const data = await response.json();

			if (response.ok) {
				localStorage.setItem("token", data.token);
				alert("¡Usuario registrado con éxito!");
				navigate("/login");
			} else {
				if (response.status === 409) {
					throw new Error("El usuario ya existe");
				}
				throw new Error(data.msg || "Error en el registro");
			}
		} catch (error) {
			alert("Ocurrió un error: " + error.message);
		}
	};

	return (
		<div className="container d-flex justify-content-center align-items-center vh-100">
			<div className="border p-5 rounded shadow bg-white" style={{ maxWidth: "400px", width: "100%" }}>
				<h2 className="text-center mb-4 text-primary">Crear cuenta</h2>
				<form onSubmit={registerUser}>
					{/* Si necesitas un nombre de usuario, descomenta esto:
					<div className="mb-3">
						<label htmlFor="username" className="form-label fw-semibold">Nombre de usuario</label>
						<input
							type="text"
							className="form-control"
							id="username"
							name="username"
							placeholder="Tu nombre"
							onChange={handleInput}
						/>
					</div>
					*/}

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

					<div className="mb-4">
						<label htmlFor="password" className="form-label fw-semibold">Contraseña</label>
						<input
							type="password"
							className="form-control"
							id="password"
							name="password"
							placeholder="********"
							onChange={handleInput}
							required
						/>
					</div>

					<button type="submit" className="btn btn-primary w-100">
						Registrarse
					</button>
				</form>

				<p className="mt-3 text-center">
					¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
				</p>
			</div>
		</div>
	);
};
