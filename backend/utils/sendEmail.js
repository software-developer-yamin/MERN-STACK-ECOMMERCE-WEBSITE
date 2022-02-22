import nodeMailer from "nodemailer";

const sendEmail = async (options) => {
     console.log(options);
     const transporter = nodeMailer.createTransport({
          service: "gmail",
          secure: false,
          host: 'smtp.gmail.com',
          auth: {
               user:process.env.SMTP_MAIL,
               pass: process.env.SMTP_PASS,
          }
     });
     const mailOptions = {
          from: process.env.SMTP_MAIL,
          to: options.email,
          subject: options.subject,
          text: options.message,
          html: `<p>Hello world? ${options.message}</p>`,
     };

     await transporter.sendMail(mailOptions);
};

export default sendEmail;