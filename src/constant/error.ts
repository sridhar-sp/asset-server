abstract class FileUploadError implements Error {
  name: string;
  message: string;

  constructor(name: string, message: string) {
    this.name = name;
    this.message = message;
  }
}

class InvalidFileType extends FileUploadError {
  constructor(message: string) {
    super("InvalidFileType", message);
  }
}

export { FileUploadError, InvalidFileType };
