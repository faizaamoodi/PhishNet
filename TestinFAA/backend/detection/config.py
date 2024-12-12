# config.py
import os

# Base directory of the project
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Paths for datasets and model directories
DATA_DIR = os.path.join(BASE_DIR, 'datasets')
RESULTS_DIR = os.path.join(BASE_DIR, 'results')
LOGS_DIR = os.path.join(BASE_DIR, 'logs')
MODEL_DIR = os.path.join(BASE_DIR, 'phishing_model')

# Combined dataset file path
COMBINED_DATASET_PATH = os.path.join(DATA_DIR, 'combined_phishing_dataset.csv')
