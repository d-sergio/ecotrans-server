const nodemailer = require('nodemailer');
const gmail = require('../config/gmail-nodemailer.json');

async function callbackController (req, res) {
    try {
        const transporter = await nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: gmail.user,
                pass: gmail.password
            },
        })
        
        const text = `
            <strong>Заявка на обратный звонок. "Зелёный телефон"</strong><br>
            <strong>ФИО:</strong> ${req.body.initials}<br>
            <strong>Телефон:</strong> ${req.body.phone}<br>
        `;

        
        const result = await transporter.sendMail({
            from: gmail.user,
            to: gmail.address,
            subject: `Заявка с сайта Экотранс на обратный звонок от ${req.body.initials}`,
            html:`${text}`,
        })
        
        console.log(result);

        if (result.accepted) {
            res.status(200).json({"message": "done"}).end();
        } else {
            res.status(500).json({"message": "error"}).end();
        }
    } catch(e) {
        console.log(e);
        res.status(500).json({"message": "error"}).end();
    }
}

module.exports = callbackController;