// 라우팅 모듈을 로딩하여 설정
// 라우팅 모듈 파일에 대한 정보는 connfig.js 의 route_info 배열에 등록함.

var route_loader = {};
var config = require('../config/config');

route_loader.init = function (app, router) {
    console.log('route_loader.init 호출됨.');
    return initRoutes(app, router);
};

function initRoutes(app, router) {
    var infoLen = config.route_info.length;
    console.log('설정에 정의된 라우팅 모듈의 수 : %d', infoLen);

    for (var i = 0; i < infoLen; i++) {
        var curItem = config.route_info[i];
        
        var curModule = require(curItem.file);
        // ./post fkaus post 모듈에서 정보를 읽어오는건데 속성으로 등록 안해둔 친구는 사용할 수 없다.
        console.log('%s 파일에서 모듈정보를 읽어옴.', curItem.file);
        
        // passport 하고 router의 route 등록은 틀리니깐 여기선 passport route 등록은 할수없다.
        if(curItem.type == 'get'){
            router.route(curItem.path).get(curModule[curItem.method]);
        } else if(curItem.type == 'post'){
            router.route(curItem.path).post(curModule[curItem.method]);
        } else{
            console.log('알수없는 요청방식 입니다.');
        }
        console.log('라우팅 모듈 [%s]이(가) 설정됨.',curItem.method);
    }
    app.use('/',router);
}

module.exports = route_loader;
