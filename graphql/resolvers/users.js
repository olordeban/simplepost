const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const { validateRegisterInput, validateLoginInput } = require('../../util/validators');
const { SECRET_KEY } = require('../../config')
const User = require('../../models/User');


function generateToken(user){
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, SECRET_KEY, { expiresIn: '1h' });
}

module.exports = {
    Mutation: {
        async login(_, { username, password }){
            const {errors, valid} = validateLoginInput(username, password);

            if(!valid){
                throw new UserInputError('Errors', { errors });
            }

            const user = await User.findOne({ username });

            if(!user) {
                errors.general = 'Usuário não existe';
                throw new UserInputError('Usuário não existe', {errors});
            }

            const match = await bcrypt.compare(password, user.password);
            if(!match){
                errors.general = 'Senha incorreta';
                throw new UserInputError('Senha incorreta', {errors});
            }

            const token = generateToken(user);

            return {
                ...user._doc,
                id: user._id, 
                token
            }

        },
        async register(_, { registerInput: { username, email, password, confirmPassword } }) {

            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
            if(!valid){
                throw new UserInputError('Errors', { errors });
            }

            const user = await User.findOne({ username });
            if(user){
                throw new UserInputError('Nome de usuário já está sendo usado', {
                    errors: {
                        username: 'Nome de usuário já está sendo usado'
                    }
                })
            }

            const euser = await User.findOne({ email })
            if(euser){
                throw new UserInputError('Email já está sendo usado', {
                    errors: {
                        username: 'Email já está sendo usado'
                    }
                })
            }

            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                username,
                email,
                password,
                createdAt: new Date().toISOString()
            });

            const res = await newUser.save();
            const token = generateToken(res);

            return {
                ...res._doc,
                id: res._id, 
                token
            }
        }
    }
}