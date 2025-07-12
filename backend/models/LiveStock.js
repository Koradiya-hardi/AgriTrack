const mongoose = require('mongoose');

const liveStockSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    type:{
        type: String,
        required: true,
    },
    breed:{
        type: String,
    },
    age:{
        type: Number,
    },
    weight:{
        type: Number,
    },
    status:{
        type: String,
        enum: ['Active','Solid','Deceased'],
        default: 'Active',
    },
    userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  feedingLogs: [{
    date: { type: Date, default: Date.now },
    foodType: String,
    amount: String,
    notes: String
  }],
  vetLogs: [{
    date: { type: Date, default: Date.now },
    treatment: String,
    vetName: String,
    cost: Number
  }],
  vaccinations: [{
    name: String,
    date: { type: Date, default: Date.now },
    nextDueDate: Date,
    administeredBy: String
  }]
});

module.exports = mongoose.model('Livestock',liveStockSchema);


// This schema defines a LiveStock model with fields for name, type, breed, age,
// weight, status, userId, and arrays for feeding logs, vet logs, and vaccinations.
// Each log entry includes relevant details such as date, food type, amount, notes for feeding logs,
// treatment, vet name, cost for vet logs, and vaccination details like name, date, nextDueDate, and administeredBy.
// The userId field is a reference to the User model, ensuring that each livestock entry is associated with a specific user.
// The status field can be 'Active', 'Solid', or 'Deceased', with 'Active' as the default value.
// The schema uses Mongoose's ObjectId type for userId, allowing for easy reference to the User model.
// The feedingLogs, vetLogs, and vaccinations fields are arrays that can store multiple entries, allowing for detailed tracking
// of livestock care and health records.
// The date fields in the logs default to the current date, ensuring that each entry is timestamped when created.
// This schema can be used to create, read, update, and delete livestock records in a MongoDB database using Mongoose.
// It provides a structured way to manage livestock information, including care and health records, making it suitable for agricultural applications or livestock management systems.
//// The LiveStock model can be used in conjunction with other models, such as User and Crop,
// to create a comprehensive agricultural management system.
// This allows users to manage their crops and livestock in a unified platform, enhancing the overall functionality
// and usability of the application.