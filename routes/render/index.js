'use strict';

var render = {

	loginPage: function loginPagefn(req, res, next) {
	    res.render('login');
	},

	signupPage: function signupPagefn(req, res, next) {
	    res.render('signup');
	},

    forgotPasswordPage: function forgotPasswordPagefn(req, res, next) {
	    res.render('forgot-password');
    },

    resetPasswordPage: function resetPasswordPagefn(req, res, next) {
	    res.render('reset-password');
	},

	gallery: function galleryfn(req, res, next) {
		res.render('gallery');
	},

	profilePicGallery: function(req, res, next) {
		res.render('profilePicGallery');
	}

};

module.exports = render;