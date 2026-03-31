'use client'
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { notificationsAPI } from '@/lib/api'
import { useAuth } from './AuthContext'

interface Notification {
  id: number
  title: string
  message: string
  type: string
  read: boolean
  created_at: string
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  refresh: () => Promise<void>
  markAllRead: () => Promise<void>
  markRead: (id: number) => Promise<void>
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [], unreadCount: 0,
  refresh: async () => {}, markAllRead: async () => {}, markRead: async () => {},
})

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const refresh = useCallback(async () => {
    if (!user) return
    try {
      const data = await notificationsAPI.list()
      const items = data.results || data || []
      setNotifications(items)
      setUnreadCount(items.filter((n: Notification) => !n.read).length)
    } catch { /* ignore if not authenticated */ }
  }, [user])

  useEffect(() => {
    refresh()
    const interval = setInterval(refresh, 60000)
    return () => clearInterval(interval)
  }, [refresh])

  const markAllRead = async () => {
    await notificationsAPI.markAllRead()
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const markRead = async (id: number) => {
    await notificationsAPI.markRead(id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, refresh, markAllRead, markRead }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationContext)
