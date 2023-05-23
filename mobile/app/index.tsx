import { StatusBar } from 'expo-status-bar'
import React, { useEffect } from 'react'
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native'
import { useFonts, Roboto_400Regular, Roboto_700Bold } from "@expo-google-fonts/roboto"
import { BaiJamjuree_700Bold } from "@expo-google-fonts/bai-jamjuree"
import blurBg from '../src/assets/bg-blur.png'
import Stripes from '../src/assets/stripes.svg'
import NlwLogo from '../src/assets/nlw-spacetime-logo.svg'
import { styled } from 'nativewind'
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session'
import { api } from '../src/lib/api/api'
import * as SecureStore from 'expo-secure-store';
import { useRouter } from "expo-router";

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint: 'https://github.com/settings/connections/applications/bcc8f95b63ed045be699',
};

const StyledStripes = styled(Stripes)

export default function App() {
  const router = useRouter()
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold
  })

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: 'bcc8f95b63ed045be699',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        // scheme: 'com.mobile.app://'
        scheme: 'mobile'
      }),
    },
    discovery
  );

  async function handleGitHubOAuthCode(code: string) {
    const response = await api.post('/register', {
      code
    })

    const { token } = response.data

    await SecureStore.setItemAsync("token", token);

    router.push('/memories')
  }

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;

      handleGitHubOAuthCode(code)
    }
  }, [response])

  if (!fontsLoaded) {
    return null
  }

  return (
    <ImageBackground
      source={blurBg}
      className=" relative px-8 py-10 flex-1 items-center bg-gray-900"
      imageStyle={{ position: 'absolute', left: "-100%" }}
    >
      <StyledStripes className='absolute left-2' />

      <View className='flex-1 items-center justify-center gap-6'>
        <NlwLogo />

        <View className='space-y-2'>
          <Text className='text-center font-title text-2xl leading-tight text-gray-50'>
            Sua cápsula do tempo
          </Text>
          <Text className='text-center font-body text-base leading-relaxed text-gray-100'>
            Colecione momentos marcantes da sua jornada e compartilhe (se quiser) com o mundo!
          </Text>
        </View>

        <TouchableOpacity className='rounded-full bg-green-500 px-5 py-2' activeOpacity={0.7}
          onPress={() => {
            promptAsync();
          }}
        >
          <Text className='font-alt text-sm uppercase text-black'>COMEÇAR A CADASTRAR</Text>
        </TouchableOpacity>
      </View>

      <Text className='text-center font-body text-sm leading-relaxed text-gray-200'>Feito com 💜 no NLW da Rocketseat</Text>

      <StatusBar style="light" translucent />
    </ImageBackground>
  )
}
