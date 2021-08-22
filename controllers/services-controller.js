const nodemailer = require('nodemailer');
const gmail = require('../config/gmail-nodemailer.json');
const fs = require('fs');
const path = require('path');

async function servicesController (req, res) {
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
            <strong>ИНН:</strong> ${req.body.inn}<br>
            <strong>ФККО:</strong> ${req.body.fkko}<br>
            <strong>Телефон:</strong> ${req.body.phone}<br>
            <strong>e-mail:</strong> ${req.body.email}
        `;

        
        const result = await transporter.sendMail({
            from: gmail.user,
            to: gmail.address,
            subject: `Заявка с сайта Экотранс: ${req.body.orderName}`,
            html:`${text}`,
            attachments: [
                {
                    filename: req.file.originalname,
                    path: req.file.path
                }
            ]
        });
        
        console.log(result);

        if (result.accepted) {
            res.status(200).json({"message": "done"}).end();
        } else {
            res.status(500).json({"message": "error"}).end();
        }

        fs.unlink(path.join(req.file.path), err => {
            if (err) throw err;
        });

    } catch(e) {
        console.log(e);
        res.status(500).json({"message": "error"}).end();
    }
}

module.exports = servicesController;