const { Worker } = require("bullmq");
const connection = require("../redis/connection");
const {
  sendOtpEmail,
  sendBookingConfirmMail,
} = require("../services/notificationService");

const worker = new Worker(
  "notifications",
  async (job) => {
    switch (job.name) {
      case "emailVerification":
        return await sendOtpEmail(
          job.data.email,
          job.data.username,
          job.data.otp
        );
      case "sendBookingConfirmation":
        return await sendBookingConfirmMail(
          job.data.mail,
          job.data.sendMailDetails
        );
      default:
        throw new Error("Unknown job type");
    }
  },
  { connection }
);

worker.on("completed", (job) => console.log(`Notification sent: ${job.name}`));
worker.on("failed", (job, err) =>
  console.error(`Notification failed: ${job.name} - ${err.message}`)
);
