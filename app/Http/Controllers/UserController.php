<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Events\UserSent;
use App\Models\User;

class UserController extends Controller
{
    /**
     * Muestra la lista de usuarios.
     */
    public function index()
    {
        // Obtén todos los usuarios
        $users = User::all();

        // Retorna la vista con los datos de los usuarios
        return Inertia::render('Dashboard', [
            'users' => $users,
        ]);
    }

    /**
     * Actualiza el nombre de un usuario.
     */
    public function update(Request $request, User $user)
    {
        // Validamos el nombre
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // Actualizamos el nombre del usuario
        $user->update([
            'name' => $request->input('name'),
        ]);

        // Emitir evento
        broadcast(new UserSent($user))->toOthers();

        // Retornamos la respuesta con los datos del usuario actualizado
        return redirect()->route('dashboard')->with('success', 'Nombre actualizado exitosamente');
    }
}
