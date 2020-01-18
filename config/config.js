module.exports = {
    server_port: 3000,
    db_url: 'mongodb://test01:test01@ds141168.mlab.com:41168/heroku_lq8rmb0m',
    db_schemas: [
        {
            file: './user_schema', // database에서 쓸꺼니깐 파일경로가 이렇게 되지.
            collection: 'users7',
            schemaName: 'UserSchema',
            modelName: 'UserModel'
        },
        {
            file: './post_schema',
            collection: 'post',
            schemaName: 'PostSchema',
            modelName: 'PostModel'
        },
        {
            file:'./rank_schema',
            collection: 'ranks',
            schemaName:'RankSchema',
            modelName:'RankModel'
        }
    ],
    route_info: [
        {
            file: './post',
            path: '/process/addpost',
            method: 'addpost',
            type: 'post'
        },
        {
            file: './post',
            path: '/process/showpost/:id',
            method: 'showpost',
            type: 'get'
        },
        {
            file: './post',
            path: '/process/listpost',
            method: 'listpost',
            type: 'get'
        },
        {
            file: './post',
            path: '/process/listpost',
            method: 'listpost',
            type: 'post'
        },
        {
            file: './post',
            path: '/process/addcomments',
            method: 'addcomments',
            type: 'post'
        },
        {  // 랭크 추가
            file:'./rank',
            path:'/process/addrank',
            method:'addrank',
            type:'post'
        },
        
        {
            file:'./rank',
            path:'/process/listrank',
            method:'listrank',
            type:'post'
        }

    ],
    facebook: { // passport facebook
        clientID: '1442860336022433',
        clientSecret: '13a40d84eb35f9f071b8f09de10ee734',
        callbackURL: 'http://localhost:3000/auth/facebook/callback'
    },
    twitter: { // passport twitter
        clientID: 'id',
        clientSecret: 'secret',
        callbackURL: '/auth/twitter/callback'
    },
    google: { // passport google
        clientID: 'id',
        clientSecret: 'secret',
        callbackURL: '/auth/google/callback'
    }

}
