const express = require('express')
const router = express.Router()
const { registerUser, loginUser, logOutUser,createComp ,history,resign,companies,compdash,joincomp} = require('../controllers/apiController')
const authenticate = require('../middleware/authenticate')
const Employee = require('../models/Employee')
const Detail = require('../models/Details')
const Company = require('../models/Company')

router.get('/', (req, res) => {
    if (req.session.userId) {
        res.render('home', {
            userId: req.session.userId
        })
    }
    else {
        res.render('home')
    }
})

router.get('/home', authenticate, async (req, res) => {
    const user = await Employee.findById(req.session.userId)
    if (user.working == false) {
        res.render('dashboard', {
            userId: req.session.userId,
            free: true
        })
    }
    else {
        const details  = await Detail.find({_id:user.cur_company}).populate('company')
        res.render('dashboard', {
            name:details[0].company.name,
            role:details[0].role,
            joiningdate:details[0].joiningdate,
            userId: req.session.userId,
            free: false,
            id:details[0].company._id
        })
    }

})
router.get('/register', (req, res) => {
    res.render('register')
})
router.post('/register', registerUser)

router.get('/login', (req, res) => {
    res.render('login')
})
router.get('/newcompany',authenticate,async(req,res)=>{
    const user = await Employee.findById(req.session.userId)
    if (user.working == true) {
        res.redirect('/home')
    }
    else{
        res.render('create',{
            userId: req.session.userId
        })
    }
})
router.get('/history',authenticate,history)
router.get('/allcomp',companies)
router.get('/compdash/:id',compdash)
router.post('/login', loginUser)
router.post('/newcomp',authenticate,createComp)
router.post('/join/:id',authenticate,joincomp)
router.delete("/logout", authenticate, logOutUser);
router.delete('/resign/:id',authenticate,resign)

module.exports = router;