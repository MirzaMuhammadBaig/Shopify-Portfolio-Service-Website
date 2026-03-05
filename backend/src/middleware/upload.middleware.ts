import multer from 'multer';

const storage = multer.memoryStorage();

const imageFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, WebP, and AVIF images are allowed'));
  }
};

const deliverableFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'application/pdf'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, WebP, AVIF images and PDF files are allowed'));
  }
};

/** Accept a single image field (max 5 MB). */
export const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single('image');

/** Accept up to 3 deliverable files (images or PDFs, max 10 MB each). */
export const uploadDeliverables = multer({
  storage,
  fileFilter: deliverableFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
}).array('files', 3);
