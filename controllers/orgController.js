// controllers/orgController.js
const Organization = require("../models/Organization");
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

exports.createOrganization = async (req, res) => {
  console.log(`[ORG] ${new Date().toISOString()} - POST /org/create - Request received`);
  console.log(`[ORG] ${new Date().toISOString()} - Request body:`, JSON.stringify(req.body, null, 2));

  try {
    const { name, adminEmail, adminPassword } = req.body;
    console.log(
      `[ORG] ${new Date().toISOString()} - Creating organization with name: ${name}, admin email: ${adminEmail}`
    );

    // Check if organization already exists
    console.log(`[ORG] ${new Date().toISOString()} - Checking if organization '${name}' already exists...`);
    let organization = await Organization.findOne({ name });
    if (organization) {
      console.log(`[ORG] ${new Date().toISOString()} - Organization '${name}' already exists`);
      return res.status(400).json({ msg: "Organization with this name already exists" });
    }

    // Create new organization
    console.log(`[ORG] ${new Date().toISOString()} - Saving new organization to database...`);
    organization = new Organization({ name });
    await organization.save();
    console.log(`[ORG] ${new Date().toISOString()} - Organization saved successfully with ID: ${organization._id}`);

    // Create admin user for the organization
    console.log(`[ORG] ${new Date().toISOString()} - Creating admin user for organization...`);
    const admin = new Admin({
      email: adminEmail,
      password: adminPassword,
      organization: organization._id,
      role: "admin",
    });

    await admin.save();
    console.log(`[ORG] ${new Date().toISOString()} - Admin created successfully with ID: ${admin._id}`);

    // Generate JWT token for the admin
    const payload = {
      admin: {
        id: admin.id,
        organization: organization._id,
        role: admin.role,
      },
    };

    console.log(`[ORG] ${new Date().toISOString()} - Generating JWT token...`);
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
      if (err) {
        console.log(`[ORG] ${new Date().toISOString()} - JWT token generation failed: ${err.message}`);
        throw err;
      }
      console.log(`[ORG] ${new Date().toISOString()} - JWT token generated successfully, returning 201 response`);
      res.status(201).json({ msg: "Organization and admin created successfully", token });
    });
  } catch (err) {
    console.error(`[ORG] ${new Date().toISOString()} - Error in createOrganization:`, err.message);
    res.status(500).send("Server Error");
  }
};

exports.getOrganizationByName = async (req, res) => {
  console.log(`[ORG] ${new Date().toISOString()} - GET /org/get/${req.params.name} - Request received`);
  console.log(`[ORG] ${new Date().toISOString()} - Admin info from middleware:`, JSON.stringify(req.admin, null, 2));

  try {
    console.log(`[ORG] ${new Date().toISOString()} - Looking up organization by name: ${req.params.name}`);
    const organization = await Organization.findOne({ name: req.params.name });

    if (!organization) {
      console.log(`[ORG] ${new Date().toISOString()} - Organization '${req.params.name}' not found`);
      return res.status(404).json({ msg: "Organization not found" });
    }

    console.log(`[ORG] ${new Date().toISOString()} - Organization found:`, JSON.stringify(organization, null, 2));
    console.log(`[ORG] ${new Date().toISOString()} - Returning organization data`);
    res.json(organization);
  } catch (err) {
    console.error(`[ORG] ${new Date().toISOString()} - Error in getOrganizationByName:`, err.message);
    res.status(500).send("Server Error");
  }
};

exports.getOrganizationById = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({ msg: "Organization not found" });
    }

    res.json(organization);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Organization not found" });
    }
    res.status(500).send("Server Error");
  }
};

exports.updateOrganizationByName = async (req, res) => {
  const { name } = req.body;
  const organizationFields = {};
  if (name) organizationFields.name = name;

  console.log(`[ORG] ${new Date().toISOString()} - PUT /org/update/${req.params.name} - Request received`);
  console.log(`[ORG] ${new Date().toISOString()} - Update data:`, JSON.stringify(req.body, null, 2));
  console.log(`[ORG] ${new Date().toISOString()} - Admin info from middleware:`, JSON.stringify(req.admin, null, 2));

  try {
    console.log(`[ORG] ${new Date().toISOString()} - Looking up organization by name: ${req.params.name}`);
    let organization = await Organization.findOne({ name: req.params.name });

    if (!organization) {
      console.log(`[ORG] ${new Date().toISOString()} - Organization '${req.params.name}' not found`);
      return res.status(404).json({ msg: "Organization not found" });
    }

    console.log(
      `[ORG] ${new Date().toISOString()} - Current organization found:`,
      JSON.stringify(organization, null, 2)
    );

    // Ensure user is authorized to update this organization
    console.log(`[ORG] ${new Date().toISOString()} - Checking authorization...`);
    console.log(`[ORG] ${new Date().toISOString()} - Admin org ID: ${req.admin.organization}`);
    console.log(`[ORG] ${new Date().toISOString()} - Current org ID: ${organization._id}`);
    if (req.admin.organization.toString() !== organization._id.toString()) {
      console.log(
        `[ORG] ${new Date().toISOString()} - Authorization failed: admin not authorized to update this organization`
      );
      return res.status(401).json({ msg: "Not authorized to update this organization" });
    }

    console.log(`[ORG] ${new Date().toISOString()} - Authorization passed, updating organization...`);
    organization = await Organization.findOneAndUpdate(
      { name: req.params.name },
      { $set: organizationFields },
      { new: true }
    );

    console.log(
      `[ORG] ${new Date().toISOString()} - Organization updated successfully:`,
      JSON.stringify(organization, null, 2)
    );
    res.json(organization);
  } catch (err) {
    console.error(`[ORG] ${new Date().toISOString()} - Error in updateOrganizationByName:`, err.message);
    res.status(500).send("Server Error");
  }
};

