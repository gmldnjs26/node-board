var express = require('express'); 
var http = require('http');
var path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var static = require('serve-static');

var expressErrorHandler = require('express-error-handler');
var errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});
var expressSession = require('express-session');

// passport 사용
var passport = require('passport');
var flash = require('connect-flash');

var config = require('./config/config');

var database = require('./database/database');

var route_loader = require('./routes/route_loader');


var app = express();// express 객체 얻기

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
console.log('뷰 엔진이 ejs로 설정되었습니다.');

app.set('port', config.server_port);
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use('/public', static(path.join(__dirname, 'public')));

//쿠키 설정
app.use(cookieParser());

//세션 설정
app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUnitialized: true
}));

// Passport 사용설정
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//라우팅 정보를 읽어들여 라우팅 설정
var router = express.Router();
route_loader.init(app, router);

// 패스포트 설정
var configPassport = require('./config/passport');
configPassport(app, passport);

// 패스포트 라우팅 설정
var userPassport = require('./routes/user_passport');
userPassport(router, passport);

// 확인되지 않은 예외 처리 서버 프로세스 종료하지 않고 유지함.

// console창에서 예외 확인이 안되서 주석처리 해놓은거
//process.on('uncaughtException', function (err) {
//    console.log('uncaughtException 발생함 : ' + err);
//    console.log('서버 프로세스 종료하지 않고 유지');
//
//    console.log(err.stacl);
//});
// 프로세스 종료 시에 데이터베이스 연결 해제
process.on('SIGTERM', function () {
    console.log('프로세스가 종료됩니다.');
    app.close();
});  

app.on('close', ()=>{
    console.log('Express 서버 객체가 종료됩니다.');
    if (database.db) {
        database.db.close();
    }
});

var server = http.createServer(app).listen(app.get('port'), () => {
    console.log('서버가 시작됭 포트 : ' + app.get('port'));
    database.init(app, config); // 데이터베이스 로딩 시켜주기
});
