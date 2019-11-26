const mongoose = require('mongoose');

const { Schema } = mongoose;

// 모델을 만드는 이유
// 몽고DB를 사용하지만 RDB처럼 데이터구조를 잡아놓고, 표현
// 직접 던져줘도 되지만, 일반적인 ORM인 방식으로 구현
// 모델 1. 데이터를 저장하는 그릇의 역할
// 모델 2. 데이터를 담아 옮겨다니는 역할
// 이 userSchema객체를 이용해 find, update, insert 등을 실행할 수 있다. 자바스크립트 프로그래밍적으로 유용

//사용자 콜렉션 구조 모델 구현
const userSchema = new Schema({
    userid:{
        type:String,
        required: true,
        unique: true,
    },
    username:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required: true,
    },
    phone:{
        type:String,
        required: true,
    },
    usestatecode:{
        type:Number,
        required: true,
    },
    entrydate:{
        type:Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('User', userSchema); //User객체이름으로  userSchema라는 모델구조를 매핑해줌.
//index.js에서 매핑했지만, 몽구스에서는 여기서 해줌