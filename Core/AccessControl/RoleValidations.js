export const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.userId || !allowedRoles.includes(req.userRole)) {
      return res.status(403).json({ message: "Unauthorized", status: false });
    }

    next();
  };
};
