export const isImageFile = (file: File | null | undefined): file is File => {
  if (!file) {
    return false;
  }

  return file.type.startsWith("image/");
};

export const formatFileSize = (bytes: number) => {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return "0 KB";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const createLocalImagePreview = (file: File) => URL.createObjectURL(file);
