const User = require('../Model/userModel.js')
const ApiFeatures = require('../Utils/apifeatures.js');
const CustomError = require('../Utils/CustomError.js');
const asyncErrorHandler = require('../Utils/AsyncErrorHandler.js');
const jwt = require('jsonwebtoken');
const util = require('util');

const tokenCreation = (id) => {
    return jwt.sign({ id }, process.env.SECRET_STR, {
        expiresIn: '3d'
    })
}
exports.signup = asyncErrorHandler(async (req, res, next) => {
    const user = await User.create(req.body);
    const token = tokenCreation(user._id);
    res.status(200).json({
        status: 'CREATED',
        token
    });
})

exports.logIn = asyncErrorHandler(async (req, res, next) => {
    //console.log(req.body)
    const email = req?.body?.email;
    const password = req?.body?.password;

    if (!email || !password) {
        const error = new CustomError('password/email missing', 400);
        return next(error);
    }
    const user = await User.findOne({ email }).select('+password');
    console.log(user);
    //const isMatch = await user.comparePassword(password,user.password);
    if (!user || !(await user.comparePassword(password, user?.password))) {
        const error = new CustomError('incorrect password / missing user', 400);
        return next(error);
    }
    const token = tokenCreation(user._id);
    res.status(200).json({
        status: 'SUCCESS',
        token
    });

})

exports.protect = asyncErrorHandler(async (req, res, next) => {
    //1.check if token is present
    const testToken = req.headers.authorization;
    let token;
    if (testToken && testToken.startsWith('bearer')) {
        token = testToken.split(' ')[1]
    }

    if (!token) {
        const error = new CustomError('unauthorized', 401)
        return next(error);
    }
    //2.validate the token
    const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_STR);
    //3.if user exists
    const user = await User.findById(decodedToken.id);
    if (!user) {
        const error = new CustomError('no such user exits', 404)
        return next(error);
    }
    //4.if user changed password after token is issued
    if (await user.isPasswordChanged(decodedToken.iat)) {
        const error = new CustomError('password recently changed. Please logIn Again', 401);
        return next(error);
    };
    //5.allow user to access the route
    next()

})

exports.restrict = (role) => {
    return (req, res, next) => {
        if (req.user.role!=role) {
            const error = new CustomError('unauthorized', 401);
            return next(error);
        }
        next();
    }
}