import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';

const StarBarChart = ({ rating }) => {
/* rating: a map object containing the number of reviews received per rating category

   Following is the expected structure of the input parameter "rating";
   {
      '5 Star': 50,
      '4 Star': 226,
      '3 Star': 32,
      '2 Star': 19,
      '1 Star': 56,
   } 
*/

  const fiveStarBarWidth = useSharedValue(0);
  const fourStarBarWidth = useSharedValue(0);
  const threeStarBarWidth = useSharedValue(0);
  const twoStarBarWidth = useSharedValue(0);
  const oneStarBarWidth = useSharedValue(0);

/* Calculate the total by summing the values in the object */
  const total = Object.values(rating).reduce((sum, current) => sum + current, 0);

/* Set how far (width) the star bars should fill and configure the animation */
  React.useEffect(() => {
    fiveStarBarWidth.value = withTiming((rating['5 Star'] / total) * 100, { duration: 1000 }); // percentage of 5 star ratings out of total
    fourStarBarWidth.value = withTiming((rating['4 Star'] / total) * 100, { duration: 1000 }); // percentage of 4 star ratings out of total
    threeStarBarWidth.value = withTiming((rating['3 Star'] / total) * 100, { duration: 1000 }); // percentage of 3 star ratings out of total
    twoStarBarWidth.value = withTiming((rating['2 Star'] / total) * 100, { duration: 1000 }); // percentage of 2 star ratings out of total
    oneStarBarWidth.value = withTiming((rating['1 Star'] / total) * 100, { duration: 1000 }); // percentage of 1 star ratings out of total

  }, [rating]);

/* Animated styles to apply width or fill star bars dynamically */
  const animatedFiveStarBarStyle = useAnimatedStyle(() => ({
    width: `${fiveStarBarWidth.value}%`,
  }));

  const animatedFourStarBarStyle = useAnimatedStyle(() => ({
    width: `${fourStarBarWidth.value}%`,
  }));

  const animatedThreeStarBarStyle = useAnimatedStyle(() => ({
    width: `${threeStarBarWidth.value}%`,
  }));

  const animatedTwoStarBarStyle = useAnimatedStyle(() => ({
    width: `${twoStarBarWidth.value}%`,
  }));

  const animatedOneStarBarStyle = useAnimatedStyle(() => ({
    width: `${oneStarBarWidth.value}%`,
  }));


/*   Configuring to smoothly view and close the star bars when dragging up and down
  the card to view/close the star bars in the '../components/EmployeeCard_two' */
  const translateY = useSharedValue(0);

  // Gesture handler using the Gesture API
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // Update translation values (only interested in dragging up/down gesture {related with Y axis})
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      // Apply spring animation on gesture end {spring animation is unnecessary though, 
      // this is enough: translateY.value = translateY.value
      translateY.value = withSpring(translateY.value + event.velocityY / 10);
    });

  // Animated style for smoothly view and close the star bars
  const animatedDragUpDownStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
    ],
  }));



  return (
    <GestureHandlerRootView>
        <GestureDetector gesture={panGesture}>       
            <Animated.View style={[styles.starContainer, animatedDragUpDownStyle]}>

                {/* 5 Star Rating Bar */}
                <View style={[styles.ratingBarContainer /* , {marginTop: 5} */]}>
                    <Text style={styles.starText}>5</Text>
                    <Ionicons name={'star'} size={15} style={styles.starIcon}/>
                    <View style={styles.emptyStars}>
                        <Animated.View style={[styles.filledStars, animatedFiveStarBarStyle]} />
                        <Text style={styles.ratingText}>{rating['5 Star']}</Text>
                    </View>
                </View>


                {/* 4 Star Rating Bar */}
                <View style={[styles.ratingBarContainer, {marginTop: 5}]}>
                    <Text style={styles.starText}>4</Text>
                    <Ionicons name={'star'} size={15} style={styles.starIcon}/>
                    <View style={styles.emptyStars}>
                        <Animated.View style={[styles.filledStars, animatedFourStarBarStyle]} />
                        <Text style={styles.ratingText}>{rating['4 Star']}</Text>
                    </View>
                </View>      

                {/* 3 Star Rating Bar */}
                <View style={[styles.ratingBarContainer, {marginTop: 5}]}>
                    <Text style={styles.starText}>3</Text>
                    <Ionicons name={'star'} size={15} style={styles.starIcon}/>
                    <View style={styles.emptyStars}>
                        <Animated.View style={[styles.filledStars, animatedThreeStarBarStyle]} />
                        <Text style={styles.ratingText}>{rating['3 Star']}</Text>
                    </View>
                </View>        

                {/* 2 Star Rating Bar */}
                <View style={[styles.ratingBarContainer, {marginTop: 5}]}>
                    <Text style={styles.starText}>2</Text>
                    <Ionicons name={'star'} size={15} style={styles.starIcon}/>
                    <View style={styles.emptyStars}>
                        <Animated.View style={[styles.filledStars, animatedTwoStarBarStyle]} />
                        <Text style={styles.ratingText}>{rating['2 Star']}</Text>
                    </View>
                </View>       

                {/* 1 Star Rating Bar */}
                <View style={[styles.ratingBarContainer, {marginTop: 5}]}>
                    <Text style={styles.starText}>1</Text>
                    <Ionicons name={'star'} size={15} style={styles.starIcon}/>
                    <View style={styles.emptyStars}>
                        <Animated.View style={[styles.filledStars, animatedOneStarBarStyle]} />
                        <Text style={styles.ratingText}>{rating['1 Star']}</Text>
                    </View>
                </View>       
        
            </Animated.View>
        </GestureDetector> 
    </GestureHandlerRootView>
  );
};

export default StarBarChart;

const styles = StyleSheet.create({
  starContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  ratingBarContainer: {
    alignItems: 'center', 
    flexDirection: 'row',
  },
  emptyStars: {
    height: 15,//25,
    width: 300,//325,
    backgroundColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
    marginLeft: 5, 
    marginRight: 5,
  },
  filledStars: {
    height: '100%',
    backgroundColor: '#ffd700',
    position: 'relative'
  },
  ratingText: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: 'bold',
    position: 'absolute', 
    alignSelf: 'center', 
    justifyContent: 'center', 
    bottom: 0
  },
  starIcon: {
    color: '#FF8C00', 
    left:1
  },
  starText: {
    fontSize: 15
  },
});
