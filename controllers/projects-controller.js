const nodemailer = require('nodemailer');
const gmail = require('../config/gmail-nodemailer.json');

async function projectsController (req, res) {
    try {
        const transporter = await nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: gmail.user,
                pass: gmail.password
            },
        })
        
        const text = `
            <strong>Заявка:</strong> ${req.body.orderName}<br>
            <strong>ФИО:</strong> ${req.body.initials}<br>
            <strong>Телефон:</strong> ${req.body.phone}<br>
            <strong>e-mail:</strong> ${req.body.email}
        `;

        
        const result = await transporter.sendMail({
            from: gmail.user,
            to: gmail.address,
            subject: `Заявка с сайта Экотранс: ${req.body.orderName}`,
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

module.exports = projectsController;