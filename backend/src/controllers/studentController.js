export const registerStudent = async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password || !phone) {
    return res.status(401).json({
      status: 401,
      success: false,
      message: "All fields are required",
    });
  }
};
