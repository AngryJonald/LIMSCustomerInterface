'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Plate Schema
 */
var PlateSchema = new Schema({
  plateCode: {
    type: String,
    trim: true,
    required: 'Plate code must be specified',
		match: /[A-Z]{3}_[0-9]{6}_P[0-9]{2}/
  },
  stage: {
    type: Number,
    default: 1,
	required: true
  },
  project: {
    type: Schema.ObjectId,
    ref: 'Project',
    required: 'Plate must belong to a project'
  },
  samples: [{
    type: Schema.Types.ObjectId,
    ref: 'Sample'
  }],
  assignee: {
    type: Schema.ObjectId,
    ref: 'User',
    default: null
  },
  isAssigned: {
    type: Boolean,
    default: false
  },
  logs: [{
    type: Schema.Types.ObjectId,
    ref: 'Log'
  }],
  conditionalNotes: [{
	  type: Schema.Types.ObjectId,
	  ref: 'ConditionalNote'
  }],
  i5Barcode: {
     type: Schema.Types.ObjectId,
     ref: 'Barcode',
	 required: true,
     default: '56ba129f1f2a9e22c51080c5'
  }
});

//create a hook that intercepts a remove and deletes all samples before the plate is deleted
PlateSchema.pre('remove', function(next){
    //this uses a direct mongo-styled remove, so if we needed a remove hook on
    //samples for some reason, it wouldn't work. if we needed that, we would switch
    //to the foreach style remove used in projects.
    this.model('Sample').remove({_id: {$in: this.samples}},function(err){
        if(err) {
            console.log('Failed to remove nested samples: ' + err);
        }
    });
    next();
});


mongoose.model('Plate', PlateSchema);
