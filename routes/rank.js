// listrank addrank 추가하기

var Entities = require('html-entities').AllHtmlEntities;

var addrank = function(req, res){
    console.log('rank 모듈 안에 있는 addrank 호출됨');
    console.dir(req);
    var paramName = req.body.name || req.query.name;
    var paramScore = req.body.score || req.query.score;

    console.log('요청 파라미터 -> ' + paramName + '의 점수: ' + paramScore + '점 이다');

    var database = req.app.get('database');
    // 서버 작동 시킬때 셋팅시킨 데이터베이스의 연결을 가져온다.

    if(database.db){
        var rank = new database.RankModel({
            name:paramName,
            score:paramScore
        });
        rank.addRank(function(err,result){
            if(err){
                console.log('랭크 추가 실패');
                return;
            }
            console.log('랭크 데이터 추가함');
            console.log('랭크 작성');

            return ; // 사용자에게 보내줄 값? 넣으면 될꺼같다 req에서 찾아서
        });
    }else{
        console.log('데이터베이스 연결 실패');
    }
}
var listrank = function(req,res){
    console.log('rank 모듈 안에있는 listrank 호출됨.');

    var database = req.app.get('database');

    if(database.db){
        database.RankModel.listrank(function(err,results){
            if(err){
                console.log('랭크리스트 불러오기 실패');
                return;
            }
            else{
                var rlist = results;
                res.json(rlist);
                console.dir('랭크리스트 : ' + results);
                console.dir('사용자 요청 정보 : ' + req);
                return;
            }
        });
    }else{
        console.log('데이터베이스 연결 실패');
    }
    
}

module.exports.addrank = addrank;
module.exports.listrank = listrank;
