const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Packages = require("../model/Package");
const path = require("path");

// Register a new package
const registerPackage = async (req, res) => {
  console.log("-------", req);

  try {
    console.log("Starting package registration...");

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No images uploaded" });
    }

    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    console.log("Files:", req.files);
    console.log("Body:", req.body);

    const { title, description, location, price, package_type } = req.body;



    if (!title || !description || !location || !price) {
      return res.status(400).json({
        error: "Missing required fields",
        details: { title, description, location, price },
      });
    }

    const images = req.files.map((file) => file.filename);

    const packageData = {
      title,
      description,
      owner_id: userId,
      price: price, // send integer
      location,
      total_capacity: 1,
      is_available: true,
      image: images,
      package_type,
      facilities: req.body.facilities ? JSON.parse(req.body.facilities) : [],
    };

    console.log("Attempting to create package with data:", packageData);

    const newPackage = await Packages.create(packageData);
    console.log("Package created successfully:", newPackage.id);

    res.status(201).json({
      message: "Package registered successfully",
      package: newPackage,
      imageUrls: images.map((img) => `http://localhost:5000/uploads/${img}`),
    });
  } catch (error) {
    console.error("Package registration error:", error);
    return res.status(500).json({
      error: "Failed to register package",
      details: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// View all packages
const viewAllPackage = async (req, res) => {
  try {
    const packages = await Packages.findAll(); 

    console.log(packages, "Fetched packages");
    

    const packagesWithUrls = packages.map((pkg) => {
      const packageData = pkg.toJSON();
      if (packageData.image && Array.isArray(packageData.image)) {
        packageData.image = packageData.image.map(
          (img) => `http://localhost:5000/uploads/${img}`
        );
      }
      return packageData;
    });

    res.status(200).json(packagesWithUrls);
  } catch (error) {
    console.error("Error fetching packages:", error);
    res.status(500).json({ error: "Failed to fetch packages" });
  }
};

// Delete a package
const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const pkg = await Packages.findByPk(id);

    if (!pkg) {
      return res.status(404).json({ error: "Package not found" });
    }

    if (parseInt(pkg.owner_id) !== parseInt(userId))
 {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this package" });
    }

    await pkg.destroy();

    res.status(200).json({
      message: "Package deleted successfully",
      packageId: id,
    });
  } catch (error) {
    console.error("Error deleting package:", error);
    res.status(500).json({
      error: "Failed to delete package",
      details: error.message,
    });
  }
};

module.exports = {
  registerPackage, 
  viewAllPackage,
  deletePackage,
};
