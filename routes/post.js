// 게시판을 위한 라우팅 함수 정의

var Entities = require('html-entities').AllHtmlEntities;

var addpost = function (req, res) {
    console.log('post 모듈 안에 있는 addpost 호출됨.');

    var paramTitle = req.body.title || req.query.title;
    var paramContents = req.body.contents || req.query.contents;
    var paramWriter = req.body.writer || req.query.writer;

    console.log('요청 파라미터 : ' + paramTitle + ' , ' + paramContents + ' , ' + paramWriter);

    var database = req.app.get('database');

    if (database.db) {
        // 유저 모델로 해서 아이디가 있는지 Check 하기 위해
        database.UserModel.findByEmail(paramWriter, function (err, results) {
            if (err) {
                console.error('게시판 글 추가 중 에러 발생: ' + err.stack);
                res.writeHead(200, {
                    'Content-Type': 'text/html;charset=utf8'
                });
                res.write('<p>' + err.stack + '</p>');
                res.end();

                return;
            }
            if (results == undefined || results.length < 1) {
                res.writeHead(200, {
                    'Content-Type': 'text/html;charset=utf8'
                });
                res.write('<h2>사용자 [' + paramWriter + ']를 찾을 수 없습니다.');
                res.end();
                return;
            }
            var userObjectId = results[0]._doc._id;
            console.log('사용자 ObjectId : ' + paramWriter + ' -> ' + userObjectId);

            // save()로 저장
            // postModel 인스턴스 생성
            var post = new database.PostModel({
                title: paramTitle,
                contents: paramContents,
                writer: userObjectId
            });
            post.savePost(function (err, result) {
                if (err) {
                    if (err) {
                        console.error('응답 웹문서 생성 중 에러 발생 : ' + err.stack);

                        res.writeHead('200', {
                            'Content-Type': 'text/html;charset=utf8'
                        });
                        res.write('<h2>응답 웹문서 생성 중 에러 발생</h2>');
                        res.write('<p>' + err.stack + '</p>');
                        res.end();

                        return;
                    }
                }

                console.log("글 데이터 추가함.");
                console.log('글 작성', '포스팅 글을 생성했습니다. : ' + post._id);

                return res.redirect('/process/showpost/' + post._id);
            });
        })

    } else {
        res.writeHead('200', {
            'Content-Type': 'text/html;charset=utf8'
        });
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
    }
}

