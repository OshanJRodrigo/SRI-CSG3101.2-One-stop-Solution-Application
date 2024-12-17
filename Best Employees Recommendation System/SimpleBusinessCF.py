# References: https://www.linkedin.com/learning/building-recommender-systems-with-machine-learning-and-ai

from Yelp import Yelp
from surprise import KNNBasic
import heapq
from collections import defaultdict
from operator import itemgetter



def ifInCategoryScore(trainSet, testBusinessCategory, SimilarBusinessInnerID):
    '''Return a score if the provided business belongs to the given category'''
    BusinessCategoryWithRatings = trainSet.ir[SimilarBusinessInnerID]
    score = 0
    for businessCategoryInnerID, rating in BusinessCategoryWithRatings:
        businessCategory = trainSet.to_raw_uid(businessCategoryInnerID)
        if businessCategory == testBusinessCategory:
            score = 1
            return score
            
    return score

        
testBusinessCategory = 'Electronics Repair' # user given service category
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

testBusinessCategoryInnerID = trainSet.to_inner_uid(testBusinessCategory)

# Get the top K businesses/employees belong to the user given category
testBusinessCategoryRatings = trainSet.ur[testBusinessCategoryInnerID]
#testBusinessCategoryRatings = set(testBusinessCategoryRatings)
#testBusinessCategoryRatings = list(testBusinessCategoryRatings)
kNeighbors = heapq.nlargest(k, testBusinessCategoryRatings, key=lambda t: t[1])


# Get similar businesses/employees to the top K businesses/employees 
# belong to the user given category (weighted by whether the similar businesses/employees belong 
# to the user given category, their overall ratings and their number of reviews received)
candidates = defaultdict(float)
for BusinessInnerID, rating in kNeighbors:
    #businessID = trainSet.to_raw_iid(BusinessInnerID)
    #print(ml.getBusinessName(businessID))
    similarityRow = simsMatrix[BusinessInnerID]
    for SimilarBusinessInnerID, score in enumerate(similarityRow):
        businessID = trainSet.to_raw_iid(SimilarBusinessInnerID)
        ifWithinCategoryScore = ifInCategoryScore(trainSet, testBusinessCategory, SimilarBusinessInnerID)
        #print(ml.getBusinessName(businessID), ifWithinCatgoryScore)
        candidates[SimilarBusinessInnerID] += (score * ifWithinCategoryScore 
                                               * (ml.getBusinessOverallRating(businessID) / 5.0) 
                                               * ml.getBusinessNumReviews(businessID)
                                               )
    
    
print(f"\n\nCustomer Selected Service Category: {testBusinessCategory}")
print("\nTop 5 recommended employees for the selected service category;\n")
    
# Get top-rated businesses/employees from similar businesses/employees:
pos = 0
for SimilarBusinessInnerID, ratingSum in sorted(candidates.items(), key=itemgetter(1), reverse=True):
    businessID = trainSet.to_raw_iid(SimilarBusinessInnerID)
    #print(ml.getBusinessAvailabilityStatus(businessID))
    if ml.getBusinessAvailabilityStatus(businessID): # filtering to get only the currently available or open employees/businesses
        print(ml.getBusinessName(businessID))#, ratingSum)
        pos += 1
        if (pos > 5):
            break

    


