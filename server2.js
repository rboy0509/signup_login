
//Сервер
let express = require('express');
const app = express()
app.listen(3000,console.log('Server is online'))

//База данных
let mongoose =require('mongoose')
let db ='mongodb+srv://user:1111@cluster0.lay9cse.mongodb.net/?retryWrites=true&w=majority'
mongoose
.connect(db)
.then(()=>console.log('Connected to DB'))

// Другое
app.use(express.urlencoded({extended:false}))
let User= require('./models/userModel')
let jwt =require('jsonwebtoken')
const axios = require('axios')
let path=require('path')
let createPath=(page)=>path.resolve(__dirname,'views',`${page}.ejs`)
app.set('view-engine','ejs')
const { generateCuteCode } = require('cute-code-generator');
let Code = require('./models/codsModel')
let cookieParser = require('cookie-parser');
const { decode } = require('punycode');
app.use(cookieParser())

//Страница только для авторизированых пользователей

app.get('/private',(req,res)=>{
console.log(req.cookies.token);
try {
let decoded = jwt.verify(req.cookies.token,'d84s')

console.log(decoded.login);
User.find({login:decoded.login})
.then((r)=>{
    res.render(createPath('profile'),{r})
})





} catch(err) {
res.send('Ошибка валидации токена')
}


})


//Регистрация новых пользователей

app.post('/signup',(req,res)=>{
    let user = new User(req.body)
    
    //Проверим есть ли такой пользователь
    User.find(req.body)
    .then((r)=>{
        if(!r[0]) {
            user.save()
            res.redirect('/login')
            // res.send('Пользователь успешно зарегестрирован');
        }else{
            res.send('Пользователь стаким именем уже существует');
        }
    })
    
})


//Авторизация пользователя

app.post('/login',(req,res)=>{
//Проверим есть ли в базе такой пользователь
User.find({login:req.body.login})
.then((r)=>{
    
//Если такого пользователя нет
if(!r[0]){
    res.send('Неверный логин');
} else {
    if(req.body.password !=r[0].password){
        res.send('Неверный пароль');
    } else {

//Создаем и устанавливаем токен

let token= jwt.sign({login:r[0].login},'d84s')
res.cookie('token',token)
res.redirect('/private')


    }
}




})






})


//Выход из системы
app.get('/logout',(req,res)=>{
    res.clearCookie('token')
    res.redirect('/login')
})

//Страница регистрации

app.get('/signup',(req,res)=>{
    console.log(req.body);
    res.render(createPath('signup'))
})

//Страница логина
let showMsg1='block'
app.get('/login',(req,res)=>{
    console.log(req.body);
    res.render(createPath('login'))
})


SERVER_URL='https://1e8b-176-100-9-22.eu.ngrok.io'

let telegramToken='5337882239:AAFp4N21ZtzN9ZvWY27txgxjpuq5q6G0Umc'
const URI=`/webhook/${telegramToken}`
const WEBHOOK_URL=SERVER_URL+URI