from keras.preprocessing.image import ImageDataGenerator
import os
from PIL import Image

# Create an instance of ImageDataGenerator for data augmentation
datagen = ImageDataGenerator(
    rotation_range=20,  # Rotate images randomly by up to 20 degrees
    width_shift_range=0.1,  # Shift images horizontally by up to 10% of the width
    height_shift_range=0.1,  # Shift images vertically by up to 10% of the height
    shear_range=0.2,  # Shear transformation (tilt) with a maximum shear intensity of 20%
    zoom_range=0.2,  # Zoom in or out by up to 20%
    horizontal_flip=True,  # Randomly flip images horizontally
    fill_mode='nearest'  # Fill in missing pixels using the nearest available pixel
)

# Specify the paths for the original images and where to save the augmented images
original_images_dir = 'C:/Users/jemag/Documents/2023_2024_Second_Semester/CAPSTONE/DataSetImages/GooglePipes/'
save_dir = 'C:/Users/jemag/Documents/2023_2024_Second_Semester/CAPSTONE/DataSetImages/GooglePipes/AugmentedNotBrokenGoogle'

# Generate additional images for the "not broken" class to match the size of the "broken" class
num_additional_images = 150 - len(os.listdir('C:/Users/jemag/Documents/2023_2024_Second_Semester/CAPSTONE/DataSetImages/GooglePipes/NotBrokenGoogle'))  # Calculate how many additional images are needed

print(num_additional_images)

# Generate augmented images and save them to the specified directory
data_holder = datagen.flow_from_directory(
    original_images_dir,
    batch_size=num_additional_images,
    shuffle=True,
    seed=42,
    subset='training',
    classes=['NotBrokenGoogle'],
    save_to_dir=None  # Don't save images during generation
)

print(data_holder.batch_size)

i = 0
for batch in data_holder:
    images = batch[0]  # Extract the image data from the batch
    for image in images:
        # Convert the image array to a PIL Image
        img = Image.fromarray(image.astype('uint8'), 'RGB')

        # Save the augmented image to the save_dir directory
        img.save(os.path.join(save_dir, f'augmented_image_{i}.jpeg'))

        i = i + 1
        print(i)

        if(i >= num_additional_images):
            break
    else:
        continue
    break #Will break if outer loop if the inner loop is broken by if