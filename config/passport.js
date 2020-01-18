var local_login = require('./passport/local_login');
var local_signup = require('./passport/local_signup');
var facebook = require('./passport/facebook');
var twitter = require('./passport/twitter');
var google = require('./passport/google');

module.exports = function (app, passport) {
    console.log('config/passport 호출됨.');
    
    // 사용자 인증 성공시 호출, 사용자 정보를 이용해 세션만듬,
    // 로그인 이후에 들어오는 요청은 deserializeUser 메소드 안에서 이세션을 확인가능
    passport.serializeUser(function(user,done){
        console.log('serializeUser() 호출됨.');
        console.dir(user);
        
        done(null,user); // 이 인증 콜백에서 념겨주는 user 객체의 정보를 이용해 세션 생성
    });
    
    passport.deserializeUser(function(user,done){
        console.log('deserializeUser() 호출됨.');
        console.dir(user);

        // 사용자 정보 중 id나 email만 있는 경우 사용자 정보 조회 필요 - 여기에서는 user 객체 전체를 패스포트에서 관리
        // 두 번째 파라미터로 지정한 사용자 정보는 req.user 객체로 복원됨
        // 여기에서는 파라미터로 받은 user를 별도로 처리하지 않고 그대로 넘겨줌
        done(null,user);
    });
    passport.use('local-login', local_login); // local passport Authenticate 사용한다는 말이다. 인증은 모듈에서 알아서 처리해줌.
	passport.use('local-signup', local_signup); // 역시 local passport 회원가입 사용 
	passport.use('facebook', facebook(app, passport));
	passport.use('twitter', twitter(app, passport));
	passport.use('google', google(app, passport));
	console.log('5가지 passport 인증방식 설정됨.');
};
