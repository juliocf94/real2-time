import Echo from 'laravel-echo';

import Pusher from 'pusher-js';
window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
    wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
});

/**
 * Testing Channels & Events & Connections
 */
window.Echo.channel("dashboard").listen("UserSent", (event) => {
    console.log("Usuario actualizado:", event.user);
    // Aquí puedes actualizar el estado en React
    // Por ejemplo, actualiza la lista de usuarios
    setUsers((prevUsers) =>
        prevUsers.map((user) =>
            user.id === event.user.id ? { ...user, name: event.user.name } : user
        )
    );
});
