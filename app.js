const PORT = process.env.PORT || 3000
const express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	flash = require('connect-flash'),
	methodOverride = require('method-override'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	passportLocalMongoose = require('passport-local-mongoose'),
	Blog = require('./models/blog'),
	Comment = require('./models/comment'),
	User = require('./models/user'),
	seedDB = require('./seeds')

const compression = require('compression')
const helmet = require('helmet')
app.use(compression())
app.use(helmet())

//requiring routes
const blogRoutes = require('./routes/blogs'),
	commentRoutes = require('./routes/comments'),
	indexRoutes = require('./routes/index')

mongoose.connect(
	'mongodb+srv://DeepanshuRai:hellokaun@fbloggerapp-surie.mongodb.net/test?retryWrites=true&w=majority',
	{ useNewUrlParser: true, useUnifiedTopology: true }
)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(flash())

//PASSPORT CONFIGURATION
app.use(
	require('express-session')({
		secret: 'Hello there!Welcome to the world of Deepanshu_15',
		resave: false,
		saveUninitialized: false,
	})
)
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function (req, res, next) {
	res.locals.currentUser = req.user
	res.locals.success = req.flash('success')
	res.locals.error = req.flash('error')
	next()
})

app.use(blogRoutes)
app.use(commentRoutes)
app.use(indexRoutes)

app.listen(PORT, function () {
	console.log('Server has Started...')
})
