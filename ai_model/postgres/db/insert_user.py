from flask_sqlalchemy import SQLAlchemy
from flask import Flask

db = SQLAlchemy()


class UserInputs(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    video_name = db.Column(db.String(50), nullable=False)
    confidence_input = db.Column(db.DECIMAL(5, 4), nullable=False)
    iou_input = db.Column(db.DECIMAL(5, 4), nullable=False)


def insert_user_input(video_name, confidence_input, iou_input):
    try:
        new_input = UserInputs(
            video_name=video_name,
            confidence_input=confidence_input,
            iou_input=iou_input
        )
        db.session.add(new_input)
        db.session.commit()
        return new_input
    except Exception as e:
        print("Erro ao inserir dados:", str(e))


def test_insert():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres2024@localhost/ai-detection'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Inicialize o Flask SQLAlchemy dentro do contexto de aplicativo
    db.init_app(app)

    # Defina os dados que você deseja inserir
    with app.app_context():
        video_name = 'example_video.mp4'
        confidence_input = 0.8
        iou_input = 0.5

        # Chame a função insert_user_input com os dados
        result = insert_user_input(video_name, confidence_input, iou_input)

        # Verifique se a inserção foi bem-sucedida
        if result:
            print('Dados inseridos com sucesso!')
        else:
            print('Falha ao inserir dados.')


if __name__ == '__main__':
    test_insert()
