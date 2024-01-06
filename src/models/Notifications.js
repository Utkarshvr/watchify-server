const {
  Schema,
  model,
  Types: { ObjectId },
} = require("mongoose");

const notificationSchema = new Schema(
  {
    user: { type: ObjectId, required: true },
    notificationType: { type: String, required: true },
    content: { type: String, required: true },
    payload: {
      type: Object,
      required: false,
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notifications = model("Notification", notificationSchema);

module.exports = Notifications;
