const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://anurag:anurag@cluster0-wgy0r.mongodb.net/employee?retryWrites=true&w=majority',{
    useUnifiedTopology:true,
    useNewUrlParser: true,
    useCreateIndex: true

}).then(function(){
    console.log('database connected')
}).catch(function(err){
    console.log('Error in database')
})