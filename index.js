const express = require('express');
const bodyParser = require('body-parser')
const Datastore = require('nedb');

const app = express();
const users_database = new Datastore('users_database.db');
users_database.loadDatabase();
// db = {};
// db.users = new Datastore('users_database.db');
// db.forms = new Datastore('forms_database.db');
// db.users.loadDatabase();
// db.forms.loadDatabase();

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use(express.static('public'));
app.use(express.json())


app.post('/selectedEmployee', (request, response)=> {
  console.log('I got a request (selectedEmployee)');
  // console.log('this is the request', request);
  let dataBody = request.body;
  // console.log(dataBody);
  const employeeName = dataBody.name;
// let employeeName = 'Christos Koumpotis'
  // console.log(employeeName, 'employeeName')

  users_database.find({ "name" : employeeName}, (err, data)=> {
    if (err) {
      response.end();
      return;
    }
    // for (item of data){
    //   const root = document.createElement('div');
    //   const username = document.createElement('div');
    //   username.textContent = item // item.user1.answers.q1
    //   root.append(username);
    //   document.body.append(root)
    // }
    // response.json(data);
    let answers = { currentRequest: 'currentRequest' , q1 : data[0].q1 , q2: data[0].q2 , q3: data[0].q3, satisfaction: data[0].satisfaction}
    // console.log('this is data', data)
    // console.log('this is question 1:', data[0].q1)

    users_database.insert(answers);

  })
  response.redirect('answers.html');

});

app.post('/formSubmission', (request, response) => {
  console.log('I got a request formSubmission');

  let dataBody = request.body
  console.log(dataBody)
  // let user = 'dkoumpotis'
  let timestamp = Date.now();
  dataBody.timestamp = timestamp;

    // databody before this step is something like: "answer":"cool 555", "_id":"Qm5P6F2gJlc3PCEc"
  // dataBody.user = user
console.log('databody 2nd:', dataBody);

  users_database.insert(dataBody);
  // throw('Thank you for completing the form. ');
  response.redirect('thankYou.html');
});

// find and return the answers
// app.get('/', (request, response)=> {
//   users_database.find({name: `${employeeName}`}, (err, data) =>{
// if (err) {
//   response.end();
//   return;
// }
// console.log(response);
// response.json(data);
//   })
// });

app.get('/answers', (request, response)=> {
  console.log('I got a request (/answers');
  users_database.find({currentRequest:'currentRequest'}, (err, data)=> {
    if (err) {
      response.end();
      return;
    }
    console.log('this is data in /answers:' , data[0])
    response.json(data[0]);
  })
});
app.get('redirectToManagers', (request, response) => {
  response.redirect('managers.html')
});

app.get('redirectToForm', (request, response) => {
  response.redirect('form.html')
});
app.get('redirectToMain', (request, response) => {
  response.redirect('index.html')
});



app.listen(process.env.PORT || 3000, () => console.log('listening at 3000'));


// async function getAnswers(employeeName){
//   const response = await fetch('/answers');
//   const data = await response.json();

//   for (item of data) {
//     const root = document.createElement('div');
//     const username = document.createElement('div');
//     username.textContent = data // item.user1.answers.q1
//     root.append(username);
//     document.body.append(root);
// }
// };

