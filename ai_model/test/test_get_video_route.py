import requests

ENDPOINT = 'http://127.0.0.1:8080'
test_video_path = r"C:\Users\jrnel\Downloads\people_program.mp4"

video_name = '2024-03-31_18-36-15.mp4'


def test_get_video_video_path_dont_exist():
    wrong_video_name = 'invalid_name'
    response = requests.get(ENDPOINT + '/result/' + wrong_video_name)

    assert response.status_code == 404

    print(response.json())


def test_get_video_video():
    response = requests.get(ENDPOINT + '/result/' + video_name)

    assert response.status_code == 200
