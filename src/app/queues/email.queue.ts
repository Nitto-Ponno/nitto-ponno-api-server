import amqp from "amqplib";
import nodemailer from "nodemailer";
import config from "../config";

export enum EmailJobName {
  sendVerificationEmail = "sendVerificationEmail",
  sendResetPasswordEmail = "sendResetPasswordEmail",
}
interface EmailUser {
  email: string;
  name?:
    | {
        firstName?: string;
        middleName?: string;
        lastName?: string;
      }
    | string;
  [key: string]: any;
}

interface SendVerificationEmailData {
  user: EmailUser;
  opt: string;
}

interface SendResetPasswordEmailData {
  user: EmailUser;
  opt: string;
}

type EmailJobData = SendVerificationEmailData | SendResetPasswordEmailData;

const getUserName = (
  name?:
    | {
        firstName?: string;
        middleName?: string;
        lastName?: string;
      }
    | string
): string => {
  if (!name) return "User";
  if (typeof name === "string") return name;
  const parts = [name.firstName, name.middleName, name.lastName].filter(
    Boolean
  );
  return parts.length > 0 ? parts.join(" ") : "User";
};

const createTransporter = () => {
  const encryption = (config.smtp_encryption as string)?.toLowerCase() || "tls";
  const port = Number(config.smtp_port) || (encryption === "ssl" ? 465 : 587);

  const smtpConfig = {
    host: config.smtp_host as string,
    port,
    secure: encryption === "ssl",
    auth: {
      user: config.smtp_user_name as string,
      pass: config.smtp_password as string,
    },
    ...(encryption === "tls" && { requireTLS: true }),
  };

  return nodemailer.createTransport(smtpConfig);
};

const getVerificationEmailTemplate = (otp: string, userName?: string) => {
  return {
    subject: "Verify Your Email Address",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #4CAF50;">Email Verification</h2>
            <p>Hello ${userName || "User"},</p>
            <p>Thank you for registering with us. Please use the following OTP to verify your email address:</p>
            <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
              <h1 style="color: #4CAF50; margin: 0; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
            </div>
            <p>This OTP will expire in ${config.otp_expires_in || "10 minutes"}.</p>
            <p>If you didn't request this verification, please ignore this email.</p>
            <p>Best regards,<br>${config.smtp_from_name || "Nitto Ponno Team"}</p>
          </div>
        </body>
      </html>
    `,
    text: `
      Hello ${userName || "User"},
      
      Thank you for registering with us. Please use the following OTP to verify your email address:
      
      OTP: ${otp}
      
      This OTP will expire in ${config.otp_expires_in || "10 minutes"}.
      
      If you didn't request this verification, please ignore this email.
      
      Best regards,
      ${config.smtp_from_name || "Nitto Ponno Team"}
    `,
  };
};

const getResetPasswordEmailTemplate = (otp: string, userName?: string) => {
  return {
    subject: "Reset Your Password",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Password</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #FF9800;">Password Reset Request</h2>
            <p>Hello ${userName || "User"},</p>
            <p>We received a request to reset your password. Please use the following OTP to reset your password:</p>
            <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
              <h1 style="color: #FF9800; margin: 0; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
            </div>
            <p>This OTP will expire in ${config.otp_expires_in || "10 minutes"}.</p>
            <p>If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
            <p>Best regards,<br>${config.smtp_from_name || "Nitto Ponno Team"}</p>
          </div>
        </body>
      </html>
    `,
    text: `
      Hello ${userName || "User"},
      
      We received a request to reset your password. Please use the following OTP to reset your password:
      
      OTP: ${otp}
      
      This OTP will expire in ${config.otp_expires_in || "10 minutes"}.
      
      If you didn't request a password reset, please ignore this email and your password will remain unchanged.
      
      Best regards,
      ${config.smtp_from_name || "Nitto Ponno Team"}
    `,
  };
};

const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  text: string
) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"${config.smtp_from_name || "Nitto Ponno"}" <${config.smtp_from_email || config.smtp_user_name}>`,
    to,
    subject,
    html,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}:`, info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

const processEmailJob = async (jobName: EmailJobName, data: EmailJobData) => {
  try {
    let emailTemplate;

    switch (jobName) {
      case EmailJobName.sendVerificationEmail:
        {
          const emailData = data as SendVerificationEmailData;
          const userName = getUserName(emailData.user.name);
          emailTemplate = getVerificationEmailTemplate(emailData.opt, userName);
          await sendEmail(
            emailData.user.email,
            emailTemplate.subject,
            emailTemplate.html,
            emailTemplate.text
          );
        }
        break;

      case EmailJobName.sendResetPasswordEmail:
        {
          const emailData = data as SendResetPasswordEmailData;
          const userName = getUserName(emailData.user.name);
          emailTemplate = getResetPasswordEmailTemplate(
            emailData.opt,
            userName
          );
          await sendEmail(
            emailData.user.email,
            emailTemplate.subject,
            emailTemplate.html,
            emailTemplate.text
          );
        }
        break;

      default:
        console.error(`Unknown email job name: ${jobName}`);
        throw new Error(`Unknown email job name: ${jobName}`);
    }
  } catch (error) {
    console.error(`Error processing email job ${jobName}:`, error);
    throw error;
  }
};

let connection: any = null;
let channel: any = null;
const QUEUE_NAME = "email_queue";

const initializeRabbitMQ = async () => {
  try {
    const rabbitmqUrl = (config.rabbitmq_url as string) || "amqp://localhost";
    connection = await amqp.connect(rabbitmqUrl);
    if (!connection) {
      throw new Error("Failed to create RabbitMQ connection");
    }
    channel = await connection.createChannel();
    if (!channel) {
      throw new Error("Failed to create RabbitMQ channel");
    }

    if (channel) {
      await channel.assertQueue(QUEUE_NAME, {
        durable: true,
      });

      await channel.consume(
        QUEUE_NAME,
        async (msg: amqp.ConsumeMessage | null) => {
          if (msg && channel) {
            try {
              const job = JSON.parse(msg.content.toString());
              await processEmailJob(job.jobName, job.data);
              channel.ack(msg);
            } catch (error) {
              console.error("Error processing email job:", error);
              if (channel) {
                channel.nack(msg, false, false);
              }
            }
          }
        },
        {
          noAck: false,
        }
      );
    }

    console.log("RabbitMQ email queue initialized and ready to process jobs");
  } catch (error) {
    console.error("Error initializing RabbitMQ:", error);
  }
};

export const emailQueue = {
  add: async (jobName: EmailJobName, data: EmailJobData) => {
    if (channel) {
      const job = {
        jobName,
        data,
      };
      channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(job)), {
        persistent: true,
      });
    } else {
      console.warn(
        "RabbitMQ not available, processing email job immediately (synchronous)"
      );
      await processEmailJob(jobName, data);
    }
  },
};

initializeRabbitMQ().catch((error) => {
  console.error("Failed to initialize RabbitMQ:", error);
});

const closeConnections = async () => {
  try {
    if (channel) {
      await channel.close();
      channel = null;
    }
    if (connection) {
      await connection.close();
      connection = null;
    }
  } catch (error) {
    console.error("Error closing RabbitMQ connections:", error);
  }
};

process.on("SIGINT", async () => {
  await closeConnections();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await closeConnections();
  process.exit(0);
});
