// https://github.com/braitsch/node-login/blob/master/app/server/modules/account-manager.js

var crypto 		= require('crypto');
var mongodb     = require('mongodb');
var moment      = require('moment');

/* login validation methods */

exports.autoLogin = function(user, pass, db, callback) {
	db.collection('accounts').findOne({email:user}, function(e, o) {
		if (o){
			o.password == pass ? callback(o) : callback(null);
		}	else{
			callback(null);
		}
	});
};

exports.manualLogin = function(user, pass, db, callback) {
	db.collection('accounts').findOne({email:user}, function(e, o) {
		if (o == null){
			callback('user-not-found');
		}	else{
			validatePassword(pass, o.password, function(err, res) {
			    if (err) {
		            return console.log(err);
		        }
			    
				if (res){
					callback(null, o);
				}	else{
					callback('invalid-password');
				}
			});
		}
	});
};

/* record insertion, update & deletion methods */
exports.addNewAccount = function(newData, db, callback) {
	var accounts = db.collection('accounts');
	
	accounts.findOne({email:newData.email}, function(e, o) {
		if (o) {
			callback('email-taken');
		} else {
			saltAndHash(newData.password, function(hash){
				newData.password = hash;
				// append date stamp when record was created //
				newData.created = moment().format('MMMM Do YYYY, h:mm:ss a');
				accounts.insert(newData, {safe: true}, callback);
			});
		}
	});
};
 /*
exports.updateAccount = function(newData, callback)
{
	accounts.findOne({user:newData.user}, function(e, o){
		o.name 		= newData.name;
		o.email 	= newData.email;
		o.country 	= newData.country;
		if (newData.pass == ''){
			accounts.save(o, {safe: true}, function(err) {
				if (err) callback(err);
				else callback(null, o);
			});
		}	else{
			saltAndHash(newData.pass, function(hash){
				o.pass = hash;
				accounts.save(o, {safe: true}, function(err) {
					if (err) callback(err);
					else callback(null, o);
				});
			});
		}
	});
}

exports.updatePassword = function(email, newPass, callback)
{
	accounts.findOne({email:email}, function(e, o){
		if (e){
			callback(e, null);
		}	else{
			saltAndHash(newPass, function(hash){
		        o.pass = hash;
		        accounts.save(o, {safe: true}, callback);
			});
		}
	});
}
*/
/* account lookup methods */
/*
exports.deleteAccount = function(id, callback)
{
	accounts.remove({_id: getObjectId(id)}, callback);
}

exports.getAccountByEmail = function(email, callback)
{
	accounts.findOne({email:email}, function(e, o){ callback(o); });
}

exports.validateResetLink = function(email, passHash, callback)
{
	accounts.find({ $and: [{email:email, pass:passHash}] }, function(e, o){
		callback(o ? 'ok' : null);
	});
}

exports.getAllRecords = function(callback)
{
	accounts.find().toArray(
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
};

exports.delAllRecords = function(callback)
{
	accounts.remove({}, callback); // reset accounts collection for testing //
}
*/
/* private encryption & validation methods */

var generateSalt = function()
{
	var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
	var salt = '';
	for (var i = 0; i < 10; i++) {
		var p = Math.floor(Math.random() * set.length);
		salt += set[p];
	}
	return salt;
}

var md5 = function(str) {
	return crypto.createHash('md5').update(str).digest('hex');
}

var saltAndHash = function(pass, callback) {
	var salt = generateSalt();
	callback(salt + md5(pass + salt));
};

var validatePassword = function(plainPass, hashedPass, callback) {
	var salt = hashedPass.substr(0, 10);
	var validHash = salt + md5(plainPass + salt);
	callback(null, hashedPass === validHash);
};

/* auxiliary methods */

var getObjectId = function(id) {
	return new mongodb.ObjectID(id);
};
