from flask import Flask, request, jsonify
import face_recognition
import cv2
import numpy as np

app = Flask(__name__)

#load know faces and embedding
known_face_encodings = []
known_face_names = []

labels = ['Rahul','Titas']
for label in labels:
    for i in range(1,2):
        image = face_recognition.load_image_file(f'img/{label}/{i}.jpg')
        face_encoding = face_recognition.face_encodings(image)[0]
        known_face_encodings.append(face_encoding)
        known_face_names.append(label)

@app.route('/recognize',methods=['POST'])

def recognize():
    file = request.files['image']
    image =face_recognition.load_image_file(file)
    face_locations = face_recognition.face_locations(image)
    face_encodings = face_recognition.face_encodings(image, face_locations)


    face_names = []
    for face_encoding in face_encodings:
        matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
        name = "Unknown"

        face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
        best_match_index = np.argmin(face_distances)
        if matches[best_match_index]:
            name = known_face_names[best_match_index]

        face_names.append(name)

    return jsonify(face_names)
if __name__ == '__main__':
    app.run(debug=True)