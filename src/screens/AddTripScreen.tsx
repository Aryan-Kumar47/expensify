import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import ScreenWrapper from '../components/ScreenWrapper';
import {colors} from '../themes';
import BackButton from '../components/BackButton';
import {useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamsList} from '../navigation/AppNavigation';
import Loading from '../components/Loading';
import Snackbar from 'react-native-snackbar';
import {addDoc} from 'firebase/firestore';
import {tripsRef} from '../config/firebase';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {TripType} from '../types';
import {setTrips} from '../redux/slices/user';

type AddTripScreenProps = NativeStackScreenProps<
  RootStackParamsList,
  'AddTrip'
>;
const AddTripScreen = ({navigation}: AddTripScreenProps) => {
  const [place, setPlace] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const {user, trips} = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const handleAddTrip = async () => {
    if (place && country) {
      try {
        setLoading(true);
        let doc = await addDoc(tripsRef, {
          place,
          country,
          userId: user?.uid,
        });
        setLoading(false);
        if (doc && doc.id) {
          dispatch(
            setTrips({
              id: doc.id,
              userId: user?.uid!,
              place: place,
              country: country,
            }),
          );
          navigation.goBack();
        }
      } catch (error: any) {
        Snackbar.show({
          text: `${error.message}`,
          backgroundColor: 'red',
          duration: Snackbar.LENGTH_SHORT,
        });
      } finally {
        setLoading(false);
      }
    } else {
      Snackbar.show({
        text: 'Place and Country are required!',
        backgroundColor: 'red',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };
  return (
    <ScreenWrapper>
      <ScrollView>
        <View className="flex justify-between h-full mx-4">
          <View>
            <View className="relative mt-5">
              <View className="absolute top-0 left-0 z-[1]">
                <BackButton />
              </View>
              <Text
                className={`${colors.heading} text-xl font-bold text-center`}>
                Add Trip
              </Text>
            </View>
            <View className="flex-row justify-center my-3 mt-5">
              <Image
                className="w-72 h-72"
                source={require('../assets/images/4.png')}
              />
            </View>
            <View className="space-y-2 mx-2">
              <Text className={`${colors.heading} text-lg font-bold`}>
                Where On Earth?
              </Text>
              <TextInput
                value={place}
                onChangeText={setPlace}
                className={`p-4 bg-white rounded-full mb-3 ${colors.heading}`}
              />
              <Text className={`${colors.heading} text-lg font-bold`}>
                Which Country
              </Text>
              <TextInput
                value={country}
                onChangeText={setCountry}
                className={`p-4 bg-white rounded-full mb-3 ${colors.heading}`}
              />
            </View>
          </View>
          <View>
            {loading ? (
              <Loading />
            ) : (
              <TouchableOpacity
                onPress={handleAddTrip}
                style={{backgroundColor: colors.button}}
                className="my-6 rounded-full p-3 shadow-sm mx-2">
                <Text className="text-center text-white text-lg font-bold">
                  Add Trip
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default AddTripScreen;
