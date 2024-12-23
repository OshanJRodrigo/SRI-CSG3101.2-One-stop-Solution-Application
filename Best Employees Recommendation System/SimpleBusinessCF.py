# References: https://www.linkedin.com/learning/building-recommender-systems-with-machine-learning-and-ai

from Yelp import Yelp
from surprise import KNNBasic
import heapq
from collections import defaultdict
from operator import itemgetter

from geopy.distance import geodesic
import numpy as np


def ifInCategoryScore(trainSet, testBusinessCategory, SimilarBusinessInnerID):
    '''Return a score if the provided business belongs to the given category.'''
    BusinessCategoryWithRatings = trainSet.ir[SimilarBusinessInnerID]
    score = 0
    for businessCategoryInnerID, rating in BusinessCategoryWithRatings:
        businessCategory = trainSet.to_raw_uid(businessCategoryInnerID)
        if businessCategory == testBusinessCategory:
            score = 1
            return score
            
    return score


def businessesDistanceFromCustomer(customerLocation, AllbusinessesLocations):
    '''Return the distance (in kilometres) from the customer for each business/employee.'''    
    distanceFromCustomer = {}
    for businessID, businessLocation in AllbusinessesLocations.items():
        distanceFromCustomer[businessID] = geodesic(customerLocation, businessLocation).km
        
    return distanceFromCustomer
        
    
def normaliseDistanceFromCustomer(distanceFromCustomer):
    '''Return the normalised distance (in kilometres) from the customer for each business/employee.
       Normalised between 1 and 0.''' 
    distances = np.array(list(distanceFromCustomer.values()))
    minDistance = distances.min()
    maxDistance= distances.max()
    normalised = (distances - minDistance) / (maxDistance - minDistance)
    
    normalisedDistanceFromCustomer = {}
    for i, businessID in enumerate(distanceFromCustomer.keys()):
        normalisedDistanceFromCustomer[businessID] = normalised[i]
        
    return normalisedDistanceFromCustomer


        
testBusinessCategory = 'Electronics Repair' # user given service category
customerLocation = (29.935091, -90.110102) # lat, long
k = 5

ml = Yelp()
data = ml.loadYelp()

trainSet = data.build_full_trainset()
#print(trainSet.rating_scale)

sim_options = {'name': 'cosine',
               'user_based': False
               }

model = KNNBasic(sim_options=sim_options)
model.fit(trainSet)
simsMatrix = model.sim #model.compute_similarities()

# Get the distance (in kilometres) from the customer for each business/employee.
AllbusinessesLocations = ml.getAllBusinessesLocations()
distanceFromCustomer = businessesDistanceFromCustomer(customerLocation, AllbusinessesLocations)

# Normalise the distance to build up the locationScore for ranking the businesses/employees
normalisedDistanceFromCustomer = normaliseDistanceFromCustomer(distanceFromCustomer)


testBusinessCategoryInnerID = trainSet.to_inner_uid(testBusinessCategory)

# Get the top K businesses/employees belong to the user given category
testBusinessCategoryRatings = trainSet.ur[testBusinessCategoryInnerID]
#testBusinessCategoryRatings = set(testBusinessCategoryRatings)
#testBusinessCategoryRatings = list(testBusinessCategoryRatings)
kNeighbors = heapq.nlargest(k, testBusinessCategoryRatings, key=lambda t: t[1])


# Get similar businesses/employees to the top K businesses/employees 
# belong to the user given category (weighted by whether the similar businesses/employees belong 
# to the user given category, their overall ratings, their number of reviews received
# and how geographically closer they are to the customer)
candidates = defaultdict(float)
for BusinessInnerID, rating in kNeighbors:
    #businessID = trainSet.to_raw_iid(BusinessInnerID)
    #print(ml.getBusinessName(businessID))
    similarityRow = simsMatrix[BusinessInnerID]
    for SimilarBusinessInnerID, score in enumerate(similarityRow):
        businessID = trainSet.to_raw_iid(SimilarBusinessInnerID)
        ifWithinCategoryScore = ifInCategoryScore(trainSet, testBusinessCategory, SimilarBusinessInnerID)
        #print(ml.getBusinessName(businessID), ifWithinCatgoryScore)
        locationScore = 1 - normalisedDistanceFromCustomer[businessID]
        candidates[SimilarBusinessInnerID] += (score * ifWithinCategoryScore 
                                               * (ml.getBusinessOverallRating(businessID) / 5.0) 
                                               * ml.getBusinessNumReviews(businessID)
                                               * locationScore
                                               )
    
    
print(f"\n\nCustomer Selected Service Category: {testBusinessCategory}")
print("\nTop 5 recommended employees for the selected service category;\n")
    
# Get top-rated businesses/employees from similar businesses/employees:
    
tableHeader = "{:^37} | {:^15} | {:^25}".format("Business Name", "Overall Rating", "Distance from Customer")
print(tableHeader)
print('-' * len(tableHeader))

pos = 1
for SimilarBusinessInnerID, ratingSum in sorted(candidates.items(), key=itemgetter(1), reverse=True):
    businessID = trainSet.to_raw_iid(SimilarBusinessInnerID)
    #print(ml.getBusinessAvailabilityStatus(businessID))
    if ml.getBusinessAvailabilityStatus(businessID): # filtering to get only the currently available or open employees/businesses
        #locationScore = 1 - normalisedDistanceFromCustomer[businessID]
        #print(ml.getBusinessName(businessID), distanceFromCustomer[businessID], locationScore) #, ratingSum)
        
        businessName = ml.getBusinessName(businessID)
        businessRating = ml.getBusinessOverallRating(businessID)
        businessDistance = str(round(distanceFromCustomer[businessID], 2)) + " km"
        row = "{:<37} | {:^15} | {:>25}".format(businessName, businessRating, businessDistance)
        print(row)
        
        pos += 1
        if (pos > 5):
            break
