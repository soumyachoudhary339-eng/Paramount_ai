import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["candidate", "recruiter", "admin"],
      default: "candidate",
    },
    targetRole: {
      type: String,
      default: "Full-Stack Developer",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function () {
    if (!this.password ||!this.isModified("password")) {
        return 
    }
        return this.password = bcrypt.hashSync(this.password, 10)
         
})

userSchema.methods.comparePass = function (password) {
    return bcrypt.compareSync(password, this.password)
}

const userModel = mongoose.model("User", userSchema);

export default userModel;