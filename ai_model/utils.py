from werkzeug.exceptions import HTTPException


def allowed_file(filename: str):
    """A function that checks whether the uploaded filetype is allowed using its extension.
    Supported file types: "jpg", "jpeg", "png", "webp", "mp4", "mov", "avi".

    Parameters:
        filename (str): The name of the uploaded file, including its extension.
    Raises:
        An exception if the filetype is not allowed.
    """

    file_extension = filename.split(
        ".")[-1] in ("jpg", "jpeg", "png", "webp", "mp4", "mov", "avi")

    if not file_extension:
        raise HTTPException(
            status_code=415, detail="Unsupported file provided.")
