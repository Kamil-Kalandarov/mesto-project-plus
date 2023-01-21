import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import UnauthorizedError from '../errors/unauthorized_error';

interface IUser {
  name: string,
  about: string,
  avatar: string,
  email: string,
  password: string,
}

interface IUserModel extends mongoose.Model<IUser> {
  findUserByCredentials:
    // eslint-disable-next-line no-unused-vars
    (email: string, password: string) => Promise<mongoose.Document<unknown, any, IUser>>
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
      validator: (v: any) => validator.isURL(v),
      message: 'Некорректный URL',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v: any) => validator.isEmail(v),
      message: 'Некорректный email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

UserSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password')
    .orFail(new UnauthorizedError('Неправильные почта или пароль'))
    .then((user: any) => {
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }
          return user;
        });
    });
});

export default mongoose.model<IUser, IUserModel>('User', UserSchema);
