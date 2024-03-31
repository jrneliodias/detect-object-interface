import requests
from io import BytesIO

ENDPOINT = 'http://127.0.0.1:8080'
test_video_path = r"C:\Users\jrnel\Downloads\people_program.mp4"


def test_upload_valid_video():
    # Preparar dados de arquivo de vídeo válido
    with open(test_video_path, 'rb') as file:
        files = {'video': file}
        # Enviar solicitação POST com o arquivo de vídeo anexado
        response = requests.post(ENDPOINT + '/upload', files=files)

    assert response.status_code == 200
    assert 'message' in response.json()
    assert response.json()['message'] == 'Video saved successfully'
    print(response.json())


def test_upload_no_video_file():
    files = {}
    response = requests.post(ENDPOINT + '/upload', files=files)
    print(response.json())
    assert response.status_code == 404


def test_upload_file_with_invalid_type_file():
    files = {'video': 'invalid_video'}
    response = requests.post(ENDPOINT + '/upload', files=files)
    print(response.json())
    assert response.status_code == 415
