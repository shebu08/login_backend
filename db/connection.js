const mongoose = require('mongoose');
async function connectMongoDb(){
    return mongoose.connect('mongodb+srv://shariq:shariq123@cluster0.gm0lpdi.mongodb.net/user-auth');
}
module.exports = {
    connectMongoDb
};
