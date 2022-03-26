const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected to MongoDB...'))
    .catch((err) => console.error('Could not connect to MongoDB...',err));


const courseSchema = new mongoose.Schema({
    name:String,
    author:String,
    tags: [String],
    date: {type:Date, default:Date.now},
    isPublished: Boolean
});

// Course is a Class (Model)
const Course = mongoose.model('Course',courseSchema);

async function createCourse(){
    // course is a object (document) of Course Class
    const course = new Course ({
        name:'Angular Course',
        author:'Mosh',
        tags:['angular','frontend'],
        isPublished:true
    });

    const result = await course.save();
    console.log(result);
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

    // update(filter,updateOperators)
    const result = await Course.update({_id:id},{
        $set: {
            author: 'Mosh',
            isPublished: true
        }
    });

    console.log(result);
}

// createCourse();
// getCourses();

updateCourse('623eebcb8777de9b3371b4a8');

