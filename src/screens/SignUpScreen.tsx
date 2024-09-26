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
import Snackbar from 'react-native-snackbar';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {auth} from '../config/firebase';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {setUserLoading} from '../redux/slices/user';
import Loading from '../components/Loading';

type SignUpProps = NativeStackScreenProps<RootStackParamsList, 'SignUp'>;
const SignUpScreen = ({navigation}: SignUpProps) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const dispatch = useAppDispatch();
  const {userLoading} = useAppSelector(state => state.user);
  const handleSubmit = async () => {
    if (email && password) {
      try {
        dispatch(setUserLoading(true));
        await createUserWithEmailAndPassword(auth, email, password);
      } catch (e: any) {
        const a = e.message;
        if (a === 'Firebase: Error (auth/email-already-in-use).') {
          Snackbar.show({
            text: `User already exists`,
            backgroundColor: 'red',
            duration: Snackbar.LENGTH_SHORT,
          });
        } else {
          Snackbar.show({
            text: `Something went wrong`,
            backgroundColor: 'red',
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      } finally {
        dispatch(setUserLoading(false));
      }
    } else {
      Snackbar.show({
        text: 'Email and Password are required!',
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
                Sign Up
              </Text>
            </View>
            <View className="flex-row justify-center my-3 mt-5">
              <Image
                className="w-80 h-80"
                source={require('../assets/images/signup.png')}
              />
            </View>
            <View className="space-y-2 mx-2">
              <Text className={`${colors.heading} text-lg font-bold`}>
                Email
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                className={`p-4 bg-white rounded-full mb-3 ${colors.heading}`}
              />
              <Text className={`${colors.heading} text-lg font-bold`}>
                Password
              </Text>
              <TextInput
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                className={`p-4 bg-white rounded-full mb-3 ${colors.heading}`}
              />
            </View>
          </View>
          <View>
            {userLoading ? (
              <Loading />
            ) : (
              <TouchableOpacity
                onPress={handleSubmit}
                style={{backgroundColor: colors.button}}
                className="my-6 rounded-full p-3 shadow-sm mx-2">
                <Text className="text-center text-white text-lg font-bold">
                  Sign Up
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default SignUpScreen;
