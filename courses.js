const mongoCollections = require("./collections");
const courses = mongoCollections.courses;
const uuid = require("node-uuid");

module.exports = {

  async create(name, code, professors, rating, description, credits, level, web){
    if(typeof(name) !== "string" || !(name)){
      throw "Error: Must provide a name of type string";
    }
    if(typeof(code) !== "string" || !(code)){
      throw "Error: Must provide a code of type string";
    }
    if(!Array.isArray(professors) || !(professors)){
      throw "Error: Must provide an array of professors";
    }
    if(typeof(rating) !== "number" || rating > 5.0 || rating < 0.0 || !(rating)){
      throw "Error: Must provide a rating of type number between 1 and 5"
    }
    if(typeof(description) !== "string" || !(description)){
      throw "Error: Must provide a description of type string";
    }
    if(typeof(credits) !== "number"){
      throw "Error: Must provide credits of type number";
    }
    if(typeof(level) !== "string" || !(level)){
      throw "Error: Must provide a level of type string";
    }
    if(typeof(web) !== "boolean" || !(web)){
      throw "Error: Must provide a web section boolean";
    }

    const courseCollection = await courses();

    let newCourse = {
      _id: uuid.v4(),
      courseName: name,
      courseCode: code,
      professors: professors,
      avgRating: rating,
      description: description,
      credits: credits,
      classLevel: level,
      webSection: web
    };

    const insertInfo = await courseCollection.insertOne(newCourse);
    if (insertInfo.insertedCount === 0){
      throw "Could not add course";
    }

  },

  async getAllCourses(){
    const courseCollection = await courses();
    const coursesArray = await courseCollection.find().toArray();
    return coursesArray;
  },

  async getCourseById(id){
    if(!id || typeof(id) !== "string"){
      throw "Error: You must provide an input id of type 'string'";
    }
    const courseCollection = await courses();
    const course = await courseCollection.findOne({ _id: id });

    if (!course){
      throw "Course not found";
    }

    return course;
  },

  async getCourseByName(name){
    if(typeof(name) !== "string"){
      throw "Error: Name must be a string";
    }

    const courseCollection = await courses();
    const course = await courseCollection.findOne({ courseName: name });

    if(!course){
      throw "Course not found";
    }

    return course;
  },

  async getCourseByCode(code){
    if(typeof(code) !== "string"){
      throw "Error: Code must be a string";
    }

    const courseCollection = await courses();
    const course = await courseCollection.findOne({ courseCode: code });

    if(!course){
      throw "Course not found";
    }

    return course;
  },

  async getCourseByProfessor(professors){
    if(!Array.isArray(professors)){
      throw "Error: Professors must be an array";
    }

    const courseCollection = await courses();
    const course = await courseCollection.findOne({ professors: professors });

    if(!course){
      throw "Course not found";
    }

    return course;
  },

  async updateRating(id, rating){
    if(typeof(id) !== "string"){
      throw "Error: Id must be a string";
    }
    if(typeof(rating) !== "number"){
      throw "Error: Rating must be a number";
    }

    const courseCollection = await courses();
    const course = await courseCollection.getCourseById(id);
    let updatedCourse = course;
    updatedCourse.avgRating = rating;

    const updatedInfo = await courseCollection.updateOne({ _id: id }, updatedCourse);

    if (updatedInfo.modifiedCount === 0) {
      throw "Could not update course successfully.";
    }
  },

  async removeCourse(id) {
    if(!id){
      throw "You must provide an id to search for";
    }
    if(typeof(id) !== "string"){
      throw "Error: Id must be a string";
    }
    return courses().then(courseCollection => {
      return courseCollection.removeOne({ _id: id }).then(deletionInfo => {
        if (deletionInfo.deletedCount === 0) {
          throw `Could not delete course with id of ${id}`;
        }
      });
    });
  }
};