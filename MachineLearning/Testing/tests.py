import tensorflow as tf
import numpy as np
import pytest
import requests
from PIL import Image
from io import BytesIO

# Load the trained model
model = tf.saved_model.load('C:/Users/jemag/Documents/2023_2024_Second_Semester/CAPSTONE/AppRepo/Bit-Busters/MachineLearning/saved_model_versionTwo')

def test_model_prediction():
    # Download the image from the URL
    response = requests.get('https://images.thdstatic.com/productImages/da43eacb-cfaa-4dfd-9038-05be93ddf195/svn/master-flow-vent-pipe-flashing-lrf2-31_600.jpg')
    # Open the image using PIL
    image = Image.open(BytesIO(response.content))
    # Convert the image mode to RGB
    image = image.convert('RGB')
    # Resize the image to match the model's input size (200x200)
    image_resized = image.resize((200, 200))
    # Convert the image to numpy array and normalize pixel values
    image_array = np.array(image_resized, dtype=np.float32) / 255.0
    # Add a batch dimension to the image array
    image_array = np.expand_dims(image_array, axis=0)
    # Perform prediction using the loaded model
    prediction = model(image_array)
    
    # Get the predicted class index with the highest probability
    predicted_class_index = np.argmax(prediction)
    print(prediction)
    expected_class_index = 0  # Replace with the expected class index (e.g., 0 for NotBroken, 1 for Broken)

    assert predicted_class_index == expected_class_index, f"Expected class index {expected_class_index}, but got {predicted_class_index}"


if __name__ == '__main__':
    pytest.main()


#test_model_prediction()