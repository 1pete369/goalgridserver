// /api/send-message.js

const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true
});

module.exports = async (req, res) => {
  if (req.method === "POST") {
    const { message, roomName, username, createdAt, uid, userProfileImage, name, id } = req.body;

    console.log("Message to send:", req.body);

    try {
      // Trigger the message event to Pusher
      await pusher.trigger("chat-channel", "new-message", {
        message,        // Plain message string
        roomName,       // Room name
        username,       // Username
        createdAt,      // Date
        uid,            // User ID
        userProfileImage, // Profile Image URL
        name,
        id            // User Name
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error triggering Pusher:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
