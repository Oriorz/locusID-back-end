const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const User = mongoose.model("User");
const {
  CLOUDINARY_NAME,
  CLOUDINARY_API,
  CLOUDNIARY_SECRET,
  GOOGLE_MAP_API,
} = require("../config/key");
const cloudinary = require("cloudinary").v2;
const axios = require("axios");
const cheerio = require("cheerio");

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API,
  api_secret: CLOUDNIARY_SECRET,
});

router.get(/^\/(?:api\/)?healthcheck$/, (req, res) => {
  try {
    console.log("healthcheck called ")
    res.json({ data: "status ok" });
  } catch (err) {
    return res.status(404).json({ error: "Page not found" });
  }
});

router.get("/api/user/:id", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }).select("-password");
    //console.log({user})
    res.json({ user });
  } catch (err) {
    return res.status(404).json({ error: "User not found" });
  }
});
router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }).select("-password");
    //console.log({user})
    res.json({ user });
  } catch (err) {
    return res.status(404).json({ error: "User not found" });
  }
});

// UPLOADPIC
// upload picture API, it just upload the picture,
// then return the picture URL from cloudinary
router.put(/^\/(?:api\/)?uploadpic$/, requireLogin, (req, res) => {
  console.log("req body received is ");
  cloudinary.uploader
    .upload(req.body.pic)
    .then((result) => {
      console.log(result);
      res.json({ pic: result.url });
    })
    .catch((error) => {
      console.log("error", error);
      return res.status(422).json({ error: error });
    });
});

// update picture API, it detects if the old pic is default pic,
// if it is default pic, then just do upload new picutre
// if it is not default pic, then after do upload new picture, delete old picture
router.put(/^\/(?:api\/)?updatepic$/, requireLogin, (req, res) => {
  console.log("req received is ", req.body.oldpic);
  if (
    req.body.oldpic !== "no-image-avatar-vector-icon-600w-2054244497_xdhqa3" ||
    req.body.oldpic !== "null"
  ) {
    cloudinary.uploader
      .destroy(req.body.oldpic)
      .then((result) => console.log("deleted pic ", result));
  }
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { pic: req.body.pic } },
    { new: true, select: "-password" },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: "pic cannot post" });
      }
      res.json(result);
    }
  );
});

// update picture API, it detects if the old pic is default pic,
// if it is default pic, then just do upload new picutre
// if it is not default pic, then after do upload new picture, delete old picture
router.put(/^\/(?:api\/)?updatecoverpic$/, requireLogin, (req, res) => {
  console.log("req received by updatecoverpic is ", req.body.oldpic);
  if (
    req.body.oldpic !== "null"
  ) {
    cloudinary.uploader
      .destroy(req.body.oldpic)
      .then((result) => console.log("deleted updatecoverpic ", result));
  }
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { coverPic: req.body.pic } },
    { new: true, select: "-password" },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: "pic cannot post" });
      }
      res.json(result);
    }
  );
});

router.put("/updatedetails/:detail", requireLogin, (req, res) => {
  const tkey = req.params.detail;
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { [`${tkey}`]: req.body.value } },
    { new: true, select: "-password" },
    //User.findByIdAndUpdate(req.user._id, {$set:{socials:{[`${tkey}`]:req.body.value}}},{new:true},
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: "details cannot update" });
      }
      res.json(result);
    }
  );
});
router.put("/api/updatedetails/:detail", requireLogin, (req, res) => {
  const tkey = req.params.detail;
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { [`${tkey}`]: req.body.value } },
    { new: true, select: "-password" },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: "details cannot update" });
      }
      res.json(result);
    }
  );
});

router.put("/updatevcard", requireLogin, (req, res) => {
  const tkey = req.body.vcard;
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { [`${tkey}`]: req.body.value } },
    { new: true, select: "-password" },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: "details cannot update" });
      }
      res.json(result);
    }
  );
});
router.put("/updatemapaddress", requireLogin, (req, res) => {
  /* const tkey = req.params.detail; */
  const { address, maplink } = req.body;
  console.log("address : ", address, ", maplink : ", maplink);
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { address: address, maplink: maplink } },
    { new: true, select: "-password" },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: "details cannot update" });
      }
      res.json(result);
    }
  );
});

router.put("/api/updatemapaddress", requireLogin, (req, res) => {
  /* const tkey = req.params.detail; */
  const { address, maplink } = req.body;
  console.log("address : ", address, ", maplink : ", maplink);
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { address: address, maplink: maplink } },
    { new: true, select: "-password" },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: "details cannot update" });
      }
      res.json(result);
    }
  );
});

router.post("/createlink", requireLogin, async (req, res) => {
  const link = req.body.link;
  const linkLimit = 10;
  const user = await User.findOne({ _id: req.user._id });
  if (user.links.length < linkLimit) {
    User.findByIdAndUpdate(
      req.user._id,
      { $push: { links: link } },
      { new: true, select: "-password" },
      (err, result) => {
        if (err) {
          return res.status(422).json({ error: "link cannot insert" });
        }
        result.password = undefined;
        return res.json(result);
      }
    );
  } else {
    return res.status(422).json({
      message: `links amount create is more than ${linkLimit}, please reduce`,
    });
  }
});

