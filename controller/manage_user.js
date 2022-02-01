const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../db/models/users");
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");
//to register the user
exports.register = async (req, res, next) => {
  const currentTime = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
  });

  // const { errors, isValid } = validateRegisterInput(req.body);
  if (req.body.email) {
    const { errors, isValid } = validateRegisterInput(req.body);
    // Check validation

    if (!isValid) {
      console.log(errors);
      return res.status(400).json(errors);
    }
  }
  User.findOne({ mobile: req.body.mobile }).then((user) => {
    if (user) {
      return res.status(400).json({ mobile: "Mobile Number already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        password: req.body.password,
        time: currentTime,
      });
      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.save();
          console.log(newUser);

          const payload = {
            id: newUser._id,
            name: newUser.name,
          };
          // Sign token
          jwt.sign(
            payload,
            process.env.secretOrKey,
            {
              expiresIn: 31556926, // 1 year in seconds
            },
            (err, token) => {
              console.log("sign in Successful");
              res.json({
                success: true,
                token: "Bearer " + token,
              });
            }
          );
          // next();
          // res.status(200).json({ message: "User registered Successfully" });
        });
      });
    }
  });
};

//to login the user
exports.sign_in = async (req, res) => {
  console.log("in sign in");
  console.log(req.body);
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
  if (!isValid) {
    console.log(errors);
    return res.status(400).json(errors);
  }
  const mobile = req.body.mobile;
  const password = req.body.password;
  // Find user by email
  User.findOne({ mobile: mobile }).then((user) => {
    // Check if user exists
    if (!user) {
      console.log("Contact not found");
      return res
        .status(404)
        .json({ mobilenotfound: "Contact Number not found" });
    }
    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
        };
        // Sign token
        jwt.sign(
          payload,
          process.env.secretOrKey,
          {
            expiresIn: 31556926, // 1 year in seconds
          },
          (err, token) => {
            console.log("sign in Successful");
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        console.log("Incorrect password");
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
};

//to reset the user password
exports.reset_password = async (req, res) => {
  const { mobile, password } = req.body;
  if (!mobile || !password) {
    return res.status(422).json({ error: "Fill all required fields" });
  }

  try {
    const userExists = await User.findOne({ mobile: mobile });
    if (!userExists) {
      return res
        .status(422)
        .json({ error: "User does not exists.. please sign in" });
    }
    password = await bcrypt.hash(password, 12);

    await User.findByIdAndUpdate(
      userExists._id,
      { password: password },
      {
        useFindAndModify: false,
      }
    );
    res.status(201).json({ message: "Data successfully Updated." });
  } catch (error) {
    console.log(error);
  }
};

//to update the user data
exports.update_user = async (req, res) => {
  try {
    const { name, email, mobile, password, address, state, country } = req.body;

    let hashPass;
    if (password != "") {
      await bcrypt.genSalt(10, async (err, salt) => {
        hashPass = await bcrypt.hash(password, salt);
        await User.findByIdAndUpdate(req.user._id, { password: hashPass });
      });
    }

    if (email != "" || password != "") {
      if (email != req.user.name || mobile != req.user.mobile) {
        console.log("Required additional verification!");
      }
    }

    await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        profile: {
          image: req.user.image,
          image_public_id: req.user.image_public_id,
          address,
          state,
          country,
        },
      },
      {
        useFindAndModify: false,
      }
    );
    res.status(201).json({ message: "Data successfully Updated." });
  } catch (error) {
    console.log(error);
  }
};

exports.get_user = (req, res) => {
  User.findOne({ _id: req.user._id })
    // .populate("courses orders")
    .populate([
      {
        path: "courses",
        populate: {
          path: "subject",
        },
      },
      {
        path: "orders",
      },
    ])
    .exec((error, user) => {
      if (user) {
        res.status(201).json(user);
      } else {
        console.log("error", error);
      }
    });
};

exports.user_completed_quiz = (req, res) => {
  User.findOne({ _id: req.user._id })
    // .populate("courses orders")
    .populate([
      {
        path: "completed_quiz",
        populate: {
          path: "course chapter",
        },
      },
    ])
    .exec((error, user) => {
      if (user) {
        res.status(201).json(user);
      } else {
        console.log("error", error);
      }
    });
};

exports.get_all_user = async (req, res) => {
  try {
    const get_data = await User.find();
    if (!get_data) {
      res.status(404).send({ message: "Data not found" });
    } else {
      res.send(get_data);
    }
  } catch (error) {
    console.log(error);
  }
};
