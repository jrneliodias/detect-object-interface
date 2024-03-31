import requests

ENDPOINT = 'http://127.0.0.1:8080'


test_parameters = {"confidence": 0.7, "iou": 0.5}


def test_missing_confidence():
    # Preparar dados de arquivo de vídeo inválido
    invalid_test_parameters = {"iou": 0.5}

    response = requests.post(ENDPOINT + '/detect',
                             json=invalid_test_parameters)

    assert response.status_code == 400
    assert 'error' in response.json()
    assert response.json()[
        'error'] == 'Model parameter(s) "confidence" is/are missing.'
    print(response.json())


def test_missing_iou():
    # Preparar dados de arquivo de vídeo inválido
    invalid_test_parameters = {"confidence": 0.5}

    response = requests.post(ENDPOINT + '/detect',
                             json=invalid_test_parameters)

    assert response.status_code == 400
    assert 'error' in response.json()
    assert response.json()[
        'error'] == 'Model parameter(s) "iou" is/are missing.'
    print(response.json())


def test_missing_all_parameters():
    # Preparar dados de arquivo de vídeo inválido
    invalid_test_parameters = {}

    response = requests.post(ENDPOINT + '/detect',
                             json=invalid_test_parameters)

    assert response.status_code == 400
    assert 'error' in response.json()
    assert response.json()[
        'error'] == 'Model parameter(s) "confidence" "iou" is/are missing.'
    print(response.json())


# def test_database_comunication_error():
#     # Preparar dados de arquivo de vídeo válido

#     response = requests.post(ENDPOINT + '/detect', json=test_parameters)

#     assert response.status_code == 500
#     assert 'message' in response.json()
#     print(response.json())

def test_detect_object_in_video():
    # Preparar dados de arquivo de vídeo válido

    response = requests.post(ENDPOINT + '/detect', json=test_parameters)

    assert response.status_code == 200
    assert 'message' in response.json()
    assert response.json()['message'] == 'Video processed successfully'
    print(response.json())
