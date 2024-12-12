from Yelp import Yelp
from surprise import KNNBasic
import heapq
from collections import defaultdict
from operator import itemgetter
        
testBusinessCategory = 'Food'
k = 10

ml = Yelp()
data = ml.loadYelp()

trainSet = data.build_full_trainset()

sim_options = {'name': 'cosine',
               'user_based': False
               }

model = KNNBasic(sim_options=sim_options)
model.fit(trainSet)
simsMatrix = model.compute_similarities()

testBusinessCategoryInnerID = trainSet.to_inner_uid(testBusinessCategory)

# Get the top K items we rated
testBusinessCategoryRatings = trainSet.ur[testBusinessCategoryInnerID]
testBusinessCategoryRatings = set(testBusinessCategoryRatings)
testBusinessCategoryRatings = list(testBusinessCategoryRatings)
kNeighbors = heapq.nlargest(k, testBusinessCategoryRatings, key=lambda t: t[1])

# Get similar items to stuff we liked (weighted by rating)
candidates = defaultdict(float)
for BusinessInnerID, rating in kNeighbors:
    similarityRow = simsMatrix[BusinessInnerID]
    for SimilarBusinessInnerID, score in enumerate(similarityRow):
        candidates[SimilarBusinessInnerID] += score * (ml.getBusinessOverallRating(trainSet.to_raw_iid(SimilarBusinessInnerID)) / 5.0)
    
# Build a dictionary of stuff the user has already seen
# watched = {}
# for itemID, rating in trainSet.ur[testUserInnerID]:
#     watched[itemID] = 1

print(f"\n\nCustomer Selected Service Category: {testBusinessCategory}")

print(f"\nTop 5 recommended employees for the selected service category;\n")
    
# Get top-rated items from similar users:
pos = 0
for SimilarBusinessInnerID, ratingSum in sorted(candidates.items(), key=itemgetter(1), reverse=True):
    #if not itemID in watched:
    businessID = trainSet.to_raw_iid(SimilarBusinessInnerID)
    print(ml.getBusinessName(businessID))#, ratingSum)
    pos += 1
    if (pos > 5):
        break

    


