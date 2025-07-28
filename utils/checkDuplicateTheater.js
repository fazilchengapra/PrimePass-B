const Theater = require("../models/Theater")

const checkDuplicateTheater = async({name, city, address}) => {
    return await Theater.findOne({
        name,
        "location.address": address,
        "location.city": city
    })
}

module.exports = checkDuplicateTheater;