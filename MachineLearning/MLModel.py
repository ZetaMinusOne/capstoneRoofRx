import tensorflow as tf
import keras
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from keras import layers, models, datasets
from keras.applications import InceptionV3, MobileNetV2
from keras.utils import to_categorical
from keras.callbacks import EarlyStopping
from keras.src.preprocessing.image import ImageDataGenerator
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

print(train_labels)
print(train_labels_ready)


'''#USING A DATASET SET WITH REAL DATA
# Load and preprocess the CIFAR-10 dataset
(train_images, train_labels), (test_images, test_labels) = datasets.cifar10.load_data()


# Select two classes (e.g., 'airplane' and 'automobile')
class_indices = [0, 1]  # 'airplane' and 'automobile' classes
class_labels = ['airplane', 'automobile']

# Initialize lists to store the subset of images and labels
subset_images = []
subset_labels = []

# Iterate through the dataset and select images and labels for the specified classes
count_per_class = 150 // len(class_indices)  # Number of images to select per class
for class_index, class_label in zip(class_indices, class_labels):
    # Filter images for the current class
    class_images = train_images[train_labels.flatten() == class_index][:count_per_class]
    # Create corresponding labels for the current class
    class_labels_subset = np.full((count_per_class, 1), class_index)
    
    # Add selected images and labels to the subset
    subset_images.append(class_images)
    subset_labels.append(class_labels_subset)

# Concatenate the subset images and labels
subset_images = np.concatenate(subset_images, axis=0)
subset_labels = np.concatenate(subset_labels, axis=0)

# Shuffle the subset data
shuffle_indices = np.random.permutation(subset_images.shape[0])
subset_images = subset_images[shuffle_indices]
subset_labels = subset_labels[shuffle_indices]

# Convert images to grayscale using OpenCV
subset_images_grayscale = [cv2.cvtColor(img, cv2.COLOR_RGB2GRAY) for img in subset_images]

# Resize CIFAR-10 images to meet the minimum input size requirement of InceptionV3
subset_images_resized = np.array([resize(img, (75, 75)) for img in subset_images_grayscale])

#ONLY REQUIRED IF IMAGES ARE GRAYSCALE
# Convert to 3 channels by replicating the grayscale values across channels
subset_images_resized_grayscale = np.repeat(subset_images_resized[..., np.newaxis], 3, -1)

# Print the shape of the subset data
print("Subset images shape:", subset_images_resized.shape)
print("Subset labels shape:", subset_labels.shape)


# Split the subset data into training and validation sets
X_train, X_val, y_train, y_val = train_test_split(subset_images_resized, subset_labels, test_size=0.25, random_state=42)

X_train, X_val = X_train / 255.0, X_val / 255.0

# Convert labels to one-hot encoded vectors
y_train = to_categorical(y_train, num_classes=2)
y_val = to_categorical(y_val, num_classes=2)
'''


'''#DATA AUGMENTATION
data_augmentation = ImageDataGenerator(
    rotation_range=20,  # Rotate images by up to 20 degrees
    width_shift_range=0.2,  # Shift images horizontally by up to 20% of the width
    height_shift_range=0.2,  # Shift images vertically by up to 20% of the height
    horizontal_flip=True,  # Randomly flip images horizontally
    vertical_flip=True   # Randomly flip images vertically
)

augmented_train_data = data_augmentation.flow(train_images, train_labels, batch_size=32)

# Initialize lists to store augmented data
augmented_X_train = []
augmented_y_train = []

# Generate and append augmented data batches
num_batches = len(train_images) // 32  # Calculate the number of batches
for _ in range(num_batches):
    # Generate a batch of augmented data
    batch_X, batch_y = next(augmented_train_data)
    # Append the batch to the list
    augmented_X_train.append(batch_X)
    augmented_y_train.append(batch_y)

# Concatenate augmented data batches
augmented_X_train = np.concatenate(augmented_X_train, axis=0)
augmented_y_train = np.concatenate(augmented_y_train, axis=0)

# Append augmented data to the original training data
X_train_augmented = np.concatenate([train_images, augmented_X_train], axis=0)
y_train_augmented = np.concatenate([train_labels, augmented_y_train], axis=0)

# Reshape the target labels to (None, 2)
y_train_augmented = np.reshape(y_train_augmented, (-1, 2))
'''



