const Joi = require('@hapi/joi');

const typeUser = ['mentor', 'mentored'];

const registerValidation = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        cpf: Joi.string().min(11).max(11).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        typeUser: Joi.string().valid(...typeUser).required()
    });
    return schema.validate(data);
}

const loginValidation = (data) => {
    const schema = Joi.object({
        cpf: Joi.string().min(11).max(11).required(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(data);
}

const mentoringValidation = (data) => {
    const schema = Joi.object({
        title: Joi.string().required()
    });
    return schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.mentoringValidation = mentoringValidation;
