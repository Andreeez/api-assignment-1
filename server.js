var express = require('express');
var bodyParser = require('body-parser');
var app = express();

const fs = require('fs');

app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('myJsonObject'));
app.use(express.static('stylesheets'));
// app.use(express.static(path.join(__dirname, 'public')));


let data = fs.readFileSync('./myJsonObject/list.json');
let list = JSON.parse(data);

app.get("/", (req,response) => response.render('index', {list})
);

//Funktion för att kunna söka
app.get('/:key', (req, res) => {
    
    let key = req.params.key;
    key.toLowerCase();
    var stadlist = Object.keys(list);
    
    for(const stad in stadlist) {
        console.log(stadlist[stad]);
        console.log(key);
        if(stadlist[stad].toLowerCase().includes(key)){
            let value = list[stadlist[stad]];
            res.send(`Du har sökt efter ${stadlist[stad].charAt(0).toUpperCase() + stadlist[stad].slice(1)}, betyget är ${value} poäng`)
        }
    }

    res.send("Din sökning gav inget resultat");
})

//Funktion för att lägga till via Formulär

app.post('/addToList', (req, res) => {
    // let name = req.params.addToListKey1
    // let values = parseInt(req.params.addToListKey2)
    let name = req.body.addToListKey1;
    let values = parseInt(req.body.addToListKey2)
    if(!name & !values){
        res.send('Lägg till ett värde')
    } else {
        list[name] = values;
        let addToJsonFile = JSON.stringify(list,null, 10)
        fs.writeFileSync('./myJsonObject/list.json', addToJsonFile);
    
        res.redirect('/');
       
        // var x = document.createElement("BUTTON").createTextNode("Click me");
        // x.appendChild.redirect('/list');
        // document.body.appendChild(x);
    }
})
//Funktion för att kunna ta bort från listan. Man måste dock skriva in exakt rätt stad för att kunna ta bort den
app.post('/deleteFromList', (req, res) => {
    let name = req.body.deleteFromList;
    if(delete list[name])
    {
        try {
            fs.writeFileSync('./myJsonObject/list.json', JSON.stringify(list), "utf8");
        }
        catch(err) {
            console.log(err);
        }
    }
    res.redirect('/');
    
})
//Funktion för att kunna updatera listan via formulär, Man måste dock skriva in exakt rätt stad för att kunna redigera.
app.post('/updateList', (req, res) => {

    let names = req.body.updateListKey1
    let newname = req.body.updateListKey2
    let newvalues = parseInt(req.body.updateListKey3)

    if(names){
        list[newname] = list[names] 
        delete list[names]
        list[newname] = newvalues
      
        let addToJsonFile = JSON.stringify(list)
        fs.writeFileSync('./myJsonObject/list.json', addToJsonFile);

        res.redirect('/');
    } else {
        res.send('kunde inte läggas till')
    }
})

//Funktion för att lägga till via URL QUERY

app.get('/list/:addName/:population?', (req, res) => { 
    let names = req.params.addName
    let values = parseInt(req.params.population)

    if(values){
        list[names] = values
        let addToJsonFile = JSON.stringify(list)
        fs.writeFile('./myJsonObject/list.json', addToJsonFile);

        res.redirect('/');
    } else {
        res.send('kunde inte läggas till')
    }
})

//Funktion för att ta bort via URL-QUERY

app.get('/tabort/:name', (req, res) => { 
    let name = req.params.name;
    if(delete list[name])
    {
        try {
            fs.writeFileSync('./myJsonObject/list.json', JSON.stringify(list), "utf8");
        }
        catch(err) {
            console.log(err);
        }
    }
    res.redirect('/');
}) 

//Ändra via URL Query
app.get('/uppdatera/:changename/:newname/:newvalue' , (req, res) => {
    
    let names = req.params.changename
    let newname = req.params.newname
    let newvalues = parseInt(req.params.newvalue)

    if(names){
        list[newname] = list[names] 
        delete list[names]
        list[newname] = newvalues
      
        let addToJsonFile = JSON.stringify(list)
        fs.writeFileSync('./myJsonObject/list.json', addToJsonFile);

        res.redirect('/');
    } else {
        res.send('kunde inte läggas till')
    }
})



app.listen(3000, listening);
function listening(){
   console.log("listening . . .");
}


