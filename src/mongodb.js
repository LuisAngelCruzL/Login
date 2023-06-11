const mongoose=require("mongoose")

mongoose.connect("mongodb+srv://LuisAngel:1a+2b+3c-4d-cbtis@cluster.xl3vevl.mongodb.net/database?retryWrites=true&w=majority")
.then(()=>{
    console.log("mongodb connected");
})
.catch(()=>{
    console.log("failed to connect mongodb");
})


//Coleccion y documento
const logInSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const collection=new mongoose.model("Users",logInSchema)

module.exports=collection