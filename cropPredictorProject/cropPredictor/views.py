from datetime import datetime
import asyncio
from cropharvest.inference import Inference
from django.http import JsonResponse
from asgiref.sync import sync_to_async
import json
import joblib
from google.cloud import storage
from cropharvest.eo import EarthEngineExporter
import pandas as pd
import ee

import os

# Path to the current file (e.g., views.py)
CURRENT_FILE_DIR = os.path.dirname(os.path.abspath(__file__))

# Path to the parent of the current file directory
BASE_DIR = os.path.dirname(CURRENT_FILE_DIR)



# Now you can use BASE_DIR to construct paths to other directories within your project


os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = os.path.join(BASE_DIR, 'fine-jetty-417618-968bb48225bc.json')

ee.Initialize(project='ee-truharvest')
google_cloud_exporter = EarthEngineExporter(dest_bucket="truecropharvest")


# Async view to handle the request
async def export_and_predict(request):
    print(request.GET)
    # Extract parameters from request
    # For simplicity, assuming GET request; for production, consider POST with request body
    min_lon = float(request.GET.get('min_lon'))
    max_lon = float(request.GET.get('max_lon'))
    min_lat = float(request.GET.get('min_lat'))
    max_lat = float(request.GET.get('max_lat'))
    start_date_str = request.GET.get('start_date')  # Consider parsing to date object as needed
    end_date_str = request.GET.get('end_date')

    # Convert start_date and end_date from string to datetime.date objects
    start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
    end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()

    # Construct export_identifier
    export_identifier = f"min_lat={min_lat}_min_lon={min_lon}_max_lat={max_lat}_max_lon={max_lon}_dates={start_date}_{end_date}_all"

    # Create DataFrame
    private_labels = pd.DataFrame({
        "lon": [min_lon, max_lon],
        "lat": [min_lat, max_lat],
        "start_date": [start_date, start_date],
        "end_date": [end_date, end_date],
        "export_identifier": export_identifier,
    })
    # Construct blob name and download
    source_blob_name = f"tifs/{export_identifier}.tif"
    bucket_name = "truecropharvest"
    local_dir = BASE_DIR  # Adjust accordingly

    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(source_blob_name)
    # Check if the blob already exists to avoid re-exporting
    if blob.exists():
        print(f"Blob {source_blob_name} already exists. Skipping export.")
    else:
        # Blob does not exist, proceed with export
        await sync_to_async(google_cloud_exporter.export_for_labels)(labels=private_labels)
        print(f"Exported {source_blob_name} successfully.")


    # Initialize a timeout for the file check loop
    timeout_seconds = 60
    start_time = datetime.now()

    while not blob.exists():
        await asyncio.sleep(1)  # Wait for 1 second before trying again
        if (datetime.now() - start_time).total_seconds() > timeout_seconds:
            return JsonResponse({'error': 'Exported file not found within the timeout period.'}, status=404)

    local_file_path = await sync_to_async(download_blob_to_file)(bucket_name, source_blob_name, local_dir)

    # Load ML model and run inference (ensure model path is correct)
    model_path = os.path.join(BASE_DIR, 'modelt1_filename.pkl')
    modelp = joblib.load(model_path)
    preds = Inference(model=modelp, normalizing_dict=None).run(local_path=local_file_path)

    # Process prediction results and return as JSON
    prediction_data = process_predictions(preds)  # Implement this based on your ML model's output


    try:
        os.remove(local_file_path)
        print(f"Successfully deleted local file: {local_file_path}")
    except OSError as e:
        print(f"Error: {e.strerror}. File: {e.filename} could not be deleted.")

    return JsonResponse(prediction_data, safe=False)


# Ensure download_blob_to_file is defined as provided or adjusted as necessary

def download_blob_to_file(bucket_name, source_blob_name, local_dir="."):
    """
    Downloads a blob to a local file.

    Parameters:
    - bucket_name: Name of the Google Cloud Storage bucket.
    - source_blob_name: The path of the source blob in the GCS bucket.
    - local_dir: Local directory to save the file. Defaults to the current directory.

    Returns:
    - local_file_path: The path to the saved file on the local filesystem.
    """
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(source_blob_name)

    if not os.path.exists(local_dir):
        os.makedirs(local_dir)

    # Construct local file path
    filename = source_blob_name.split('/')[-1]
    local_file_path = os.path.join(local_dir, filename)

    # Download the blob to a local file
    blob.download_to_filename(local_file_path)
    print(f"Blob {source_blob_name} downloaded to {local_file_path}.")

    return local_file_path


def process_predictions(preds):
    # Convert the xarray Dataset to a numpy array
    # Assume `preds` is the xarray Dataset you obtained from the `run` method
    preds_np = preds.to_array().values[0]  # Assuming there is only one data variable
    print(preds_np)

    # Convert the numpy array to a list
    preds_list = preds_np.tolist()

    # Since preds_list can be directly serialized to JSON, you can return it
    # Or if you need to wrap it or include other data:
    result = {
        "prediction_rate": preds_list
    }

    return result
