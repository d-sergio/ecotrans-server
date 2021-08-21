const express = require('express');
const router = express.Router();
const cors = require('cors');
const getCors = require('./get-cors');
const multer = require('multer');   //Загрузка formData из req
const upload = multer({dest: './uploads/'});

const setHeaders = require('./set-headers');
const feedbackController = require('../controllers/feedback-controller');
const projectsController = require('../controllers/projects-controller');
const servicesController = require('../controllers/services-controller');
const callbackController = require('../controllers/callback-controller');

router.use('/', setHeaders, cors(getCors));

router.post('/feedback', upload.fields([]), feedbackController);

router.post('/projects', upload.fields([]), projectsController);

router.post('/services', upload.single('passport'), servicesController);

router.post('/callback', upload.fields([]), callbackController);

router.use((err, req, res, next) => {
    res.status(500).json({error: "Ошибка маршрутизации",
    error: err});
 });

module.exports = router;