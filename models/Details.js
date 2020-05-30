var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var Schema = mongoose.Schema;

var detailSchema = new Schema(
  {
        company:{
        type: Schema.Types.ObjectId,
        ref: "company"
        },
        employee:{
            type:Schema.Types.ObjectId,
            ref:"employee"
        },
        name:{
          type:String
        },
        role:{
          type:String
        },
        current_status:{
          type:String,
          default:'working'
        },
        joiningdate:{
          type:Date,
          default:Date()
        },
        resignationdate:{
          type:Date
        }
  },
  { timestamps: true }
);


var Detail = mongoose.model("detail", detailSchema);

module.exports = Detail;
