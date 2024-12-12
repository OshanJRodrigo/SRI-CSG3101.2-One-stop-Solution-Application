import os
import csv
import sys
import re

from surprise import Dataset
from surprise import Reader

from collections import defaultdict
import numpy as np

class Yelp:
    
    businessID_to_name = {}
    name_to_businessID = {}
    businessID_to_numReviews = {}
    businessID_to_overallRating = {}
    mainDatasetPath = 'Datasets/yelp_academic_dataset_businessCatSplit_busid_overallstarsReduced.csv'
    businessNamesNumReviewsPath = 'Datasets/yelp_academic_dataset_businessid_to_name_stars_numreviewsReduced.csv'
    
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
                    businessID = row[0]
                    businessName = row[1]
                    businessOverallRating = float(row[2])
                    businessNumReviews = int(row[3])
                    self.businessID_to_name[businessID] = businessName
                    self.name_to_businessID[businessName] = businessID
                    self.businessID_to_overallRating[businessID] = businessOverallRating
                    self.businessID_to_numReviews[businessID] = businessNumReviews

        return mainDataset
    
    
    
    def getBusinessName(self, businessID):
        if businessID in self.businessID_to_name:
            return self.businessID_to_name[businessID]
        else:
            return ""
        
    def getBusinessID(self, businessName):
        if businessName in self.name_to_businessID:
            return self.name_to_businessID[businessName]
        else:
            return ""
        
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
        
        
