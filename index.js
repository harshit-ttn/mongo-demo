const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected to MongoDB...'))
    .catch((err) => console.error('Could not connect to MongoDB...',err));


const courseSchema = new mongoose.Schema({
    name:{type:String, 
        required:true,
        minlength:5,
        maxlength:255,
        // match: /pattern/
    },
    category:{
        type: String,
        required: true,
        enum:['web','mobile','network']
    },

    author:String,
    tags: {
        type: Array,
        validate: {
            isAsync: true,
            validator: function(v, callback){
                setTimeout(()=>{
                    // Do some async work
                    const result = v && v.length > 0;
                    callback(result);
                },4000);
            },
            message: 'A course should have at least one tag'
        }
    },
    date: {type:Date, default:Date.now},
    isPublished: Boolean,
    price: {
        type: Number,
        required: function(){return this.isPublished;},
        min: 10,
        max: 200
    }

});

// Course is a Class (Model)
const Course = mongoose.model('Course',courseSchema);

async function createCourse(){
    // course is a object (document) of Course Class
    const course = new Course ({
        name:'Angular Course',
        category:'mobile',
        author:'Jack',
        tags:null,
        isPublished:true,
        price: 20
    });

    try {
        const result = await course.save();
        console.log(result);
    } 
    catch (error) {
        console.log(error.message);
    }
    
}


async function getCourses(){
    const pageNumber = 2;
    const pageSize = 10;
    

    const courses = await Course
    .find({author:'Mosh',isPublished:true})
    .skip((pageNumber - 1)* pageSize)
    .limit(pageSize)
    .sort({name:1})
    .select({name:1,tags:1})
    .count()
    console.log(courses);
}


async function updateCourse(id){
    // Approcah : Update first

    const course = await Course.findByIdAndUpdate({_id:id},{
        $set: {
            author: 'Harshit',
            isPublished: false
        }
    },{new: true});

    console.log(course);
}

async function removeCourse(id){
    // const result = await Course.deleteOne({ _id: id });
    // console.log(result);
    const course = await Course.findByIdAndRemove(id);
    console.log(course);
}

createCourse();
