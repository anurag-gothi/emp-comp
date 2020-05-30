var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var companySchema = new Schema(
  {
        name:{
          type: String
        },
        employees:[
            {
            type:Schema.Types.ObjectId,
            ref:"detail"
        }
        ]
  },
  { timestamps: true }
);


var Company = mongoose.model("company", companySchema);

module.exports = Company;
