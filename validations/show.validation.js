const Joi = require("joi");

const showValidation = Joi.object({
    movieId: Joi.string().trim().min(3).max(10).required(),
    zoneCodes: Joi.array().items(Joi.string().trim().min(1)).required(),
    screenCode: Joi.string().trim().min(9).max(18).required(),
    theaterCode: Joi.string().trim().min(5).max(10).required(),
    startTime: Joi.date().required(),
    endTime: Joi.date().required(),
    language: Joi.string().trim().min(2).max(10).required(),
    format: Joi.string().trim().valid('2D', '3D', 'IMAX').default('2D')
})

module.exports=showValidation