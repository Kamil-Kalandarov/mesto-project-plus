import mongoose from 'mongoose';
import validator from 'validator';

interface IUser {
  name: string,
  about: string,
  avatar: string,
  email: string,
  password: string,
}

const UserSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator: (v: string) => validator.isURL(v),
      message: 'Некорректный URL',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    minlength: 2,
    maxlength: 30,
    unique: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'Некорректный email'
    },
  },
  password: {
    type: String,
    minlength: 2,
    maxlength: 30,
    validate: {
      validator: (v: string) => validator.isStrongPassword(v),
      message: 'Некорректный email'
    },
  }
});

export default mongoose.model('User', UserSchema);
