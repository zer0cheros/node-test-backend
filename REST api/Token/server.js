require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()
let port = 3000
let localhost = "http://localhost"

app.use(express.json())

const jwtOptins = {
    expiresIn: '15s'
}
const data = [
    {
        username: "Christian",
        isAdmin: true
    },
    {
        username: "Göran",
        isAdmin: false
    }
]


app.get('/', (req, res)=> {
    res.json(data)
})


app.post('/registration', authToken, (req,res)=>{
    jwt.verify(req.token, process.env.TOKEN_SECRET, (err, authData)=>{
        if(err) return res.sendStatus(403)
        else {
        res.json({message: 'user added...',
        authData})
    }
    })
})
app.post('/login', (req, res)=> {
    const user = {
        id: 123123123,
        name: 'Christian',
        email: 'christian@gmail.com'
    }
    jwt.sign({user: user}, process.env.TOKEN_SECRET, jwtOptins, (err, token)=> {
        res.json({
            token
        })
    })
    
})

app.post('/login2', (req, res)=> {
    const username = req.body.username
    const user = { name: username}
    const accesToken = jwt.sign({user:user}, process.env.TOKEN_SECRET)
    res.json({accesToken: accesToken})
})


// verify token
function authToken( req, res, next){
    //get header value
    const authHeader = req.headers['authorization']
    // check if bearer is undefind
    //Metod 1
    if(typeof authHeader !== 'undefined'){
        const bearer = authHeader.split(' ')
        const bearerToken = bearer[1]
        req.token = bearerToken
        next()
    } else{
        res.sendStatus(403)
    }
    //Metod 2
    /*
    const token = authHeader && authHeader.split(' '[1])
    if(token === null)return res.sendStatus(401)
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user)=> {
       if(err) return res.sendStatus(403)
       req.user = user
       next()
    })*/

}

app.listen(port, (err)=> {
    console.log(`Connected to Localhost:${port}`);
})
