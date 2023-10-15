import nodemailer from "nodemailer";
const sendOTP = (email: string, verificationCode: any) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "lifesport.hcmvn@gmail.com",
            pass: "nzpwluzpbkydpvze",
        },
        tls: {
            rejectUnauthorized: true,
            minVersion: "TLSv1.2",
        },
    });
    const mailOption = {
        from: "lifesport.hcmvn@gmail.com",
        to: email,
        subject: "Code Verification",
        html: `<p>LifeTravel-<b><mark>${verificationCode}</mark></b> is your verification code.</p>`,
    };
    transporter.sendMail(mailOption, (error, info) => {
        if (error) {
            throw new Error(`${error}`);
        }
    });

};
export default sendOTP
