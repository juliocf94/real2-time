<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    // Tabla asociada
    protected $table = 'notifications';

    // Clave primaria
    protected $primaryKey = 'id';

    // Campos asignables masivamente
    protected $fillable = [
        'title',
        'message',
        'icon_url',
        'type',
        'priority',
    ];

    // Fechas automáticamente manejadas por Laravel
    public $timestamps = true;

    // Relación con los usuarios que han recibido esta notificación
    public function users()
    {
        return $this->belongsToMany(User::class, 'notification_users', 'notification_id', 'user_id')
                    ->withPivot('is_read', 'read_at')
                    ->withTimestamps();
    }

    // Scope para filtrar por tipo
    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }

    // Scope para notificaciones con prioridad alta
    public function scopeHighPriority($query)
    {
        return $query->where('priority', '>=', 4);
    }
}
