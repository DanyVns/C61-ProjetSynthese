
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ScheduleSchema = new Schema(
    {
      nom: { type: String, required: true, unique: true },
      event: {type: Schema.Types.ObjectId, ref: 'Event', required: true},
      user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
      start: {type: Date, required: true}
      //end: {type: Date, required: true}
    }
);


module.exports = mongoose.model('Schedule', ScheduleSchema);