const mongoose = require('mongoose')
mongoose.set('useNewUrlParser', true)
mongoose.set('useUnifiedTopology', true)
mongoose.set('useFindAndModify', false)

class Database {
  //constrcutor is the code that runs when an instance of this class is created
  constructor() {
    this.connect()
  }

  connect() {
    mongoose
      .connect(
        'mongodb+srv://admin:admin@cluster0.dctfo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
      )
      .then(() => console.log('MongoDB connected'))
      .catch((error) => console.log(`Connection error: ${error}`))
  }
}

module.exports = new Database()
