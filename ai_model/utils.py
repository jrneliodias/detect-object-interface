from werkzeug.exceptions import HTTPException
from flask import abort


def allowed_file(filename: str):
    """A function that checks whether the uploaded filetype is allowed using its extension.
    Supported file types: "jpg", "jpeg", "png", "webp", "mp4", "mov", "avi".

    Parameters:
        filename (str): The name of the uploaded file, including its extension.
    Raises:
        An exception if the filetype is not allowed.
    """

    return filename.split(
        ".")[-1] in ("jpg", "jpeg", "png", "webp", "mp4", "mov", "avi")
