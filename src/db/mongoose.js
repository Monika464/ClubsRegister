// getting-started.js
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  //await mongoose.connect('mongodb://127.0.0.1:27017/test');
  await mongoose.connect('mongodb+srv://mkubianka:VMXeIyXDCT5D0jzH@clusterregistration.sd346.mongodb.net/competRegister?retryWrites=true&w=majority&appName=ClusterRegistration')
   .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Connection error:", error);
  });
  
  //mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api", {
  // useNewUrlParser: true,
//});

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
