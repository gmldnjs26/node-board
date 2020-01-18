var utils = require('../utils/utils');

var SchemaObj = {};

SchemaObj.createSchema = function (mongoose) {
    var PostSchema = mongoose.Schema({
        title: {
            type: String,
            trim: true, // trim 속성은 ? 앞뒤 제거인가?
            default: ''
        },
        contents: {
            type: String,
            trim: true,
            default: ''
        },
        writer: {
            type: mongoose.Schema.ObjectId, // users 컬렉션을 Reference하는거
            ref: 'users7' // 이렇게 join? 식으로 가져오는건가?
        },
        comments: [{
            contents: {
                type: String,
                trim: true,
                default: ''
            },
            writer: {
                type: mongoose.Schema.ObjectId,
                ref: 'users7'
            },
            created_at: {
                type: Date,
                default: Date.now
            }
        }],
        tages: {
            type: [],
            default: ''
        },
        created_at: {
            type: Date,
            index: {
                unique: false
            },
            default: Date.now
        },
        updated_at: {
            type: Date,
            index: {
                unique: false
            },
            default: Date.now
        },
        views: { // 조회수를 위해 만들어준 친구
            type: Number,
            default : 0
        }
    });
    PostSchema.path('title').required(true, '글 제목이 필요합니다.');
    PostSchema.path('contents').required(true, '글 내용이 필요합니다.');

        
    // 스키마에 인스턴스 메소드 추가.
    PostSchema.methods = {
        savePost: function (callback) {
            var self = this;

            this.validate(function (err) {
                if (err) return callback(err);
                self.save(callback);
            });
        },
        
        addComment: function(user, comment,callback){
            this.comment.push({
                contents: comment.contents,
                writer: user._id
            });
            this.save(callback);
        },
        removeComment: function(id,callback){
            var index = utils.indexOf(this.comments,{id:id});
            // 배열 안에 있으므로 해당 id의 index 값을 찾아내 반환하는 함수
            if(~index){
                this.comments.splice(index,1);
            }else{
                return callback('ID [' + id + ']를 가진 댓글이 업습니다.');
            }
            this.save(callback);
        }
    }
    PostSchema.statics = { 
        load: function(id,callback){
            this.findOne({_id: id})
                .populate('writer','name provider email')
                .populate('comments.writer')
                .exec(callback);
        },
        list: function(options,callback){
            var criteria = options.criteria || {};
            
            this.find(criteria)
                .populate('writer','name provider email')
                .sort({'created_at': -1})
                .limit(Number(options.perPage))
                .skip(options.perPage * options.page)
                .exec(callback);
        }
    }
    console.log('PostSchema 정의함');
    
    return PostSchema;
};

// module.exports에 PostSchema 객체 직접 전달.
module.exports = SchemaObj;
 
