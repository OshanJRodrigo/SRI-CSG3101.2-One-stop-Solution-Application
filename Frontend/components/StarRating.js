// References: https://github.com/itzpradip/Food-Finder-React-Native-App/blob/master/components/StarRating.js
// Source code for generating star ratings dynamically

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';

const StarRating = ({rating, numOfRatings}) => {
/*     rating: an integer representing stars
       numOfRatings: an integer representing number of reviews recieved
 */

    // This array will contain our star tags. We will include this
    // array between the view tag.
    let stars = [];
    // Loop 5 times
    for (var i = 1; i <= 5; i++) {
        // set the path to filled star
        let name = 'star';
        // If rating is lower, set the path to unfilled star
        if (i > rating) {
            name = 'star-outline';
        }

        // If rating is lower and contain a half rating, set the path to half star
        // Remove this snippet if half ratings are not allowed in our application
        if ((i - 0.5) === rating) {
            name = 'star-half';
        }

        stars.push((<Ionicons name={name} size={15} style={styles.star} key={i} />));
    }

    return (
        <View style={ styles.container }>
            { stars }
            <Text style={styles.text}>({numOfRatings})</Text>
        </View>
    );
	
}

export default StarRating;

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	star: {
		color: '#FF8C00'
	},
	text: {
		fontSize: 12,
        marginLeft: 5,
        color: '#444',
	}
});