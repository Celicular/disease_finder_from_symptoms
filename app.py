from flask import Flask, request, jsonify, render_template
from infer import predict_disease

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    symptoms = request.json.get('symptoms')
    if not symptoms:
        return jsonify({'error': 'No symptoms provided'}), 400

    # The user can either send a string of comma separated symptoms or a list of symptoms
    if isinstance(symptoms, str):
        symptoms_list = [s.strip() for s in symptoms.split(',')]
    else:
        symptoms_list = symptoms

    prediction = predict_disease(symptoms_list)
    return jsonify({'prediction': prediction})

if __name__ == '__main__':
    app.run(debug=True)
