module.exports = {
    'mongoUrl': 'mongodb://localhost:27017/r2r',//process.env.MONGO_URL,
    'port': 3005,//parseInt(process.env.MONGO_PORT)
    'secretJwt': process.env.JWT_SECRET_KEY,
    'expiringTime': 2592000000//time is a month in miliseconds
}

// export default () => ({
//     'mongoUrl': 'mongodb://localhost:27017/r2r',//process.env.MONGO_URL,
//     'port': 3005,//parseInt(process.env.MONGO_PORT)
//     'secret': process.env.JWT_SECRET_KEY,
//     'expiringTime': 2592000000//time is a month in miliseconds
// });