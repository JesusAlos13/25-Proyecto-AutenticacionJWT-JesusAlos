import { useEffect, useState } from 'react';
import useGlobalReducer from '../hooks/useGlobalReducer';
import { useNavigate } from 'react-router-dom';

export const Private = () => {
	const { dispatch } = useGlobalReducer();
	const [message, setMessage] = useState('');
	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	const navigate = useNavigate();

	useEffect(() => {
		if (!localStorage.getItem('token')) {
			navigate('/login');
			return;
		}

		const fetchPrivateData = async () => {
			try {
				const response = await fetch(`${backendUrl}/api/private`, {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				});

				if (response.ok) {
					const data = await response.json();
					setMessage(data.message);
				} else {
					throw new Error('Unauthorized');
				}
			} catch (error) {
				console.error('Error fetching private data:', error);
				setMessage('No estás autorizado para ver esta página. Por favor inicia sesión.');
			}
		};

		fetchPrivateData();
	}, [backendUrl, navigate]);

	const handleLogout = () => {
		localStorage.removeItem('token');
		dispatch({ type: 'login', payload: false });
		setMessage('Has cerrado sesión.');
		navigate('/login');
	};

	if (!localStorage.getItem('token')) {
		return null;
	}

	return (
		<div className="container d-flex flex-column align-items-center justify-content-center vh-100">
			<div className="text-center border rounded p-5 shadow bg-white" style={{ maxWidth: '600px', width: '100%' }}>
				<h1 className="text-primary mb-3">Zona Privada 🔒</h1>
				<p className="lead text-muted mb-4">
					Esta sección solo es visible para usuarios autenticados.
				</p>
				{message && (
					<div className="alert alert-info" role="alert">
						{message}
					</div>
				)}
				<button className="btn btn-outline-primary mt-3" onClick={handleLogout}>
					Cerrar sesión
				</button>
			</div>
		</div>
	);
};
