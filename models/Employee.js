var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var Schema = mongoose.Schema;

var employeeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      unique: true,
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      trim: true
    },
    company_worked: [
      {
        type:Schema.Types.ObjectId,
        ref:"detail"
      }
    ],
    working:{
      type:Boolean,
      default:false
    },
    cur_company:{
      type:Schema.Types.ObjectId,
      ref:"detail"
    }
  },
  { timestamps: true }
);

employeeSchema.statics.findByEmailAndPassword = function(email, password) {
  var employeeObj = null;
  return new Promise(function(resolve, reject) {
    Employee.findOne({ email: email })
      .then(function(employee) {
        if (!employee) reject("Incorrect credentials");
        employeeObj = employee;
        return bcrypt.compare(password, employee.password);
      })
      .then(function(isMatched) {
        if (!isMatched) reject("Incorrect credentials");
        resolve(employeeObj);
      })
      .catch(function(err) {
        reject(err);
      });
  });
};

// I should avoid rehashing the password twice.
employeeSchema.pre("save", function(next) {
  var employee = this;
  // Check whether password field is modified
  if (employee.isModified("password")) {
    bcrypt
      .hash(employee.password, 10)
      .then(function(hashedPassword) {
        employee.password = hashedPassword;
        next();
      })
      .catch(function(err) {
        next(err);
      });
  }
  else{
    next();
  }
});


var Employee = mongoose.model("employee", employeeSchema);

module.exports = Employee;
