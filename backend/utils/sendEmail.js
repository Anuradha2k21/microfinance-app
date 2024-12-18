const nodemailer = require("nodemailer");
const cron = require("node-cron");
const Loan = require("../models/Loan");

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Function to send reminder emails
const sendReminderEmail = (email, loan) => {
  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: "Loan Repayment Reminder",
    text: `Dear Customer, this is a reminder for your loan repayment of ${
      loan.amount
    } due on ${
      loan.dueDate.toISOString().split("T")[0]
    }. Please repay the payment amount. Thank you.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("email: ", email);
      return console.log(error);
    }
    console.log("Loan Repayment Reminder Email sent: " + info.response);
  });
};

// Schedule the task to run every day at 9 AM
cron.schedule("0 9 * * *", async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to the beginning of the day (00:00:00)

    //  Find all loans due today (from 00:00:00 to 23:59:59)
    const loans = await Loan.find({
      dueDate: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Less than tomorrow
      },
    }).populate("customer");

    loans.forEach((loan) => {
      if (loan.customer && loan.customer.email) {
        sendReminderEmail(loan.customer.email, loan);
      } else {
        console.log("No email found for customer with loan ID:", loan._id);
      }
    });
  } catch (error) {
    console.error("Error scheduling loan reminders:", error);
  }
});

// // Function to send test email

// const sendTestEmail = () => {
//   const mailOptions = {
//     from: process.env.SMTP_EMAIL,
//     to: process.env.TEST_EMAIL,
//     subject: "Test Email",
//     text: "This is a test email sent for development purposes.",
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       return console.log(error);
//     }
//     console.log("Test Email sent: " + info.response);
//   });
// };

// sendTestEmail();
