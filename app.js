var app = require('./config/app_config.js'),
	promotionRoutes = require('./api/routes/promotionRoute.js'),
	usersRoutes = require('./api/routes/userRoute'),
	loginRoutes = require('./api/routes/loginRoute'),
	establishmentRouter = require('./api/routes/establishmentRoute.js'),
	conversationRouter = require('./api/routes/conversationRoute.js'),
	db = require('./config/db_config.js'),
	scriptSendEmail = require('./script/sendEmail.js'),
	express = require('express');

var path = require('path');

/*Rotas sem autenticação*/
app.use('/api/login', loginRoutes);

app.use(express.static(__dirname + '/public'));
app.set('view', __dirname + '/view');
app.get('/' , function(request, response){
	return response.sendFile(path.join(__dirname+'/public/view/login.html'));
});

/*app.get('/home' , function(request, response){
	return response.sendFile(path.join(__dirname+'/public/view/home.html'));
});*/

app.use('/api/conversation', conversationRouter);
/*Rotas com autenticação*/
app.use(require('./auth'));
app.use('/api/users', usersRoutes);
app.use('/api/establishments', establishmentRouter);
app.use('/api/sendEmail', scriptSendEmail);
app.use('/api/promotions', promotionRoutes);

exports = module.exports = app;
