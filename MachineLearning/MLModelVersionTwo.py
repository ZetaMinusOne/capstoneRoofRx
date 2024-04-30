import tensorflow as tf
import keras
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from keras import layers, models, datasets
from keras.applications import InceptionV3, MobileNetV2
from keras.utils import to_categorical
from keras.callbacks import EarlyStopping
from keras.preprocessing.image import ImageDataGenerator
from keras.preprocessing import image_dataset_from_directory
from skimage.transform import resize
import matplotlib.pyplot as plt
import numpy as np
import cv2

# Set random seed for reproducibility
np.random.seed(42)
tf.random.set_seed(42)

image_height = 200
image_width = 200
batch_size = 32

train_data = image_dataset_from_directory(
    'MachineLearning/DataSetImages/',
    labels='inferred',
    label_mode='binary',
    class_names=['0_NotBroken', '1_Broken'],
    batch_size=batch_size,
    image_size=(image_height, image_width),
    shuffle=True,
    seed=42,
    validation_split=0.25,
    subset='training'
)

validation_data = image_dataset_from_directory(
    'MachineLearning/DataSetImages/',
    labels='inferred',
    label_mode='binary',
    class_names=['0_NotBroken', '1_Broken'],
    batch_size=batch_size,
    image_size=(image_height, image_width),
    shuffle=True,
    seed=42,
    validation_split=0.25,
    subset='validation'
)

# Extract images and labels from the training dataset
train_images = []
train_labels = []
for images, labels in train_data:
    train_images.append(images)
    train_labels.append(labels)

# Concatenate batches into a single array
train_images = tf.concat(train_images, axis=0)
train_labels = tf.concat(train_labels, axis=0)

# Extract images and labels from the validation dataset
validation_images = []
validation_labels = []
for images, labels in validation_data:
    validation_images.append(images)
    validation_labels.append(labels)

# Concatenate batches into a single array
validation_images = tf.concat(validation_images, axis=0)
validation_labels = tf.concat(validation_labels, axis=0)

train_images, validation_images = train_images / 255.0, validation_images / 255.0

# Assuming train_labels_binary and validation_labels_binary are TensorFlow tensors
train_labels = tf.cast(train_labels, dtype=tf.int32)
validation_labels = tf.cast(validation_labels, dtype=tf.int32)


# Convert target labels to one-hot encoded format
train_labels = to_categorical(train_labels, num_classes=2)
validation_labels = to_categorical(validation_labels, num_classes=2)

# Reshape the target labels to (None, 2)
train_labels_ready = np.reshape(train_labels, (-1, 2))
validation_labels_ready = np.reshape(validation_labels, (-1, 2))



#INCEPTION V3 MODEL FOR TRANSFER LEARNING
# Load InceptionV3 model pretrained on ImageNet dataset
base_model = InceptionV3(weights='imagenet', include_top=False, input_shape=train_images.shape[1:])

# Freeze all layers in the base model (No Fine Tuning)
for layer in base_model.layers:
    layer.trainable = False

# Add custom classification head
x = layers.GlobalAveragePooling2D()(base_model.output)
x = layers.Dense(64, activation='relu')(x)
#x = layers.Dropout(0.5)(x)  # Adding dropout layer
predictions = layers.Dense(2, activation='sigmoid')(x)

# Combine base model and custom classification head
model = models.Model(inputs=base_model.input, outputs=predictions)



# Compile the model
model.compile(optimizer='adam',
              loss='binary_crossentropy',
              metrics=['accuracy'])



#EARLY STOPPING
# Define early stopping callback
early_stopping = EarlyStopping(
    monitor='val_accuracy',  # Metric to monitor
    patience=3,  # Number of epochs with no improvement after which training will be stopped
    mode='max',  # 'max' to monitor accuracy (higher is better)
    restore_best_weights=True  # Restore the best model weights after training
)



# Print model summary
model.summary()



# Train the model
history = model.fit(train_images, train_labels_ready, epochs=20, validation_data=(validation_images, validation_labels_ready), callbacks=[early_stopping])



# Evaluate the model
test_loss, test_acc = model.evaluate(validation_images, validation_labels_ready)
print(f'Test accuracy: {test_acc}')


'''
if(test_acc > 0.80):
    # Save the model in SavedModel format
    tf.saved_model.save(model, './saved_model_versionTwo')
'''




# Plot training and validation accuracy
plt.plot(history.history['accuracy'], label='Training Accuracy')
plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.legend()
plt.show()