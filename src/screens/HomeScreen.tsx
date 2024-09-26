import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenWrapper from '../components/ScreenWrapper';
import {colors} from '../themes';
import randomImage from '../assets/images/randomImage';
import EmptyList from '../components/EmptyList';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamsList} from '../navigation/AppNavigation';
import {TripType} from '../types';
import {signOut} from 'firebase/auth';
import {auth, tripsRef} from '../config/firebase';
import {getDocs, query, where} from 'firebase/firestore';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import Loading from '../components/Loading';
import {setTrips} from '../redux/slices/user';

type HomeScreenProps = NativeStackScreenProps<RootStackParamsList, 'Home'>;
export default function HomeScreen({navigation}: HomeScreenProps) {
  const {user} = useAppSelector(state => state.user);
  const [loading, setLoading] = useState<boolean>(false);
  const {trips} = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  const fetchTrips = async () => {
    setLoading(true);
    const q = query(tripsRef, where('userId', '==', user?.uid));
    const querySnapShot = await getDocs(q);
    const data: TripType[] = [];
    querySnapShot.forEach(doc => {
      data.push({
        place: doc.data().place,
        country: doc.data().country,
        id: doc.id,
        userId: user?.uid!,
      });
    });
    dispatch(setTrips(data));
    setLoading(false);
  };
  useEffect(() => {
    fetchTrips();
  }, []);
  const handleLogout = async () => {
    await signOut(auth);
  };
  return (
    <ScreenWrapper>
      <View className="flex-row justify-between items-center p-4">
        <Text className={`${colors.heading} font-bold text-3xl shadow-sm`}>
          Expensify
        </Text>
        <TouchableOpacity
          onPress={handleLogout}
          className="p-2 px-3 bg-white border-gray-200 border rounded-full">
          <Text className={`${colors.heading}`}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row justify-center items-center bg-blue-200 rounded-xl mx-4 mb-4">
        <Image
          source={require('../assets/images/banner.png')}
          className="w-60 h-60"
        />
      </View>
      <View className="px-4 space-y-3 h-1/2">
        <View className="flex-row justify-between items-center">
          <Text className={`${colors.heading} font-bold text-xl`}>
            Recent Trips
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddTrip')}
            className="p-2 px-3 bg-white border-gray-200 border rounded-full">
            <Text className={`${colors.heading}`}>Add Trips</Text>
          </TouchableOpacity>
        </View>
        <View className="">
          {loading ? (
            <Loading />
          ) : (
            <FlatList
              data={trips}
              keyExtractor={item => item.id!}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <EmptyList message="You haven't recorded any trips yet" />
              }
              columnWrapperStyle={{
                justifyContent: 'space-between',
              }}
              // style={{
              //   flex: 1,
              // }}
              className="mx-1 mr-3"
              renderItem={({item}) => {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('TripExpenses', {...item})
                    }
                    className="bg-white flex-[0.5] justify-center items-center p-3 rounded-2xl mb-3 ml-3 shadow-sm">
                    <View>
                      <Image
                        source={randomImage()}
                        className="h-36 w-36 mb-2"
                      />
                      <Text className={`${colors.heading} font-bold`}>
                        {item.place}
                      </Text>
                      <Text className={`${colors.heading} text-xs`}>
                        {item.country}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({});