''' #DUMMY DATA CREATION

# Generate synthetic dataset
x, y = make_classification(n_samples=150, n_features=30000, n_classes=2, random_state=42)

# Split the dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(x, y, test_size=0.25, random_state=42)

# Reshape images for CNN input (assuming RGB color images)
X_train_cnn = X_train.reshape(-1, 100, 100, 3)  # Adjust dimensions for color images
X_test_cnn = X_test.reshape(-1, 100, 100, 3)

# Optionally, normalize pixel values to the range [0, 1]
X_train_cnn = X_train_cnn / 255.0
X_test_cnn = X_test_cnn / 255.0

y_train = to_categorical(y_train, 2)
y_test = to_categorical(y_test, 2)

'''

#INCEPTION V3 MODEL FOR TRANSFER LEARNING
# Load InceptionV3 model pretrained on ImageNet dataset
base_model = InceptionV3(weights='imagenet', include_top=False, input_shape=train_images.shape[1:])

# Load MobileNetV2 model pretrained on ImageNet dataset
#base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=train_images.shape[1:])

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


'''#CONVOLUTIONAL NEURAL NETWORK ARCHITECTURE
# Define the model architecture
model = models.Sequential([
    layers.Conv2D(32, (3, 3), activation='relu', input_shape=(200, 200, 3)),
    layers.MaxPooling2D((2, 2)),
    #layers.Conv2D(64, (3, 3), activation='relu'),
    #layers.MaxPooling2D((2, 2)),
    #layers.Conv2D(64, (3, 3), activation='relu'),
    layers.Flatten(),
    layers.Dense(64, activation='relu'),
    layers.Dense(2, activation='sigmoid')
])
'''



# Compile the model
model.compile(optimizer='adam',
              loss='binary_crossentropy',
              metrics=['accuracy'])



'''#FINE TUNING BY SELECTING TRAINABLE LAYERS
num_layers = len(model.layers)
percentage_to_unfreeze = 0.5
num_layers_to_unfreeze = int(num_layers * percentage_to_unfreeze)

# Unfreeze some layers for fine-tuning
for layer in model.layers[:num_layers_to_unfreeze]:  # Unfreeze layers up to a certain index
    layer.trainable = True
for layer in model.layers[num_layers_to_unfreeze:]:  # Fine-tune the rest of the layers
    layer.trainable = False
'''


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


'''#TEST DATA FROM CIFAR DATASET
# Filter test images and labels for the first two classes
class_indices_to_keep = [0, 1]
filtered_test_images = []
filtered_test_labels = []

for idx, label in enumerate(test_labels):
    if label[0] in class_indices_to_keep:
        filtered_test_images.append(test_images[idx])
        filtered_test_labels.append(label)

# Convert filtered test images and labels to numpy arrays
filtered_test_images = np.array(filtered_test_images)
filtered_test_labels = np.array(filtered_test_labels)

filtered_test_images = np.array([resize(img, (75, 75)) for img in filtered_test_images])
# Normalize filtered test images
filtered_test_images = filtered_test_images / 255.0

# Convert filtered test labels to one-hot encoded vectors
filtered_test_labels = to_categorical(filtered_test_labels, num_classes=2)
'''

# Evaluate the model
test_loss, test_acc = model.evaluate(validation_images, validation_labels_ready)
print(f'Test accuracy: {test_acc}')


# Plot training and validation accuracy
plt.plot(history.history['accuracy'], label='Training Accuracy')
plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.legend()
plt.show()
