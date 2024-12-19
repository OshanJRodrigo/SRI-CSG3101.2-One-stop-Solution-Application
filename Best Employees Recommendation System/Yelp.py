# References: https://www.linkedin.com/learning/building-recommender-systems-with-machine-learning-and-ai

import os
import csv
import sys
# import re

from surprise import Dataset
from surprise import Reader

# from collections import defaultdict
# import numpy as np

class Yelp:
    
    businessID_to_name = {}
    name_to_businessID = {}
    businessID_to_location = {}
    businessID_to_numReviews = {}
    businessID_to_overallRating = {}
    businessID_to_availability = {}
    mainDatasetPath = 'Datasets/Reduced_ratings_with_splitted_bCategories.csv'
    businessNamesNumReviewsPath = 'Datasets/Reduced_business.csv'
    
    def loadYelp(self):

        # Look for files relative to the directory we are running from
        os.chdir(os.path.dirname(sys.argv[0]))

        mainDataset = 0
        self.businessID_to_name = {}
        self.name_to_movieID = {}

        reader = Reader(line_format='user item rating', sep=',', skip_lines=1)

        mainDataset = Dataset.load_from_file(self.mainDatasetPath, reader=reader)

        with open(self.businessNamesNumReviewsPath, newline='', encoding='ISO-8859-1') as csvfile:
                businessNamesNumReviewsReader = csv.reader(csvfile)
                next(businessNamesNumReviewsReader)  #Skip header line
                for row in businessNamesNumReviewsReader:
                    businessID = str(row[0])
                    businessName = str(row[1])
                    businessLocation = (float(row[2]), float(row[3]))
                    businessOverallRating = float(row[4])
                    businessNumReviews = int(row[5])
                    businessAvailability = int(row[6])
                    self.businessID_to_name[businessID] = businessName
                    self.name_to_businessID[businessName] = businessID
                    self.businessID_to_location[businessID] = businessLocation
                    self.businessID_to_overallRating[businessID] = businessOverallRating
                    self.businessID_to_numReviews[businessID] = businessNumReviews
                    self.businessID_to_availability[businessID] = businessAvailability

        return mainDataset
    
    
    
    def getBusinessName(self, businessID):
        if businessID in self.businessID_to_name:
            return self.businessID_to_name[businessID]
        else:
            return ""
        
    # def getBusinessID(self, businessName):
    #     if businessName in self.name_to_businessID:
    #         return self.name_to_businessID[businessName]
    #     else:
    #         return ""
        
    # def getBusinessLocation(self, businessID):
    #     if businessID in self.businessID_to_location:
    #         return self.businessID_to_location[businessID]
    #     else:
    #         return ()
        
    def getAllBusinessesLocations(self):
        return self.businessID_to_location

        
    def getBusinessOverallRating(self, businessID):
        if businessID in self.businessID_to_overallRating:
            return self.businessID_to_overallRating[businessID]
        else:
            return 0.0
        
    def getBusinessNumReviews(self, businessID):
        if businessID in self.businessID_to_numReviews:
            return self.businessID_to_numReviews[businessID]
        else:
            return 0
        
    def getBusinessAvailabilityStatus(self, businessID):
        if businessID in self.businessID_to_availability:
            return self.businessID_to_availability[businessID]
        else:
            return 0
        
        
