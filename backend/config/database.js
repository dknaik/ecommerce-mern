const mongoose=require('mongoose');

const connectDatabase=()=>{
    console.log("db connection called")
mongoose.set("strictQuery", false);
    mongoose
      .connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((data) => {
        console.log(`Mongodb connected with server : ${data.connection.host}`);
      })
      // .catch((err) => {
      //   console.log(err);
      // });;
      //commented writing code for unhandledpromise rejection
}

module.exports=connectDatabase