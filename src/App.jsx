import { useEffect, useState } from 'react';
import './App.css';
import { firebase } from './firebase';

function App() {
    const [getListaUsuarios, setListaUsuarios] = useState([]);
    const [getNombre, setNombre] = useState('');
    const [getApellido, setApellido] = useState('');
    const [getId, setId] = useState('');
    const [getError, setError] = useState(null);
    const [getModoEdicion, setModoEdicion] = useState(false);
    useEffect(() => {

        const obtenerData = async () => {
            try {
                const db = firebase.firestore();
                const data = await db.collection('usuarios').get();
                const arrayData = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setListaUsuarios(arrayData);
            } catch (error) {
                console.log(error);
            }
        }
        obtenerData();
    }, []);

    const registrarUsuario = async (e) => {
        e.preventDefault();

        if (!getNombre) return alert('Por favor, ingrese un Nombre');
        if (!getApellido) return alert('Por favor, ingrese un Apellido');

        try {
            const nombre = getNombre.trim().toLowerCase();
            const apellido = getApellido.trim().toLowerCase();

            // Validar si el usuario ya existe en la lista
            const usuarioExistente = getListaUsuarios.some(
                (user) => user.nombre.trim().toLowerCase() === nombre && user.apellido.trim().toLowerCase() === apellido
            );

            if (usuarioExistente) {
                return alert(`El usuario ${nombre} ${apellido} ya se encuentra registrado.`);
            }

            const db = firebase.firestore();
            const nuevoUsuario = { nombre, apellido };
            const usuarioRegistrado = await db.collection('usuarios').add(nuevoUsuario);
            // Actualizar la lista de usuarios
            setListaUsuarios([
                ...getListaUsuarios, { id: usuarioRegistrado.id, ...nuevoUsuario }
            ]);
            setModoEdicion(false);
            setNombre('');
            setApellido('');
            setId('');
        } catch (error) {
            console.log(error);
        }
    }

    const eliminarUsuario = async (id) => {
        try {
            const db = firebase.firestore();
            await db.collection('usuarios').doc(id).delete();
            const listaFiltrada = getListaUsuarios.filter((item) => item.id !== id);
            setListaUsuarios(listaFiltrada);
        } catch (error) {
            console.log(error);
        }
    }

    const getUsuario = async (usuario) => {
        try {
            setModoEdicion(true);
            setNombre(usuario.nombre);
            setApellido(usuario.apellido);
            setId(usuario.id);
        } catch (error) {
            console.log(error);
        }
    }

    const actualizarUsuario = async (e) => {
        e.preventDefault();

        if (!getNombre.trim()) return alert('Por favor, ingrese un Nombre');
        if (!getApellido.trim()) return alert('Por favor, ingrese un Apellido');

        try {
            const nombre = getNombre.trim().toLowerCase();
            const apellido = getApellido.trim().toLowerCase();
            const id = getId;

            const db = firebase.firestore();
            await db.collection('usuarios').doc(id).update({ nombre, apellido });
            const listaActualizada = getListaUsuarios.map(usuario => usuario.id === id ? { id, nombre, apellido } : usuario);

            setListaUsuarios(listaActualizada);
            setModoEdicion(false);
            setNombre('');
            setApellido('');
            setId('');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='container'>
            <div className='row justify-content-center'>
                <div className='col-md-6'>
                    <div className='card shadow-sm border-0 mt-4'>
                        <div className='card-header bg-primary text-white'>
                            <h3 className='text-center m-0'>
                                {getModoEdicion ? 'Actualizar Usuario' : 'Registrar Usuario'}
                            </h3>
                        </div>
                        <div className='card-body'>
                            <form onSubmit={getModoEdicion ? actualizarUsuario : registrarUsuario}>
                                <div className='mb-3'>
                                    <input
                                        type='text'
                                        placeholder='Ingrese su nombre'
                                        className='form-control'
                                        onChange={(e) => setNombre(e.target.value)}
                                        value={getNombre} />
                                </div>
                                <div className='mb-3'>
                                    <input
                                        type='text'
                                        placeholder='Ingrese su apellido'
                                        className='form-control'
                                        onChange={(e) => setApellido(e.target.value)}
                                        value={getApellido} />
                                </div>
                                <button
                                    type='submit'
                                    className={`btn ${getModoEdicion ? 'btn-success' : 'btn-primary'} w-100`}
                                >
                                    {getModoEdicion ? 'Actualizar' : 'Registrar'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div className='row justify-content-center mt-4'>
                <div className='col-md-8'>
                <h3 className='text-center mb-3'>Lista de Usuarios</h3>
                    <ul className='list-group'>
                        {getListaUsuarios.map((user) => (
                            <li className='list-group-item d-flex justify-content-between align-items-center' key={user.id}>
                                <span>{user.nombre} {user.apellido}</span>
                                <div>
                                    <button
                                        onClick={() => getUsuario(user)}
                                        className='btn btn-outline-warning btn-sm me-2'
                                    >
                                        <i className='bi bi-pencil-square'></i> Actualizar
                                    </button>
                                    <button
                                        onClick={() => eliminarUsuario(user.id)}
                                        className='btn btn-outline-danger btn-sm'
                                    >
                                        <i className='bi bi-trash'></i> Eliminar
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default App
