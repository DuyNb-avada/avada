import yup from 'yup';

export default async function todoInputMiddleware(ctx, next) {
  try {
    const postData = ctx.request.body;
    let schema = yup.object().shape({
      id: yup.number().positive().integer().nullable(),
      text: yup.string().required(),
      isCompleted: yup.boolean().default(false),
    });

    await schema.validate(postData);
    next();
  } catch (e) {
    ctx.status = 400;
    ctx.body = {
      success: false,
      errors: e.errors,
      errorName: e.name
    }
  }

}