import jwt from "jsonwebtoken";

export class Authenticate {
  controller;

  constructor(controller) {
    this.controller = controller;
  }

  async execute(
    req,
    res,
  ) {
    // console.log(`${this.constructor.name}.execute`);

    let decoded;
    try {
      const token = req.headers.authorization.split(' ')[1];
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      console.error(e);
      return res.status(401).json({ message: 'Unauthorized' });
    }

    return await this.controller.execute({
      ...req.body,  // for post requests
      ...req.query, // for get requests
      userID: decoded.id,
    }, res);

  }
}
