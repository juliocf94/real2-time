import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import NotificationPush from "./../Components/Atoms/NotificationPush";

export default function Dashboard({ users: initialUsers }) {
    const [users, setUsers] = useState(initialUsers); // Estado para la lista de usuarios
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null); // Usuario que se está editando
    const { data, setData, put } = useForm({
        name: "",
    });

    // Efecto para escuchar eventos en tiempo real con Laravel Echo
    useEffect(() => {
        const channel = window.Echo.channel("dashboard");

        channel.listen("UserSent", (event) => {
            console.log("Evento UserSent recibido correctamente:", event);
            // Actualizar el estado de los usuarios en tiempo real
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === event.user.id
                        ? { ...user, name: event.user.name }
                        : user
                )
            );
        });

        return () => {
            window.Echo.leaveChannel("dashboard");
        };
    }, []);

    // Función para abrir el modal y establecer el usuario a editar
    const openModal = (user) => {
        setEditingUser(user);
        setData("name", user.name); // Rellenar el nombre actual en el input
        setIsModalOpen(true);
    };

    // Función para cerrar el modal
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    // Función para manejar el cambio de nombre
    const handleNameChange = (e) => {
        setData("name", e.target.value);
    };

    // Función para guardar los cambios
    const handleSave = () => {
        if (editingUser) {
            put(route("user.update", editingUser.id), {
                onSuccess: () => {
                    closeModal(); // Cerrar el modal después de guardar
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium text-gray-900">
                                Usuarios
                            </h3>
                            <div className="overflow-x-auto mt-4">
                                <table className="min-w-full table-auto">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                                                ID
                                            </th>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                                                Nombre
                                            </th>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                                                Correo electrónico
                                            </th>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="border-t"
                                            >
                                                <td className="px-4 py-2 text-sm text-gray-900">
                                                    {user.id}
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-900">
                                                    {user.name}
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-900">
                                                    {user.email}
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-900">
                                                    <button
                                                        className="text-blue-600 hover:text-blue-900"
                                                        onClick={() =>
                                                            openModal(user)
                                                        }
                                                    >
                                                        Editar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <NotificationPush
                title="Nueva Notificación"
                message="Este es un mensaje de prueba."
                icon="https://via.placeholder.com/40"
                time="Hace un momento"
                theme="info"
                duration={5000} // Notificación visible por 5 segundos
                repeat={false} // Repetir notificaciones automáticamente
                intervalTime={30000} // Intervalo de 30 segundos
            />

            {/* Modal para editar el nombre */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Editar Usuario
                        </h3>
                        <div className="mt-4">
                            <label
                                className="block text-sm text-gray-700"
                                htmlFor="name"
                            >
                                Nombre
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={data.name}
                                onChange={handleNameChange}
                                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
                                onClick={closeModal}
                            >
                                Cancelar
                            </button>
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded-md"
                                onClick={handleSave}
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