router.post("/api/createlink", requireLogin, async (req, res) => {
  const link = req.body.link;
  const linkLimit = 10;
  const user = await User.findOne({ _id: req.user._id });
  if (user.links.length < linkLimit) {
    User.findByIdAndUpdate(
      req.user._id,
      { $push: { links: link } },
      { new: true, select: "-password" },
      (err, result) => {
        if (err) {
          return res.status(422).json({ error: "link cannot insert" });
        }
        result.password = undefined;
        return res.json(result);
      }
    );
  } else {
    return res.status(422).json({
      message: `links amount create is more than ${linkLimit}, please reduce`,
    });
  }
});

router.put("/deletelink", requireLogin, (req, res) => {
  const link = req.body.link;
  User.findByIdAndUpdate(
    req.user._id,
    { $pull: { links: link } },
    { new: true, select: "-password" },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: "link cannot delete" });
      }
      result.password = undefined;
      return res.json(result);
    }
  );
});

router.put("/api/deletelink", requireLogin, (req, res) => {
  const link = req.body.link;
  User.findByIdAndUpdate(
    req.user._id,
    { $pull: { links: link } },
    { new: true, select: "-password" },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: "link cannot delete" });
      }
      result.password = undefined;
      return res.json(result);
    }
  );
});

router.put("/editlink", requireLogin, (req, res) => {
  const link = req.body.link;
  User.updateOne(
    { _id: req.user._id, "links._id": link._id },
    { $set: { "links.$": link } },
    { new: true, select: "-password" },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: "link cannot delete" });
      }
      result.password = undefined;
      return res.json(result);
    }
  );
});

router.post("/createsocials", requireLogin, async (req, res) => {
  const social = req.body.socials;
  User.findByIdAndUpdate(
    req.user._id,
    { $push: { socials: social } },
    { new: true, select: "-password" },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: "socials cannot insert" });
      }
      result.password = undefined;
      return res.json(result);
    }
  );
});

router.put("/deletesocials", requireLogin, (req, res) => {
  const social = req.body.socials;
  User.findByIdAndUpdate(
    req.user._id,
    { $pull: { socials: social } },
    { new: true, select: "-password" },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: "socials cannot delete" });
      }
      result.password = undefined;
      return res.json(result);
    }
  );
});

router.put("/editsocials", requireLogin, (req, res) => {
  /* const link = req.body.link; */
  const social = req.body.socials;
  User.updateOne(
    /* { _id: req.user._id, "links._id": link._id }, */
    { _id: req.user._id, "socials._id": social._id },
    /* { $set: { "links.$": link } }, */
    { $set: { "socials.$": social } },
    { new: true, select: "-password" },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: "socials cannot edit" });
      }
      result.password = undefined;
      return res.json(result);
    }
  );
});

router.put("/editbios", requireLogin, (req, res) => {
  /* const link = req.body.link; */
  const social = req.body.socials;
  User.updateOne(
    /* { _id: req.user._id, "links._id": link._id }, */
    { _id: req.user._id, "socials._id": social._id },
    /* { $set: { "links.$": link } }, */
    { $set: { "socials.$": social } },
    { new: true, select: "-password" },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: "socials cannot edit" });
      }
      result.password = undefined;
      return res.json(result);
    }
  );
});

router.get("/metadata", async (req, res) => {
  try {
    const { url } = req.query;
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const metadata = {
      image: $('meta[property="og:image"]').attr("content"),
    };

    res.json(metadata);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching metadata." });
  }
});

router.get("/get-map", async (req, res) => {
  try {
    const address =
      "39,jalan+jaya+11+rini+heights+taman+mutiara+rini+81300+skudai+johor+malaysia";
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GOOGLE_MAP_API}`;
    const response = await axios.get(url);
    const html = response.data;
    res.json(html.results);
  } catch (error) {
    res.status(500).json({ error: "Error occurred" });
  }
});

router.get("/geocode", async (req, res) => {
  try {
    const address = req.query.address;
    /* const apiKey = process.env.GOOGLE_MAPS_API_KEY; */
    const apiKey = GOOGLE_MAP_API;
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;

    const response = await axios.get(apiUrl);
    const { results } = response.data;

    //res.json({ results });
    if (results.length > 0) {
      const { place_id } = results[0];
      const { location } = results[0].geometry;
      const { lat, lng } = location;
      const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
      /* const mapsLink = `https://www.google.com/maps?q=place_id:${place_id}`; */
      res.json({ lat, lng, mapsLink });
      /* res.json({ place_id }); */
    } else {
      res.status(404).json({ error: "Address not found" });
    }
  } catch (error) {
    console.error("error ", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
