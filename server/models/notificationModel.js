import db from '../config/db.js';

// Create a new notification
export const createNotification = (notification, callback) => {
  const query = `INSERT INTO notifications SET ?`;
  db.query(query, notification, callback);
};

// Get notifications for a user (most recent first)
export const getNotificationsByUser = (userId, callback) => {
  const query = `
    SELECT * FROM notifications
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;
  db.query(query, [userId], callback);
};

// Mark a notification as read
export const markNotificationAsRead = (notificationId, userId, callback) => {
  const query = `
    UPDATE notifications
    SET is_read = 1
    WHERE id = ? AND user_id = ?
  `;
  db.query(query, [notificationId, userId], callback);
};

// (Optional) Mark all notifications as read for a user
export const markAllNotificationsAsRead = (userId, callback) => {
  const query = `
    UPDATE notifications
    SET is_read = 1
    WHERE user_id = ?
  `;
  db.query(query, [userId], callback);
};