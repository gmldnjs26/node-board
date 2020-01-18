var SchemaObj = {};

SchemaObj.createSchema = function (mongoose) {
    var RankSchema = mongoose.Schema({
        name: {
            type: String,
            default: ''
        },
        score: {
            type: Number,
            default: 0
        },
        created_at: {
            type: Date,
            default: Date.now
        }
    });
    // statics 와 거의 사용법이 동일하다고 보면 되는데
    // java 의 일반 method와 static method 의 차이라고 보면 된다.
    RankSchema.methods = {
        addRank: function (callback) {
            var self = this;
            this.validate(function (err) {
                if (err)
                    return callback(err);
                self.save(callback);
            });
        }
    }

    RankSchema.statics = {
        listrank: function (callback) {
            this.find()
                .sort({ 'score': -1 })
                .exec(callback);
        }
    }
    console.log('RankSchema 정의함.');

    return RankSchema;
};

module.exports = SchemaObj;