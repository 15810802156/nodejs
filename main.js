var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var multer  = require('multer');
var util = require('util')
 
// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.all("*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");          //允许所有跨域请求
  // res.header("Access-control-Allow-Headers", "xCors");    //允许请求头中携带 xCors
  // res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT,OPTIONS,HEAD,FETCH");
  next();
})

app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: '/tmp/'}).array('image'));
app.use(cookieParser())


// app.get('/index.html', function (req, res) {
//    res.sendFile( __dirname + "/" + "index.html" );
// })
// app.get('/', function(req, res) {
//   console.log("Cookies: " + util.inspect(req.cookies));
// })

app.get('/process_get', function (req, res) {
  res.writeHeader(200,{   'Content-Type' : 'text/plain;charset=utf-8'});
  var response = {
    success:true,
    statusCode:0,
    errorMessage:'',
    data:{}
   
  };
  if(!req.query.first_name||!req.query.last_name){
    response.errorMessage='参数不全或未传值',
    response.statusCode = 1;
  }else{
    response.data={
      "first_name":req.query.first_name,
      "last_name":req.query.last_name
    }
  }
   res.end(JSON.stringify(response));
})

app.post('/process_post', urlencodedParser, function (req, res) {
  var response = {
    success:true,
    statusCode:0,
    errorMessage:'',
    data:{}
   
  };
  if(!req.body.name||!req.body.type){
    response.errorMessage='参数不全或未传值',
    response.statusCode = 1;
  }else{
    response.data={
      "name":req.body.name,
      "type":req.body.type
    }
  }
   res.end(JSON.stringify(response));

})
 
app.post('/file_upload', function (req, res) {
 
  console.log(req.files[0]);  // 上传的文件信息

  var des_file = __dirname + "/" + req.files[0].originalname;
  fs.readFile( req.files[0].path, function (err, data) {
       fs.writeFile(des_file, data, function (err) {
        if( err ){
             console.log( err );
        }else{
              response = {
                  message:'File uploaded successfully', 
                  filename:req.files[0].originalname
             };
         }
         console.log( response );
         res.end( JSON.stringify( response ) );
      });
  });
})

var server = app.listen(8081, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})