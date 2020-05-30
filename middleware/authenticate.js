const User = require('../models/Employee')
module.exports = async function(req,res,next){
    try{
        const userid = req.session.userId
        if(!userid){
        res.redirect('/login')
         }
        const user = await User.findById(userid)
        if(user){
        next()
        }
     }
    catch(err){
        console.log(err)
        res.redirect('/login')
    }
    
} 