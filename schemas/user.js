const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema;

// 모델을 만드는 이유
// 몽고DB를 사용하지만 RDB처럼 데이터구조를 잡아놓고, 표현
// 직접 던져줘도 되지만, 일반적인 ORM인 방식으로 구현
// 모델 1. 데이터를 저장하는 그릇의 역할
// 모델 2. 데이터를 담아 옮겨다니는 역할
// 이 userSchema객체를 이용해 find, update, insert 등을 실행할 수 있다. 자바스크립트 프로그래밍적으로 유용

//사용자 콜렉션 구조 모델 구현
const userSchema = new Schema({
    userId:{
        type:String,
        required: true,
        unique: true,
    },
    userName:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required: true,
        // unique: true, //테스트를 위해 잠시 주석처리. 꼭해제할것
    },
    password:{
        type:String,
        required: true,
    },
    phone:{
        type:String,
        required: true,
        // unique: true, //테스트를 위해 잠시 주석처리. 꼭 해제할것
    },
    nickName:{
        type:String,
        required: true,
    },
    birth:{
        type:Date,
        required: true,
    },
    profileImgPath:{
        type:String,
        required: true,
        unique: false,
        default:'기본값'
    },
    profileImgName:{
        type:String,
        required: true,
        default:'기본값'
    },
    profileMsg:{
        type:String,
        required: false,
    },
    followingId:[{
        type: ObjectId,
        ref: 'User',
        unique: true
    }],
    followerId:[{
        type: ObjectId,
        ref: 'User',
        unique: true,
    }],
    entryType:{
        type:String,
        required: true,
    },
    userState:{
        type:Boolean,
        required: true,
        default: true
    },
    createdAt:{
        type:Date,
        required: false,
        default: Date.now,
    },
    deleteAt:{
        type:Date,
        required: false,
    }
});

module.exports = mongoose.model('User', userSchema); //User객체이름으로  userSchema라는 모델구조를 매핑해줌.
//index.js에서 매핑했지만, 몽구스에서는 여기서 해줌