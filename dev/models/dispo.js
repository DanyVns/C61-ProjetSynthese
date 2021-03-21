
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var DispoSchema = new Schema(
    {
      dispos: {type: Array, required: true},
      event: {type: Schema.Types.ObjectId, ref: 'Event', required: true},
      user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
      preference: {type: Boolean, required: true, default: false}
    }
);


module.exports = mongoose.model('Dispo', DispoSchema);