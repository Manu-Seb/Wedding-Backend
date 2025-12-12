const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc    Admin login
// @route   POST /admin/login
// @access  Public
exports.adminLogin = async (req, res) => {
  console.log(`[AUTH] ${new Date().toISOString()} - POST /admin/login - Request received`);
  console.log(`[AUTH] ${new Date().toISOString()} - Request body:`, JSON.stringify(req.body, null, 2));

  const { email, password } = req.body;

  try {
    console.log(`[AUTH] ${new Date().toISOString()} - Looking up admin with email: ${email}`);
    // Check if admin exists
    let admin = await Admin.findOne({ email });
    if (!admin) {
      console.log(`[AUTH] ${new Date().toISOString()} - Admin with email '${email}' not found`);
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    console.log(
      `[AUTH] ${new Date().toISOString()} - Admin found:`,
      JSON.stringify({ id: admin._id, email: admin.email, role: admin.role, organization: admin.organization }, null, 2)
    );

    // Check password
    console.log(`[AUTH] ${new Date().toISOString()} - Validating password...`);
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.log(`[AUTH] ${new Date().toISOString()} - Password validation failed`);
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    console.log(`[AUTH] ${new Date().toISOString()} - Password validation successful`);

    // Generate JWT token
    const payload = {
      admin: {
        id: admin.id,
        organization: admin.organization,
        role: admin.role,
      },
    };

    console.log(
      `[AUTH] ${new Date().toISOString()} - Generating JWT token with payload:`,
      JSON.stringify(payload, null, 2)
    );

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
      if (err) {
        console.log(`[AUTH] ${new Date().toISOString()} - JWT token generation failed: ${err.message}`);
        throw err;
      }
      console.log(`[AUTH] ${new Date().toISOString()} - JWT token generated successfully, returning 200 response`);
      res.json({ token });
    });
  } catch (err) {
    console.error(`[AUTH] ${new Date().toISOString()} - Error in adminLogin:`, err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Get logged in admin details
// @route   GET /admin
// @access  Private
exports.getAdmin = async (req, res) => {
  console.log(`[AUTH] ${new Date().toISOString()} - GET /admin - Request received`);
  console.log(`[AUTH] ${new Date().toISOString()} - Admin info from middleware:`, JSON.stringify(req.admin, null, 2));

  try {
    // req.admin is set from the auth middleware
    console.log(`[AUTH] ${new Date().toISOString()} - Looking up admin details for ID: ${req.admin.id}`);
    const admin = await Admin.findById(req.admin.id).select("-password");

    if (!admin) {
      console.log(`[AUTH] ${new Date().toISOString()} - Admin with ID '${req.admin.id}' not found`);
      return res.status(404).json({ msg: "Admin not found" });
    }

    console.log(`[AUTH] ${new Date().toISOString()} - Admin details retrieved:`, JSON.stringify(admin, null, 2));
    res.json(admin);
  } catch (err) {
    console.error(`[AUTH] ${new Date().toISOString()} - Error in getAdmin:`, err.message);
    res.status(500).send("Server Error");
  }
};
