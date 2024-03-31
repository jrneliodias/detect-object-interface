import requests

ENDPOINT = 'http://127.0.0.1:8080'


def test_get_detections_error():
    response = requests.get(ENDPOINT + '/detections')

    assert response.status_code == 500

    print(response.json())


# def test_get_detections():
#     response = requests.get(ENDPOINT + '/detections')

#     assert response.status_code == 200
