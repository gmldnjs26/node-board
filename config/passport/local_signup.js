var LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // 첫번째 파라미터로 req 전달 가능
}, function (req, email, password, done) {
    var paramName = req.body.name || req.query.name;
    console.log('passport의 local-signup 호출됨: ' + email + ' , ' + password + ' , ' +
        paramName);
    // findOne 메소드가 blocking 되지 않도록 하고 싶은 경우 async 방식으로 변경
    process.nextTick(function () {
        var database = req.app.get('database');
        database.UserModel.findOne({
            'email': email
        }, function (err, user) {
            // 에러 발생시
            if (err) {
                return done(err);
            }
            // 기존에 사용자 정보가 있는 경우
            if (user) {
                console.log('기존에 계정이 있음.');
                return done(null, false, req.flash('signupMessage', '계정이 이미 있습니다.')); // 검증 콜백에서 두 번째 파라미터의 값을 false로 하여 인증 실패한 것으로 처리
            } else {
                // 모델 인스턴스 객체 만들어 저장
                var user = new database.UserModel({
                    'email': email,
                    'password': password,
                    'name': paramName
                });
                user.save(function (err) {
                    if (err) {
                        throw err;
                    }
                    console.log("사용자 데이터 추가함.");
                    return done(null, user); // 검증 콜백에서 두 번째 파라미터의 값을 user 객체로 넣어 인증 성공한 것으로 처리
                });
            }
        })
    });

})
