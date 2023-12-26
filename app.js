
var bodyParser = require('body-parser');
var mysql      = require('mysql');
var express = require('express');

var app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: false }))

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'todo'
});
  
connection.connect();

var id=0;


// admin login
app.get('/',function(req,res){
    res.render("admin_login");
})

app.post('/',function(req,res){

    var email = req.body.email;
    var password = req.body.password;

        var login_query = "select * from admin_login where email='"+email+"' AND password='"+password+"'";

        connection.query(login_query,function(error,result,fields){
            if(error) throw error;
            if(result.length==1)
            {
                id=result[0].id;
                res.redirect('/admin_dashboard');
            }
            else{
                res.send('Incorrect Email or Password');
            }
        });
})

app.get('/admin_dashboard',function(req,res){
  
         res.render("admin_dashboard")
   
  })


//   user registration

// app.get('/user_register',function(req,res){
  
//     res.render("user_register")

// })

app.get('/user_register',function(req,res){
    var insert = "select * from user_register";

    connection.query(insert,function(error,result,fields){
        if(error) throw error;
        res.render("user_register",{result});
    })
})

app.post('/user_register',function(req,res){

    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var contact_no = req.body.contact_no;
    var city = req.body.city;
   

    var insert = "insert into user_register(name,email,password,contact_no,city)values('"+name+"','"+email+"','"+password+"','"+contact_no+"','"+city+"')"

    connection.query(insert,function(error,result,fields){
        if(error) throw error;

        res.redirect('/user_register');
    })
})

// user login

//  login
app.get('/user_login',function(req,res){
    res.render("user_login");
})

app.post('/user_login',function(req,res){

    var email = req.body.email;
    var password = req.body.password;

        var login_query = "select * from user_register where email='"+email+"' AND password='"+password+"'";

        connection.query(login_query,function(error,result,fields){
            if(error) throw error;
            if(result.length==1)
            {
                id=result[0].id;
                res.redirect('/user_dashboard');
            }
            else{
                res.send('Incorrect Email or Password');
            }
        });
})

app.get('/user_dashboard',function(req,res){
  
    var select = "select * from user_register where id='"+id+"'";
  
    connection.query(select, function (error, result, fields) {
        if (error) throw error;
  
         res.render("user_dashboard",{result})
      });
  })
  


//   Add task
  
// app.get('/task',function(req,res){

//     res.render("task")

// })

app.get('/task',function(req,res){
    var insert = "select * from user_register";
    connection.query(insert, function(error,result,fields){
        if(error) throw error;

        res.render("task",{result})
    })

})

app.post('/task',function(req,res){
    var userid = req.body.userid;
    var task = req.body.task;

    var insert = "insert into task(id,task) values('"+userid+"','"+task+"')"
    connection.query(insert, function(error,result,fields){
        if(error) throw error;
        res.redirect("/task");
        console.log("task inserted successfully");
    });
})
 

// view task
app.get('/view_task', function(req,res){
    var select_task = "SELECT task.task , user_register.name FROM task JOIN user_register ON task.id = user_register.id";
    connection.query(select_task,function(error,result,fields){
        if(error) throw error;
        res.render("view_task",{result})
    });
})

app.get('/user_dashboard',function(req,res){
  
    var select = "select * from task where id='"+id+"'";
  
    connection.query(select, function (error, result, fields) {
        if (error) throw error;
  
         res.redirect("user_dashboard",{result})
      });
  })



app.listen(3002);


