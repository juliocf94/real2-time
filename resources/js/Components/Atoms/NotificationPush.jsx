import React, { useState, useEffect } from "react";
import { CToast, CToastHeader, CToastBody, CCloseButton } from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";
import "./../../../../resources/css/NotificationPush.css";

const NotificationPush = ({
    title = "Notificación",
    message = "Este es el cuerpo de la notificación.",
    icon,
    time = "Ahora",
    theme = "info", // "success", "warning", "error"
    duration = 10000,
    repeat = true, // Define si la notificación se repite
    intervalTime = 45000, // Intervalo de repetición
    onClose,
}) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        let interval;

        // Solicitar permiso para notificaciones del navegador
        if (Notification.permission === "default") {
            Notification.requestPermission();
        }

        const showNotification = () => {
            setIsVisible(true);

            // Mostrar notificación del navegador si la página está oculta
            if (document.hidden && Notification.permission === "granted") {
                const browserNotification = new Notification(title, {
                    body: message,
                    icon: icon || "https://via.placeholder.com/40",
                });

                browserNotification.onclick = () => window.focus(); // Enfocar la ventana al hacer clic
                browserNotification.onclose = () => onClose?.(); // Evento onClose
            }

            // Ocultar después del tiempo establecido
            setTimeout(() => {
                setIsVisible(false);
                onClose?.();
            }, duration);
        };

        showNotification(); // Primera notificación inmediata

        if (repeat) {
            interval = setInterval(showNotification, intervalTime);
        }

        return () => {
            if (interval) clearInterval(interval); // Limpiar intervalo al desmontar
        };
    }, [title, message, icon, duration, repeat, intervalTime, onClose]);

    if (!isVisible) return null; // No renderizar nada si no está visible

    return (
        <CToast
            className={`notification-toast ${theme} position-fixed bottom-0 end-0 m-3`}
            autohide={false}
            visible
            role="alert"
            aria-live="assertive"
        >
            <CToastHeader className="notification-header">
                {icon && (
                    <img
                        src={icon}
                        alt="Icono de la notificación"
                        className="rounded me-2"
                        width={24}
                    />
                )}
                <strong className="me-auto">{title}</strong>
                <small className="text-muted">{time}</small>
                <CCloseButton
                    className="ms-2 mb-1 close-btn"
                    onClick={() => {
                        setIsVisible(false);
                        onClose?.();
                    }}
                />
            </CToastHeader>
            <CToastBody className="notification-body">{message}</CToastBody>
        </CToast>
    );
};

export default NotificationPush;
