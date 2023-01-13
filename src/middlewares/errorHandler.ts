import { Request, Response, NextFunction } from "express";

const errorHandler = ((err: any, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500, message } = err;  // если у ошибки нет статуса, выставляем 500
  res
    .status(statusCode)
    .send({
      message: statusCode === 500  // проверяем статус и выставляем сообщение в зависимости от него
        ? 'На сервере произошла ошибка'
        : message
    })
    console.log(err.name, statusCode);

});

export default errorHandler;
