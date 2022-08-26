const mongoose = require("mongoose");

const subjectsSchema = new mongoose.Schema(
    {
        subjectId:{
            type:String,
            require:true
        },
        subjectName:{
            type:String,
            require:true
        },
        subjectCode:{
            type:String,
            require:true
        },
        professorName:{
            type:String,
            require:true
        },
        professorDegree:{
            type:String,
            require:true
        }
    });

module.exports = mongoose.model("subjectsData", subjectsSchema);