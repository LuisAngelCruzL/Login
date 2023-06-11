const express = require("express")
const path=require("path");
const app=express();
const collection=require("./mongodb");
var currentData;

app.use(express.json());
app.use(express.urlencoded({extended:false}));

const tempelatePath= path.join(__dirname,'../tempelates');
const publicPath = path.join(__dirname, '../public');
console.log(publicPath);

app.set("view engine","hbs");
app.set("views",tempelatePath);
app.use(express.static(publicPath));

app.get('/signup', (req, res) => {
    res.render('signup');
})
app.get('/', (req, res) => {
    res.render('login');
})
app.get('/update', (req, res) => {
    res.render('update');
})

//consultar o ver usuarios
app.get("/consult", async(req, res) =>{
    const search = async () => {
        const usuarios = await collection.find({});
        res.render("consult", {usuarios:usuarios});
    }
    search();
});


//Registrar usuario
app.post("/signup",async (req, res)=>{
    const data={
        name:req.body.name,
        password:req.body.password
    }
    await collection.insertMany([data]);

    res.render("login");
})

//Ingresar usuarios
app.post("/login",async (req, res)=>{ 
    try{
        const check=await collection.findOne({name:req.body.name})
        if(check.password===req.body.password){
            currentData=check
            res.status(201).render("home", {usuarios:check});
        }else{
            res.send("Contraseña incorrecta");
        }
    }
    catch{
        res.send("Introduzca bien los datos");
    }
})

//Actualizar usuarios
app.post("/update", async(req, res)=> {
    const usuario=await collection.findOne({name:currentData.name, password:currentData.password})
    if (usuario != null) {
        var data = {
            name:req.body.name,
            password:req.body.password
        };
        if(data.name==""){
            data.name=currentData.name;
        }
        if(data.password==""){
            data.password=currentData.password;
        }

        await collection.updateOne({name:usuario.name}, data);
        currentData = data;

        var criptedpass = "";

        for (i = 0; i < currentData.password.length; i++) {
            criptedpass += "*";
        }

        res.render("login");
        console.log("User Updated");
    }
});

//ELiminar usuarios
app.post("/delete", async(req, res)=> {
    const usuario = await collection.findOne({name:currentData.name, password:currentData.password});

        if (usuario != null) {
            collection.deleteOne(usuario)
            .then(function(){})
            .catch(function(){});
            res.render("login");
            console.log("User deleted");
        }
});

//Conectar al puerto
app.set('port',process.env.PORT || 3000);
app.listen(app.get('port'), () => {
    console.log('port connected');
})