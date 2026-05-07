import { useEffect, useState } from "react";

export interface LiveNotification {
  id: string;
  title: string;
  description: string;
  kind: string;
}

const DEFAULT_LIMIT = 5;
const DEFAULT_TTL_MS = 5000;

const getNotificationCreatedAt = (notification: LiveNotification) => {
  const createdAt = Number(notification.id.split("-")[0]);
  return Number.isFinite(createdAt) ? createdAt : null;
};

const isNotificationActive = (notification: LiveNotification, now: number) => {
  const createdAt = getNotificationCreatedAt(notification);
  return createdAt === null || now - createdAt < DEFAULT_TTL_MS;
};

const pruneNotifications = (items: LiveNotification[], now: number) => {
  const active: LiveNotification[] = [];

  for (const notification of items) {
    if (isNotificationActive(notification, now)) {
      active.push(notification);
    }
  }

  return active;
};

export const usePersistentNotifications = (storageKey: string, limit = DEFAULT_LIMIT) => {
  const [notifications, setNotifications] = useState<LiveNotification[]>(() => {
    try {
      const raw = globalThis.sessionStorage.getItem(storageKey);
      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw) as LiveNotification[];
      if (!Array.isArray(parsed)) {
        return [];
      }

      return pruneNotifications(parsed, Date.now()).slice(0, limit);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      globalThis.sessionStorage.setItem(storageKey, JSON.stringify(notifications.slice(0, limit)));
    } catch {
      // Ignore storage errors in private mode or quota exhaustion.
    }
  }, [limit, notifications, storageKey]);

  useEffect(() => {
    const timer = globalThis.setInterval(() => {
      setNotifications((current) => pruneNotifications(current, Date.now()));
    }, 1000);

    return () => globalThis.clearInterval(timer);
  }, []);

  const pushNotification = (title: string, description: string, kind: string) => {
    const createdAt = Date.now();
    const id = `${createdAt}-${Math.random()}`;

    setNotifications((current) => [{ id, title, description, kind }, ...current].slice(0, limit));

    globalThis.setTimeout(() => {
      setNotifications((current) => {
        const remaining: LiveNotification[] = [];

        for (const notification of current) {
          if (notification.id !== id) {
            remaining.push(notification);
          }
        }

        return remaining;
      });
    }, DEFAULT_TTL_MS);
  };

  const clearNotifications = () => setNotifications([]);

  return { notifications, pushNotification, clearNotifications, setNotifications };
};