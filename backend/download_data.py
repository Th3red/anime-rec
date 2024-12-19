import kagglehub

# Download the latest version of the dataset
path = kagglehub.dataset_download("CooperUnion/anime-recommendations-database")

print("Path to dataset files:", path)
