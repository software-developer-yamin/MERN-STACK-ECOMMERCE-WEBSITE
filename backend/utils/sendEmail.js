import nodeMailer from "nodemailer";

const sendEmail = async (options) => {
     const transporter = nodeMailer.createTransport({
          service: "Gmail",
          auth: {
               user: "service.yamin.all@gmail.com",
               pass: "01880279877",
          }
     });
     const mailOptions = {
          from: "service.yamin.all@gmail.com",
          to: options.email,
          subject: options.subject,
          text: options.message,
     };

     await transporter.sendMail(mailOptions);
};

export default sendEmail;