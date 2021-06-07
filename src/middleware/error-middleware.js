const error_middleware = (req, res, next)=>{

    throw new Error("From my middleware")




}

module.exports = error_middleware