exports.updateOrganization = async (req, res) => {
  const { name } = req.body;
  const organizationFields = {};
  if (name) organizationFields.name = name;

  try {
    let organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({ msg: "Organization not found" });
    }

    // Ensure user is authorized to update this organization (e.g., is an admin of this org)
    // This part would typically involve checking req.user.organization or similar from auth middleware
    if (req.admin.organization.toString() !== req.params.id) {
      return res.status(401).json({ msg: "Not authorized to update this organization" });
    }

    organization = await Organization.findByIdAndUpdate(req.params.id, { $set: organizationFields }, { new: true });

    res.json(organization);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Organization not found" });
    }
    res.status(500).send("Server Error");
  }
};

exports.deleteOrganizationByName = async (req, res) => {
  console.log(`[ORG] ${new Date().toISOString()} - DELETE /org/delete/${req.params.name} - Request received`);
  console.log(`[ORG] ${new Date().toISOString()} - Admin info from middleware:`, JSON.stringify(req.admin, null, 2));

  try {
    console.log(`[ORG] ${new Date().toISOString()} - Looking up organization by name: ${req.params.name}`);
    let organization = await Organization.findOne({ name: req.params.name });

    if (!organization) {
      console.log(`[ORG] ${new Date().toISOString()} - Organization '${req.params.name}' not found`);
      return res.status(404).json({ msg: "Organization not found" });
    }

    console.log(
      `[ORG] ${new Date().toISOString()} - Organization found for deletion:`,
      JSON.stringify(organization, null, 2)
    );

    // Ensure user is authorized to delete this organization
    console.log(`[ORG] ${new Date().toISOString()} - Checking authorization...`);
    console.log(`[ORG] ${new Date().toISOString()} - Admin org ID: ${req.admin.organization}`);
    console.log(`[ORG] ${new Date().toISOString()} - Current org ID: ${organization._id}`);
    if (req.admin.organization.toString() !== organization._id.toString()) {
      console.log(
        `[ORG] ${new Date().toISOString()} - Authorization failed: admin not authorized to delete this organization`
      );
      return res.status(401).json({ msg: "Not authorized to delete this organization" });
    }

    console.log(`[ORG] ${new Date().toISOString()} - Authorization passed, deleting organization...`);
    await Organization.findOneAndRemove({ name: req.params.name });
    console.log(`[ORG] ${new Date().toISOString()} - Organization deleted successfully`);

    // Also delete all associated admins/users
    console.log(
      `[ORG] ${new Date().toISOString()} - Deleting associated admins for organization ID: ${organization._id}`
    );
    const deleteResult = await Admin.deleteMany({ organization: organization._id });
    console.log(`[ORG] ${new Date().toISOString()} - Deleted ${deleteResult.deletedCount} admin(s)`);

    console.log(`[ORG] ${new Date().toISOString()} - Delete operation completed successfully`);
    res.json({ msg: "Organization and associated admins removed" });
  } catch (err) {
    console.error(`[ORG] ${new Date().toISOString()} - Error in deleteOrganizationByName:`, err.message);
    res.status(500).send("Server Error");
  }
};

exports.deleteOrganization = async (req, res) => {
  try {
    let organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({ msg: "Organization not found" });
    }

    // Ensure user is authorized to delete this organization
    if (req.admin.organization.toString() !== req.params.id) {
      return res.status(401).json({ msg: "Not authorized to delete this organization" });
    }

    await Organization.findByIdAndRemove(req.params.id);

    // Also delete all associated admins/users
    await Admin.deleteMany({ organization: req.params.id });

    res.json({ msg: "Organization and associated admins removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Organization not found" });
    }
    res.status(500).send("Server Error");
  }
};
