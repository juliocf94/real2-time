<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NotificationUser extends Model
{
    use HasFactory;

    // Tabla asociada
    protected $table = 'notification_users';

    // Clave primaria
    protected $primaryKey = 'id';

    // Campos asignables masivamente
    protected $fillable = [
        'notification_id',
        'user_id',
        'is_read',
        'read_at',
    ];

    // Fechas automáticamente manejadas por Laravel
    public $timestamps = true;

    // Relación con la notificación asociada
    public function notification()
    {
        return $this->belongsTo(Notification::class, 'notification_id');
    }

    // Relación con el usuario asociado
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Scope para filtrar notificaciones no leídas
    public function scopeUnread($query)
    {
        return $query->where('is_read', 0);
    }
}
