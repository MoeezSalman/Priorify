const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
{
  firstName: { 
    type: String, 
    required: true, 
    trim: true 
  },

  lastName: { 
    type: String, 
    required: true, 
    trim: true 
  },

  username: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  },

  passwordHash: { 
    type: String, 
    required: true 
  },

  role: {
    type: String,
    default: "admin",
    immutable: true
  },

  // Multiple teams under one admin
team: {
  type: [
    {
      teamName: {
        type: String,
        required: true
      },
      focus: {
        type: String,
        default: "General"
      },
      members: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Engineer"
        }
      ]
    }
  ],
  default: []
},


  resetOtpHash: { 
    type: String, 
    default: null 
  },

  resetOtpExpires: { 
    type: Date, 
    default: null 
  },

},
{ timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
