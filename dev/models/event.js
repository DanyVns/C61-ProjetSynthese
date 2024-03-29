
var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var Dispo = require('./dispo');

var EventSchema = new Schema(
    {
      nom: { type: String, required: true, unique: true },
      description: String,
      owner: {type: Schema.Types.ObjectId, ref: 'User', required: true},
      //length: {type: Number, required: true, default: 1},
      start_date: {type: Date, required: true},
      end_date: {type: Date, required: true},
      start_time: {type: Number, required: true, default: 0800},
      end_time: {type: Number, required: true, default: 1800},
      limit_date: {type: Date, required: true}     
    }
);




module.exports = mongoose.model('Event', EventSchema);