var listpost = function (req, res) {
    console.log('post 모듈 안에 있는 listpost 호출됨.');

    var paramPage = req.body.page || req.query.page;
    var paramPerPage = req.body.perPage || req.query.perPage;

    console.log('요청 파라미터 : ' + paramPage + ' , ' + paramPerPage);

    var database = req.app.get('database');

    // 데이터베이스 객체가 초기화 된 경우
    if (database.db) {
        // 1. 글 리스트
        var options = {
            page: paramPage,
            perPage: paramPerPage
        }
        database.PostModel.list(options, function (err, results) {
            if (err) {
                console.error('게시판 글 목록 조회 중 에러 발생: ' + err.stack);
                res.writeHead('200', {
                    'Content-Type': 'text/html;charset=utf8'
                });
                res.write('<h2>게시판 글 목록 조회 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();

                return;
            }
            if (results) {
                // 전체 문서 객체 수 확인
                database.PostModel.count().exec((err, count) => { // Arrow Fucntion 
                    res.writeHead('200', {
                        'Content-Type': 'text/html;charset=utf8'
                    });

                    // 뷰 템플레이트를 이용하여 렌더링한 후 전송
                    var context = {
                        title: '글 목록',
                        posts: results,
                        page: parseInt(paramPage),
                        pageCount: Math.ceil(count / paramPerPage),
                        perPage: paramPerPage,
                        totalRecords: count,
                        size: paramPerPage
                    }

                    req.app.render('listpost', context, function (err, html) {
                        if (err) {
                            console.error('응답 웹문서 생성 중 에러 발생: ' + err.stack);
                            res.writeHead(200, {
                                'Content-Type': 'text/html;charset=utf8'
                            });
                            res.write('<h2>응답 웹문서 생성 중 에러 발생</h2>');
                            res.write('<p> ' + err.stack + '</p>');
                            res.end();

                            return;
                        }
                        res.end(html);
                    });
                });
            } else {
                res.writeHead('200', {
                    'Content-Type': 'text/html;charset=utf8'
                });
                res.write('<h2>글 목록 조회  실패</h2>');
                res.end();
            }
        });
    } else {
        res.writeHead('200', {
            'Content-Type': 'text/html;charset=utf8'
        });
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
    }
}

var showpost = function (req, res) { // showpost 요청 없어짐
    console.log('post 모듈 안에 있는 showpost 호출됨.');

    //URL 파라미터로 전달됨.
    var paramId = req.body.id || req.query.id || req.params.id;
    console.log('요청 파라미터 : ' + paramId);

    var database = req.app.get('database');
    if (database.db) {
        database.PostModel.load(paramId, function (err, results) {
            if (err) {
                console.error('게시판 글 조회 중 에러 발생 : ' + err.stack);
                res.writeHead('200', {
                    'Content-Type': 'text/html;charset=utf8'
                });
                res.write('<h2>게시판 글 조회 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
                return;
            }
            if (results) {
                console.dir(results); // dir 하면 model {} 으로 나오는데 그게 그건가보다.
                results.views++; // 조회수 증가 시켜줌
                results.save(); // 그리고 저장
                res.writeHead(200, {
                    'Content-Type': 'text/html;charset=utf8'
                });
                // 뷰 템플레이트를 이용하여 렌더링 한 후 전송 
                var context = {
                    title: '글 조회',
                    posts: results,
                    Entities: Entities
                };

                req.app.render('showpost', context, function (err, html) {
                    if (err) {
                        console.error('응답 웹문서 생성 중 에러 발생 : ' + err.stack);

                        res.writeHead('200', {
                            'Content-Type': 'text/html;charset=utf8'
                        });
                        res.write('<h2>응답 웹문서 생성 중 에러 발생</h2>');
                        res.write('<p>' + err.stack + '</p>');
                        res.end();

                        return;
                    }
                    res.end(html);
                });
            } else {
                res.writeHead('200', {
                    'Content-Type': 'text/html;charset=utf8'
                });
                res.write('<h2>글 조회  실패</h2>');
                res.end();
            }
        });
    } else {
        res.writeHead('200', {
            'Content-Type': 'text/html;charset=utf8'
        });
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
    }
}

var addcomments = function (req, res) {
    console.log('addcomments 메소드 호출됨.'); // 여기까지 나와야됨

    var paramComments = req.body.comments || req.query.comments; // 코멘트 내용 받기
    var paramId = req.body.postId || req.query.postId;

    console.log('요청 파라미터 : ' + paramComments + ' , ' + paramId);

    var database = req.app.get('database');

    if (database.db) {
        database.PostModel.load(paramId, function (err, result) {
            if (err) {
                console.log('해당 글 가져오는 도중 에러')
            } else if (result) {
                var comments = {
                    contents: paramComments,
                    writer: req.user, // 로그인이 되어 있다면, req 안에 들어있다.
                    // '/' 요청이 들어올때마다 deserializeUser가 실행
                };
                result.comments.push(comments); // 해당 코멘트 넣고
                result.save(); // 그리고 저장
                console.log('댓글저장완료');
                return res.redirect('/process/showpost/' + paramId);
            } else {
                console.log('존재하지 않는 글입니다.');
            }
        });
        // 그리고 댓글 달아주기인데...
    } else {
        res.writeHead('200', {
            'Content-Type': 'text/html;charset=utf8'
        });
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
    }
}

var addcomment = function (req, res) {
    console.log('post 모듈 안에 있는 addcomment 호출됨,');

    var paramId = req.body.id || req.query.id;
    var paramContents = req.body.contents || req.query.conents;
    var paramWriter = req.query.writer || req.body.writer;

    console.log('요청 파라미터: ' + paramContents + ' , ' + paramWrtier);

    var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우
    if (database.db) {
        //findOneAndUpdate(query,update,options,callback) 슨으로 파라미터가 들어갑니다.
        database.PoastModel.findByIdAndUpdate(paramId, {
            '$push': { // comments 배열안에 push해라 안에{객체내용}으로
                'comments': {
                    'contents': paramContents,
                    'writer': paramWriter
                }
            }
        }, {
            'new': true,
            'upsert': true
        }, function (err, result) {
            if (err) {
                console.log('게시판 댓글 추가 중 에러 발생: ' + err.stack);
                res.writeHead('200', {
                    'Content-Type': 'text/html;charset=utf8'
                });
                res.write('<h2>게시판 댓글 추가 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();

                return;
            }
            console.log('글 데이터 추가함.');
            console.log('글 작성', '포스팅 글을 생성하였습니다 : ' + paramId);

            return res.redirect('/process/showpost/' + paramId);
        });
    } else {
        res.writeHead(200, { 'Content-Type': 'text/html;charset=utf8' });
        res.write('<h2>데이터베이스 연결실패</h2>');
        res.end();
    }
};

module.exports.addpost = addpost;
module.exports.listpost = listpost;
module.exports.showpost = showpost;
module.exports.addcomments = addcomments;
