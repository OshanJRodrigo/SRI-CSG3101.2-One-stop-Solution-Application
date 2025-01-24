FROM python:3.11.11

WORKDIR /code

# Set the environment variable
# Temporary solution for a bug in the implementation of the tfrs.layers.factorized_top_k module.
# https://github.com/tensorflow/recommenders/issues/712#issuecomment-2041163592
ENV TF_USE_LEGACY_KERAS=1

# Copy the requirements file
COPY ./requirements.txt /code/requirements.txt

# Install Python dependencies
RUN pip install --no-cache-dir -r /code/requirements.txt

# Copy the application code
COPY ./app /code/app

# Expose the application port
EXPOSE 8000

# Define the default command
CMD ["uvicorn", "app.server:app", "--host", "0.0.0.0", "--port", "8000"]
