import tarfile
import os

# Specify the path to the saved_model folder
saved_model_folder = 'C:/Users/jemag/Documents/2023_2024_Second_Semester/CAPSTONE/AppRepo/Bit-Busters/MachineLearning/saved_model_edge'

# Specify the name for the compressed archive
compressed_archive = 'saved_model_edge.tar.gz'

# Specify the version directory name
version_directory = '1'

# Create a new .tar.gz archive and add the saved_model folder to it
with tarfile.open(compressed_archive, 'w:gz') as tar:
    # Walk through the saved_model folder and add its contents to the archive
    for root, dirs, files in os.walk(saved_model_folder):
        for file in files:
            file_path = os.path.join(root, file)
            # Construct the path within the version directory
            arcname = os.path.join(version_directory, os.path.relpath(file_path, saved_model_folder))
            tar.add(file_path, arcname=arcname)