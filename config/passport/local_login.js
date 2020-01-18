// 패스포트 설정 파일

var LocalStrategy = require('passport-local').Strategy;


// LocalStrategy 를 사용해 인증을 하겠다는것

module.exports = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // 이 옵션을 설정하면 아래 콜백 함수의 첫번째로 req 전달
}, function (req, email, password, done) {
    console.log('passport의 local-login 호출됨 : ' + email + ', ' + password);

    var database = req.app.get('database');
    database.UserModel.findOne({
        'email': email
    }, function (err, user) {
        console.log('-----------------로그인----------------- ');
        console.dir(user);// user 역시 model이구나 아 당연하네 UserModel.findOne이니깐
        if (err) {
            return done(err);
        }

        // 등록된 사용자가 없는경우
        if (!user) {
            console.log('계정이 일치하지 않음.');
            return done(null, false, req.flash('loginMessage', '등록된 계정이 없습니다.'));
            // 인증 실패 처리
        }
        // 비밀번호 비교하여 맞지 않는 경우
        var authenticated =
            user.authenticate(password, user._doc.salt, user._doc.hashed_password);
        if (!authenticated) {
            console.log('비밀번호 일치하지 않음');
            return done(null, false, req.flash('loginMessage', '비밀번호가 일치하지 않음'));
        }
        console.log('계정과 비밀번호가 일치함.');
        return done(null, user);
        // 인증 성공 처리 serializeUser에 user 정보 전달
    })
});
