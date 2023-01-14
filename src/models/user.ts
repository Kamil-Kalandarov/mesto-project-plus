import mongoose from 'mongoose';
import validator from 'validator';

interface IUser {
  name: string,
  about: string,
  avatar: string
}

const UserSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v: any) => validator.isURL(v),
      message: 'Некорректный URL',
    },
  },
});

export default mongoose.model('User', UserSchema);
