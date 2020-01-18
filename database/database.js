var mongoose = require('mongoose');

var database = {};

database.init = function (app, config) {
    console.log('init() 호출됨.');
    connect(app, config);
}

function connect(app, config) {
    console.log('connect() 호출됨,');
    mongoose.Promise = global.Promise;
    mongoose.connect(config.db_url);

    database.db = mongoose.connection; // 몽구스 커넥션으로 db연결 얻어오기

    // 에러 이벤트 등록
    database.db.on('error', console.error.bind(console, 'mongoose connection error'));

    // 데이터 베이스 연결 
    database.db.on('open', function () {
        console.log('데이터베이스에 연결되었습니다. : ' + config.db_url);

        createSchema(app, config);
    });
    database.db.on('disconnected', connect);
}

function createSchema(app, config) {
    var schemaLen = config.db_schemas.length;
    console.log('설정에 정의된 스키마의 수: %d', schemaLen);

    for (var i = 0; i < schemaLen; i++) {
        var curItem = config.db_schemas[i];
        var curSchema = require(curItem.file).createSchema(mongoose);
        console.log('%s 모듈을 불러들인 후 스키마 정의함.', curItem.file);

        var curModel = mongoose.model(curItem.collection, curSchema);
        console.log('%s 컬렉션을 위해 모델 정의함.', curItem.collection);

        // 데이터베이스 갹체에 스키마 모델 config 가 정의한 이름으로 넣어주기
        database[curItem.schemaName] = curSchema;
        database[curItem.modelName] = curModel;
        console.log('스키마 이름[%s] , 모델 이름 [%s] 이 database 객체의 속성으로 추가',
            curItem.schemaName, curItem.modelName);
    }
    app.set('database', database);
    console.log('database 객체가 app 객체의 속성으로 추가됨,');
}

module.exports = database;
