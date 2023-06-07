import mongoose, { trusted } from 'mongoose';
import Report from '../mongodb/models/report.js';
import User from '../mongodb/models/user.js';
import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getAllReports = async (req, res) => {
  const { _end, _order, _start, _sort, title_like = "", reportType = "" } = req.query;

  const query = {};

  if (reportType !== '') {
    query.reportType = reportType;
  }

  if (title_like) {
    query.title = { $regex: title_like, $options: 'i' };
  }

  try {
    const count = await Report.countDocuments(query);

    const reports = await Report
      .find(query)
      // .populate('creator')  // Add this line
      .limit(_end)
      .skip(_start)
      .sort({ [_sort]: _order });

    res.header('x-total-count', count);
    res.header('Access-Control-Expose-Headers', 'x-total-count');

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReportDetail = async (req, res) => {
  const { id } = req.params;
  const reportExists = await Report.findOne({ _id: id }).populate('creator');

  if (reportExists) {
    res.status(200).json(reportExists);
  } else {
    res.status(404).json({ message: 'Report not found' });
  }
};

const createReport = async (req, res) => {
  try {
    const { title, description, reportType, location, photo, email, isReviewed } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    const user = await User.findOne({ email }).session(session);

    if (!user) throw new Error('User not found');

    const photoUrl = await cloudinary.uploader.upload(photo);

    const newReport = await Report.create({
      title,
      description,
      reportType,
      location,
      photo: photoUrl.url,
      creator: user._id,
      isReviewed
    });

    user.allReports.push(newReport._id);
    await user.save({ session });

    await session.commitTransaction();

    res.status(200).json({ message: 'Report created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateReport = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, reportType, location, isReviewed } = req.body;
  
      let photoUrl = req.body.photo;
  
      if (req.file) {
        // If a new file is uploaded, update the photoUrl
        const uploadedPhoto = await cloudinary.uploader.upload(req.file.path);
        photoUrl = uploadedPhoto.url;
      }
  
      await Report.findByIdAndUpdate(
        { _id: id },
        {
          title,
          description,
          reportType,
          location,
          photo: photoUrl,
          isReviewed
        }
      );
  
      res.status(200).json({ message: 'Report updated successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    const reportToDelete = await Report.findById({ _id: id }).populate('creator');

    if (!reportToDelete) throw new Error('Report not found');

    const session = await mongoose.startSession();
    session.startTransaction();

    await Report.deleteOne({ _id: id }).session(session);
    reportToDelete.creator.allReports.pull(reportToDelete);

    await reportToDelete.creator.save({ session });
    await session.commitTransaction();

    res.status(200).json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getAllReports,
  getReportDetail,
  createReport,
  updateReport,
  deleteReport
};
