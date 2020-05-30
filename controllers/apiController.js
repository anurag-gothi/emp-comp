const Employee = require('../models/Employee')
const Detail = require('../models/Details')
const Company = require('../models/Company')

module.exports = {
    registerUser: async (req, res) => {
        try {
            const { name, email, password } = req.body
            const employee = await new Employee({ name: name, email: email, password: password })
            await employee.save()
            req.session.userId = employee._id
            res.redirect('/home')
        }
        catch{
            console.log(err.message)
            res.redirect('/register')
        }

    },
    loginUser: async function (req, res) {
        try {
            var email = req.body.email;
            var password = req.body.password;
            if (!email || !password) throw new Error("Incorrect credentials");
            const employee = await Employee.findByEmailAndPassword(email, password)
            req.session.userId = employee._id
            res.redirect('/home')
        }
        catch (err) {
            console.log(err.message)
            res.redirect('/login')
        }
    },

    logOutUser: function (req, res) {
        req.session.destroy();
        return res.redirect("/");
    },
    createComp: async function (req, res) {
        try {
            const id = req.session.userId
            const name = req.body.name
            const employee = await Employee.findById(id)
            const company = await new Company({ name: name })
            const detail = await new Detail({
                company: company._id,
                employee: id,
                name: employee.name,
                role: 'ceo',
            })
            company.employees.push(detail._id)
            await company.save()
            console.log(employee)
            employee.company_worked.push(detail._id)
            employee.working = true
            employee.cur_company = detail._id
            await employee.save()
            await detail.save()
            res.redirect('/home')
        }

        catch (err) {
            console.log(err)
            res.redirect('/newcompany')
        }

    },
    history: async function (req, res) {
        try {
            const id = req.session.userId
            const details = await Detail.find({ employee: id }).populate('company')
            res.render('history', {
                data: details,
                userId: req.session.userId
            })
        }
        catch (err) {
            console.log(err.message)
            res.redirect('/home')
        }

    },
    resign: async function (req, res) {
        try {
            const id = req.session.userId
            const CompId = req.params.id
            const employee = await Employee.findById(id)
            const company = await Company.findById(CompId)
            const detail = await Detail.findOne({ company: CompId })
            if (employee && company && detail) {
                detail.current_status = 'ex'
                detail.resignationdate = Date()
                employee.cur_company = null
                employee.working = false
                await detail.save()
                await employee.save()
                console.log(employee)
            }
            res.redirect('/home')
        }
        catch (err) {
            console.log(err.message)
            res.redirect('/home')
        }
    },
    companies: async function (req, res) {
        try {
            const companies = await Company.find()
            console.log(companies)
            if(req.session.userId){
                res.render('company', {
                    data: companies,
                    userId: req.session.userId
                })
            }
            else{
                res.render('company', {
                    data: companies,
                })
            }
        }
        catch (err) {
            console.log(err.message)
            res.redirect('/home')
        }
    },

    compdash: async function (req, res) {
        try {   
            const compid = req.params.id
            const details = await Company.findById(compid).populate('employees')
            var current = []
            var ex = []
            for(i=0;i<details.employees.length;i++){
                if(details.employees[i].current_status=='working'){
                    current.push(details.employees[i])
                    continue
                }
                else if(details.employees[i].current_status=='ex'){
                    ex.push(details.employees[i])
                    continue
                }
            }
            if(req.session.userId){
                const user = await Employee.findById(req.session.userId)
            res.render('compdash',{
                name:details.name,
                current:current,
                ex:ex,
                id:details._id,
                userId: req.session.userId,
                working:user.working
            })
            }
            else{
            res.render('compdash',{
                name:details.name,
                current:current,
                ex:ex,
                id:details._id,
                working:true
            })
            }
            
        }
        catch (err) {
            console.log(err)
            res.redirect('/home')
        }
    },
    joincomp: async function(req,res){
        try{
            const id = req.session.userId
            const compid = req.params.id
            const employee = await Employee.findById(id)
            if(employee.working==true){
                throw new Error('Already Working')
            }
            const company= await Company.findById(compid)
            const role = req.body.role
            const detail = await new Detail({
                company: company._id,
                employee: id,
                name: employee.name,
                role: role,
            })
            company.employees.push(detail._id)
            await company.save()
            console.log('yes')
            console.log(employee)
            employee.company_worked.push(detail._id)
            employee.working = true
            employee.cur_company = detail._id
            await employee.save()
            await detail.save()
            res.redirect('/home')
        }
        catch(err){
            console.log(err)
            res.redirect('/home')
        }
    }
}