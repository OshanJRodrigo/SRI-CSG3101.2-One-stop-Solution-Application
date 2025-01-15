RecSys Model 1 Deployment
=========================

Complete code (including a trained model) to deploy and inference a machine learning model (built on the Yelp dataset) using Docker and FastAPI.

1. With terminal navigate to the root of this repository
--------------------------------------------------------

2. Build docker image
---------------------

    $ docker build -t image_name .

3. Run container
----------------

    $ docker run --name container_name -p 8000:8000 image_name

4. Output will contain
----------------------

INFO:     Uvicorn running on http://0.0.0.0:8000

    - use this url in chrome to see the model frontend;
    - use http://0.0.0.0:8000/docs for testing the model in the web interface.

5. Query model
--------------
    
 5.1 Via web interface (chrome):
    http://0.0.0.0:8000/docs -> test model
    
 5.2 Via curl request:

    $ curl -X POST "http://0.0.0.0:8000/predict" -H "accept: application/json" -H "Content-Type: application/json" -d '{"category": "Plumbing", "location": {"latitude": 29.935091, "longitude": -90.110102}}'