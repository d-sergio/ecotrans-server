const express = require('express');
const app = express();
const port = 3000;
const nodemailer = require('nodemailer');
const cors = require('cors');
const multer = require('multer');   //Загрузка formData из req
const upload = multer({dest: './uploads/'});

const config = require('./config/config.json');

const gmail = require('./config/gmail-nodemailer.json');
const fs = require('fs');
const path = require('path');

app.use(express.static('public_html'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public_html/index.html');
});

app.use('/messages', (req, res, next) => {
    const isAllowed = checkOrigin(req);

    if (!isAllowed) {
        res.status(403).end();

        return;
    }

    res.set(config.headers);

    next();
   
}, cors(getCors));

/**Допустимые origin */
function getCors(req, callback) {
    const isAllowed = checkOrigin(req);

    corsOptions = {
        methods: config.cors.methods,
        allowedHeaders: config.cors.allowedHeaders,
        origin: isAllowed
    }

    callback(null, corsOptions)
}

/*Origin есть в списке? */
function checkOrigin(req) {
    const allowlist = config.cors.origin;

    const isAllowed = allowlist.indexOf(req.header('Origin')) !== -1;
    
    return isAllowed;
}

app.post('/messages/feedback', upload.fields([]), async (req, res) => {    
    try {
        const transporter = await nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: gmail.user,
                pass: gmail.password
            },
        })
        
        const text = `<strong>ФИО:</strong> ${req.body.initials}<br>
            <strong>e-mail:</strong> ${req.body.email}<br>
            <strong>Телефон:</strong> ${req.body.phone}<br>
            <strong>Сообщение:</strong> ${req.body.message}`;

        
        const result = await transporter.sendMail({
            from: gmail.user,
            to: gmail.address,
            subject: `Сайт Экотранс: сообщение от ${req.body.initials}`,
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
});

app.post('/messages/projects', upload.fields([]), async (req, res) => {
    try {
        const transporter = await nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: gmail.user,
                pass: gmail.password
            },
        })
        
        const text = `
            <strong>ФИО:</strong> ${req.body.initials}<br>
            <strong>Интересующий проект:</strong> ${req.body.projectName}<br>
            <strong>Телефон:</strong> ${req.body.phone}<br>
            <strong>e-mail:</strong> ${req.body.email}
        `;

        
        const result = await transporter.sendMail({
            from: gmail.user,
            to: gmail.address,
            subject: `Сайт Экотранс: ${req.body.initials} интересуется проектом`,
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
});

app.post('/messages/services', upload.single('passport'), async (req, res) => {
    try {
        const transporter = await nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: gmail.user,
                pass: gmail.password
            },
        })
        
        const text = `
            <strong>Интересующая услуга:</strong> ${req.body.serviceName}<br>
            <strong>ИНН:</strong> ${req.body.inn}<br>
            <strong>ФККО:</strong> ${req.body.fkko}<br>
            <strong>Телефон:</strong> ${req.body.phone}<br>
            <strong>e-mail:</strong> ${req.body.email}
        `;

        
        const result = await transporter.sendMail({
            from: gmail.user,
            to: gmail.address,
            subject: `Сайт Экотранс: запрос стоимости услуг ${req.body.phone}`,
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
});

app.post('/messages/callback', upload.fields([]), async (req, res) => {
    try {
        const transporter = await nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: gmail.user,
                pass: gmail.password
            },
        })
        
        const text = `
            <strong>Заказан обратный звонок</strong><br>
            <strong>ФИО:</strong> ${req.body.initials}<br>
            <strong>Телефон:</strong> ${req.body.phone}<br>
        `;

        
        const result = await transporter.sendMail({
            from: gmail.user,
            to: gmail.address,
            subject: `Сайт Экотранс: ${req.body.initials} просит позвонить`,
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
});

app.listen(config.server.port, () => {
    console.log(`Listening at ${port} port`);
});