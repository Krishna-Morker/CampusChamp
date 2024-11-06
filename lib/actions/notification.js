import { connect } from '../mongodb/mongoose';
const mongoose = require('mongoose');
import Course from '../models/coursemodel';
import User from '../models/usermodel';
import pusher from './pusherConfig';
import Notification from '../models/notificationmodel';


export const getNotifi = async (req) => {
    await connect();
    try {
        const { id } = req;

        const idd= new mongoose.Types.ObjectId(id)
        // Find unread notifications for the user and sort by createdAt descending
        const noti = await Notification.find({ userId: idd})
            .sort({ createdAt: -1 }); // Sort by createdAt in descending order
        return noti; // Return the sorted notifications
    } catch (error) {
        console.log(error);
        return 'Error Getting Notification';
    }
};
export const markAllNotifications = async (req) => {
    await connect();
    try {
        const { notifications } = req; // Assuming notifications is an array of { notification_id, message }
        
        // Extract notification IDs from the received array
        const notificationIds = notifications.map(noti => noti.notification_id);
        
        // Mark notifications as read
        await Notification.updateMany({ notification_id: { $in: notificationIds } }, { readStatus: true });
          console.log('Notifications marked as read');
        return "All notifications marked as read";
    } catch (error) {
        console.log('Error deleting notifications:', error);
        return 'Error deleting notifications';
    }
};



